// Declare URL variable for JSON resource
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Select the cards container
const cards = document.querySelector('#cards');

// Async function to fetch prophet data
async function getProphetData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.table(data.prophets); // temporary testing of data response
        displayProphets(data.prophets); // note that you reference the prophets array of the JSON data object
    } catch (error) {
        console.error('Error fetching prophet data:', error);
        cards.innerHTML = `<p class="error">Failed to load prophet data. Please try again later.</p>`;
    }
}

// Function expression to display prophets
const displayProphets = (prophets) => {
    // Clear any existing content
    cards.innerHTML = '';

    // Process each prophet
    prophets.forEach((prophet) => {
        // Create card section
        const card = document.createElement('section');
        card.classList.add('prophet-card');

        // Create and populate h2 element
        const fullName = document.createElement('h2');
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        // Create and populate img element
        const portrait = document.createElement('img');
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} - ${prophet.order}th Latter-day Prophet`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '300');
        portrait.setAttribute('height', '400');

        // Create additional info elements
        const birthDate = document.createElement('p');
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;

        const birthPlace = document.createElement('p');
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        const deathDate = document.createElement('p');
        deathDate.textContent = prophet.death ? `Date of Death: ${prophet.death}` : 'Currently Living';

        const numChildren = document.createElement('p');
        numChildren.textContent = `Children: ${prophet.numofchildren}`;

        const yearsProphet = document.createElement('p');
        yearsProphet.textContent = `Years as Prophet: ${prophet.length}`;

        // Append elements to card
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(deathDate);
        card.appendChild(numChildren);
        card.appendChild(yearsProphet);

        // Add card to container
        cards.appendChild(card);
    });
};

// Call the function to get and display prophet data
getProphetData();