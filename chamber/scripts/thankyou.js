// Display submitted form data on thankyou page
document.addEventListener('DOMContentLoaded', function () {
    displayApplicationData();
    
    // Add animation to the success icon
    animateSuccessIcon();
});

// Get URL parameters and display them
function displayApplicationData() {
    const urlParams = new URLSearchParams(window.location.search);
    const summaryContainer = document.querySelector('.summary-content');

    if (!summaryContainer) {
        console.error('Summary container not found');
        return;
    }

    // Clear any existing content
    summaryContainer.innerHTML = '';

    // Define which fields to display and their labels
    const fields = [
        { param: 'first-name', label: 'First Name', required: true },
        { param: 'last-name', label: 'Last Name', required: true },
        { param: 'email', label: 'Email Address', required: true },
        { param: 'phone', label: 'Phone Number', required: true },
        { param: 'business-name', label: 'Business Name', required: true },
        { param: 'timestamp', label: 'Application Date', required: true }
    ];

    // Check if we have data
    let hasData = false;

    // Display each field
    fields.forEach(field => {
        const value = urlParams.get(field.param);
        if (value) {
            hasData = true;
            const displayValue = formatFieldValue(field.param, value);

            const itemDiv = document.createElement('div');
            itemDiv.className = 'summary-item';
            itemDiv.innerHTML = `
                <span class="summary-label">${field.label}:</span>
                <span class="summary-value">${displayValue}</span>
            `;
            summaryContainer.appendChild(itemDiv);
        } else if (field.required) {
            // If a required field is missing, show a placeholder
            const itemDiv = document.createElement('div');
            itemDiv.className = 'summary-item';
            itemDiv.innerHTML = `
                <span class="summary-label">${field.label}:</span>
                <span class="summary-value" style="color: #999;">Not provided</span>
            `;
            summaryContainer.appendChild(itemDiv);
        }
    });

    // Display membership level separately (with special formatting)
    const membershipLevel = urlParams.get('membership-level');
    if (membershipLevel) {
        hasData = true;
        const membershipLabel = getMembershipLabel(membershipLevel);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <span class="summary-label">Membership Level:</span>
            <span class="summary-value"><strong>${membershipLabel}</strong></span>
        `;
        summaryContainer.appendChild(itemDiv);
    }

    // Display optional fields if they exist
    const title = urlParams.get('title');
    if (title) {
        hasData = true;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <span class="summary-label">Job Title:</span>
            <span class="summary-value">${escapeHtml(title)}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    }

    const description = urlParams.get('description');
    if (description) {
        hasData = true;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.style.display = 'flex';
        itemDiv.style.flexDirection = 'column';
        itemDiv.style.alignItems = 'flex-start';
        itemDiv.innerHTML = `
            <span class="summary-label" style="margin-bottom: 0.5rem;">Business Description:</span>
            <span class="summary-value" style="text-align: left; width: 100%; padding: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                ${escapeHtml(description)}
            </span>
        `;
        summaryContainer.appendChild(itemDiv);
    }

    // If no data found, show a message
    if (!hasData) {
        summaryContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 2rem;">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No application data found.</p>
                <p style="font-size: 0.9rem;">Please submit the membership application form first.</p>
                <a href="join.html" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; 
                    background-color: #3498db; color: white; text-decoration: none; border-radius: 4px;">
                    Return to Application Form
                </a>
            </div>
        `;
    }
}

// Format field values for display
function formatFieldValue(fieldName, value) {
    switch (fieldName) {
        case 'timestamp':
            return formatDate(value);
        case 'phone':
            return formatPhoneNumber(value);
        case 'email':
            return `<a href="mailto:${escapeHtml(value)}" style="color: #3498db;">${escapeHtml(value)}</a>`;
        default:
            return escapeHtml(value);
    }
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date from ISO string
function formatDate(isoString) {
    try {
        if (!isoString) return 'Not provided';
        const date = new Date(isoString);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return isoString;
        }
        
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return isoString || 'Not provided';
    }
}

// Format phone number for display
function formatPhoneNumber(phone) {
    if (!phone) return 'Not provided';
    
    // Remove all non-digit characters
    const cleaned = ('' + phone).replace(/\D/g, '');
    
    // Format as +234 XXX XXX XXXX
    if (cleaned.length === 13 && cleaned.startsWith('234')) {
        return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
    }
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    // Return as is if not formatted
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
    
    return levels[level] || level || 'Not specified';
}

// Animate the success icon
function animateSuccessIcon() {
    const icon = document.querySelector('.success-icon');
    if (icon) {
        // Add a subtle bounce animation after initial load
        setTimeout(() => {
            icon.style.animation = 'none';
            void icon.offsetHeight; // Force reflow
            icon.style.animation = 'successPop 0.5s ease-out';
        }, 100);
    }
}

// Function to handle print-friendly page
function setupPrintButton() {
    const printButton = document.querySelector('.btn-print');
    if (printButton) {
        printButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.print();
        });
    }
}

// Function to handle share options
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.btn-share');
    shareButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (navigator.share) {
                navigator.share({
                    title: 'Ota Chamber of Commerce Membership',
                    text: 'I just joined the Ota Chamber of Commerce!',
                    url: window.location.href
                }).catch(() => {
                    // User cancelled or sharing not supported
                });
            } else {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(() => {
                    alert('Share this page: ' + window.location.href);
                });
            }
        });
    });
}