// Fetch and display members
async function displayMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load member data');
        }

        const members = await response.json();
        const container = document.getElementById('members-container');

        // Clear existing content
        container.innerHTML = '';

        // Create member cards
        members.forEach(member => {
            const card = createMemberCard(member);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading members:', error);
        document.getElementById('members-container').innerHTML =
            '<p class="error">Unable to load member information. Please try again later.</p>';
    }
}

// Create a member card element
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';

    // Membership level text
    const membershipText = getMembershipText(member.membership);

    card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name}" class="member-image" loading="lazy">
        <div class="member-info">
            <h3>${member.name}</h3>
            <p class="member-address">${member.address}</p>
            <p class="member-phone">${member.phone}</p>
            <p class="member-website">
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            </p>
            <p class="member-industry"><strong>Industry:</strong> ${member.industry}</p>
            <p class="member-description">${member.description}</p>
            <span class="membership-badge membership-${member.membership}">${membershipText}</span>
        </div>
    `;

    return card;
}

// Get membership level text
function getMembershipText(level) {
    switch (level) {
        case 3: return 'Gold Member';
        case 2: return 'Silver Member';
        case 1: return 'Member';
        default: return 'Member';
    }
}

// Toggle between grid and list view
function setupViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const container = document.getElementById('members-container');

    if (!gridViewBtn || !listViewBtn || !container) return;

    gridViewBtn.addEventListener('click', () => {
        container.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        container.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });
}

// Initialize directory page
document.addEventListener('DOMContentLoaded', () => {
    displayMembers();
    setupViewToggle();
});

// Fetch and display members
async function displayMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load member data');
        }

        const members = await response.json();
        const container = document.getElementById('members-container');

        // Clear existing content
        container.innerHTML = '';

        // Create member cards with ARIA attributes
        members.forEach((member, index) => {
            const card = createMemberCard(member, index);
            container.appendChild(card);
        });

        // Update container ARIA label
        container.setAttribute('aria-label', 'Business directory listing');

    } catch (error) {
        console.error('Error loading members:', error);
        document.getElementById('members-container').innerHTML =
            '<p class="error" role="alert">Unable to load member information. Please try again later.</p>';
    }
}

// Create a member card element with improved accessibility
function createMemberCard(member, index) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `${member.name} - ${getMembershipText(member.membership)}`);

    const membershipText = getMembershipText(member.membership);
    const membershipClass = `membership-${member.membership}`;

    card.innerHTML = `
        <img src="images/${member.image}" 
             alt="${member.name} logo" 
             class="member-image" 
             loading="lazy"
             width="300" 
             height="200">
        <div class="member-info">
            <h3>${member.name}</h3>
            <p class="member-address"><strong>📍 Address:</strong> ${member.address}</p>
            <p class="member-phone"><strong>📞 Phone:</strong> ${member.phone}</p>
            <p class="member-website">
                <a href="${member.website}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${member.name} website">
                    🌐 Visit Website
                </a>
            </p>
            <p class="member-industry"><strong>Industry:</strong> ${member.industry}</p>
            <p class="member-description">${member.description}</p>
            <span class="membership-badge ${membershipClass}" role="status">
                ${membershipText}
            </span>
        </div>
    `;

    return card;
}

// Get membership level text
function getMembershipText(level) {
    switch (level) {
        case 3: return 'Gold Member';
        case 2: return 'Silver Member';
        case 1: return 'Member';
        default: return 'Member';
    }
}

// Toggle between grid and list view with accessibility
function setupViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const container = document.getElementById('members-container');

    if (!gridViewBtn || !listViewBtn || !container) return;

    function setView(view) {
        if (view === 'grid') {
            container.className = 'grid-view';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            gridViewBtn.setAttribute('aria-pressed', 'true');
            listViewBtn.setAttribute('aria-pressed', 'false');
        } else {
            container.className = 'list-view';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            listViewBtn.setAttribute('aria-pressed', 'true');
            gridViewBtn.setAttribute('aria-pressed', 'false');
        }
    }

    gridViewBtn.addEventListener('click', () => setView('grid'));
    listViewBtn.addEventListener('click', () => setView('list'));

    // Keyboard support
    gridViewBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setView('grid');
        }
    });

    listViewBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setView('list');
        }
    });
}

// Initialize directory page
document.addEventListener('DOMContentLoaded', () => {
    displayMembers();
    setupViewToggle();
});