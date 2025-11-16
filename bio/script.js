const apply3dEffect = (element, strength = 20) => {
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const lerp = (start, end, t) => {
        return start * (1 - t) + end * t;
    };

    element.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth: width, offsetHeight: height } = element;
        const { left, top } = element.getBoundingClientRect();

        const mouseX = clientX - left;
        const mouseY = clientY - top;

        target.x = (mouseY / height - 0.5) * -strength;
        target.y = (mouseX / width - 0.5) * strength;
    });

    element.addEventListener('mouseleave', () => {
        target.x = 0;
        target.y = 0;
    });

    const animate = () => {
        current.x = lerp(current.x, target.x, 0.1);
        current.y = lerp(current.y, target.y, 0.1);

        const roundedX = Math.round(current.x * 100) / 100;
        const roundedY = Math.round(current.y * 100) / 100;

        const scale = 1.05;

        element.style.transform = `perspective(1000px) rotateX(${roundedX}deg) rotateY(${roundedY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        requestAnimationFrame(animate);
    };

    animate();
};

// separate function for the movement animation with text
const applyMoveEffect = (element, textElement) => {
    let targetTranslationX = 0;
    let currentTranslationX = 0;
    let isMoved = false;

    const lerp = (start, end, t) => {
        return start * (1 - t) + end * t;
    };

    // add click event to toggle position
    element.addEventListener('click', () => {
        isMoved = !isMoved;
        targetTranslationX = isMoved ? -80 : 0;  // change -100 to your desired distance
        
        // set target opacity based on movement state for fast fade-in
        if (textElement) {
            textElement.targetOpacity = isMoved ? 1 : 0;
            textElement.currentOpacity = textElement.targetOpacity;
            textElement.style.opacity = textElement.targetOpacity;
            
            // reset text animation when it appears
            if (isMoved) {
                textElement.textAnimationProgress = 0;
            }
        }
        
        // adjust z-index when moving to act like a focused window
        element.style.zIndex = isMoved ? '10' : 'auto';
    });

    const animate = () => {
        currentTranslationX = lerp(currentTranslationX, targetTranslationX, 0.05); // slower for smoother animation

        const roundedTranslationX = Math.round(currentTranslationX * 100) / 100;

        element.style.transform = `translateX(${roundedTranslationX}px)`;

        // animate text opacity separately for fast fade
        if (textElement) {
            // if target opacity is set, animate towards it quickly
            if (typeof textElement.targetOpacity !== 'undefined') {
                textElement.currentOpacity = lerp(textElement.currentOpacity || 0, textElement.targetOpacity, 0.3);
                textElement.style.opacity = textElement.currentOpacity.toFixed(2);
                
                // if we've reached target opacity, stop animating
                if (Math.abs(textElement.currentOpacity - textElement.targetOpacity) < 0.01) {
                    textElement.currentOpacity = textElement.targetOpacity;
                    textElement.style.opacity = textElement.targetOpacity;
                }
            }
            
            // position the text to create the effect of appearing at the original logo position and moving right
            // when logo is at original position and not moved: text invisible
            // when logo starts moving left: text appears at original logo position (0px from start) and moves right to 170px
            // the text movement should be independent of the logo position after it appears
            
            // animate text position when it's appearing, moving same distance as logo but to the right
            if (textElement.targetOpacity === 1 && textElement.currentOpacity > 0.1) {
                // calculate the target text position based on logo position
                const targetTextPosition = -roundedTranslationX * 0.25; // when logo is at -60, this becomes +15
                
                // update current text position with faster animation
                textElement.currentTextPosition = textElement.currentTextPosition || 0;
                textElement.currentTextPosition = lerp(textElement.currentTextPosition, targetTextPosition, 0.4); // much faster than logo's 0.05
                
                textElement.style.transform = `translateX(${textElement.currentTextPosition}px)`;
            } else if (textElement.targetOpacity === 0) {
                // reset text position when hiding
                textElement.currentTextPosition = 0;
                textElement.style.transform = 'translateX(0px)';
            }
        }

        requestAnimationFrame(animate);
    };

    animate();
};

const glassContainer = document.querySelector('.glass-container');
const logo = document.querySelector('.logo');
const logoContainer = document.querySelector('.logo-container');
const logoText = document.querySelector('.logo-text');

apply3dEffect(glassContainer, 30);
apply3dEffect(logo, 45);  // apply 3d effect to logo
applyMoveEffect(logoContainer, logoText);  // apply movement effect to container with text
