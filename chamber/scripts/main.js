// Update footer information
function updateFooterInfo() {
    // Current year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Your name
    document.getElementById('Emmanuel Ademuyiwa').textContent = '[Emmanuel Ademuyiwa]';

    // Last modified date
    document.getElementById('last-modified').textContent = document.lastModified;
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            primaryNav.classList.toggle('active');

            // Change button text/icon
            const isActive = primaryNav.classList.contains('active');
            menuToggle.textContent = isActive ? '✕' : '☰';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateFooterInfo();
    setupMobileMenu();
});