
// Firebase Configuration for Queue Joy
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "queue-joy-demo.firebaseapp.com",
  databaseURL: "https://queue-joy-demo-default-rtdb.firebaseio.com",
  projectId: "queue-joy-demo",
  storageBucket: "queue-joy-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

console.log('🔥 Firebase initialized for Queue Joy Enhanced System');

function initializeDemoData() {
  // Initialize enhanced queue state
  database.ref('queue').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      console.log('🎯 Initializing enhanced demo queue data...');
      
      const demoQueue = {
        currentServing: 'A001',
        lastNumber: 3,
        settings: {
          prefix: 'A',
          startNumber: 1,
          isPaused: false
        },
        numbers: {
          'A001': { status: 'serving', timestamp: Date.now() - 1800000, number: 1 },
          'A002': { status: 'waiting', timestamp: Date.now() - 1200000, number: 2 },
          'A003': { status: 'waiting', timestamp: Date.now() - 600000, number: 3 }
        }
      };
      
      database.ref('queue').set(demoQueue)
        .then(() => console.log('✅ Enhanced demo queue data initialized'))
        .catch(error => console.error('❌ Error initializing demo data:', error));
    } else {
      // Ensure settings exist for existing data
      database.ref('queue/settings').once('value', (settingsSnapshot) => {
        if (!settingsSnapshot.exists()) {
          console.log('🔧 Adding default settings to existing queue...');
          database.ref('queue/settings').set({
            prefix: 'A',
            startNumber: 1,
            isPaused: false
          });
        }
      });
    }
  });
}

// Connection monitoring with enhanced logging
database.ref('.info/connected').on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('✅ Connected to Firebase Realtime Database - Enhanced Queue System Active');
  } else {
    console.log('❌ Disconnected from Firebase Realtime Database - Using offline fallback');
  }
});

// Initialize demo data when script loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeDemoData, 1000);
});

// Enhanced error handling for Firebase operations
window.addEventListener('unhandledrejection', event => {
  console.error('🔥 Firebase operation failed:', event.reason);
  
  // Don't prevent default for queue operations - let them fallback gracefully
  if (event.reason && event.reason.code && event.reason.code.includes('firebase')) {
    console.log('🔄 Firebase error detected - system will use local fallback methods');
  }
});

// Helper function to ensure queue settings are loaded
window.getQueueSettings = function() {
  return new Promise((resolve) => {
    database.ref('queue/settings').once('value', (snapshot) => {
      const settings = snapshot.val() || { prefix: 'A', startNumber: 1, isPaused: false };
      resolve(settings);
    }).catch(() => {
      // Fallback to default settings
      resolve({ prefix: 'A', startNumber: 1, isPaused: false });
    });
  });
};

// Helper function for atomic number generation
window.generateNextQueueNumber = function() {
  return database.ref('queue/lastNumber').transaction((currentValue) => {
    const settings = JSON.parse(localStorage.getItem('queueSettings') || '{"startNumber": 1}');
    return (currentValue || settings.startNumber) + 1;
  });
};
