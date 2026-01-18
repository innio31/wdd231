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