import { attractions } from '../data/attractions.mjs';

// DOM Elements
const attractionsContainer = document.getElementById('attractions-container');
const visitMessage = document.getElementById('visit-message');
const closeMessageBtn = document.getElementById('close-message');
const visitorMessage = document.getElementById('visitor-message');
const modal = document.getElementById('attraction-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-modal');

// Track last visit
const LAST_VISIT_KEY = 'ota-chamber-last-visit';

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    displayAttractions();
    setupModal();
    trackVisit();
    setupEventListeners();
});

// Display attraction cards
function displayAttractions() {
    attractionsContainer.innerHTML = '';

    attractions.forEach((attraction, index) => {
        const card = createAttractionCard(attraction, index + 1);
        attractionsContainer.appendChild(card);
    });
}

// Create attraction card element
function createAttractionCard(attraction, index) {
    const card = document.createElement('article');
    card.className = `attraction-card card-${index}`;

    card.innerHTML = `
        <figure>
            <img src="images/discover/${attraction.image}" 
                 alt="${attraction.name}" 
                 loading="lazy"
                 width="300" 
                 height="200">
        </figure>
        <div class="card-content">
            <h2>${attraction.name}</h2>
            <address>${attraction.address}</address>
            <p>${truncateDescription(attraction.description, 100)}</p>
            <button class="learn-more-btn" data-id="${attraction.id}">
                Learn More
            </button>
        </div>
    `;

    return card;
}

// Truncate description for card view
function truncateDescription(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Setup modal functionality
function setupModal() {
    // Close modal when clicking X
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // Add click listeners to Learn More buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('learn-more-btn')) {
            const attractionId = parseInt(e.target.getAttribute('data-id'));
            const attraction = attractions.find(a => a.id === attractionId);

            if (attraction) {
                showAttractionDetails(attraction);
            }
        }
    });
}

// Show attraction details in modal
function showAttractionDetails(attraction) {
    modalBody.innerHTML = `
        <h2>${attraction.name}</h2>
        <address>${attraction.address}</address>
        <p>${attraction.description}</p>
        <div class="modal-image">
            <img src="images/discover/${attraction.image}" 
                 alt="${attraction.name}"
                 width="500"
                 height="300">
        </div>
    `;

    modal.style.display = 'flex';
}

// Track and display visit information
function trackVisit() {
    const now = Date.now();
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

    if (!lastVisit) {
        // First visit
        showVisitMessage('Welcome! Let us know if you have any questions.');
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDifference = now - lastVisitTime;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference === 0) {
            // Less than a day
            showVisitMessage('Back so soon! Awesome!');
        } else {
            // Multiple days
            const dayText = daysDifference === 1 ? 'day' : 'days';
            showVisitMessage(`You last visited ${daysDifference} ${dayText} ago.`);
        }
    }

    // Store current visit
    localStorage.setItem(LAST_VISIT_KEY, now.toString());
}

// Show visit message
function showVisitMessage(message) {
    visitMessage.textContent = message;
    visitorMessage.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
    // Close visitor message
    closeMessageBtn.addEventListener('click', () => {
        visitorMessage.style.display = 'none';
    });

    // Add lazy loading for images
    const images = document.querySelectorAll('.attraction-card img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}