// scripts/navigation.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const closeBtn = document.querySelector('.close');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');

        // Toggle icon visibility
        if (nav.classList.contains('active')) {
            hamburger.style.display = 'none';
            closeBtn.style.display = 'inline';
        } else {
            hamburger.style.display = 'inline';
            closeBtn.style.display = 'none';
        }
    });

    // Close menu when clicking on a link (for mobile)
    document.querySelectorAll('.navigation a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                nav.classList.remove('active');
                hamburger.style.display = 'inline';
                closeBtn.style.display = 'none';
            }
        });
    });
});