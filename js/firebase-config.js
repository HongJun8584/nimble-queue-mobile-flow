
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

// Initialize queue structure for independent counter system
function initializeQueueStructure() {
  // Initialize ad banner setting
  database.ref('settings/adBanner').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/adBanner').set('');
    }
  });

  // Initialize service time setting
  database.ref('settings/averageServiceTime').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/averageServiceTime').set(300); // 5 minutes in seconds
    }
  });

  // Initialize counters structure if it doesn't exist
  database.ref('settings/counters').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      console.log('🔧 Initializing default counter structure');
      // Create a sample counter structure (will be populated by counter setup)
      database.ref('settings/counters').set({});
    }
  });

  // Initialize today's queue structure
  const today = new Date().toISOString().split('T')[0];
  database.ref(`queues/${today}`).once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref(`queues/${today}`).set({});
    }
  });

  console.log('🏗️ Queue structure initialized for independent counters');
}

// Function to get available counters
window.getAvailableCounters = function() {
  return new Promise((resolve) => {
    database.ref('settings/counters').once('value', (snapshot) => {
      resolve(snapshot.val() || {});
    });
  });
};

// Function to create/update counter
window.createCounter = function(counterId, prefix) {
  const counterData = {
    prefix: prefix,
    current: 0,
    lastSuffix: 0,
    createdAt: Date.now()
  };
  
  return database.ref(`settings/counters/${counterId}`).set(counterData);
};

// Function to get counter queue status
window.getCounterQueueStatus = function(counterId, date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return new Promise((resolve) => {
    database.ref(`queues/${targetDate}/${counterId}`).once('value', (snapshot) => {
      const queue = snapshot.val() || {};
      const waiting = Object.values(queue).filter(item => item.status === 'waiting').length;
      const serving = Object.values(queue).filter(item => item.status === 'serving').length;
      
      resolve({
        waiting: waiting,
        serving: serving,
        total: Object.keys(queue).length
      });
    });
  });
};

// Function to get user's queue position
window.getUserQueuePosition = function(counterId, queueId, date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  return new Promise((resolve) => {
    database.ref(`queues/${targetDate}/${counterId}`).orderByChild('timestamp').once('value', (snapshot) => {
      const queue = snapshot.val() || {};
      const queueArray = Object.entries(queue)
        .filter(([key, data]) => data.status === 'waiting')
        .sort(([a, aData], [b, bData]) => aData.timestamp - bData.timestamp);
      
      const position = queueArray.findIndex(([key, data]) => data.number === queueId);
      resolve(position >= 0 ? position + 1 : -1);
    });
  });
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
