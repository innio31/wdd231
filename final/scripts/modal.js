// ===== scripts/modal.js =====
// IMPACT DIGITAL ACADEMY - Modal Dialog Module
// Accessible modal for displaying detailed module information
// Demonstrates: DOM manipulation, event delegation, ARIA attributes

/**
 * Initialize modal dialog functionality
 * Uses event delegation for dynamically generated buttons
 */
export function initModal() {
    const modal = document.getElementById('module-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !modalTitle || !modalDetails || !closeBtn) return;

    // Event delegation: listen for clicks on document
    // Catches clicks on dynamically added "Quick View" buttons
    document.addEventListener('click', function (event) {
        const button = event.target.closest('.view-details-btn');
        if (!button) return;

        event.preventDefault();

        try {
            // Get module data from data-module attribute
            const moduleData = JSON.parse(button.dataset.module);

            // DOM Manipulation: Update modal content
            modalTitle.textContent = moduleData.title || 'Module Details';

            // Template Literals: Build detailed content
            modalDetails.innerHTML = `
                <div class="modal-module-details">
                    <p class="modal-duration">
                        <strong>⏱️ Duration:</strong> ${moduleData.duration || 'Not specified'}
                    </p>
                    <p class="modal-prerequisites">
                        <strong>📋 Prerequisites:</strong> ${moduleData.prerequisites || 'None'}
                    </p>
                    
                    <h4 class="modal-section-heading">📖 Syllabus</h4>
                    <p>${moduleData.syllabus || 'Comprehensive training in this module.'}</p>
                    
                    <h4 class="modal-section-heading">🛠️ Project</h4>
                    <p>${moduleData.project || 'Hands-on project to build your portfolio.'}</p>
                    
                    <h4 class="modal-section-heading">🎯 Skills You'll Gain</h4>
                    <ul class="modal-skills-list">
                        ${moduleData.skills ? moduleData.skills.map(skill => `<li>${skill}</li>`).join('') : '<li>Industry-relevant skills</li>'}
                    </ul>
                    
                    <h4 class="modal-section-heading">🔧 Tools</h4>
                    <p>${moduleData.tools ? moduleData.tools.join(', ') : 'Industry-standard tools'}</p>
                    
                    <h4 class="modal-section-heading">💼 Career Outcomes</h4>
                    <p>${moduleData.career_outcomes || 'Entry-level roles in this field'}</p>
                    
                    <div class="modal-cta">
                        <a href="community.html#partnership-form" class="btn btn-primary">
                            Inquire about this course
                        </a>
                    </div>
                </div>
            `;

            // Accessibility: Update ARIA attributes
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';

            // Focus management: Set focus to close button
            setTimeout(() => closeBtn.focus(), 100);

            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Error opening modal:', error);
            alert('Could not load module details. Please try again.');
        }
    });

    // Close modal when clicking close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    /**
     * Close modal and restore focus
     */
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling

        // Return focus to the button that opened the modal
        // (focus management best practice)
        if (document.activeElement && document.activeElement.classList.contains('close-modal')) {
            // Find last focused button - simplified for demo
            const lastButton = document.querySelector('.view-details-btn:focus');
            if (lastButton) lastButton.focus();
        }
    }
}