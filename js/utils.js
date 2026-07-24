/**
 * Smart Civic Complaint AI - Utility & API Module
 * 
 * IMPORTANT FOR INTEGRATION:
 * This file is the single source of truth for database and API requests.
 * By default, it operates in 'localStorage' mode for offline/static demonstration.
 * To integrate your n8n AI webhook, simply change API_CONFIG.mode to 'webhook'
 * and set the API_CONFIG.webhookUrl. No changes to other frontend files are required.
 */

// --- API Configuration ---
const API_CONFIG = {
  mode: "webhook",
  webhookUrl: "https://paragdesai.app.n8n.cloud/webhook/civic-complaint",
  apiKey: "YOUR_N8N_API_KEY_HERE",
  storageKey: "smart_civic_complaints"
};

// --- Mock Routing and Priority Assignment (Simulates Gemini AI backend categorization) ---
const AI_ROUTING_RULES = {
  'waste': { department: 'Waste Management Team', priority: 'Medium' },
  'road': { department: 'Infrastructure Team', priority: 'High' },
  'water': { department: 'Water Services', priority: 'High' },
  'streetlight': { department: 'Road Maintenance', priority: 'Medium' },
  'safety': { department: 'Public Safety Team', priority: 'High' },
  'other': { department: 'Operations Team', priority: 'Low' }
};

// --- Database Simulation and Initial Seeding ---
const DB = {
  // Get all complaints from localStorage
  getAll() {
    const data = localStorage.getItem(API_CONFIG.storageKey);
    return data ? JSON.parse(data) : [];
  },

  // Save all complaints to localStorage with automatic image-pruning fallback
  saveAll(complaints) {
    try {
      localStorage.setItem(API_CONFIG.storageKey, JSON.stringify(complaints));
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22) {
        console.warn('LocalStorage quota exceeded! Pruning image data to save database records.');
        
        // Step 1: Keep the newest image, clear older image payloads to free up space
        const pruned = complaints.map((c, idx) => {
          if (idx > 0 && c.image) {
            return { ...c, image: null };
          }
          return c;
        });

        try {
          localStorage.setItem(API_CONFIG.storageKey, JSON.stringify(pruned));
          console.log('Saved complaints with pruned history image payloads.');
        } catch (innerError) {
          // Step 2: Clear all images if still exceeding limits
          const textOnly = complaints.map(c => ({ ...c, image: null }));
          try {
            localStorage.setItem(API_CONFIG.storageKey, JSON.stringify(textOnly));
            console.log('Saved text-only complaints database.');
          } catch (lastError) {
            console.error('All localStorage save attempts failed: ', lastError);
          }
        }
      } else {
        throw error;
      }
    }
  },

  // Seed initial records if database is empty
  seed() {
    const current = this.getAll();
    if (current.length === 0) {
      const mockSeeds = [
        {
          id: 'SCAI-2026-9081',
          title: 'Illegal dump site near park',
          description: 'A large pile of garbage and hazardous waste has been dumped at the corner of Green Avenue, right next to the children\'s play area. Strong foul smell.',
          category: 'waste',
          department: 'Waste Management Team',
          priority: 'High',
          location: 'Green Ave Sector 4',
          latitude: '12.9716',
          longitude: '77.5946',
          image: null,
          status: 'resolved',
          createdAt: '2026-07-15T10:30:00.000Z',
          statusTimeline: [
            { status: 'submitted', date: '2026-07-15T10:30:00.000Z', note: 'Report submitted by user.' },
            { status: 'review', date: '2026-07-15T10:35:00.000Z', note: 'AI classified category and routed to Waste Management Team.' },
            { status: 'routed', date: '2026-07-15T11:00:00.000Z', note: 'Accepted by Waste Management Team.' },
            { status: 'progress', date: '2026-07-16T09:00:00.000Z', note: 'Field operations team dispatched to Green Avenue.' },
            { status: 'resolved', date: '2026-07-16T15:30:00.000Z', note: 'Area cleared. Site cleaned and processed.' }
          ]
        },
        {
          id: 'SCAI-2026-4402',
          title: 'Dangerous pothole on main road',
          description: 'Deep pothole in the middle of Main Highway Lane 2. Multiple cars have swerved dangerously to avoid it. Extremely hazardous at night.',
          category: 'road',
          department: 'Infrastructure Team',
          priority: 'High',
          location: 'Main Highway Lane 2',
          latitude: '12.9805',
          longitude: '77.6010',
          image: null,
          status: 'progress',
          createdAt: '2026-07-19T14:20:00.000Z',
          statusTimeline: [
            { status: 'submitted', date: '2026-07-19T14:20:00.000Z', note: 'Report submitted by user.' },
            { status: 'review', date: '2026-07-19T14:22:00.000Z', note: 'AI classified category and routed to Infrastructure Team.' },
            { status: 'routed', date: '2026-07-19T15:00:00.000Z', note: 'Job assigned to Zone 3 maintenance crew.' },
            { status: 'progress', date: '2026-07-20T08:30:00.000Z', note: 'Repairs scheduled; safety markers placed around the hazard.' }
          ]
        }
      ];
      this.saveAll(mockSeeds);
    }
  }
};

// Seed database on script load
DB.seed();

// --- API Wrapper Interface (Separate from UI) ---
const API = {
  /**
   * Submit a new civic complaint
   * @param {Object} complaintData - Raw form data fields from client
   * @returns {Promise<Object>} - Resolves to the created complaint receipt
   */
  async submitComplaint(complaintData) {
    if (API_CONFIG.mode === 'webhook') {
      try {
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (API_CONFIG.apiKey) {
          headers['X-N8N-API-KEY'] = API_CONFIG.apiKey;
          headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
        }

        const response = await fetch(API_CONFIG.webhookUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(complaintData)
        });
        
        if (!response.ok) {
          let errorText = `Server responded with status: ${response.status}`;
          try {
            const errData = await response.json();
            if (errData && (errData.error || errData.message)) {
              errorText = errData.error || errData.message;
            }
          } catch (_) {
            // Non-JSON error body
          }
          throw new Error(errorText);
        }
        
        const data = await response.json();
        
        // Normalize webhook response fields to match internal schema
        const normalizedResponse = {
          id: data.id || data.complaintId || data.complaint_id || `SCAI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: data.title || complaintData.title || `Issue near ${complaintData.location || 'Location'}`,
          description: data.description || complaintData.description,
          category: data.category || complaintData.category,
          department: data.department || data.assigned_department || 'General Municipal Administration',
          priority: data.priority || data.priority_level || 'Medium',
          location: data.location || complaintData.location,
          latitude: data.latitude || complaintData.latitude || null,
          longitude: data.longitude || complaintData.longitude || null,
          image: data.image || complaintData.image || null,
          status: data.status || 'submitted',
          aiSummary: data.aiSummary || data.summary || data.ai_summary || null,
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
          statusTimeline: data.statusTimeline || data.timeline || [
            { status: 'submitted', date: new Date().toISOString(), note: 'Complaint submitted via Webhook.' },
            { status: 'review', date: new Date().toISOString(), note: data.aiSummary || 'AI Triage completed by n8n workflow.' }
          ]
        };

        // Cache webhook response in localStorage database so success and tracking loading work immediately
        const complaints = DB.getAll();
        complaints.unshift(normalizedResponse);
        DB.saveAll(complaints);
        
        return normalizedResponse;
      } catch (error) {
        console.error('API submission failed: ', error);
        throw new Error(error.message || 'Connection to the n8n routing server failed. Please try again later.');
      }
    } else {
      // LocalStorage Mode
      return new Promise((resolve) => {
        setTimeout(() => {
          const complaints = DB.getAll();
          
          // Generate realistic reference ID
          const randId = Math.floor(1000 + Math.random() * 9000);
          const generatedId = `SCAI-2026-${randId}`;
          const currentTimestamp = new Date().toISOString();
          
          // AI Routing Simulation
          const categoryRules = AI_ROUTING_RULES[complaintData.category] || AI_ROUTING_RULES['other'];
          
          const newComplaint = {
            id: generatedId,
            title: complaintData.title || `Issue near ${complaintData.location || 'Location'}`,
            description: complaintData.description,
            category: complaintData.category,
            department: categoryRules.department,
            priority: categoryRules.priority,
            location: complaintData.location,
            latitude: complaintData.latitude || null,
            longitude: complaintData.longitude || null,
            image: complaintData.image || null, // Base64 image
            status: 'submitted',
            createdAt: currentTimestamp,
            statusTimeline: [
              { status: 'submitted', date: currentTimestamp, note: 'Complaint submitted by citizen.' },
              { status: 'review', date: currentTimestamp, note: 'AI engines analyzed keywords and location.' }
            ]
          };
          
          complaints.unshift(newComplaint); // Add to beginning of database
          DB.saveAll(complaints);
          
          resolve(newComplaint);
        }, 800); // Artificial network latency
      });
    }
  },

  /**
   * Fetch complaint details by tracking reference ID
   * @param {string} complaintId - ID of complaint (e.g. SCAI-2026-4402)
   * @returns {Promise<Object>} - Resolves to complaint details or throws error
   */
  async getComplaint(complaintId) {
    if (!complaintId || complaintId.trim() === '') {
      throw new Error('Tracking ID is required.');
    }
    
    const cleanId = complaintId.trim().toUpperCase();
    
    // Check Firestore first if available
    if (window.db) {
      try {
        const doc = await window.db.collection('tickets').doc(cleanId).get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (err) {
        console.warn("Firestore tracking lookup failed, falling back to local/webhook", err);
      }
    }
    
    // Check cache first (contains mock seeds & submitted webhook complaints)
    const complaints = DB.getAll();
    const cachedRecord = complaints.find(c => c.id.toUpperCase() === cleanId);

    if (API_CONFIG.mode === 'webhook') {
      // Return cached item if available to support immediate display without GET endpoints
      if (cachedRecord) {
        return cachedRecord;
      }
      
      try {
        const headers = {
          'Accept': 'application/json'
        };

        if (API_CONFIG.apiKey) {
          headers['X-N8N-API-KEY'] = API_CONFIG.apiKey;
          headers['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;
        }

        const response = await fetch(`${API_CONFIG.webhookUrl}/track?id=${encodeURIComponent(cleanId)}`, {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Complaint ID not found.');
          }
          throw new Error('Server returned an error.');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API track failed: ', error);
        throw error;
      }
    } else {
      // LocalStorage Mode
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (cachedRecord) {
            // Simulate progression of status for demonstration if it was recently submitted
            if (cachedRecord.status === 'submitted') {
              const diffMs = new Date() - new Date(cachedRecord.createdAt);
              // If submitted more than 1 minute ago, show AI review progress for dynamic feel
              if (diffMs > 30000 && cachedRecord.statusTimeline.length === 2) {
                cachedRecord.status = 'review';
                cachedRecord.statusTimeline.push({
                  status: 'review',
                  date: new Date().toISOString(),
                  note: `Gemini Agent categorized category: ${cachedRecord.category.toUpperCase()}`
                });
                DB.saveAll(complaints);
              }
            }
            resolve(cachedRecord);
          } else {
            reject(new Error('Complaint Reference ID not found. Verify the code and try again.'));
          }
        }, 500); // Artificial network latency
      });
    }
  }
};

// --- Geolocation utilities ---
const GeolocationHelper = {
  /**
   * Get current latitude/longitude coordinates
   * @returns {Promise<Object>} - Resolves to {latitude, longitude} or throws error
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
        },
        (error) => {
          let errorMsg = 'Failed to retrieve location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Permission denied for location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Location retrieval request timed out.';
              break;
          }
          reject(new Error(errorMsg));
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }
};
