/* ===== HOME.JS - Chamber Home Page ===== */

// API Configuration
const WEATHER_API_KEY = 'eadc1a703fd9d421e0e5424518976562';
const OTA_LAT = 6.6926;
const OTA_LON = 3.2366;
const WEATHER_UNITS = 'metric';

// DOM Elements
const currentTempEl = document.getElementById('current-temp');
const weatherDescEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const forecastGridEl = document.getElementById('forecast-grid');
const spotlightsContainer = document.getElementById('spotlights-container');

// ===== WEATHER FUNCTIONS =====
async function fetchWeatherData() {
    try {
        // Fetch current weather
        const currentWeatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?lat=${OTA_LAT}&lon=${OTA_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
        const currentResponse = await fetch(currentWeatherUrl);

        if (!currentResponse.ok) {
            throw new Error('Failed to fetch current weather');
        }

        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        // Fetch 5-day forecast
        const forecastUrl =
            `https://api.openweathermap.org/data/2.5/forecast?lat=${OTA_LAT}&lon=${OTA_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast');
        }

        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);

    } catch (error) {
        console.error('Weather API Error:', error);
        showWeatherError();
    }
}

function displayCurrentWeather(data) {
    currentTempEl.textContent = Math.round(data.main.temp);
    weatherDescEl.textContent = data.weather[0].description;
    humidityEl.textContent = data.main.humidity;
    windSpeedEl.textContent = Math.round(data.wind.speed * 3.6); // m/s to km/h
}

function displayForecast(data) {
    forecastGridEl.innerHTML = '';

    // Get unique dates from forecast list
    const forecastDays = [];
    const seenDates = new Set();

    for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString('en-US');

        // Only take midday forecasts (around 12:00) and only 3 days
        if (!seenDates.has(dateKey) && date.getHours() >= 11 && date.getHours() <= 14) {
            seenDates.add(dateKey);
            forecastDays.push(item);

            if (forecastDays.length >= 3) break;
        }
    }

    // Create forecast cards
    forecastDays.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const card = document.createElement('div');
        card.className = 'forecast-day';
        card.innerHTML = `
            <h4>${dayName}</h4>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <p class="forecast-desc">${forecast.weather[0].description}</p>
        `;
        forecastGridEl.appendChild(card);
    });
}

function showWeatherError() {
    currentTempEl.textContent = '--';
    weatherDescEl.textContent = 'Unavailable';
    humidityEl.textContent = '--';
    windSpeedEl.textContent = '--';
    forecastGridEl.innerHTML = '<p class="error">Weather data unavailable</p>';
}

// ===== SPOTLIGHT FUNCTIONS =====
async function displayBusinessSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to load member data');
        }

        const members = await response.json();

        // Filter gold (3) and silver (2) members only
        const premiumMembers = members.filter(member =>
            member.membership === 2 || member.membership === 3
        );

        if (premiumMembers.length === 0) {
            spotlightsContainer.innerHTML = '<p class="error">No premium members found</p>';
            return;
        }

        // Randomly select 2-3 members
        const count = Math.min(premiumMembers.length, 3);
        const selectedMembers = getRandomMembers(premiumMembers, count);

        // Clear and populate
        spotlightsContainer.innerHTML = '';
        selectedMembers.forEach(member => {
            const card = createSpotlightCard(member);
            spotlightsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Spotlight Error:', error);
        spotlightsContainer.innerHTML = '<p class="error">Unable to load business spotlights.</p>';
    }
}

function getRandomMembers(members, count) {
    const shuffled = [...members];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

function createSpotlightCard(member) {
    const card = document.createElement('div');
    card.className = 'spotlight-card';

    const membershipText = member.membership === 3 ? 'Gold Member' : 'Silver Member';
    const membershipClass = `membership-${member.membership}`;

    card.innerHTML = `
        <div class="spotlight-header">
            <img src="images/${member.image}" alt="${member.name} logo" class="spotlight-logo" loading="lazy" width="60" height="60">
            <div>
                <h3>${member.name}</h3>
                <span class="membership-badge ${membershipClass}">${membershipText}</span>
            </div>
        </div>
        <div class="spotlight-content">
            <p class="member-address">📍 ${member.address}</p>
            <p class="member-phone">📞 ${member.phone}</p>
            <p class="spotlight-website">
                <a href="${member.website}" target="_blank" rel="noopener noreferrer">🌐 Visit Website</a>
            </p>
            <p class="member-industry"><strong>Industry:</strong> ${member.industry}</p>
            <p class="member-description">${member.description}</p>
        </div>
    `;

    return card;
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
    displayBusinessSpotlights();
});