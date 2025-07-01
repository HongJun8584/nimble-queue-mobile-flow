
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

console.log('🔥 Firebase initialized for Queue Joy');

// Connection monitoring
database.ref('.info/connected').on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('✅ Connected to Firebase Realtime Database');
  } else {
    console.log('❌ Disconnected from Firebase Realtime Database');
  }
});

// Initialize queue structure for 6-counter system
function initializeQueueStructure() {
  const allCounters = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Initialize active counters list (default: A, B, C)
  database.ref('settings/activeCounters').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/activeCounters').set(['A', 'B', 'C']);
    }
  });
  
  // Initialize last assigned prefix for round-robin
  database.ref('settings/lastAssignedPrefix').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/lastAssignedPrefix').set('C'); // Start with C so first assignment is A
    }
  });
  
  // Initialize all possible counter settings
  allCounters.forEach(counter => {
    database.ref(`queue/lastNumber_${counter}`).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        database.ref(`queue/lastNumber_${counter}`).set(0);
      }
    });
    
    database.ref(`queue/currentServing_${counter}`).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        database.ref(`queue/currentServing_${counter}`).set(null);
      }
    });
  });
  
  // Initialize service time setting
  database.ref('settings/averageServiceTime').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/averageServiceTime').set(300); // 5 minutes in seconds
    }
  });

  // Initialize ad banner setting
  database.ref('settings/adBanner').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/adBanner').set('');
    }
  });
}

// Function to get active counters
window.getActiveCounters = function() {
  return new Promise((resolve) => {
    database.ref('settings/activeCounters').once('value', (snapshot) => {
      resolve(snapshot.val() || ['A', 'B', 'C']);
    });
  });
};

// Function to update active counters
window.updateActiveCounters = function(counters) {
  return database.ref('settings/activeCounters').set(counters);
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeQueueStructure, 1000);
});

// Global error handler for Firebase operations
window.addEventListener('unhandledrejection', event => {
  console.error('🔥 Firebase operation failed:', event.reason);
  event.preventDefault();
});
