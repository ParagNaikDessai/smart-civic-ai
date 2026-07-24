// js/auth.js
// Handles authentication logic via Firebase and user profiles in Firestore

document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase === 'undefined' || typeof window.auth === 'undefined' || typeof window.db === 'undefined') return;
  
  const auth = window.auth;
  const db = window.db;
  const provider = window.googleProvider;

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = ['report.html', 'track.html', 'dashboard.html'];
  const isProtected = protectedRoutes.some(route => window.location.pathname.includes(route));
  const isLoginPage = window.location.pathname.includes('login.html');

  // Inject a skeleton loader to prevent layout shift while checking auth
  const headerActions = document.querySelector('.header-actions');
  const menuToggle = document.getElementById('menu-toggle');
  if (headerActions && !document.getElementById('auth-skeleton')) {
    const skeleton = document.createElement('div');
    skeleton.id = 'auth-skeleton';
    skeleton.style.cssText = 'width: 36px; height: 36px; border-radius: 50%; background: var(--color-border); opacity: 0.5; animation: skeleton-pulse 1.5s infinite; margin-left: 10px;';
    
    if (!document.getElementById('skeleton-style')) {
      const style = document.createElement('style');
      style.id = 'skeleton-style';
      style.textContent = '@keyframes skeleton-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.2; } }';
      document.head.appendChild(style);
    }

    if (menuToggle) {
      headerActions.insertBefore(skeleton, menuToggle);
    } else {
      headerActions.appendChild(skeleton);
    }
  }

  // Listen for auth state changes
  auth.onAuthStateChanged(async (user) => {
    updateHeaderUI(user);
    
    if (user) {
      // If user is logged in and on login page, redirect to home
      if (isLoginPage) {
        window.location.href = '../index.html';
      }
    } else {
      // If user is NOT logged in and on protected page, redirect to login
      if (isProtected) {
        window.location.href = 'login.html';
      }
    }
  });

  // Function to create or update user document in Firestore
  window.saveUserProfile = async (user, name = '', providerName = 'email') => {
    const userRef = db.collection('users').doc(user.uid);
    try {
      const doc = await userRef.get();
      if (!doc.exists) {
        // Create new user profile on Signup/First Login
        await userRef.set({
          uid: user.uid,
          name: name || user.displayName || 'User',
          email: user.email,
          provider: providerName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          profilePhoto: user.photoURL || ''
        });
      } else {
        // Update last login for existing users
        await userRef.update({
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  // Update Header UI for Auth State
  function updateHeaderUI(user) {
    // Remove skeleton loader if it exists
    const skeleton = document.getElementById('auth-skeleton');
    if (skeleton) skeleton.remove();

    const loginBtns = document.querySelectorAll('button[aria-label="Login to dashboard"], #btn-login-header');
    const headerActions = document.querySelector('.header-actions');
    let profileContainer = document.getElementById('user-profile-container');
    
    if (user && headerActions) {
      // Hide login buttons
      loginBtns.forEach(btn => btn.style.display = 'none');
      
      // Prevent hiding logout btn we added previously by script, just remove it
      const oldLogout = document.getElementById('btn-logout-header');
      if (oldLogout) oldLogout.style.display = 'none';

      // Create dropdown if it doesn't exist
      if (!profileContainer) {
        profileContainer = document.createElement('div');
        profileContainer.id = 'user-profile-container';
        profileContainer.className = 'profile-dropdown';
        
        const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
        const defaultAvatar = isRoot ? 'assets/default-avatar.svg' : '../assets/default-avatar.svg';
        const photoUrl = user.photoURL || defaultAvatar;
        const displayName = user.displayName || user.email.split('@')[0];
        const profileLink = isRoot ? 'pages/profile.html' : 'profile.html';

        const settingsLink = isRoot ? 'pages/settings.html' : 'settings.html';
        const adminHtml = user.email === 'paragdessai7@gmail.com' 
          ? `<a href="${settingsLink}" class="dropdown-item" style="color: #6366f1;">⚙️ Admin Settings</a>` 
          : '';

        profileContainer.innerHTML = `
          <button class="profile-toggle" aria-label="User Menu" id="profile-toggle-btn">
            <img src="${photoUrl}" alt="Profile" class="profile-avatar" onerror="this.src='${defaultAvatar}';">
            <span class="profile-name">${displayName}</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="dropdown-menu" id="profile-dropdown-menu">
            <div class="dropdown-header">
              <p class="dropdown-name">${displayName}</p>
              <p class="dropdown-email">${user.email}</p>
            </div>
            <div class="dropdown-divider"></div>
            <a href="${profileLink}" class="dropdown-item">My Profile</a>
            ${adminHtml}
            <a href="#" class="dropdown-item text-danger" id="btn-logout">Logout</a>
          </div>
        `;
        
        // Insert before the menu toggle if it exists
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
          headerActions.insertBefore(profileContainer, menuToggle);
        } else {
          headerActions.appendChild(profileContainer);
        }

        // Add event listeners for dropdown interactions
        const toggleBtn = document.getElementById('profile-toggle-btn');
        const menu = document.getElementById('profile-dropdown-menu');
        
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
          if (!profileContainer.contains(e.target)) {
            menu.classList.remove('show');
          }
        });

        document.getElementById('btn-logout').addEventListener('click', (e) => {
          e.preventDefault();
          auth.signOut().then(() => {
            if (window.Notification) window.Notification.show('Logged out successfully', 'success');
            profileContainer.remove();
          }).catch((error) => console.error(error));
        });
      }
    } else {
      // User is logged out
      loginBtns.forEach(btn => {
        btn.style.display = 'inline-block';
        btn.textContent = 'Login';
      });
      if (profileContainer) {
        profileContainer.remove();
      }
    }
  }

  // Handle Login button redirects globally
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('button[aria-label="Login to dashboard"], #btn-login-header') || e.target.closest('button[aria-label="Login to dashboard"], #btn-login-header')) {
      if (window.location.pathname.includes('login.html')) return;
      const isRoot = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
      window.location.href = isRoot ? 'pages/login.html' : 'login.html';
    }
  });

  // ==== LOGIN PAGE LOGIC ====
  if (isLoginPage) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotForm = document.getElementById('forgot-form');
    
    // View Toggles
    document.getElementById('show-signup')?.addEventListener('click', (e) => {
      e.preventDefault();
      if(loginForm) loginForm.style.display = 'none';
      if(forgotForm) forgotForm.style.display = 'none';
      if(signupForm) signupForm.style.display = 'block';
    });
    
    document.getElementById('show-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      if(signupForm) signupForm.style.display = 'none';
      if(forgotForm) forgotForm.style.display = 'none';
      if(loginForm) loginForm.style.display = 'block';
    });

    document.getElementById('show-forgot')?.addEventListener('click', (e) => {
      e.preventDefault();
      if(loginForm) loginForm.style.display = 'none';
      if(signupForm) signupForm.style.display = 'none';
      if(forgotForm) forgotForm.style.display = 'block';
    });

    document.getElementById('back-to-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      if(forgotForm) forgotForm.style.display = 'none';
      if(loginForm) loginForm.style.display = 'block';
    });

    // Google Sign In
    document.getElementById('btn-google-signin')?.addEventListener('click', () => {
      auth.signInWithPopup(provider)
        .then((result) => {
          window.saveUserProfile(result.user, '', 'google');
          if (window.Notification) window.Notification.show('Logged in successfully', 'success');
        }).catch((error) => {
          if (window.Notification) window.Notification.show(error.message, 'error');
        });
    });

    // Login Form Submit
    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      
      auth.signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
          window.saveUserProfile(userCredential.user, '', 'email');
          if (window.Notification) window.Notification.show('Logged in successfully', 'success');
        })
        .catch((error) => {
          if (window.Notification) window.Notification.show(error.message, 'error');
        });
    });

    // Signup Form Submit
    signupForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-password').value;
      
      auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
          return userCredential.user.updateProfile({ displayName: name }).then(() => {
             window.saveUserProfile(userCredential.user, name, 'email');
             if (window.Notification) window.Notification.show('Account created successfully', 'success');
          });
        })
        .catch((error) => {
          if (window.Notification) window.Notification.show(error.message, 'error');
        });
    });

    // Forgot Password Submit
    forgotForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      auth.sendPasswordResetEmail(email)
        .then(() => {
          if (window.Notification) window.Notification.show('Password reset email sent!', 'success');
          document.getElementById('back-to-login').click();
        })
        .catch((error) => {
          if (window.Notification) window.Notification.show(error.message, 'error');
        });
    });
  }
});
