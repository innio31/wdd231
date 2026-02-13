// ===== scripts/main.js =====
// IMPACT DIGITAL ACADEMY - Main Entry Module
// WDD 231 Final Project
// Author: [Your Name]
// Version: 2.0
// 
// This module serves as the single entry point for all JavaScript functionality.
// It coordinates page-specific initializations and global components.
// ES Module pattern ensures clean namespace and dependency management.

import { initHamburgerMenu, setActiveNavLink } from './navigation.js';
import { initThemeToggle, trackVisit, loadPreference } from './localstorage.js';
import { initModal } from './modal.js';
import { loadCourseModules } from './courses.js';
import { loadAlumniPreviews, loadAllAlumni } from './community.js';

/**
 * App configuration object
 * Centralizes page routing and feature flags
 */
const APP_CONFIG = {
    pages: {
        'index.html': {
            name: 'Home',
            init: () => {
                loadAlumniPreviews();
                console.log('🏠 Home page initialized');
            }
        },
        'courses.html': {
            name: 'Courses',
            init: () => {
                loadCourseModules();
                console.log('📚 Courses page initialized');
            }
        },
        'community.html': {
            name: 'Community',
            init: () => {
                loadAllAlumni();
                console.log('🤝 Community page initialized');
            }
        },
        'form-action.html': {
            name: 'Form Action',
            init: () => {
                // No dynamic data loading needed on form action page
                console.log('📋 Form action page initialized');
            }
        },
        'attributions.html': {
            name: 'Attributions',
            init: () => {
                // Static page, no dynamic init needed
                console.log('📄 Attributions page initialized');
            }
        }
    },

    // Global features that run on every page
    globalFeatures: [
        { name: 'Navigation', fn: initHamburgerMenu },
        { name: 'Wayfinding', fn: setActiveNavLink },
        { name: 'Theme Toggle', fn: initThemeToggle },
        { name: 'Modal System', fn: initModal },
        { name: 'Visit Tracking', fn: trackVisit }
    ],

    // Development mode flags
    devMode: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    debug: false // Set to true for verbose console logging
};

/**
 * Main application initializer
 * Runs when DOM is fully parsed and ready
 */
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Log application start
        if (APP_CONFIG.debug || APP_CONFIG.devMode) {
            console.log('🚀 Impact Digital Academy starting up...');
            console.log(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}`);
            console.log(`🌐 Environment: ${APP_CONFIG.devMode ? 'Development' : 'Production'}`);
        }

        // Initialize global features (run on EVERY page)
        initializeGlobalFeatures();

        // Get current page filename
        const currentPage = getCurrentPage();

        // Initialize page-specific features
        await initializePageFeatures(currentPage);

        // Log successful initialization
        logInitializationSuccess(currentPage);

    } catch (error) {
        // Global error handling for initialization
        console.error('❌ Failed to initialize application:', error);

        // Display user-friendly error message
        displayGlobalErrorMessage(error);
    }
});

/**
 * Initialize all global features that run on every page
 * @returns {number} Count of successfully initialized features
 */
function initializeGlobalFeatures() {
    let successCount = 0;

    APP_CONFIG.globalFeatures.forEach(feature => {
        try {
            feature.fn();
            successCount++;

            if (APP_CONFIG.debug) {
                console.log(`✅ Global feature loaded: ${feature.name}`);
            }
        } catch (error) {
            console.error(`❌ Failed to initialize ${feature.name}:`, error);
        }
    });

    if (APP_CONFIG.debug) {
        console.log(`📊 Global features: ${successCount}/${APP_CONFIG.globalFeatures.length} initialized`);
    }

    return successCount;
}

/**
 * Initialize features specific to the current page
 * @param {string} pageName - Current page filename
 * @returns {Promise<boolean>} Success status
 */
async function initializePageFeatures(pageName) {
    // Default to index.html if no page is detected
    const pageKey = pageName || 'index.html';
    const pageConfig = APP_CONFIG.pages[pageKey];

    if (!pageConfig) {
        console.warn(`⚠️ No configuration found for page: ${pageKey}`);
        return false;
    }

    try {
        // Check if user has high contrast preference from localStorage
        // This ensures theme is applied before page renders anything
        await applySavedTheme();

        // Run page-specific initialization
        if (pageConfig.init) {
            await pageConfig.init();
        }

        if (APP_CONFIG.debug) {
            console.log(`✅ Page initialized: ${pageConfig.name} (${pageKey})`);
        }

        return true;

    } catch (error) {
        console.error(`❌ Failed to initialize page ${pageConfig.name}:`, error);
        return false;
    }
}

/**
 * Get current page filename from URL
 * @returns {string} Current page filename (e.g., 'index.html')
 */
function getCurrentPage() {
    const path = window.location.pathname;
    let page = path.split('/').pop();

    // Handle root path or empty
    if (!page || page === '' || page.endsWith('/')) {
        page = 'index.html';
    }

    return page;
}

/**
 * Apply saved theme preference from localStorage
 * This runs early to prevent flash of wrong theme
 * @returns {Promise<void>}
 */
async function applySavedTheme() {
    try {
        const savedTheme = localStorage.getItem('idaTheme');
        const themeToggle = document.getElementById('theme-toggle');

        if (savedTheme === 'high-contrast') {
            document.body.classList.add('high-contrast');
            if (themeToggle) themeToggle.checked = true;

            if (APP_CONFIG.debug) {
                console.log('🎨 Applied saved theme: high-contrast');
            }
        } else {
            document.body.classList.remove('high-contrast');
            if (themeToggle) themeToggle.checked = false;
        }
    } catch (error) {
        console.error('Failed to apply saved theme:', error);
    }
}

/**
 * Display user-friendly error message when app fails to initialize
 * @param {Error} error - The error that occurred
 */
function displayGlobalErrorMessage(error) {
    // Don't show on attributions page - it's intentionally simple
    const currentPage = getCurrentPage();
    if (currentPage === 'attributions.html') return;

    // Create error banner
    const main = document.querySelector('main');
    if (!main) return;

    const errorBanner = document.createElement('div');
    errorBanner.className = 'global-error-banner';
    errorBanner.setAttribute('role', 'alert');
    errorBanner.setAttribute('aria-live', 'assertive');
    errorBanner.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        border: 2px solid #dc3545;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem 0;
        font-family: 'Open Sans', sans-serif;
    `;

    errorBanner.innerHTML = `
        <h3 style="margin-top: 0; color: #721c24; font-family: 'Montserrat', sans-serif;">
            ⚠️ Site functionality limited
        </h3>
        <p>Some interactive features are temporarily unavailable. Please try:</p>
        <ul style="margin-bottom: 1rem;">
            <li>Refreshing the page</li>
            <li>Clearing your browser cache</li>
            <li>Checking your internet connection</li>
        </ul>
        <button onclick="window.location.reload()" style="
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        ">Refresh page</button>
    `;

    // Insert at top of main content
    main.prepend(errorBanner);

    // Log to console for developers
    console.error('🚨 Global error banner displayed:', error.message);
}

/**
 * Log successful application initialization
 * @param {string} currentPage - Current page name
 */
function logInitializationSuccess(currentPage) {
    if (!APP_CONFIG.debug && !APP_CONFIG.devMode) return;

    console.log(`
╔══════════════════════════════════════════════════════════╗
║     Impact Digital Academy - Successfully Initialized    ║
╠══════════════════════════════════════════════════════════╣
║  📄 Page: ${currentPage.padEnd(39)} ║
║  🕒 Time: ${new Date().toLocaleTimeString().padEnd(39)} ║
║  📊 Version: 2.0                                         ║
╚══════════════════════════════════════════════════════════╝
    `);
}

/**
 * Register service worker for offline capability (bonus feature)
 * Not required for project but adds professionalism
 */
export async function registerServiceWorker() {
    if ('serviceWorker' in navigator && APP_CONFIG.devMode === false) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('📦 Service Worker registered:', registration.scope);
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    }
}

/**
 * Get application metadata
 * @returns {Object} App information
 */
export function getAppInfo() {
    return {
        name: 'Impact Digital Academy',
        version: '2.0',
        author: '[Your Name]',
        course: 'WDD 231',
        semester: 'Winter 2025',
        pages: Object.keys(APP_CONFIG.pages).length,
        modules: APP_CONFIG.globalFeatures.length
    };
}

/**
 * Safely check if a required DOM element exists
 * @param {string} selector - CSS selector
 * @param {string} context - Description for error message
 * @returns {HTMLElement} The found element
 * @throws {Error} If element not found
 */
export function requireElement(selector, context = '') {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Required element not found: ${selector} ${context ? `(${context})` : ''}`);
    }
    return element;
}

// Expose debug utilities in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.__IDA_DEBUG__ = {
        config: APP_CONFIG,
        getCurrentPage,
        reload: () => window.location.reload(),
        clearStorage: () => {
            localStorage.clear();
            console.log('🧹 localStorage cleared');
            window.location.reload();
        }
    };
    console.log('🔧 Debug utilities available: window.__IDA_DEBUG__');
}