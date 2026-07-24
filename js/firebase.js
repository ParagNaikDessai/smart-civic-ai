// js/firebase.js
// Firebase configuration and initialization

const firebaseConfig = {
  apiKey: "AIzaSyBAbfMdIk77HhV0hps6zrLmPYYHADOnIjU",
  authDomain: "smart-civic-ai-24f9f.firebaseapp.com",
  projectId: "smart-civic-ai-24f9f",
  storageBucket: "smart-civic-ai-24f9f.firebasestorage.app",
  messagingSenderId: "782470596827",
  appId: "1:782470596827:web:cd125403cd2e2f82ae64fe",
  measurementId: "G-1ZWZ445CE1"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Export instances (attached to window since we aren't using modules here)
window.db = firebase.firestore();
window.auth = firebase.auth();
window.storage = firebase.storage();
window.googleProvider = new firebase.auth.GoogleAuthProvider();
