// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Set current timestamp in hidden field
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Initialize modals
    initModals();

    // Add animation classes to cards
    animateCards();

    // Form validation
    setupFormValidation();
});

// Initialize modal functionality
function initModals() {
    // Get all modal elements
    const modals = document.querySelectorAll('.modal');
    const infoButtons = document.querySelectorAll('.info-btn');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal when info button is clicked
    infoButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', function (event) {
            if (event.target === this) {
                closeModal(this);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    closeModal(modal);
                }
            });
        }
    });
}

// Close modal function
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

// Animate cards on page load
function animateCards() {
    const cards = document.querySelectorAll('.membership-card');

    // Cards are already animated with CSS, but we can add additional effects
    cards.forEach((card, index) => {
        // Add hover effect for keyboard navigation
        card.addEventListener('focus', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('blur', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('membership-form');
    const titleInput = document.getElementById('title');
    const phoneInput = document.getElementById('phone');

    // Custom validation for title input (minimum 7 characters, letters, spaces, hyphens only)
    if (titleInput) {
        titleInput.addEventListener('input', function () {
            const pattern = /^[A-Za-z\s\-]{7,}$/;
            if (this.value && !pattern.test(this.value)) {
                this.setCustomValidity('Title must be at least 7 characters and contain only letters, spaces, and hyphens.');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Phone number formatting (optional enhancement)
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            // Remove all non-digit characters
            let phone = this.value.replace(/\D/g, '');

            // Format as Nigerian phone number if it starts with 234
            if (phone.startsWith('234') && phone.length === 13) {
                phone = phone.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
            }

            // Update the input value if it changed
            if (phone !== this.value.replace(/\D/g, '')) {
                this.value = phone;
            }
        });
    }

    // Form submission - additional validation
    if (form) {
        form.addEventListener('submit', function (event) {
            // Check if all required fields are filled
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--accent-color)';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                event.preventDefault();
                alert('Please fill in all required fields marked with *.');
            }
        });
    }
}

// Helper function to format phone number
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '+234 ' + match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return phone;
}