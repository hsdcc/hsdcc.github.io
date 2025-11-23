document.addEventListener('DOMContentLoaded', () => {
  const animatedText = document.getElementById('animated-text');
  
  // Track mouse movement for text to subtly follow cursor
  document.addEventListener('mousemove', (e) => {
    // Calculate the position relative to the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate how far the cursor is from the center (normalized) - reduced movement by 35%
    const moveX = (e.clientX - centerX) / 92; // Less movement (35% less than previous)
    const moveY = (e.clientY - centerY) / 92; // Less movement (35% less than previous)
    
    // Apply a subtle movement to the text based on cursor position
    animatedText.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
  
  // Reset text position when mouse leaves the window
  document.addEventListener('mouseleave', () => {
    animatedText.style.transform = 'translate(0, 0)';
  });
});