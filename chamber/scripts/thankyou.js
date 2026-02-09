// Display submitted form data on thankyou page
document.addEventListener('DOMContentLoaded', function () {
    displayApplicationData();
});

// Get URL parameters and display them
function displayApplicationData() {
    const urlParams = new URLSearchParams(window.location.search);
    const summaryContainer = document.querySelector('.summary-content');

    if (!summaryContainer) return;

    // Clear any existing content
    summaryContainer.innerHTML = '';

    // Define which fields to display and their labels
    const fields = [
        { param: 'first-name', label: 'First Name' },
        { param: 'last-name', label: 'Last Name' },
        { param: 'email', label: 'Email Address' },
        { param: 'phone', label: 'Phone Number' },
        { param: 'business-name', label: 'Business Name' },
        { param: 'timestamp', label: 'Application Date' }
    ];

    // Display each field
    fields.forEach(field => {
        const value = urlParams.get(field.param);
        if (value) {
            const displayValue = formatFieldValue(field.param, value);

            const itemDiv = document.createElement('div');
            itemDiv.className = 'summary-item';
            itemDiv.innerHTML = `
                <span class="summary-label">${field.label}:</span>
                <span class="summary-value">${displayValue}</span>
            `;

            summaryContainer.appendChild(itemDiv);
        }
    });

    // Display membership level separately (with special formatting)
    const membershipLevel = urlParams.get('membership-level');
    if (membershipLevel) {
        const membershipLabel = getMembershipLabel(membershipLevel);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <span class="summary-label">Membership Level:</span>
            <span class="summary-value">${membershipLabel}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    }

    // Display optional fields if they exist
    const title = urlParams.get('title');
    if (title) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <span class="summary-label">Job Title:</span>
            <span class="summary-value">${title}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    }

    const description = urlParams.get('description');
    if (description) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <span class="summary-label">Business Description:</span>
            <span class="summary-value">${description}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    }
}

// Format field values for display
function formatFieldValue(fieldName, value) {
    switch (fieldName) {
        case 'timestamp':
            return formatDate(value);
        case 'phone':
            return formatPhoneNumber(value);
        default:
            return value;
    }
}

// Format date from ISO string
function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return isoString;
    }
}

// Format phone number for display
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = ('' + phone).replace(/\D/g, '');

    // Format as +234 XXX XXX XXXX
    if (cleaned.length === 13 && cleaned.startsWith('234')) {
        return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
    }

    // Return as is if not Nigerian number
    return phone;
}

// Get membership level label
function getMembershipLabel(level) {
    const levels = {
        'np': 'NP Membership (Non-Profit) - Free',
        'bronze': 'Bronze Membership - ₦10,000/month',
        'silver': 'Silver Membership - ₦25,000/month',
        'gold': 'Gold Membership - ₦50,000/month'
    };

    return levels[level] || level;
}