// ===== scripts/community.js =====
// IMPACT DIGITAL ACADEMY - Community & Alumni Module
// Fetches and displays alumni success stories
// Demonstrates: Fetch API, array methods, dynamic content

/**
 * Load alumni previews for homepage (3 stories)
 */
export async function loadAlumniPreviews() {
    const container = document.getElementById('alumni-preview-container');
    if (!container) return;

    try {
        // Reuse courses.json and extract alumni-like data from modules
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to fetch alumni data');

        const data = await response.json();

        // Generate alumni stories from course modules
        const alumni = generateAlumniStories(data);

        // Take first 3 for preview
        const preview = alumni.slice(0, 3);

        container.innerHTML = '';

        // Array Method: forEach - display preview stories
        preview.forEach(story => {
            const storyCard = createAlumniCard(story);
            container.appendChild(storyCard);
        });

    } catch (error) {
        console.error('Error loading alumni previews:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load success stories. Please refresh the page.</p>
            </div>
        `;
    }
}

/**
 * Load all alumni stories for community page
 */
export async function loadAllAlumni() {
    const container = document.getElementById('alumni-full-container');
    if (!container) return;

    container.innerHTML = '<div class="loading-spinner" aria-live="polite">Loading alumni stories...</div>';

    try {
        const response = await fetch('data/courses.json');
        if (!response.ok) throw new Error('Failed to fetch alumni data');

        const data = await response.json();

        // Generate alumni stories from course modules
        const alumni = generateAlumniStories(data);

        container.innerHTML = '';

        // Array Method: forEach with conditional styling
        alumni.forEach((story, index) => {
            const storyCard = createAlumniCard(story);

            // Add featured class to first story
            if (index === 0) {
                storyCard.classList.add('featured-story');
            }

            container.appendChild(storyCard);
        });

        // Add "load more" functionality if we have more than 6 stories
        if (alumni.length > 6) {
            addLoadMoreButton(container, alumni.slice(6));
        }

    } catch (error) {
        console.error('Error loading alumni stories:', error);
        container.innerHTML = `
            <div class="error-message">
                <h3>📢 Alumni stories coming soon</h3>
                <p>We're gathering inspiring success stories from our graduates. Check back later!</p>
            </div>
        `;
    }
}

/**
 * Generate realistic alumni stories from course data
 * @param {Object} data - Course data from JSON
 * @returns {Array} Array of alumni story objects
 */
function generateAlumniStories(data) {
    const alumni = [];
    const names = [
        'Maria Garcia', 'James Wilson', 'Aisha Patel', 'David Kim',
        'Sarah Johnson', 'Carlos Mendez', 'Olivia Chen', 'Marcus Williams',
        'Zara Ahmed', 'Thomas Lee', 'Elena Rodriguez', 'Kevin O\'Brien',
        'Nia Thompson', 'Raj Sharma', 'Lily Zhang', 'Andre Foster'
    ];

    const companies = [
        'Google', 'Microsoft', 'Amazon', 'Target', 'Walgreens',
        'State Farm', 'Meta', 'Adobe', 'Salesforce', 'Accenture',
        'CVS Health', 'JPMorgan Chase', 'Verizon', 'AT&T', 'IBM'
    ];

    const roles = [
        'Junior UX Designer', 'Data Analyst', 'Digital Marketing Specialist',
        'Associate Product Designer', 'Marketing Coordinator', 'SQL Developer',
        'UI Designer', 'Social Media Manager', 'Business Intelligence Analyst',
        'Frontend Developer', 'Email Marketing Specialist', 'UX Researcher'
    ];

    let storyIndex = 0;

    // Array Method: forEach - generate stories from course modules
    data.courses.forEach(course => {
        course.modules.forEach((module, idx) => {
            // Only create stories from some modules to keep it realistic
            if (idx % 2 === 0 && alumni.length < 15) {
                const name = names[alumni.length % names.length];
                const company = companies[alumni.length % companies.length];
                const role = roles[alumni.length % roles.length];
                const monthsAgo = Math.floor(Math.random() * 12) + 3;

                const story = {
                    id: `alumni-${storyIndex++}`,
                    name: name,
                    course: course.courseName,
                    module: module.title,
                    role: role,
                    company: company,
                    hiredDate: `${monthsAgo} months ago`,
                    quote: `The ${module.title} module gave me the hands-on experience I needed to land my role at ${company}. My instructor mentored me through the ${module.project.split('.')[0]} project, which became the centerpiece of my portfolio.`,
                    image: `images/alumni-placeholder-${(alumni.length % 5) + 1}.jpg`,
                    skills: module.skills.slice(0, 3).join(', ')
                };

                alumni.push(story);
            }
        });
    });

    // Ensure we have at least 6 stories
    while (alumni.length < 6) {
        alumni.push({
            id: `alumni-${alumni.length}`,
            name: names[alumni.length % names.length],
            course: 'Digital Marketing',
            module: 'SEO & Content Strategy',
            role: 'SEO Specialist',
            company: companies[alumni.length % companies.length],
            hiredDate: '6 months ago',
            quote: 'Impact Digital Academy gave me the practical skills and confidence to switch careers. Within 3 months of graduating, I had two job offers.',
            image: `images/alumni-placeholder-${(alumni.length % 5) + 1}.jpg`,
            skills: 'Keyword Research, On-page SEO, Content Optimization'
        });
    }

    return alumni;
}

/**
 * Create an alumni story card element
 * @param {Object} story - Alumni story data
 * @returns {HTMLElement} Article element for story card
 */
function createAlumniCard(story) {
    const card = document.createElement('article');
    card.classList.add('story-card');
    card.id = `story-${story.id}`;

    card.innerHTML = `
        <div class="story-header">
            <h3 class="story-name">${story.name}</h3>
            <p class="story-meta">
                <span class="story-course">${story.course} • ${story.module}</span>
                <span class="story-date">🎓 Hired ${story.hiredDate}</span>
            </p>
        </div>
        <div class="story-company">
            <strong>Now:</strong> ${story.role} at ${story.company}
        </div>
        <blockquote class="story-quote">
            "${story.quote}"
        </blockquote>
        <div class="story-skills">
            <span class="skill-tag">${story.skills}</span>
        </div>
        <div class="story-footer">
            <button class="btn btn-outline btn-sm story-contact-btn" 
                    aria-label="Connect with ${story.name} on LinkedIn"
                    onclick="window.open('https://linkedin.com/in/example', '_blank')">
                <span class="icon">🔗</span> Connect
            </button>
        </div>
    `;

    return card;
}

/**
 * Add "Load More" button for alumni stories
 * @param {HTMLElement} container - Container element
 * @param {Array} remainingStories - Stories to load
 */
function addLoadMoreButton(container, remainingStories) {
    const loadMoreDiv = document.createElement('div');
    loadMoreDiv.classList.add('load-more-container');
    loadMoreDiv.innerHTML = `
        <button id="load-more-stories-btn" class="btn btn-secondary">
            Load more stories (${remainingStories.length})
        </button>
    `;

    container.after(loadMoreDiv);

    const loadMoreBtn = document.getElementById('load-more-stories-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            remainingStories.forEach(story => {
                const storyCard = createAlumniCard(story);
                container.appendChild(storyCard);
            });
            this.remove(); // Remove button after loading all
        });
    }
}