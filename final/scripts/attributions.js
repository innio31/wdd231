document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 Attributions page loaded');

    // Add current year to copyright if needed
    const yearElement = document.querySelector('.attributions-meta');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        if (yearElement.textContent.includes('2025')) {
            yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
        }
    }

    // Smooth scroll for "Back to top" link
    const backToTop = document.querySelector('a[href="#main-content"]');
    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('main-content').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});