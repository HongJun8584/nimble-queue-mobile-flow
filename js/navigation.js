
// Queue Joy - Navigation System
// Handles hamburger menu and page routing

function initializeNavigation() {
    console.log('🧭 Initializing navigation system');
    
    setupHamburgerMenu();
    updateMenuVisibility();
}

function setupHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    
    if (!menuToggle || !menuPanel) {
        console.log('⚠️ Menu elements not found on this page');
        return;
    }
    
    // Toggle menu panel with smooth animation
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuPanel.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Direct navigation for admin and counter (no PIN required)
    const adminLink = document.querySelector('a[href="./admin.html"]');
    const counterLink = document.querySelector('a[href="./counter.html"]');
    
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            console.log('⚙️ Navigating to admin');
            // Direct navigation - no PIN required
        });
    }
    
    if (counterLink) {
        counterLink.addEventListener('click', (e) => {
            console.log('🎯 Navigating to counter');
            // Direct navigation - no PIN required
        });
    }
    
    console.log('✅ Hamburger menu initialized');
}

function toggleMenu() {
    const menuPanel = document.getElementById('menuPanel');
    const isHidden = menuPanel.classList.contains('hidden');
    
    if (isHidden) {
        openMenu();
    } else {
        closeMenu();
    }
}

function openMenu() {
    const menuPanel = document.getElementById('menuPanel');
    menuPanel.classList.remove('hidden');
    
    // Smooth animation
    setTimeout(() => {
        menuPanel.style.transform = 'scale(1)';
        menuPanel.style.opacity = '1';
    }, 10);
}

function closeMenu() {
    const menuPanel = document.getElementById('menuPanel');
    
    menuPanel.style.transform = 'scale(0.95)';
    menuPanel.style.opacity = '0';
    
    setTimeout(() => {
        menuPanel.classList.add('hidden');
    }, 200);
}

function updateMenuVisibility() {
    const queueId = localStorage.getItem('queueId');
    const statusLink = document.getElementById('statusLink');
    
    console.log('🔍 Updating menu visibility, queueId:', queueId);
    
    // Show/hide status link based on whether user has a queue number
    if (statusLink) {
        if (queueId) {
            statusLink.classList.remove('hidden');
            console.log('✅ Status link visible');
        } else {
            statusLink.classList.add('hidden');
            console.log('❌ Status link hidden');
        }
    }
}

// Add smooth CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    #menuPanel {
        transform: scale(0.95);
        opacity: 0;
        transition: all 0.2s ease-out;
    }
    
    #menuToggle:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

console.log('✅ Navigation system loaded');
