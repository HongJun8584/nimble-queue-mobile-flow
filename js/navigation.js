
// Queue Joy - Navigation System
// Handles hamburger menu and page routing

function initializeNavigation() {
    console.log('Initializing navigation system');
    
    setupHamburgerMenu();
    updateMenuVisibility();
}

function setupHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    
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

console.log('Navigation system loaded');
