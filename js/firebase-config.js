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

// Connection monitoring (optional)
database.ref('.info/connected').on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('✅ Connected to Firebase Realtime Database');
  } else {
    console.log('❌ Disconnected from Firebase Realtime Database');
  }
});

// Demo data initializer (for testing only, run-once)
function initializeDemoData() {
  database.ref('queue').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      const demoQueue = {
        currentServing: 'A001',
        lastNumber: 3,
        numbers: {
          'A001': { status: 'serving', timestamp: Date.now() - 1800000 },
          'A002': { status: 'waiting', timestamp: Date.now() - 1200000 },
          'A003': { status: 'waiting', timestamp: Date.now() - 600000 }
        }
      };
      database.ref('queue').set(demoQueue);
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeDemoData, 1000);
});

window.addEventListener('unhandledrejection', event => {
  console.error('🔥 Firebase operation failed:', event.reason);
  event.preventDefault();
});
