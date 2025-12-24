document.addEventListener('DOMContentLoaded', () => {
  const animatedText = document.getElementById('animated-text');
  const blobsContainer = document.querySelector('.blobs-container');
  const glassBackground = document.querySelector('.glass-background');
  const timerUI = document.getElementById('timer-ui');
  
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
  
  // Initialize timer variables
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let currentMode = 'pomodoro'; // 'pomodoro', 'short-break', 'long-break'

// Get UI elements
const timerDisplay = document.getElementById('minutes');
const timerSeconds = document.getElementById('seconds');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const workDurationInput = document.getElementById('work-duration');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');

// Get minimal timer elements
const minimalTimer = document.getElementById('minimal-timer');
const minimalMinutes = document.getElementById('minimal-minutes');
const minimalSeconds = document.getElementById('minimal-seconds');
const stopTimerBtn = document.getElementById('stop-timer-btn');

// Toggle between hsd text and timer UI when clicking on the hsd text
animatedText.addEventListener('click', () => {
  // Animate the hsd text out but keep the background
  animatedText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  animatedText.style.opacity = '0';
  animatedText.style.transform = 'scale(0.8)';
  
  // After the animation completes, hide the text completely
  setTimeout(() => {
    animatedText.style.display = 'none';
    
    // Show the timer UI with animation (settings panel)
    timerUI.classList.add('active');
  }, 300);
});

// Allow clicking outside the timer panel to return to hsd text
timerUI.addEventListener('click', (e) => {
  if (e.target === timerUI) {  // Clicked on the container, not inside it
    timerUI.classList.remove('active');
    
    setTimeout(() => {
      animatedText.style.display = 'block';
      animatedText.style.opacity = '0';
      animatedText.style.transform = 'scale(0.8)';
      
      // Animate the hsd text back in
      setTimeout(() => {
        animatedText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        animatedText.style.opacity = '1';
        animatedText.style.transform = 'scale(1)';
      }, 10);
    }, 300);
  }
});

// Update the display with current time
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = String(minutes).padStart(2, '0');
  timerSeconds.textContent = String(seconds).padStart(2, '0');
  
  // Update minimal display if timer is running
  if (isRunning) {
    minimalMinutes.textContent = String(minutes).padStart(2, '0');
    minimalSeconds.textContent = String(seconds).padStart(2, '0');
  }
}

// Start or pause the timer
function startPauseTimer() {
  if (isRunning) {
    // Pause the timer
    clearInterval(timerInterval);
    startPauseBtn.textContent = 'Start';
    isRunning = false;
    
    // Hide minimal timer display
    timerUI.classList.remove('active');
    minimalTimer.classList.remove('active');
  } else {
    // Start the timer
    if (timeLeft > 0) {
      // Show minimal timer display and hide full panel
      timerUI.classList.remove('active');
      minimalTimer.classList.add('active');
      
      timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          startPauseBtn.textContent = 'Start';
          isRunning = false;
          
          // Hide minimal timer display
          minimalTimer.classList.remove('active');
          
          // Play a sound or show notification when timer completes
          alert(`Time's up! ${currentMode === 'pomodoro' ? 'Take a break!' : 'Time to work!'}`);
          
          // Option to auto-switch between work and break in pomodoro mode
          if (currentMode === 'pomodoro') {
            // After a work session, automatically switch to short break
            setTimeout(() => {
              switchMode('short-break');
              startPauseTimer(); // Automatically start the break
            }, 1000);
          } else if (currentMode === 'short-break' || currentMode === 'long-break') {
            // After a break session, automatically switch back to work
            setTimeout(() => {
              switchMode('pomodoro');
              startPauseTimer(); // Automatically start the work session
            }, 1000);
          }
        }
      }, 1000);
      
      startPauseBtn.textContent = 'Pause';
      isRunning = true;
    }
  }
}

// Reset the timer to current mode's initial time
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  
  // Set time based on current mode
  switch(currentMode) {
    case 'pomodoro':
      timeLeft = parseInt(workDurationInput.value) * 60;
      break;
    case 'short-break':
      timeLeft = parseInt(shortBreakInput.value) * 60;
      break;
    case 'long-break':
      timeLeft = parseInt(longBreakInput.value) * 60;
      break;
  }
  
  updateDisplay();
}

// Switch between different timer modes
function switchMode(mode) {
  // Update active button
  pomodoroBtn.classList.remove('active');
  shortBreakBtn.classList.remove('active');
  longBreakBtn.classList.remove('active');
  
  currentMode = mode;
  
  // Set the active class on the current button
  if (mode === 'pomodoro') {
    pomodoroBtn.classList.add('active');
  } else if (mode === 'short-break') {
    shortBreakBtn.classList.add('active');
  } else if (mode === 'long-break') {
    longBreakBtn.classList.add('active');
  }
  
  // Reset timer to the new mode's time
  resetTimer();
}

// Event listeners for buttons
startPauseBtn.addEventListener('click', startPauseTimer);
resetBtn.addEventListener('click', resetTimer);

pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => switchMode('short-break'));
longBreakBtn.addEventListener('click', () => switchMode('long-break'));

// Event listeners for duration inputs
workDurationInput.addEventListener('change', function() {
  if (currentMode === 'pomodoro') {
    resetTimer();
  }
});

shortBreakInput.addEventListener('change', function() {
  if (currentMode === 'short-break') {
    resetTimer();
  }
});

longBreakInput.addEventListener('change', function() {
  if (currentMode === 'long-break') {
    resetTimer();
  }
});

// Stop timer button functionality
stopTimerBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
  startPauseBtn.textContent = 'Start';
  minimalTimer.classList.remove('active');
  
  // Show the timer settings UI (main menu)
  timerUI.classList.add('active');
  
  // Reset to initial values based on current mode
  switch(currentMode) {
    case 'pomodoro':
      timeLeft = parseInt(workDurationInput.value) * 60;
      break;
    case 'short-break':
      timeLeft = parseInt(shortBreakInput.value) * 60;
      break;
    case 'long-break':
      timeLeft = parseInt(longBreakInput.value) * 60;
      break;
  }
  
  updateDisplay();
});

// Initialize the timer display
updateDisplay();
});