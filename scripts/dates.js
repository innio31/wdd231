// scripts/dates.js
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    // Format last modified date
    const lastModified = document.lastModified;
    const formattedDate = new Date(lastModified).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('last-modified').textContent = formattedDate;
});