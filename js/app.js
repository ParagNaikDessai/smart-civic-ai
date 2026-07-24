/**
 * Smart Civic AI - Premium AI SaaS Global UI Manager
 * Handles responsive menu, dark mode toggling, scroll shrinking, 
 * toast notifications, and the floating AI Assistant chat widget.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupTheme();
  setupHeaderScroll();
  setupAccessibility();
  setupChatWidget();
});

/**
 * Responsive Mobile Drawer Menu Configurations
 */
function setupNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    // Open/Close menu click handler
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside of the drawer
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== menuToggle) {
        closeMobileMenu();
      }
    });

    // Close drawer when screen scales larger
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close menu on pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    `;
  }

  highlightActiveLink();
}

function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.endsWith(linkPath) || 
        (currentPath.endsWith('/') && linkPath.endsWith('index.html')) ||
        (currentPath.includes('/pages/') && linkPath.includes(currentPath.substring(currentPath.lastIndexOf('/') + 1)))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Dark Mode Theme Handler
 */
function setupTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Set theme from localStorage or fallback to default light
  const currentTheme = localStorage.getItem('smart-civic-theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('smart-civic-theme', isDark ? 'dark' : 'light');
    });
  }
}

/**
 * Scroll Shrinking Navbar
 */
function setupHeaderScroll() {
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    });
  }
}

/**
 * Accessibilities Enhancements
 */
function setupAccessibility() {
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('id')) {
    main.setAttribute('id', 'main-content');
  }
}

/**
 * Dynamic Floating AI Chatbot Widget Setup & Dialogue Simulation
 */
function setupChatWidget() {
  // Check if drawer elements already exist (prevent duplication)
  if (document.getElementById('ai-chat-toggle')) return;

  // Insert Chat Trigger Button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'ai-chat-toggle';
  toggleBtn.className = 'chat-widget-toggle';
  toggleBtn.setAttribute('aria-label', 'Open AI Chat Assistant');
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 10.742l.08-.03a7.5 7.5 0 0110.54 10.54l-.03.08-1.06 1.06a.75.75 0 01-1.06 0l-1.06-1.06a9 9 0 00-12.728 0l-1.06 1.06a.75.75 0 01-1.06 0l-1.06-1.06a7.5 7.5 0 010-10.606l1.06-1.06zm0 0L12 7.5M12 7.5l3.316 3.242M12 7.5V3" />
    </svg>
  `;
  document.body.appendChild(toggleBtn);

  // Insert Chat Panel Frame
  const chatContainer = document.createElement('div');
  chatContainer.id = 'ai-chat-container';
  chatContainer.className = 'chat-widget-container';
  chatContainer.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 20px; height: 20px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21l8.904-4.474M18 10.5c0 2.9-2.1 5.3-5 5.9-2.9-.6-5-3-5-5.9 0-3.3 2.7-6 6-6s6 2.7 6 6z" />
        </svg>
        <span>AI Assistant</span>
      </div>
      <button class="chat-close-btn" id="chat-close" aria-label="Close Chat Window">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="chat-body" id="chat-body">
      <!-- Chat bubbles inserted here -->
    </div>
    <div class="chat-input-area">
      <input type="text" id="chat-input" placeholder="Type a message...">
      <button class="chat-send-btn" id="chat-send" aria-label="Send message">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(chatContainer);

  const closeBtn = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatBody = document.getElementById('chat-body');

  // Open/Close toggle clicks
  toggleBtn.addEventListener('click', () => {
    chatContainer.classList.toggle('open');
    if (chatContainer.classList.contains('open') && chatBody.children.length === 0) {
      initiateConversation();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatContainer.classList.remove('open');
  });

  // Handle enter key submissions
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleUserTextSubmit();
    }
  });

  chatSend.addEventListener('click', handleUserTextSubmit);

  // Dialog State Machine variables
  let currentStep = 'init';
  let reportData = {
    title: '',
    category: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    image: null
  };

  function initiateConversation() {
    addMessage("Hi! I am the Smart Civic AI Assistant. How can I help you today?", 'ai');
    showOptions([
      { text: "Report an Issue", value: "report" },
      { text: "Track Ticket Status", value: "track" },
      { text: "General Inquiries", value: "info" }
    ]);
  }

  function addMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${sender}`;
    bubble.textContent = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showOptions(options) {
    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'chat-options-group';
    
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-pill';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        // User sends options choice
        addMessage(opt.text, 'user');
        optionsGroup.remove();
        processOptionChoice(opt.value);
      });
      optionsGroup.appendChild(btn);
    });
    chatBody.appendChild(optionsGroup);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function processOptionChoice(val) {
    if (val === 'report') {
      currentStep = 'report_title';
      addMessage("Let's log an issue. What is the problem? (e.g. Broken streetlight, garbage pileup)", 'ai');
    } else if (val === 'track') {
      currentStep = 'track_id';
      addMessage("Please enter your Ticket Reference ID (e.g. SCAI-2026-9081):", 'ai');
    } else if (val === 'info') {
      addMessage("I am a demo AI assistant for the Smart Civic AI platform, built in alignment with UN SDG 11. You can submit community reports and view active dispatches.", 'ai');
      setTimeout(() => initiateConversation(), 1500);
    }
  }

  function handleUserTextSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    chatInput.value = '';
    
    processTextStep(text);
  }

  async function processTextStep(text) {
    if (currentStep === 'track_id') {
      const match = text.toUpperCase();
      addMessage(`Searching for Ticket Reference: ${match}...`, 'ai');
      setTimeout(() => {
        try {
          const records = JSON.parse(localStorage.getItem('smart_civic_complaints') || '[]');
          const item = records.find(r => r.id === match);
          if (item) {
            addMessage(`Ticket Found! Status: ${item.status.toUpperCase()}. Routed to: ${item.department}. Severity: ${item.priority}.`, 'ai');
            addMessage(`View detailed timelines at track.html?id=${match}`, 'ai');
          } else {
            addMessage("No ticket matching that reference key was found. Please check spelling.", 'ai');
          }
        } catch(e) {
          addMessage("Error querying local records.", 'ai');
        }
        setTimeout(() => initiateConversation(), 1500);
      }, 1000);
      
    } else if (currentStep === 'report_title') {
      reportData.title = text;
      reportData.description = `Issue logged via AI Assistant: ${text}`;
      currentStep = 'report_location';
      addMessage("Where is this issue located? (Please provide street name/landmark)", 'ai');
      
    } else if (currentStep === 'report_location') {
      reportData.location = text;
      // Pre-fill mock GPS values
      reportData.latitude = "12.9716";
      reportData.longitude = "77.5946";
      
      currentStep = 'report_image';
      addMessage("Got it. Do you want to simulate attaching an evidence photo?", 'ai');
      showOptions([
        { text: "Attach Mock Photo", value: "attach_image" },
        { text: "Skip Photo", value: "skip_image" }
      ]);
    }
  }

  // Handle options following texts
  function processOptionFollowing(val) {
    if (val === 'attach_image') {
      reportData.image = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%234F46E5%22%2F%3E%3C%2Fsvg%3E";
      triggerAIAnalysis();
    } else if (val === 'skip_image') {
      triggerAIAnalysis();
    }
  }

  function triggerAIAnalysis() {
    addMessage("AI Triage engine is processing submission metrics...", 'ai');
    setTimeout(() => {
      // Analyze title to classify
      const titleLower = reportData.title.toLowerCase();
      let category = 'other';
      let dept = 'Operations Team';
      let priority = 'Low';

      if (titleLower.includes('garbage') || titleLower.includes('waste') || titleLower.includes('dump')) {
        category = 'waste';
        dept = 'Waste Management Team';
        priority = 'Medium';
      } else if (titleLower.includes('pothole') || titleLower.includes('road') || titleLower.includes('sidewalk')) {
        category = 'road';
        dept = 'Infrastructure Team';
        priority = 'High';
      } else if (titleLower.includes('water') || titleLower.includes('drain') || titleLower.includes('leak')) {
        category = 'water';
        dept = 'Water Services';
        priority = 'High';
      } else if (titleLower.includes('light') || titleLower.includes('lamp') || titleLower.includes('dark')) {
        category = 'streetlight';
        dept = 'Road Maintenance';
        priority = 'Medium';
      } else if (titleLower.includes('safety') || titleLower.includes('police') || titleLower.includes('hazard')) {
        category = 'safety';
        dept = 'Public Safety Team';
        priority = 'High';
      }

      reportData.category = category;
      
      addMessage(`Triage Complete!`, 'ai');
      addMessage(`Detected Class: ${dept}`, 'ai');
      addMessage(`Assigned Severity: ${priority}`, 'ai');
      addMessage("Would you like to finalize and submit this ticket?", 'ai');
      
      showOptions([
        { text: "Confirm and Submit", value: "submit_now" },
        { text: "Cancel Ticket", value: "cancel" }
      ]);
    }, 1500);
  }

  // Options router wrapper
  function processOptionChoice(val) {
    if (val === 'report') {
      currentStep = 'report_title';
      addMessage("What is the issue? (e.g. Broken streetlight, garbage pileup)", 'ai');
    } else if (val === 'track') {
      currentStep = 'track_id';
      addMessage("Please enter your Ticket Reference ID (e.g. SCAI-2026-9081):", 'ai');
    } else if (val === 'info') {
      addMessage("I am a demo AI assistant for the Smart Civic AI platform, built in alignment with UN SDG 11. You can submit community reports and view active dispatches.", 'ai');
      setTimeout(() => initiateConversation(), 1500);
    } else if (val === 'attach_image' || val === 'skip_image') {
      processOptionFollowing(val);
    } else if (val === 'submit_now') {
      saveAITicket();
    } else if (val === 'cancel') {
      addMessage("Ticket submission cancelled.", 'ai');
      setTimeout(() => initiateConversation(), 1500);
    }
  }

  async function saveAITicket() {
    addMessage("Saving report record...", 'ai');
    try {
      const payload = {
        title: reportData.title,
        category: reportData.category,
        description: reportData.description,
        location: reportData.location,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        image: reportData.image // This is the mock SVG from the chat widget
      };

      const currentUser = window.auth ? window.auth.currentUser : null;
      if (currentUser) {
        payload.uid = currentUser.uid;
        payload.email = currentUser.email;
      }

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

      addMessage(`Success! Ticket created. ID: ${response.id}.`, 'ai');
      addMessage(`You can track progress timeline at track.html?id=${response.id}`, 'ai');
      
      setTimeout(() => initiateConversation(), 3000);
    } catch (err) {
      console.error(err);
      addMessage("Failed to submit ticket. Please try the main reporting form.", 'ai');
      setTimeout(() => initiateConversation(), 2000);
    }
  }
}

/**
 * Global Toast Notification System
 */
const Notification = {
  show(message, type = 'info', duration = 4000) {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    
    let icon = '';
    if (type === 'success') {
      icon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
    } else if (type === 'error') {
      icon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;
    } else {
      icon = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }
    
    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }
};
window.Notification = Notification;
