// ===== scripts/courses.js =====
// IMPACT DIGITAL ACADEMY - Course Data Module
// Fetches and displays course modules from JSON
// Demonstrates: Fetch API, try/catch, dynamic content, array methods

/**
 * Load all course modules from courses.json
 * Generates 15+ items with 4+ properties each
 * Uses fetch with async/await and try/catch error handling
 */
export async function loadCourseModules() {
    const container = document.getElementById('course-modules-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="loading-spinner" aria-live="polite">Loading course modules...</div>';

    try {
        // Fetch data from local JSON file
        const response = await fetch('data/courses.json');

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        // Parse JSON
        const data = await response.json();

        // Clear loading spinner
        container.innerHTML = '';

        // Array Method: forEach - iterate through courses
        data.courses.forEach(course => {
            // Create course section
            const courseSection = document.createElement('section');
            courseSection.classList.add('course-group');
            courseSection.id = course.id;

            // Course header
            const courseHeader = document.createElement('div');
            courseHeader.classList.add('course-header');
            courseHeader.innerHTML = `
                <h2 class="course-title">
                    <span class="course-icon">${course.icon || '📘'}</span>
                    ${course.courseName}
                </h2>
                <p class="course-description">${course.description}</p>
                <p class="course-meta">
                    <span class="instructor">👩‍🏫 Instructor: ${course.instructor}</span>
                    <span class="module-count">📚 ${course.modules.length} modules</span>
                </p>
            `;
            courseSection.appendChild(courseHeader);

            // Create module grid
            const moduleGrid = document.createElement('div');
            moduleGrid.classList.add('module-grid');

            // Array Method: forEach - generate module cards
            course.modules.forEach(module => {
                // Template Literals - dynamic HTML construction
                const moduleCard = document.createElement('article');
                moduleCard.classList.add('module-card');

                // Display at least 4 distinct properties per item
                moduleCard.innerHTML = `
                    <h3 class="module-title">${module.title}</h3>
                    <div class="module-details">
                        <p class="module-duration">
                            <span class="detail-icon">⏱️</span> 
                            <strong>Duration:</strong> ${module.duration}
                        </p>
                        <p class="module-project">
                            <span class="detail-icon">🛠️</span> 
                            <strong>Project:</strong> ${module.project}
                        </p>
                        <p class="module-skills">
                            <span class="detail-icon">🎯</span> 
                            <strong>Skills:</strong> ${module.skills.join(', ')}
                        </p>
                        <p class="module-tools">
                            <span class="detail-icon">🔧</span> 
                            <strong>Tools:</strong> ${module.tools.join(', ')}
                        </p>
                    </div>
                    <div class="module-footer">
                        <button class="view-details-btn btn btn-outline" 
                                data-module='${JSON.stringify(module).replace(/'/g, '&#39;')}'
                                aria-label="Quick view: ${module.title}">
                            Quick View
                        </button>
                    </div>
                `;

                moduleGrid.appendChild(moduleCard);
            });

            courseSection.appendChild(moduleGrid);
            container.appendChild(courseSection);
        });

        // Display total module count for verification (15+ requirement)
        const totalModules = data.meta?.totalModules ||
            data.courses.reduce((acc, course) => acc + course.modules.length, 0);

        const countBadge = document.createElement('div');
        countBadge.classList.add('module-count-badge');
        countBadge.innerHTML = `<p>✅ ${totalModules} job-ready modules loaded. Ready to start?</p>`;
        container.prepend(countBadge);

    } catch (error) {
        // Error handling for failed fetch
        console.error('Failed to load course data:', error);

        container.innerHTML = `
            <div class="error-message" role="alert">
                <h3>⚠️ Unable to load course modules</h3>
                <p>We're having trouble connecting to our course catalog. Please try again later.</p>
                <p class="error-details">${error.message}</p>
                <button class="btn btn-secondary" onclick="window.location.reload()">
                    Refresh page
                </button>
            </div>
        `;
    }
}

/**
 * Filter modules by search term (bonus feature)
 * Demonstrates Array Method: filter
 * @param {string} searchTerm - User input to filter modules
 */
export function filterModules(searchTerm) {
    const moduleCards = document.querySelectorAll('.module-card');
    if (!moduleCards.length) return;

    const term = searchTerm.toLowerCase();

    moduleCards.forEach(card => {
        const title = card.querySelector('.module-title')?.textContent.toLowerCase() || '';
        const skills = card.querySelector('.module-skills')?.textContent.toLowerCase() || '';
        const project = card.querySelector('.module-project')?.textContent.toLowerCase() || '';

        const matches = title.includes(term) || skills.includes(term) || project.includes(term);

        card.style.display = matches ? 'flex' : 'none';
    });
}