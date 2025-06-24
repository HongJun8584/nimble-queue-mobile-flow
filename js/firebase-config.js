
// Firebase Configuration for Queue Joy
// Replace with your Firebase project credentials

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

// Initialize Realtime Database
const database = firebase.database();

console.log('Firebase initialized for Queue Joy');

// Demo data initialization
function initializeDemoData() {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if demo data already exists
  database.ref(`queues/${today}`).once('value', (snapshot) => {
    if (!snapshot.exists()) {
      console.log('Initializing demo queue data...');
      
      // Set initial queue state
      const demoQueue = {
        currentNumberSuffix: 103,
        lastSuffix: 108,
        numbers: {
          'A101': { status: 'served', timestamp: Date.now() - 3600000 },
          'A102': { status: 'served', timestamp: Date.now() - 3000000 },
          'A103': { status: 'serving', timestamp: Date.now() - 1800000 },
          'A104': { status: 'waiting', timestamp: Date.now() - 1200000 },
          'A105': { status: 'waiting', timestamp: Date.now() - 900000 },
          'A106': { status: 'waiting', timestamp: Date.now() - 600000 },
          'A107': { status: 'waiting', timestamp: Date.now() - 300000 },
          'A108': { status: 'waiting', timestamp: Date.now() }
        }
      };
      
      database.ref(`queues/${today}`).set(demoQueue);
    }
  });
  
  // Initialize default settings
  database.ref('settings').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      console.log('Initializing default settings...');
      
      const defaultSettings = {
        queueFormat: {
          prefix: 'A',
          start: 100
        },
        counterCount: 3,
        adImage: '' // Empty initially
      };
      
      database.ref('settings').set(defaultSettings);
    }
  });
  
  // Initialize demo analytics
  database.ref(`analytics/${today}`).once('value', (snapshot) => {
    if (!snapshot.exists()) {
      console.log('Initializing demo analytics...');
      
      const demoAnalytics = {
        'A101': { calledTime: Date.now() - 3600000, waitTimeMinutes: 5 },
        'A102': { calledTime: Date.now() - 3000000, waitTimeMinutes: 8 },
        'A103': { calledTime: Date.now() - 1800000, waitTimeMinutes: 3 }
      };
      
      database.ref(`analytics/${today}`).set(demoAnalytics);
    }
  });
}

// Initialize demo data when script loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeDemoData, 1000); // Small delay to ensure Firebase is ready
});

// Error handling
database.ref('.info/connected').on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('✅ Connected to Firebase Realtime Database');
  } else {
    console.log('❌ Disconnected from Firebase Realtime Database');
  }
});
