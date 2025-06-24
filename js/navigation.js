
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
    
    // Toggle menu panel with animation
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menuPanel.classList.contains('hidden');
        
        if (isHidden) {
            menuPanel.classList.remove('hidden');
            // Trigger animation
            setTimeout(() => {
                menuPanel.style.transform = 'scale(1)';
                menuPanel.style.opacity = '1';
            }, 10);
        } else {
            menuPanel.style.transform = 'scale(0.95)';
            menuPanel.style.opacity = '0';
            setTimeout(() => {
                menuPanel.classList.add('hidden');
            }, 200);
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuPanel.contains(e.target) && !menuToggle.contains(e.target)) {
            menuPanel.style.transform = 'scale(0.95)';
            menuPanel.style.opacity = '0';
            setTimeout(() => {
                menuPanel.classList.add('hidden');
            }, 200);
        }
    });
    
    // Add click handlers for admin and counter links
    const adminLink = document.querySelector('a[href="./admin.html"]');
    const counterLink = document.querySelector('a[href="./counter.html"]');
    
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPinModal('admin');
        });
    }
    
    if (counterLink) {
        counterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPinModal('counter');
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

function showPinModal(type) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    modalOverlay.style.animation = 'fadeIn 0.3s ease-out';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl';
    modalContent.style.animation = 'slideUp 0.4s ease-out';
    
    modalContent.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-2xl mb-6">
                🔐
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Access ${type === 'admin' ? 'Admin' : 'Counter'}</h2>
            <p class="text-gray-600 mb-6">Enter PIN to continue</p>
            
            <input type="password" id="pinInput" 
                   class="w-full text-center text-2xl font-bold border-2 border-gray-300 rounded-xl p-4 mb-4 focus:border-purple-500 focus:outline-none"
                   placeholder="••••" maxlength="4">
            
            <div id="pinError" class="hidden text-red-500 text-sm mb-4">❌ Incorrect PIN. Please try again.</div>
            
            <div class="flex gap-3">
                <button id="cancelBtn" 
                        class="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
                    Cancel
                </button>
                <button id="submitBtn" 
                        class="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:scale-105 transition-all duration-200 font-bold">
                    Enter
                </button>
            </div>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Focus on input
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    pinInput.focus();
    
    // Handle submission
    function handleSubmit() {
        const pin = pinInput.value;
        if (pin === '0108') {
            // Correct PIN
            modalOverlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                window.location.href = `./${type}.html`;
            }, 300);
        } else {
            // Incorrect PIN
            pinError.classList.remove('hidden');
            pinInput.value = '';
            pinInput.style.animation = 'shake 0.5s ease-out';
            setTimeout(() => {
                pinInput.style.animation = '';
            }, 500);
        }
    }
    
    // Handle cancel
    function handleCancel() {
        modalOverlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    }
    
    // Event listeners
    submitBtn.addEventListener('click', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    });
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            handleCancel();
        }
    });
}

// Add CSS animations
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
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

console.log('Navigation system loaded');
