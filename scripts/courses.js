// scripts/courses.js
const courses = [
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 1,
        completed: true
    },
    {
        subject: 'CSE',
        number: 110,
        title: 'Programming Building Blocks',
        credits: 3,
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        completed: false
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        completed: false
    }
];

function displayCourses(filter = 'all') {
    const container = document.getElementById('courses-container');
    const creditsElement = document.getElementById('total-credits');

    // Filter courses
    let filteredCourses;
    switch (filter) {
        case 'wdd':
            filteredCourses = courses.filter(course => course.subject === 'WDD');
            break;
        case 'cse':
            filteredCourses = courses.filter(course => course.subject === 'CSE');
            break;
        default:
            filteredCourses = courses;
    }

    // Calculate total credits
    const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
    creditsElement.textContent = totalCredits;

    // Clear container
    container.innerHTML = '';

    // Create course cards
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : 'incomplete'}`;

        card.innerHTML = `
            <div class="course-code">${course.subject} ${course.number}</div>
            <div class="course-title">${course.title}</div>
            <div class="course-credits">${course.credits} credit${course.credits !== 1 ? 's' : ''}</div>
            <div class="course-status ${course.completed ? 'completed' : 'incomplete'}">
                ${course.completed ? '✓ Completed' : 'Not Taken'}
            </div>
        `;

        container.appendChild(card);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCourses();

    // Add event listeners to filter buttons
    document.getElementById('all-courses').addEventListener('click', () => {
        updateActiveButton('all-courses');
        displayCourses('all');
    });

    document.getElementById('wdd-courses').addEventListener('click', () => {
        updateActiveButton('wdd-courses');
        displayCourses('wdd');
    });

    document.getElementById('cse-courses').addEventListener('click', () => {
        updateActiveButton('cse-courses');
        displayCourses('cse');
    });
});

function updateActiveButton(activeId) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    document.getElementById(activeId).classList.add('active');
}