// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Set current timestamp in hidden field
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
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
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Set focus to modal for accessibility
                setTimeout(() => {
                    const closeBtn = modal.querySelector('.close-modal');
                    if (closeBtn) closeBtn.focus();
                }, 100);
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

    // Trap focus within modal
    modals.forEach(modal => {
        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    });
}

// Close modal function
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        // Return focus to the button that opened the modal
        const infoButtons = document.querySelectorAll('.info-btn');
        infoButtons.forEach(button => {
            const modalId = button.getAttribute('data-modal');
            if (modalId && document.getElementById(modalId) === modal) {
                button.focus();
            }
        });
    }
}

// Animate cards on page load
function animateCards() {
    const cards = document.querySelectorAll('.membership-card');
    
    // Add staggered animation delay
    cards.forEach((card, index) => {
        // Remove any existing animation to restart it
        card.style.animation = 'none';
        
        // Force reflow
        void card.offsetHeight;
        
        // Add the animation with staggered delay
        const delay = (index + 1) * 0.15;
        card.style.animation = `cardEntrance 0.6s ease-out ${delay}s forwards, cardPulse 0.8s ease-out ${delay + 0.8}s forwards`;
        card.style.opacity = '0';
        
        // Add hover effect for keyboard navigation
        card.addEventListener('focusin', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('focusout', function () {
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
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');

    // Custom validation for title input (minimum 7 characters, letters, spaces, hyphens only)
    if (titleInput) {
        titleInput.addEventListener('input', function () {
            const pattern = /^[A-Za-z\s\-]{7,}$/;
            if (this.value && !pattern.test(this.value)) {
                this.setCustomValidity('Title must be at least 7 characters and contain only letters, spaces, and hyphens.');
                this.style.borderColor = '#e74c3c';
            } else {
                this.setCustomValidity('');
                this.style.borderColor = '';
            }
        });

        titleInput.addEventListener('blur', function () {
            if (this.value && !/^[A-Za-z\s\-]{7,}$/.test(this.value)) {
                this.style.borderColor = '#e74c3c';
            }
        });
    }

    // Real-time validation feedback for required fields
    const requiredFields = form ? form.querySelectorAll('[required]') : [];
    requiredFields.forEach(field => {
        field.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#27ae60';
            }
        });

        field.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#27ae60';
            }
        });
    });

    // Email validation feedback
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            if (this.value && !this.validity.valid) {
                this.style.borderColor = '#e74c3c';
                this.setCustomValidity('Please enter a valid email address (e.g., name@example.com)');
            } else {
                this.style.borderColor = '';
                this.setCustomValidity('');
            }
        });
    }

    // Phone number formatting and validation
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            // Remove all non-digit characters
            let phone = this.value.replace(/\D/g, '');
            
            // Format as Nigerian phone number if it starts with 234 and has 13 digits
            if (phone.startsWith('234') && phone.length === 13) {
                phone = phone.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
                this.value = phone;
            }
            
            // Basic validation - at least 10 digits
            if (phone.length >= 10 && phone.length <= 14) {
                this.style.borderColor = '#27ae60';
                this.setCustomValidity('');
            } else if (this.value && phone.length > 0) {
                this.style.borderColor = '#e74c3c';
                this.setCustomValidity('Please enter a valid phone number with at least 10 digits');
            }
        });
    }

    // Form submission - additional validation
    if (form) {
        form.addEventListener('submit', function (event) {
            // Ensure timestamp is set
            const timestampField = document.getElementById('timestamp');
            if (timestampField && !timestampField.value) {
                timestampField.value = new Date().toISOString();
            }

            // Validate all required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                    field.setCustomValidity('This field is required');
                } else {
                    field.style.borderColor = '#27ae60';
                    field.setCustomValidity('');
                }
            });

            // Validate email
            const email = document.getElementById('email');
            if (email && email.value && !email.validity.valid) {
                isValid = false;
                email.style.borderColor = '#e74c3c';
                email.setCustomValidity('Please enter a valid email address');
            }

            // Validate phone
            const phone = document.getElementById('phone');
            if (phone && phone.value) {
                const digits = phone.value.replace(/\D/g, '');
                if (digits.length < 10) {
                    isValid = false;
                    phone.style.borderColor = '#e74c3c';
                    phone.setCustomValidity('Please enter a valid phone number with at least 10 digits');
                }
            }

            // Validate title pattern
            const title = document.getElementById('title');
            if (title && title.value && !/^[A-Za-z\s\-]{7,}$/.test(title.value)) {
                isValid = false;
                title.style.borderColor = '#e74c3c';
                title.setCustomValidity('Title must be at least 7 characters and contain only letters, spaces, and hyphens.');
            }

            if (!isValid) {
                event.preventDefault();
                // Scroll to the first error
                const firstError = form.querySelector('[style*="border-color: #e74c3c"]');
                if (firstError) {
                    firstError.focus();
                }
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