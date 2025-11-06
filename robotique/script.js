document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides-container');
    const sections = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    let currentSlide = 0;

    function showSlide(index) {
        if (index < 0) {
            index = 0;
        } else if (index >= sections.length) {
            index = sections.length - 1;
        }
        currentSlide = index;
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}vw)`;
        updateButtonStates();
    }

    function updateButtonStates() {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === sections.length - 1;
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

    // Slide-in Panel functionality for component items
    const componentItems = document.querySelectorAll('.component-item');
    const slideInPanel = document.getElementById('slideInPanel');
    const slideInPanelOverlay = document.getElementById('slideInPanelOverlay');
    const panelImage = document.getElementById('panelImage');
    const panelExplanation = document.getElementById('panelExplanation');
    const closePanelButton = document.querySelector('.close-panel-button');

    let activeComponentItem = null; // To keep track of which item opened the panel

    function openPanel(item) {
        const imageSrc = item.dataset.image;
        const explanationText = item.dataset.explanation;

        panelImage.src = imageSrc;
        panelExplanation.textContent = explanationText;
        slideInPanel.classList.add('open');
        slideInPanelOverlay.classList.add('visible');
        document.body.classList.add('panel-active'); // Add class to body
        activeComponentItem = item;
    }

    function closePanel() {
        slideInPanel.classList.remove('open');
        slideInPanelOverlay.classList.remove('visible');
        document.body.classList.remove('panel-active'); // Remove class from body
        activeComponentItem = null;
    }

    componentItems.forEach(item => {
        item.addEventListener('click', () => {
            if (activeComponentItem === item) {
                // If the same item is clicked again, close the panel
                closePanel();
            } else {
                // Open panel with new content
                openPanel(item);
            }
        });
    });

    // Close the panel when the close button is clicked
    closePanelButton.addEventListener('click', closePanel);

    // Close the panel if clicked outside the panel (on the overlay)
    slideInPanelOverlay.addEventListener('click', closePanel);

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