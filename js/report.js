/**
 * Smart Civic AI - Premium AI SaaS Report Page Logic
 * Manages the multi-step form wizard, validation checks, GPS, image previews, 
 * loading animations, interactive Leaflet maps, and webhook API submissions.
 */

// Global Leaflet map references
let map = null;
let marker = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('report-form');
  if (!form) return;

  setupCategoryCards();
  setupImageUpload();
  setupGeolocation();
  setupStepWizard();
  setupFormSubmission(form);
});

/**
 * Modern Category Selection Cards (Step 1)
 */
function setupCategoryCards() {
  const select = document.getElementById('category');
  const cards = document.querySelectorAll('.category-card');
  if (!select || cards.length === 0) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected from others
      cards.forEach(c => c.classList.remove('selected'));
      // Add selected class
      card.classList.add('selected');
      // Set dropdown value
      const val = card.getAttribute('data-value');
      select.value = val;
      // Clear category field error if present
      clearFieldError(select);

      // Trigger AI metadata suggestions lookup
      const trigger = document.createEvent('HTMLEvents');
      trigger.initEvent('change', true, false);
      select.dispatchEvent(trigger);
    });
  });
}

/**
 * Handle File upload triggers, restrictions, and thumbnails (Step 1)
 */
function setupImageUpload() {
  const fileInput = document.getElementById('image-upload');
  const preview = document.getElementById('image-preview');
  const uploadWrapper = document.getElementById('upload-wrapper');
  
  if (!fileInput || !preview || !uploadWrapper) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadWrapper.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadWrapper.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadWrapper.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadWrapper.classList.remove('dragover');
    }, false);
  });

  uploadWrapper.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      fileInput.files = files;
      processFile(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length) {
      processFile(fileInput.files[0]);
    }
  });

  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      window.Notification.show('Only image files are allowed.', 'error');
      fileInput.value = '';
      preview.style.display = 'none';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.Notification.show('Image size exceeds 2MB limit.', 'error');
      fileInput.value = '';
      preview.style.display = 'none';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      window.Notification.show('Image uploaded successfully. Analyzing with AI...', 'info');
      autoFillWithGemini(e.target.result.split(',')[1], file.type);
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Uses Gemini API to auto-fill title, description, and category from image
 */
async function autoFillWithGemini(base64Image, mimeType) {
  const DEFAULT_GEMINI_KEY = "YOUR_GEMINI_API_KEY_HERE";
  const GEMINI_API_KEY = localStorage.getItem('smart_civic_gemini_api_key') || DEFAULT_GEMINI_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `Analyze this image. Determine if it is a real-world photo of a civic issue (like a pothole, garbage, broken pipe, etc.) or if it is a 'fake' or invalid image (like a hand-drawn sketch, a screenshot, a selfie, or something completely unrelated). 
            
            Return a JSON object with exactly these keys: 
            'isValid' (boolean: true if it is a real civic issue photo, false if it is a sketch/fake/unrelated),
            'explanation' (a brief sentence explaining what type of image this is and why it was accepted or rejected),
            'title' (a short 3-5 word title, only if valid), 
            'category' (must be exactly one of: road, water, waste, streetlight, safety, other), 
            'description' (a helpful 2-3 sentence description of the issue seen in the photo, only if valid).` },
            {
              inline_data: {
                mime_type: mimeType || "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || `API error ${response.status}`;
      if (response.status === 429) {
        window.Notification.show('AI rate limit reached. Please wait 30 seconds and try again.', 'error', 6000);
      } else {
        window.Notification.show(`AI analysis failed: ${errMsg}`, 'error', 6000);
      }
      return;
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      let jsonText = data.candidates[0].content.parts[0].text;
      let parsed;
      try {
        const match = jsonText.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          parsed = JSON.parse(jsonText);
        }
      } catch (parseErr) {
        console.error("JSON parse error:", jsonText);
        throw parseErr;
      }
      
      if (!parsed.isValid) {
        window.Notification.show(`⚠️ Image Rejected: ${parsed.explanation || 'Invalid image detected.'}`, 'error', 6000);
        // Clear the preview to discourage resubmission of fake images
        const preview = document.getElementById('image-preview');
        if (preview) {
          preview.style.display = 'none';
          preview.src = '';
        }
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
        return;
      }
      
      const titleInput = document.getElementById('complaint-title');
      const descInput = document.getElementById('description');
      const catSelect = document.getElementById('category');
      
      if (titleInput) titleInput.value = parsed.title || '';
      if (descInput) descInput.value = parsed.description || '';
      if (catSelect) {
        catSelect.value = parsed.category || 'other';
        const cards = document.querySelectorAll('.category-card');
        cards.forEach(c => c.classList.remove('selected'));
        const activeCard = document.querySelector(`.category-card[data-value="${parsed.category || 'other'}"]`);
        if (activeCard) activeCard.classList.add('selected');
        
        // Trigger validation/updates
        const trigger = document.createEvent('HTMLEvents');
        trigger.initEvent('change', true, false);
        catSelect.dispatchEvent(trigger);
        if (titleInput) titleInput.dispatchEvent(trigger);
      }
      window.Notification.show('✅ AI successfully auto-filled your report!', 'success');
    } else {
      window.Notification.show('AI returned no results. Please fill in details manually.', 'error');
    }
  } catch (err) {
    console.error("Gemini Autofill error:", err);
    window.Notification.show('AI analysis failed. Please enter details manually.', 'error');
  }
}

/**
 * Handle GPS/Location retrieval triggers (Step 2)
 */
function setupGeolocation() {
  const locateBtn = document.getElementById('btn-locate');
  const latInput = document.getElementById('latitude');
  const lngInput = document.getElementById('longitude');

  if (!locateBtn || !latInput || !lngInput) return;

  locateBtn.addEventListener('click', async () => {
    locateBtn.disabled = true;
    locateBtn.textContent = 'Locating...';
    
    try {
      const position = await GeolocationHelper.getCurrentPosition();
      latInput.value = position.latitude;
      lngInput.value = position.longitude;
      
      clearFieldError(latInput);
      clearFieldError(lngInput);
      
      // Update interactive map view
      if (map && marker) {
        map.setView([position.latitude, position.longitude], 15);
        marker.setLatLng([position.latitude, position.longitude]);
      } else {
        initMap(position.latitude, position.longitude);
      }
      
      window.Notification.show('Coordinates retrieved successfully.', 'success');
    } catch (error) {
      console.warn(error);
      window.Notification.show(error.message || 'Unable to retrieve location coordinates.', 'error');
    } finally {
      locateBtn.disabled = false;
      locateBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 4px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
        </svg>
        Get Location
      `;
    }
  });
}

/**
 * Initialize Interactive Leaflet Map Picker
 */
function initMap(forcedLat, forcedLng) {
  const latInput = document.getElementById('latitude');
  const lngInput = document.getElementById('longitude');

  if (typeof L === 'undefined') {
    const mapDiv = document.getElementById('report-map');
    if (mapDiv) {
      mapDiv.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; text-align:center; color:var(--color-text-muted);">
          <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-bottom:8px; color:var(--color-warning);">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span style="font-weight:700; color:var(--color-text); font-size: 0.9rem;">Interactive Map Offline</span>
          <span style="font-size:0.75rem; margin-top:4px; max-width: 400px; line-height: 1.4;">Please connect to the internet to load the interactive map tiles, or click "Get Location" above to set coordinates automatically.</span>
        </div>
      `;
    }
    return;
  }

  // Default coordinate center: Panjim, Goa (15.4909, 73.8278)
  let initialLat = forcedLat || parseFloat(latInput.value) || 15.4909;
  let initialLng = forcedLng || parseFloat(lngInput.value) || 73.8278;

  if (!map) {
    // Initialise Leaflet Map
    map = L.map('report-map').setView([initialLat, initialLng], 14);

    // Add OpenStreetMap layers
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create Draggable Pin Marker
    marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

    // Drag events update lat/lng coordinate fields
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      latInput.value = position.lat.toFixed(6);
      lngInput.value = position.lng.toFixed(6);
      clearFieldError(latInput);
      clearFieldError(lngInput);
    });

    // Map click drops marker to location
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      latInput.value = e.latlng.lat.toFixed(6);
      lngInput.value = e.latlng.lng.toFixed(6);
      clearFieldError(latInput);
      clearFieldError(lngInput);
    });
  } else {
    // Pan to coordinates
    map.setView([initialLat, initialLng], 14);
    marker.setLatLng([initialLat, initialLng]);
  }

  // Force Leaflet grid recalculations for hidden wizard screens
  setTimeout(() => {
    map.invalidateSize();
  }, 150);
}

/**
 * Step Wizard Coordinator Layout
 */
let currentStepIndex = 1;
const totalSteps = 3;

function setupStepWizard() {
  const screens = document.querySelectorAll('.wizard-screen');
  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const progressBar = document.getElementById('wizard-progress-bar');
  const btnNext = document.getElementById('btn-next');
  const btnBack = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');

  if (screens.length === 0 || !btnNext || !btnBack) return;

  btnNext.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateStep(currentStepIndex)) {
      if (currentStepIndex < totalSteps) {
        currentStepIndex++;
        updateWizard();
      }
    } else {
      window.Notification.show('Please fill in required fields correctly.', 'error');
    }
  });

  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStepIndex > 1) {
      currentStepIndex--;
      updateWizard();
    }
  });

  function updateWizard() {
    screens.forEach((screen, index) => {
      screen.classList.toggle('active', (index + 1) === currentStepIndex);
    });

    stepNodes.forEach((node, index) => {
      const stepNum = index + 1;
      node.classList.toggle('active', stepNum === currentStepIndex);
      node.classList.toggle('completed', stepNum < currentStepIndex);
    });

    const progressWidth = ((currentStepIndex - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progressWidth}%`;

    btnBack.style.display = currentStepIndex === 1 ? 'none' : 'block';
    
    if (currentStepIndex === totalSteps) {
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'block';
      populateReviewData();
    } else {
      btnNext.style.display = 'block';
      btnSubmit.style.display = 'none';
    }

    // Initialize interactive Leaflet map when arriving on Step 2 (Location screen)
    if (currentStepIndex === 2) {
      initMap();
    }
  }

  function populateReviewData() {
    const titleVal = document.getElementById('complaint-title').value.trim();
    const descVal = document.getElementById('description').value.trim();
    const categorySelect = document.getElementById('category');
    const locationVal = document.getElementById('location').value.trim();
    const priorityBadge = document.getElementById('review-priority');
    const deptText = document.getElementById('review-dept');
    
    document.getElementById('review-title').textContent = titleVal || 'N/A';
    document.getElementById('review-desc').textContent = descVal || 'N/A';
    document.getElementById('review-location').textContent = locationVal || 'N/A';
    
    let catText = 'N/A';
    if (categorySelect.value) {
      const opt = categorySelect.options[categorySelect.selectedIndex];
      catText = opt.text;
    }
    document.getElementById('review-category').textContent = catText;

    const cat = categorySelect.value;
    const rule = AI_ROUTING_RULES[cat] || AI_ROUTING_RULES['other'];
    
    deptText.textContent = rule.department;
    priorityBadge.textContent = rule.priority.toUpperCase();
    priorityBadge.className = `badge badge-${rule.priority.toLowerCase()}`;
  }

  updateWizard();
}

/**
 * Validate active screen specific fields
 */
function validateStep(stepIndex) {
  let isValid = true;
  
  const title = document.getElementById('complaint-title');
  const category = document.getElementById('category');
  const description = document.getElementById('description');
  const location = document.getElementById('location');
  const latitude = document.getElementById('latitude');
  const longitude = document.getElementById('longitude');

  if (stepIndex === 1) {
    if (!category.value) {
      const group = category.closest('.form-group');
      if (group) group.classList.add('invalid');
      isValid = false;
    } else {
      clearFieldError(category);
    }
    
    if (!title.value.trim() || title.value.trim().length < 5) {
      setFieldError(title, 'Please describe the issue (at least 5 characters).');
      isValid = false;
    } else {
      clearFieldError(title);
    }

    if (!description.value.trim() || description.value.trim().length < 15) {
      setFieldError(description, 'Please describe the issue in detail (at least 15 characters).');
      isValid = false;
    } else {
      clearFieldError(description);
    }
  } 
  
  else if (stepIndex === 2) {
    if (!location.value.trim() || location.value.trim().length < 5) {
      setFieldError(location, 'Please specify the location/address details (at least 5 characters).');
      isValid = false;
    } else {
      clearFieldError(location);
    }

    const coordPattern = /^-?\d{1,3}\.\d{4,8}$/;
    if (latitude.value.trim() && !coordPattern.test(latitude.value.trim())) {
      setFieldError(latitude, 'Latitude must be in decimal form (e.g. 12.345678).');
      isValid = false;
    } else {
      clearFieldError(latitude);
    }
    if (longitude.value.trim() && !coordPattern.test(longitude.value.trim())) {
      setFieldError(longitude, 'Longitude must be in decimal form (e.g. 77.345678).');
      isValid = false;
    } else {
      clearFieldError(longitude);
    }
  }

  return isValid;
}

/**
 * Handle form inputs, resets, and API postings
 */
function setupFormSubmission(form) {
  const fields = {
    title: document.getElementById('complaint-title'),
    category: document.getElementById('category'),
    description: document.getElementById('description'),
    location: document.getElementById('location'),
    latitude: document.getElementById('latitude'),
    longitude: document.getElementById('longitude'),
    imagePreview: document.getElementById('image-preview')
  };

  const btnReset = document.getElementById('btn-reset');
  const btnSubmit = document.getElementById('btn-submit');
  const triageLoading = document.getElementById('triage-loading');
  const wizardProgress = document.getElementById('wizard-progress-header');
  const wizardScreensContainer = document.getElementById('wizard-screens-container');
  const wizardActions = document.getElementById('wizard-actions-footer');
  const suggestedMetaRow = document.getElementById('suggested-meta-row');

  // Input listeners
  Object.values(fields).forEach(input => {
    if (input && input.tagName !== 'IMG') {
      input.addEventListener('input', () => {
        clearFieldError(input);
        updateAISuggestion();
      });
      input.addEventListener('change', () => {
        clearFieldError(input);
        updateAISuggestion();
      });
    }
  });

  // Dynamic priority suggestions lookup
  function updateAISuggestion() {
    const cat = fields.category.value;
    const titleVal = fields.title.value.trim();
    const descVal = fields.description.value.trim();
    const priSpan = document.getElementById('ai-suggested-priority');
    const confSpan = document.getElementById('ai-suggested-confidence');

    if (cat && (titleVal.length > 2 || descVal.length > 5)) {
      if (suggestedMetaRow) suggestedMetaRow.style.display = 'flex';
      const rule = AI_ROUTING_RULES[cat] || AI_ROUTING_RULES['other'];
      if (priSpan) {
        priSpan.textContent = rule.priority.toUpperCase();
        priSpan.className = `badge badge-${rule.priority.toLowerCase()}`;
      }
      if (confSpan) {
        confSpan.textContent = cat === 'waste' ? '92%' :
                             cat === 'road' ? '95%' :
                             cat === 'water' ? '97%' :
                             cat === 'streetlight' ? '89%' :
                             cat === 'safety' ? '91%' : '85%';
      }
    } else {
      if (suggestedMetaRow) suggestedMetaRow.style.display = 'none';
    }
  }

  // Resets Wizard
  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      form.reset();
      
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
      
      fields.imagePreview.style.display = 'none';
      fields.imagePreview.src = '';
      
      if (map && marker) {
        map.setView([15.4909, 73.8278], 14);
        marker.setLatLng([15.4909, 73.8278]);
      }

      if (suggestedMetaRow) suggestedMetaRow.style.display = 'none';

      Object.values(fields).forEach(input => {
        if (input && input.tagName !== 'IMG') {
          clearFieldError(input);
        }
      });

      // Jump back to step 1
      currentStepIndex = 1;
      const screens = document.querySelectorAll('.wizard-screen');
      const stepNodes = document.querySelectorAll('.wizard-step-node');
      const progressBar = document.getElementById('wizard-progress-bar');
      const btnNext = document.getElementById('btn-next');
      const btnBack = document.getElementById('btn-back');
      
      screens.forEach((screen, idx) => screen.classList.toggle('active', idx === 0));
      stepNodes.forEach((node, idx) => {
        node.classList.toggle('active', idx === 0);
        node.classList.remove('completed');
      });
      progressBar.style.width = '0%';
      
      btnBack.style.display = 'none';
      btnNext.style.display = 'block';
      btnSubmit.style.display = 'none';
      
      window.Notification.show('Form reset successfully.', 'info');
    });
  }

  // Handle Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) {
      window.Notification.show('Form fields contain invalid values.', 'error');
      return;
    }

    if (wizardProgress) wizardProgress.style.display = 'none';
    if (wizardScreensContainer) wizardScreensContainer.style.display = 'none';
    if (wizardActions) wizardActions.style.display = 'none';
    if (triageLoading) triageLoading.style.display = 'block';

    let imageUrl = null;
    const fileInput = document.getElementById('image-upload');
    if (fileInput && fileInput.files.length > 0) {
      try {
        const file = fileInput.files[0];
        const storageRef = window.storage.ref();
        const evidenceRef = storageRef.child('evidence/' + Date.now() + '_' + file.name);
        await evidenceRef.put(file);
        imageUrl = await evidenceRef.getDownloadURL();
      } catch (err) {
        console.error("Image upload failed:", err);
        window.Notification.show('Failed to upload image.', 'error');
        // Restore UI
        if (wizardProgress) wizardProgress.style.display = 'flex';
        if (wizardScreensContainer) wizardScreensContainer.style.display = 'block';
        if (wizardActions) wizardActions.style.display = 'flex';
        if (triageLoading) triageLoading.style.display = 'none';
        return;
      }
    }

    const payload = {
      title: fields.title.value.trim(),
      category: fields.category.value,
      description: fields.description.value.trim(),
      location: fields.location.value.trim(),
      latitude: fields.latitude.value.trim() || null,
      longitude: fields.longitude.value.trim() || null,
      image: imageUrl
    };

    const currentUser = window.auth ? window.auth.currentUser : null;
    if (currentUser) {
      payload.uid = currentUser.uid;
      payload.email = currentUser.email;
    }

    try {
      const response = await API.submitComplaint(payload);
      
      // Save to Firestore if user is logged in
      if (currentUser && window.db) {
         try {
           await window.db.collection('tickets').doc(response.id).set({
             ...response,
             uid: currentUser.uid,
             email: currentUser.email,
             timestamp: firebase.firestore.FieldValue.serverTimestamp()
           });
         } catch (fsErr) {
           console.error("Failed to save ticket to Firestore", fsErr);
         }
      }

      window.Notification.show('Ticket routed successfully!', 'success');
      
      setTimeout(() => {
        window.location.href = `success.html?id=${encodeURIComponent(response.id)}`;
      }, 1000);
      
    } catch (error) {
      console.error(error);
      window.Notification.show(error.message || 'Error executing AI triage route.', 'error');
      
      if (wizardProgress) wizardProgress.style.display = 'flex';
      if (wizardScreensContainer) wizardScreensContainer.style.display = 'block';
      if (wizardActions) wizardActions.style.display = 'flex';
      if (triageLoading) triageLoading.style.display = 'none';
    }
  });
}

function setFieldError(element, errorMessage) {
  const group = element.closest('.form-group');
  if (!group) return;
  
  group.classList.add('invalid');
  let errLabel = group.querySelector('.error-message');
  if (!errLabel) {
    errLabel = document.createElement('div');
    errLabel.className = 'error-message';
    group.appendChild(errLabel);
  }
  errLabel.textContent = errorMessage;
}

function clearFieldError(element) {
  const group = element.closest('.form-group');
  if (group) {
    group.classList.remove('invalid');
  }
}
