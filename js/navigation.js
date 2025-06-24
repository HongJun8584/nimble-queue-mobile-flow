// Queue Joy - Navigation System
// Handles hamburger menu, PIN modal, and page routing

let currentPinTarget = null;

function initializeNavigation() {
    console.log('Initializing navigation system');
    
    setupHamburgerMenu();
    setupPinModal();
    updateMenuVisibility();
}

function setupHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    const adminLink = document.getElementById('adminLink');
    const counterLink = document.getElementById('counterLink');
    
    if (!menuToggle || !menuPanel) {
        console.log('Menu elements not found on this page');
        return;
    }
    
    // Toggle menu panel
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuPanel.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuPanel.contains(e.target) && !menuToggle.contains(e.target)) {
            menuPanel.classList.add('hidden');
        }
    });
    
    // Admin link with PIN
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPinTarget = './admin.html';
            showPinModal();
            menuPanel.classList.add('hidden');
        });
    }
    
    // Counter link with PIN
    if (counterLink) {
        counterLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPinTarget = './counter.html';
            showPinModal();
            menuPanel.classList.add('hidden');
        });
    }
    
    console.log('Hamburger menu initialized');
}

function updateMenuVisibility() {
    const queueId = localStorage.getItem('queueId');
    const statusLink = document.getElementById('statusLink');
    const gameLink = document.getElementById('gameLink');
    
    // Show/hide queue-specific links based on whether user has a queue number
    if (statusLink) {
        if (queueId) {
            statusLink.classList.remove('hidden');
        } else {
            statusLink.classList.add('hidden');
        }
    }
    
    if (gameLink) {
        if (queueId) {
            gameLink.classList.remove('hidden');
        } else {
            gameLink.classList.add('hidden');
        }
    }
}

function setupPinModal() {
    const pinModal = document.getElementById('pinModal');
    const pinInput = document.getElementById('pinInput');
    const pinSubmit = document.getElementById('pinSubmit');
    const pinCancel = document.getElementById('pinCancel');
    const pinError = document.getElementById('pinError');
    
    if (!pinModal) {
        console.log('PIN modal not found on this page');
        return;
    }
    
    pinSubmit.addEventListener('click', handlePinSubmit);
    pinCancel.addEventListener('click', hidePinModal);
    
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handlePinSubmit();
        }
    });
    
    // Clear error when typing
    pinInput.addEventListener('input', () => {
        pinError.classList.add('hidden');
    });
    
    console.log('PIN modal initialized');
}

function showPinModal() {
    const pinModal = document.getElementById('pinModal');
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    
    if (pinModal) {
        pinModal.classList.remove('hidden');
        pinInput.value = '';
        pinError.classList.add('hidden');
        pinInput.focus();
    }
}

function hidePinModal() {
    const pinModal = document.getElementById('pinModal');
    if (pinModal) {
        pinModal.classList.add('hidden');
    }
    currentPinTarget = null;
}

function handlePinSubmit() {
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    const pin = pinInput.value;
    
    if (pin === '0108') {
        // Correct PIN
        hidePinModal();
        if (currentPinTarget) {
            // Set session auth based on target
            if (currentPinTarget.includes('admin')) {
                sessionStorage.setItem('adminAuth', 'true');
            } else if (currentPinTarget.includes('counter')) {
                sessionStorage.setItem('counterAuth', 'true');
            }
            window.location.href = currentPinTarget;
        }
    } else {
        // Incorrect PIN
        pinError.classList.remove('hidden');
        pinInput.value = '';
        pinInput.focus();
    }
}

// Utility function to check authentication
function checkAuth(type) {
    return sessionStorage.getItem(`${type}Auth`) === 'true';
}

// Clear authentication on page unload (optional security measure)
window.addEventListener('beforeunload', () => {
    // Keep auth for the session, but you could clear it here if needed
    // sessionStorage.removeItem('adminAuth');
    // sessionStorage.removeItem('counterAuth');
});

console.log('Navigation system loaded');
