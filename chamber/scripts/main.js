/* ===== MAIN.JS - Shared Functionality ===== */

// Update footer information
function updateFooterInfo() {
    // Current year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Your name
    const nameSpan = document.getElementById('your-name');
    if (nameSpan) {
        nameSpan.textContent = 'Emmanuel Ademuyiwa';
    }

    // Last modified date
    const modifiedSpan = document.getElementById('last-modified');
    if (modifiedSpan) {
        modifiedSpan.textContent = document.lastModified;
    }
}

// Mobile menu toggle with accessibility
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = primaryNav.classList.toggle('active');
            menuToggle.textContent = isActive ? '✕' : '☰';
            menuToggle.setAttribute('aria-expanded', isActive);
            menuToggle.setAttribute('aria-label', isActive ? 'Close navigation' : 'Open navigation');
        });

        // Close menu when a link is clicked (mobile)
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    primaryNav.classList.remove('active');
                    menuToggle.textContent = '☰';
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-label', 'Open navigation');
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateFooterInfo();
    setupMobileMenu();
});