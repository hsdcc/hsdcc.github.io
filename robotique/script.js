
document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides-container');
    const sections = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    let currentSlide = 0;

    function showSlide(index) {
        if (index < 0) {
            currentSlide = sections.length - 1;
        } else if (index >= sections.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}vw)`;
    }

    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            showSlide(currentSlide + 1);
        }
    });

    // Dark/Light mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        updateDarkModeIcon();
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    function updateDarkModeIcon() {
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '☀️';
        } else {
            darkModeToggle.innerHTML = '🌙';
        }
    }

    updateDarkModeIcon();

    // Initialize the first slide
    showSlide(0);

    // Mobile swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    slidesContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, false);

    slidesContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    }, false);

    function handleGesture() {
        if (touchendX < touchstartX - 50) { // Swiped left
            showSlide(currentSlide + 1);
        }

        if (touchendX > touchstartX + 50) { // Swiped right
            showSlide(currentSlide - 1);
        }
    }
});
