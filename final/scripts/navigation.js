// ===== scripts/navigation.js =====
// IMPACT DIGITAL ACADEMY - Navigation Module
// Responsive hamburger menu and wayfinding

/**
 * Initialize responsive hamburger menu
 * Mobile: hamburger toggles nav
 * Desktop: always visible
 */
export function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function (e) {
        e.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function (e) {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Reset on window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Set active navigation link based on current page
 * Wayfinding: highlights current page in nav
 */
export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Generate breadcrumb navigation (bonus feature)
 * @param {string[]} path - Array of page names
 * @returns {string} HTML string for breadcrumbs
 */
export function generateBreadcrumbs(path) {
    if (!path || path.length === 0) return '';

    let html = '<nav aria-label="Breadcrumb" class="breadcrumbs">';
    html += '<ol class="breadcrumb-list">';

    path.forEach((item, index) => {
        if (index === path.length - 1) {
            html += `< li aria - current="page" > ${item}</li > `;
        } else {
            html += `< li > <a href="#">${item}</a></li > `;
        }
    });

    html += '</ol></nav>';
    return html;
}