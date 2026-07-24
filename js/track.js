/**
 * Smart Civic AI - Premium AI SaaS Tracking Logic
 * Manages URL parameter lookups, database queries, timeline steps, 
 * and populating the AI Insights dashboard panels.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupSearchForm();
  checkUrlParams();
});

/**
 * Handle Search Form Actions
 */
function setupSearchForm() {
  const form = document.getElementById('track-form');
  const input = document.getElementById('track-id-input');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = input.value.trim().toUpperCase();
    
    if (!id) {
      window.Notification.show('Please enter a Ticket Reference ID.', 'error');
      return;
    }

    // Load complaint
    loadTrackingDetails(id);
  });
}

/**
 * Deep-link check for URL parameters (e.g. ?id=SCAI-XXXX)
 */
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (id) {
    const input = document.getElementById('track-id-input');
    if (input) input.value = id.toUpperCase();
    loadTrackingDetails(id);
  }
}

/**
 * Retrieve ticket and populate tracking UI dashboards
 * @param {string} id - Ticket Reference ID
 */
async function loadTrackingDetails(id) {
  const cleanId = id.trim().toUpperCase();
  const searchBtn = document.querySelector('#track-form button[type="submit"]');
  const resultSection = document.getElementById('tracking-details-section');

  if (searchBtn) {
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
  }

  try {
    const record = await API.getComplaint(cleanId);
    
    // Unhide results
    if (resultSection) {
      resultSection.style.display = 'block';
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Populate Case Record details
    document.getElementById('receipt-id').textContent = record.id;
    document.getElementById('receipt-title').textContent = record.title;
    document.getElementById('receipt-category').textContent = formatCategoryName(record.category);
    document.getElementById('receipt-department').textContent = record.department;
    document.getElementById('receipt-location').textContent = record.location || 'N/A';
    
    // Format timestamp
    const createdDate = new Date(record.createdAt);
    document.getElementById('receipt-date').textContent = createdDate.toLocaleString();
    
    // Status Badge
    const sBadge = document.getElementById('receipt-status');
    sBadge.className = `badge badge-${record.status.toLowerCase()}`;
    sBadge.textContent = record.status.toUpperCase();
    
    // Priority Badge
    const pBadge = document.getElementById('receipt-priority');
    pBadge.className = `badge badge-${record.priority.toLowerCase()}`;
    pBadge.textContent = record.priority;

    // GPS Coordinates
    const coordsText = (record.latitude && record.longitude) 
      ? `${record.latitude}, ${record.longitude}` 
      : 'Not Specified';
    document.getElementById('receipt-coords').textContent = coordsText;

    // Report Description details
    document.getElementById('receipt-desc-text').textContent = record.description;

    // AI Analysis Summary
    const summaryContainer = document.getElementById('track-ai-summary-container');
    const summaryText = document.getElementById('track-display-summary');
    if (record.aiSummary) {
      summaryText.textContent = record.aiSummary;
      summaryContainer.style.display = 'block';
    } else {
      summaryText.textContent = `Report processed under class: ${formatCategoryName(record.category)}. AI routing validated priority index and assigned case dispatcher.`;
      summaryContainer.style.display = 'block';
    }

    // Evidence Image Preview
    const imgEl = document.getElementById('receipt-img');
    const imgContainer = imgEl.closest('.receipt-item');
    if (record.image) {
      imgEl.src = record.image;
      imgContainer.style.display = 'block';
    } else {
      imgContainer.style.display = 'none';
    }

    // Update progress timeline levels
    updateProgressTimeline(record.status, record.statusTimeline);

    // Populate AI Insights Sidebar panel
    populateInsightsPanel(record);

    window.Notification.show('Ticket details retrieved successfully.', 'success');

  } catch (error) {
    console.error(error);
    window.Notification.show(error.message || 'Reference ID not found.', 'error');
    if (resultSection) resultSection.style.display = 'none';
  } finally {
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 4px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        Search
      `;
    }
  }
}

/**
 * Update visual progress timeline glows & steps
 */
function updateProgressTimeline(currentStatus, timelineData) {
  const steps = ['submitted', 'review', 'routed', 'progress', 'resolved'];
  const currentIdx = steps.indexOf(currentStatus.toLowerCase());
  
  const stepNodes = document.querySelectorAll('.timeline-step');
  const progressBar = document.querySelector('.timeline-progress');

  stepNodes.forEach((node, index) => {
    const stepName = node.getAttribute('data-step');
    const stepIdx = steps.indexOf(stepName);
    
    // Clear classes
    node.classList.remove('active', 'completed');
    
    // Date & logs tags
    const dateEl = node.querySelector('.step-date');
    const noteEl = node.querySelector('.step-note');
    if (dateEl) dateEl.style.display = 'none';
    if (noteEl) noteEl.style.display = 'none';

    if (stepIdx === currentIdx) {
      node.classList.add('active');
    } else if (stepIdx < currentIdx) {
      node.classList.add('completed');
    }

    // Set timeline updates if present
    const matchedLog = timelineData.find(item => item.status.toLowerCase() === stepName);
    if (matchedLog) {
      if (dateEl) {
        const logDate = new Date(matchedLog.date);
        dateEl.textContent = logDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        dateEl.style.display = 'block';
      }
      if (noteEl) {
        noteEl.textContent = matchedLog.note;
        noteEl.style.display = 'block';
      }
    }
  });

  // Calculate progress bar length
  if (progressBar) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Height progress for mobile
      const percentageHeight = currentIdx >= 0 ? (currentIdx / (steps.length - 1)) * 100 : 0;
      progressBar.style.height = `${percentageHeight}%`;
      progressBar.style.width = '4px';
    } else {
      // Width progress for desktop
      const percentageWidth = currentIdx >= 0 ? (currentIdx / (steps.length - 1)) * 100 : 0;
      progressBar.style.width = `${percentageWidth}%`;
      progressBar.style.height = '4px';
    }
  }
}

/**
 * Populate details for the AI Insights Sidebar (Right side card)
 */
function populateInsightsPanel(record) {
  const confidenceEl = document.getElementById('insight-confidence');
  const riskEl = document.getElementById('insight-risk');
  const classificationEl = document.getElementById('insight-classification');
  const priorityReasonEl = document.getElementById('insight-priority-reason');
  const deptReasonEl = document.getElementById('insight-dept-reason');

  // Fill Classification
  classificationEl.textContent = formatCategoryName(record.category);

  // Determine Severity Risk
  if (record.priority.toLowerCase() === 'high') {
    riskEl.textContent = 'CRITICAL / HIGH';
    riskEl.className = 'badge badge-high';
    priorityReasonEl.textContent = 'High priority triggered by safety risks and structural failure hazards.';
  } else if (record.priority.toLowerCase() === 'medium') {
    riskEl.textContent = 'ELEVATED / MEDIUM';
    riskEl.className = 'badge badge-medium';
    priorityReasonEl.textContent = 'Medium severity triggered. Concerns utility outages or sanitational backlogs.';
  } else {
    riskEl.textContent = 'STANDARD / LOW';
    riskEl.className = 'badge badge-low';
    priorityReasonEl.textContent = 'Standard low triage index assigned for general maintenance logging.';
  }

  // Set mock confidence score
  confidenceEl.textContent = record.id.endsWith('1') ? '98.4%' : 
                          record.id.endsWith('2') ? '95.1%' : 
                          record.id.endsWith('3') ? '97.2%' : '96.8%';

  // Set Routing Justification details
  deptReasonEl.textContent = `Context tags parsed into operational group: ${record.department}.`;
}

/**
 * Translate internal status identifiers to display friendly strings
 */
function formatStatusName(status) {
  const mapping = {
    'submitted': 'Submitted',
    'review': 'AI Analyzing',
    'routed': 'Routed to Team',
    'progress': 'Action In Progress',
    'resolved': 'Resolved'
  };
  return mapping[status.toLowerCase()] || status;
}

/**
 * Translate internal categories to display titles
 */
function formatCategoryName(category) {
  const mapping = {
    'waste': 'Waste Management',
    'road': 'Infrastructure Group',
    'water': 'Water Services',
    'streetlight': 'Road Maintenance',
    'safety': 'Public Safety',
    'other': 'Operations Group'
  };
  return mapping[category.toLowerCase()] || category;
}
