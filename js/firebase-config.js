
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
    
    database.ref(`settings/counter_${counter}`).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        database.ref(`settings/counter_${counter}`).set({
          prefix: counter,
          sequenceType: 'sequential',
          active: ['A', 'B', 'C'].includes(counter)
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

// Enhanced round-robin number generation for 6 counters
window.generateRoundRobinNumber = function() {
  return new Promise((resolve, reject) => {
    // First get active counters
    database.ref('settings/activeCounters').once('value', (activeSnapshot) => {
      const activeCounters = activeSnapshot.val() || ['A', 'B', 'C'];
      
      if (activeCounters.length === 0) {
        reject(new Error('No active counters available'));
        return;
      }
      
      // Use transaction to safely increment global counter
      database.ref('queue/globalCounter').transaction((currentGlobal) => {
        return (currentGlobal || 0) + 1;
      }).then((result) => {
        if (result.committed) {
          const globalNum = result.snapshot.val();
          const counterIndex = (globalNum - 1) % activeCounters.length;
          const selectedCounter = activeCounters[counterIndex];
          
          // Get counter settings to determine sequence type
          return database.ref(`settings/counter_${selectedCounter}`).once('value', (settingsSnapshot) => {
            const settings = settingsSnapshot.val() || { sequenceType: 'sequential' };
            
            // Calculate next number for this counter based on sequence type
            return database.ref(`queue/lastNumber_${selectedCounter}`).transaction((currentCounterNum) => {
              const lastNum = currentCounterNum || 0;
              let nextNum;
              
              switch (settings.sequenceType) {
                case 'odd':
                  nextNum = lastNum + (lastNum % 2 === 0 ? 1 : 2);
                  break;
                case 'even':
                  nextNum = lastNum + (lastNum % 2 === 0 ? 2 : 1);
                  break;
                default: // sequential
                  nextNum = lastNum + 1;
                  break;
              }
              
              return nextNum;
            }).then((counterResult) => {
              if (counterResult.committed) {
                const counterNumber = counterResult.snapshot.val();
                const queueId = `${selectedCounter}${counterNumber.toString().padStart(3, '0')}`;
                
                // Save ticket in Firebase
                return database.ref(`queue/numbers/${queueId}`).set({
                  status: 'waiting',
                  timestamp: Date.now(),
                  counter: selectedCounter,
                  number: counterNumber
                }).then(() => {
                  resolve({
                    queueId: queueId,
                    counter: selectedCounter,
                    number: counterNumber
                  });
                });
              } else {
                reject(new Error('Counter transaction failed'));
              }
            });
          });
        } else {
          reject(new Error('Global counter transaction failed'));
        }
      }).catch(reject);
    });
  });
};

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

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeQueueStructure, 1000);
});

window.addEventListener('unhandledrejection', event => {
  console.error('🔥 Firebase operation failed:', event.reason);
  event.preventDefault();
});
