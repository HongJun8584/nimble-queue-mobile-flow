
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

// Initialize queue structure for multi-counter system
function initializeQueueStructure() {
  const counters = ['A', 'B', 'C'];
  
  // Initialize counter settings
  counters.forEach(counter => {
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
    
    database.ref(`settings/counter_${counter}`).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        database.ref(`settings/counter_${counter}`).set({
          prefix: counter,
          sequenceType: 'sequential'
        });
      }
    });
  });
  
  // Initialize global counter for round-robin
  database.ref('queue/globalCounter').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('queue/globalCounter').set(0);
    }
  });
  
  // Initialize service time setting
  database.ref('settings/averageServiceTime').once('value', (snapshot) => {
    if (!snapshot.exists()) {
      database.ref('settings/averageServiceTime').set(300); // 5 minutes in seconds
    }
  });
}

// Round-robin number generation logic
window.generateRoundRobinNumber = function() {
  return new Promise((resolve, reject) => {
    const counters = ['A', 'B', 'C'];
    
    database.ref('queue/globalCounter').transaction((currentGlobal) => {
      const globalNum = (currentGlobal || 0) + 1;
      const counterIndex = (globalNum - 1) % 3;
      const selectedCounter = counters[counterIndex];
      
      return globalNum;
    }).then((result) => {
      if (result.committed) {
        const globalNum = result.snapshot.val();
        const counterIndex = (globalNum - 1) % 3;
        const selectedCounter = counters[counterIndex];
        const counterNumber = Math.ceil(globalNum / 3);
        
        // Update the specific counter's last number
        return database.ref(`queue/lastNumber_${selectedCounter}`).transaction((currentCounterNum) => {
          return counterNumber;
        }).then(() => {
          const queueId = `${selectedCounter}${counterNumber.toString().padStart(3, '0')}`;
          
          // Save ticket in Firebase
          return database.ref(`queue/numbers/${queueId}`).set({
            status: 'waiting',
            timestamp: Date.now(),
            counter: selectedCounter
          }).then(() => {
            resolve({
              queueId: queueId,
              counter: selectedCounter,
              number: counterNumber
            });
          });
        });
      } else {
        reject(new Error('Transaction failed'));
      }
    }).catch(reject);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeQueueStructure, 1000);
});

window.addEventListener('unhandledrejection', event => {
  console.error('🔥 Firebase operation failed:', event.reason);
  event.preventDefault();
});
