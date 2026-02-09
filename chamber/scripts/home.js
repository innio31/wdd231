// API Configuration
const WEATHER_API_KEY = 'eadc1a703fd9d421e0e5424518976562';
const OTA_LAT = 6.6926; // Ota, Ogun State coordinates
const OTA_LON = 3.2366;
const WEATHER_UNITS = 'metric';

// DOM Elements
const currentTempEl = document.getElementById('current-temp');
const weatherDescEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const forecastGridEl = document.querySelector('.forecast-grid');
const spotlightsContainer = document.getElementById('spotlights-container');

// Fetch and display weather data
async function fetchWeatherData() {
    try {
        // Fetch current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${OTA_LAT}&lon=${OTA_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
        const currentResponse = await fetch(currentWeatherUrl);

        if (!currentResponse.ok) {
            throw new Error('Failed to fetch current weather data');
        }

        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        // Fetch forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${OTA_LAT}&lon=${OTA_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast data');
        }

        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        showWeatherError();
    }
}

// Display current weather
function displayCurrentWeather(data) {
    currentTempEl.textContent = Math.round(data.main.temp);
    weatherDescEl.textContent = data.weather[0].description;
    humidityEl.textContent = data.main.humidity;
    windSpeedEl.textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
}

// Display 3-day forecast
function displayForecast(data) {
    // Clear existing forecast
    forecastGridEl.innerHTML = '';

    // Get forecast for next 3 days (8 forecasts per day, take midday forecast for each day)
    const forecasts = data.list;
    const dailyForecasts = [];

    for (let i = 0; i < forecasts.length && dailyForecasts.length < 3; i++) {
        const forecast = forecasts[i];
        const forecastTime = new Date(forecast.dt * 1000);

        // Use forecasts around midday (12:00)
        if (forecastTime.getHours() >= 11 && forecastTime.getHours() <= 13) {
            dailyForecasts.push(forecast);
        }
    }

    // Create forecast cards
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-day';
        forecastCard.innerHTML = `
            <h4>${dayName}</h4>
            <p>${dayDate}</p>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <p>${forecast.weather[0].description}</p>
        `;

        forecastGridEl.appendChild(forecastCard);
    });
}

// Show weather error message
function showWeatherError() {
    currentTempEl.textContent = '--';
    weatherDescEl.textContent = 'Unable to load weather data';
    forecastGridEl.innerHTML = '<p>Weather forecast unavailable</p>';
}

// Fetch and display business spotlights
async function displayBusinessSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load member data');
        }

        const members = await response.json();

        // Filter gold and silver members only
        const premiumMembers = members.filter(member =>
            member.membership === 2 || member.membership === 3
        );

        // Randomly select 3 members (or less if not enough)
        const selectedMembers = getRandomMembers(premiumMembers, 3);

        // Clear container
        spotlightsContainer.innerHTML = '';

        // Create spotlight cards
        selectedMembers.forEach(member => {
            const spotlightCard = createSpotlightCard(member);
            spotlightsContainer.appendChild(spotlightCard);
        });

    } catch (error) {
        console.error('Error loading business spotlights:', error);
        spotlightsContainer.innerHTML =
            '<p class="error">Unable to load business spotlights. Please try again later.</p>';
    }
}

// Get random members from array
function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, members.length));
}

// Create a spotlight card element
function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.className = 'spotlight-card';

    // Membership level text
    const membershipText = getMembershipText(member.membership);
    const membershipClass = `membership-${member.membership}`;

    card.innerHTML = `
        <div class="spotlight-header">
            <img src="images/${member.image}" alt="${member.name} Logo" class="spotlight-logo">
            <div>
                <h3>${member.name}</h3>
                <span class="membership-badge ${membershipClass}">${membershipText}</span>
            </div>
        </div>
        <div class="spotlight-content">
            <p class="member-address">📍 ${member.address}</p>
            <p class="member-phone">📞 ${member.phone}</p>
            <p class="spotlight-website">
                <a href="${member.website}" target="_blank" rel="noopener">🌐 Visit Website</a>
            </p>
            <p class="member-industry"><strong>Industry:</strong> ${member.industry}</p>
            <p class="member-description">${member.description}</p>
        </div>
    `;

    return card;
}

// Get membership level text (reuse from directory.js)
function getMembershipText(level) {
    switch (level) {
        case 3: return 'Gold Member';
        case 2: return 'Silver Member';
        case 1: return 'Member';
        default: return 'Member';
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display weather data
    fetchWeatherData();

    // Display business spotlights
    displayBusinessSpotlights();
});