// ===== scripts/localstorage.js =====
// IMPACT DIGITAL ACADEMY - Local Storage Module
// Persists user preferences (theme) client-side
// Demonstrates: localStorage API, DOM manipulation, event handling

// Storage keys
const STORAGE_KEYS = {
    THEME: 'idaTheme',
    VISITED: 'idaVisited',
    LAST_PAGE: 'idaLastPage'
};

// Theme options
const THEMES = {
    LIGHT: 'light',
    HIGH_CONTRAST: 'high-contrast'
};

/**
 * Initialize theme toggle with localStorage persistence
 * Saves user preference and applies on page load
 */
export function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    applyTheme(savedTheme);

    // Set toggle state based on saved theme
    if (savedTheme === THEMES.HIGH_CONTRAST) {
        themeToggle.checked = true;
    }

    // Event listener: Save preference when toggled
    themeToggle.addEventListener('change', function (e) {
        const isChecked = e.target.checked;
        const theme = isChecked ? THEMES.HIGH_CONTRAST : THEMES.LIGHT;

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.THEME, theme);

        // Apply theme
        applyTheme(theme);

        // Dispatch custom event for analytics (bonus)
        dispatchThemeEvent(theme);
    });
}

/**
 * Apply theme class to body
 * @param {string} theme - Theme name (light/high-contrast)
 */
function applyTheme(theme) {
    if (!theme) return;

    const body = document.body;

    if (theme === THEMES.HIGH_CONTRAST) {
        body.classList.add(THEMES.HIGH_CONTRAST);
    } else {
        body.classList.remove(THEMES.HIGH_CONTRAST);
    }
}

/**
 * Track first visit and page views
 * Demonstrates: localStorage for analytics
 */
export function trackVisit() {
    const visited = localStorage.getItem(STORAGE_KEYS.VISITED);
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!visited) {
        // First visit to site
        localStorage.setItem(STORAGE_KEYS.VISITED, 'true');
        localStorage.setItem('idaFirstVisit', new Date().toISOString());

        // Show welcome message (bonus)
        showWelcomeMessage();
    }

    // Store last visited page
    localStorage.setItem(STORAGE_KEYS.LAST_PAGE, currentPage);
}

/**
 * Show welcome message for first-time visitors
 */
function showWelcomeMessage() {
    const main = document.querySelector('main');
    if (!main) return;

    const welcomeBanner = document.createElement('div');
    welcomeBanner.classList.add('welcome-banner');
    welcomeBanner.setAttribute('aria-live', 'polite');
    welcomeBanner.innerHTML = `
        <p>👋 Welcome to Impact Digital Academy! We're glad you're here.</p>
        <button class="close-banner" aria-label="Dismiss">×</button>
    `;

    main.prepend(welcomeBanner);

    // Dismiss button
    const closeBtn = welcomeBanner.querySelector('.close-banner');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            welcomeBanner.remove();
        });
    }

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        if (welcomeBanner.parentNode) {
            welcomeBanner.remove();
        }
    }, 8000);
}

/**
 * Save user preference to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export function savePreference(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(`ida_${key}`, serialized);
        return true;
    } catch (error) {
        console.error('Failed to save preference:', error);
        return false;
    }
}

/**
 * Load user preference from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Parsed value or default
 */
export function loadPreference(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(`ida_${key}`);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to load preference:', error);
        return defaultValue;
    }
}

/**
 * Dispatch custom event for theme changes
 * @param {string} theme - New theme
 */
function dispatchThemeEvent(theme) {
    const event = new CustomEvent('themechange', {
        detail: { theme: theme, timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(event);
}

// Initialize visit tracking on module load
trackVisit();