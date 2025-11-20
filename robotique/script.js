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
        const slide = activeComponentItem.closest('.slide');
        if (slide) {
            slide.classList.add('panel-active-slide');
        }
    }

    function closePanel() {
        slideInPanel.classList.remove('open');
        slideInPanelOverlay.classList.remove('visible');
        document.body.classList.remove('panel-active'); // Remove class from body
        if (activeComponentItem) {
            const slide = activeComponentItem.closest('.slide');
            if (slide) {
                slide.classList.remove('panel-active-slide');
            }
        }
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
    
    // Interactive voltage graph functionality
    const voltageSlider = document.getElementById('voltageSlider');
    const voltageValue = document.getElementById('voltageValue');
    const voltageWave = document.getElementById('voltageWave');
    const voltageLabel = document.getElementById('voltageLabel');
    
    if (voltageSlider) {
        voltageSlider.addEventListener('input', updateVoltageGraph);
        
        function updateVoltageGraph() {
            const voltage = voltageSlider.value;
            voltageValue.textContent = voltage;
            if (voltageLabel) {
                voltageLabel.textContent = voltage + ' V';
            }
            
            // Update the wave path based on voltage
            // Higher voltage = higher amplitude
            const amplitude = (voltage / 24) * 50; // Scale amplitude based on voltage
            
            // Create the wave path with the new amplitude
            // The wave path creates a sine-like wave
            const centerY = 125; // Center Y position
            const startX = 50;
            const endX = 450;
            
            // Calculate control points for the quadratic curves
            const cp1X = 100;
            const cp1Y = centerY - amplitude;
            const cp2X = 150;
            const cp2Y = centerY;
            const cp3X = 200;
            const cp3Y = centerY + amplitude;
            const cp4X = 250;
            const cp4Y = centerY;
            const cp5X = 300;
            const cp5Y = centerY - amplitude;
            const cp6X = 350;
            const cp6Y = centerY;
            const cp7X = 400;
            const cp7Y = centerY + amplitude;
            
            // Construct the path string
            const pathData = `M ${startX} ${centerY} Q ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} Q ${cp3X} ${cp3Y} ${cp4X} ${cp4Y} Q ${cp5X} ${cp5Y} ${cp6X} ${cp6Y} Q ${cp7X} ${cp7Y} ${endX} ${centerY}`;
            
            voltageWave.setAttribute('d', pathData);
        }
        
        // Initialize the graph
        updateVoltageGraph();
        
        // Smooth moving sine wave animation from right to left
        let waveOffset = 0;
        function animateWave() {
            const voltage = parseFloat(voltageSlider.value);
            const amplitude = (voltage / 24) * 50;
            const centerY = 125;
            const startX = 50;
            const endX = 450;
            
            // Create a smooth sine wave using a single continuous path
            const frequency = 0.05; // Controls the frequency of the wave - made it stretchier
            const step = 5; // Smaller step for smoother curve
            
            let pathData = `M ${startX} ${centerY}`;
            
            // Generate the complete wave path using sine function
            for (let x = startX; x <= endX; x += step) {
                const y = centerY + amplitude * Math.sin((x - waveOffset) * frequency);
                if (x === startX) {
                    pathData = `M ${x} ${y}`;
                } else {
                    pathData += ` L ${x} ${y}`;
                }
            }
            
            voltageWave.setAttribute('d', pathData);
            
            // Move the wave from right to left continuously
            waveOffset += 3;
            if (waveOffset > 1000) waveOffset = 0; // Reset to prevent overflow
            
            requestAnimationFrame(animateWave);
        }
        
        // Start the animation
        animateWave();
    }
});