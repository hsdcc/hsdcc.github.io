document.addEventListener('DOMContentLoaded', () => {
  const animatedText = document.getElementById('animated-text');
  const blobsContainer = document.querySelector('.blobs-container');
  
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
  
  // Function to generate random blobs with minimal overlap
  function createRandomBlobs(count = 8) {
    const colors = [
      'rgba(255, 99, 132, 0.4)', // pink
      'rgba(132, 99, 255, 0.4)', // purple
      'rgba(99, 255, 132, 0.4)', // green
      'rgba(99, 132, 255, 0.4)', // blue
      'rgba(255, 218, 99, 0.4)', // yellow
      'rgba(255, 99, 255, 0.4)', // magenta
      'rgba(99, 255, 255, 0.4)', // cyan
      'rgba(255, 159, 67, 0.4)'  // orange
    ];
    
    const blobs = [];
    
    for (let i = 0; i < count; i++) {
      // Random size for each blob
      const size = Math.floor(Math.random() * 150) + 100; // Between 100px and 250px
      
      // Random position with safe margins
      let x, y;
      let positionOk = false;
      let attempts = 0;
      
      // Try to find a position that doesn't overlap too much with others
      while (!positionOk && attempts < 50) {
        x = Math.random() * (window.innerWidth - size);
        y = Math.random() * (window.innerHeight - size);
        
        positionOk = true;
        
        // Check for overlap with existing blobs
        for (const blob of blobs) {
          const dx = Math.abs(blob.x - x);
          const dy = Math.abs(blob.y - y);
          const minDistance = (blob.size + size) / 2; // Minimum safe distance
          
          if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
            positionOk = false;
            break;
          }
        }
        
        attempts++;
      }
      
      // If we couldn't find a good position after 50 attempts, just place it anywhere
      if (!positionOk) {
        x = Math.random() * (window.innerWidth - size);
        y = Math.random() * (window.innerHeight - size);
      }
      
      // Create the blob element
      const blob = document.createElement('div');
      blob.classList.add('blob');
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      blob.style.left = `${x}px`;
      blob.style.top = `${y}px`;
      blob.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent 70%)`;
      blob.style.animationDelay = `${Math.random() * 5}s`; // Random animation delay
      
      // Add to the container
      blobsContainer.appendChild(blob);
      
      // Store blob info for overlap checking
      blobs.push({ x: x + size/2, y: y + size/2, size: size });
    }
  }
  
  // Create the random blobs
  createRandomBlobs(8);
  
  // Handle window resize to recreate blobs
  window.addEventListener('resize', () => {
    // Remove existing blobs
    while (blobsContainer.firstChild) {
      blobsContainer.removeChild(blobsContainer.firstChild);
    }
    
    // Create new blobs
    createRandomBlobs(8);
  });
});