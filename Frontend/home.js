document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.getElementById('preloader');
  const MIN_DISPLAY_TIME = 700; // 1.5 seconds
  const HIDE_DELAY = 500; // Matches your CSS transition time
  const start = Date.now();

  function hidePreloader() {
    const elapsed = Date.now() - start;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add('hidden');

      // Remove from DOM after animation completes
      setTimeout(() => {
        preloader.style.display = 'none';
      }, HIDE_DELAY);
    }, remainingTime);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);

    // Optional: Hide after max timeout (failsafe)
    setTimeout(hidePreloader, 4000);
  }
});

document.addEventListener('DOMContentLoaded', function () {

    // Get the toggle button and main header elements
    const container = document.querySelector('.container');
    const grid = document.querySelector('.grid-container');
    const projectHeading = document.querySelector('.project-heading');
    const explore = document.querySelector('.explore');
    const footer = document.querySelector('.footer');
    const toggler = document.querySelector('.toggler');
    const mainHeader = document.querySelector('.main-header');
    const showcase = document.querySelector('.showcase');
    const cardcontent = document.querySelector('.card-content');
    const blockbox = document.querySelector('.block-box');

    // Add click event listener to the toggle button
    toggler.addEventListener('click', function () {
        // Toggle the 'active' class on the main header and showcase
        mainHeader.classList.toggle('active');
        showcase.classList.toggle('active');
        container.classList.toggle('active');
        grid.classList.toggle('active');
        projectHeading.classList.toggle('active');
        explore.classList.toggle('active');
        footer.classList.toggle('active');
        cardcontent.classList.toggle('active');
        blockbox.classList.toggle('active');

        // Change the icon based on the state
        const icon = toggler.querySelector('i');
        if (mainHeader.classList.contains('active')) {
            icon.classList.remove('fa-bars-staggered');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars-staggered');
        }
    });

    // Close the sidebar when clicking outside of it on mobile
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768 &&
            mainHeader.classList.contains('active') &&
            !mainHeader.contains(event.target) &&
            !toggler.contains(event.target)) {
            mainHeader.classList.remove('active');
            showcase.classList.remove('active');
            container.classList.remove('active');
            grid.classList.remove('active');
            projectHeading.classList.remove('active');
            explore.classList.remove('active');
            footer.classList.remove('active');
                    blockbox.classList.toggle('active');


            const icon = toggler.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars-staggered');
        }
    });

    // Add event listeners for nav items to close sidebar on mobile when clicked
    const navItems = document.querySelectorAll('.nav-list-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                mainHeader.classList.remove('active');
                showcase.classList.remove('active');
                container.classList.remove('active');
                grid.classList.remove('active');
                projectHeading.classList.remove('active');
                explore.classList.remove('active');
                footer.classList.remove('active');
        cardcontent.classList.toggle('active');

                const icon = toggler.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });
});
// Mobile swipe functionality for slider
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  let isTransitioning = false;
  let touchStartX = 0;
  let touchEndX = 0;
  let normalSpeed = '20s';
  let fastSpeed = '5s';
  
  // Handle mobile swipe
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    if (isTransitioning) return;
    
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    // Determine swipe direction
    if (Math.abs(touchEndX - touchStartX) < 50) return; // Ignore small moves
    
    // Remove existing animation
    slider.style.animation = 'none';
    
    // Force reflow
    void slider.offsetWidth;
    
    // Fast rotation on swipe
    slider.style.animation = `rotate ${fastSpeed} linear infinite`;
    isTransitioning = true;
    
    // Return to normal speed after 1.5 seconds
    setTimeout(() => {
      slider.style.animation = `rotate ${normalSpeed} linear infinite`;
      isTransitioning = false;
    }, 1500);
  }
  
  // Add touch events for mobile
  if ('ontouchstart' in window) {
    slider.addEventListener('touchstart', handleTouchStart, false);
    slider.addEventListener('touchend', handleTouchEnd, false);
  }
});
// API endpoints (backend should provide these)
const API_ENDPOINTS = {
  GET_PROJECTS: '/api/projects',
  GET_PROJECT: '/api/projects/{id}',
  LIKE_PROJECT: '/api/projects/{id}/like',
  VIEW_PROJECT: '/api/projects/{id}/view'
};

// Fetch projects from backend
async function loadProjects() {
  try {
    showLoader();
    
    const response = await fetch(API_ENDPOINTS.GET_PROJECTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Backend might require authentication token
        // 'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const projects = await response.json();
    renderProjects(projects);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    showError('Failed to load projects. Please try again.');
  } finally {
    hideLoader();
  }
}

// Render projects data from backend
function renderProjects(projects) {
  const gridContainer = document.getElementById('projects-grid');
  gridContainer.innerHTML = ''; // Clear existing content
  
  projects.forEach(project => {
    const projectCard = createProjectCard(project);
    gridContainer.appendChild(projectCard);
  });
}

// Create project card HTML based on backend data
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'block';
  card.dataset.projectId = project.id;
  
  card.innerHTML = `
    <div class="card-content">
      <h2 class="card-title" data-field="title">${escapeHtml(project.title)}</h2>
      <h3 class="card-name" data-field="author">${escapeHtml(project.author_name)}</h3>
      <p class="card-description" data-field="description">
        ${escapeHtml(project.description)}
      </p>
      <div class="card-stats">
        <div class="stat">
          <span class="stat-value" data-field="likes">${project.likes_count}</span>
          <span class="stat-label">Likes</span>
        </div>
        <div class="stat">
          <span class="stat-value" data-field="views">${project.views_count}</span>
          <span class="stat-label">Views</span>
        </div>
      </div>
      <button class="read-more-btn" data-action="view-details" data-project-id="${project.id}">
        Read More
      </button>
    </div>
  `;
  
  return card;
}

// Utility function to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Event listeners for user actions
document.addEventListener('click', function(event) {
  if (event.target.matches('[data-action="view-details"]')) {
    const projectId = event.target.dataset.projectId;
    viewProjectDetails(projectId);
  }
});

// Load projects when page is ready
document.addEventListener('DOMContentLoaded', loadProjects);

// Show skeleton loader
function showSkeletonLoader() {
  const skeletonLoader = document.getElementById('skeleton-loader');
  const projectsGrid = document.getElementById('projects-grid');
  
  if (projectsGrid) projectsGrid.style.opacity = '0.5';
}

// Hide skeleton loader
function hideSkeletonLoader() {
  const skeletonLoader = document.getElementById('skeleton-loader');
  const projectsGrid = document.getElementById('projects-grid');
  
  if (projectsGrid) projectsGrid.style.opacity = '1';
}

// Example usage in your loadProjects function
async function loadProjects() {
  showSkeletonLoader(); // Show loader before fetching
  
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    
    // Render your projects here...
    renderProjects(projects);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    // Show error state
  } finally {
    hideSkeletonLoader(); // Hide loader when done
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Your existing code...
  
  // Load projects after a short delay to show the skeleton effect
  setTimeout(loadProjects, 1000);
});

// Simple version - check if backend is available
async function loadProjects() {
  showSkeletonLoader();
  
  try {
    // Test if backend endpoint exists
    const testResponse = await fetch('/api/test', {
      method: 'HEAD',
      signal: AbortSignal.timeout(2000)
    });
    
    // If backend is available, fetch real data
    const response = await fetch('/api/projects');
    const projects = await response.json();
    renderProjects(projects);
    
  } catch (error) {
    console.log('Backend not available, using fallback content');
    // Backend not available - show demo content after short delay
    setTimeout(() => {
      hideSkeletonLoader();
    }, 1500);
  } finally {
    hideSkeletonLoader();
  }
}
// Add to your existing JavaScript
// API endpoint for ratings
API_ENDPOINTS.RATE_PROJECT = '/api/projects/{id}/rate';

// Rating functionality
document.addEventListener('click', async function(e) {
  // Handle rating option clicks
  if (e.target.closest('.rating-option')) {
    const ratingOption = e.target.closest('.rating-option');
    const ratingValue = parseInt(ratingOption.dataset.value);
    const ratingContainer = ratingOption.closest('.rating-container');
    const projectId = ratingContainer.dataset.projectId;
    
    // Visual feedback
    document.querySelectorAll('.rating-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    ratingOption.classList.add('selected');
    
    // Send rating to backend
    try {
      const response = await fetch(API_ENDPOINTS.RATE_PROJECT.replace('{id}', projectId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ rating: ratingValue })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update rating display
        const ratingValueEl = ratingContainer.querySelector('.rating-value');
        const ratingCountEl = ratingContainer.querySelector('.rating-count');
        
        ratingValueEl.textContent = result.average_rating;
        ratingCountEl.textContent = `(${result.rating_count})`;
        
        // Show success feedback
        ratingContainer.querySelector('.rating-icon').style.color = '#4caf50';
        setTimeout(() => {
          ratingContainer.querySelector('.rating-icon').style.color = '#fdbb2d';
        }, 1000);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      ratingOption.classList.remove('selected');
    }
  }
});

// Close rating popup when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.rating-container')) {
    document.querySelectorAll('.rating-popup').forEach(popup => {
      popup.style.display = 'none';
    });
  }
});

// Initialize user's previous rating if any
function initializeRatings() {
  document.querySelectorAll('.rating-container').forEach(container => {
    const projectId = container.dataset.projectId;
    
    // Check if user has already rated this project
    const userRating = localStorage.getItem(`rating_${projectId}`);
    if (userRating) {
      const ratingOption = container.querySelector(`.rating-option[data-value="${userRating}"]`);
      if (ratingOption) {
        ratingOption.classList.add('selected');
      }
    }
  });
}

// Call this on page load
document.addEventListener('DOMContentLoaded', initializeRatings);

// Add event listeners for login and create account buttons
document.addEventListener('DOMContentLoaded', function() {
  // Login button
  const loginBtn = document.querySelector('.login');
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Login button clicked');
      window.location.href = './login.htm';
    });
  } else {
    console.log('Login button not found');
  }

  // Create account button
  const createAccountBtn = document.querySelector('.create-account');
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Create account button clicked');
      window.location.href = './signup.htm';
    });
  } else {
    console.log('Create account button not found');
  }
});

// Alternative approach - use event delegation
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('login')) {
    e.preventDefault();
    console.log('Login button clicked (delegation)');
    window.location.href = './login.htm';
  }
  
  if (e.target.classList.contains('create-account')) {
    e.preventDefault();
    console.log('Create account button clicked (delegation)');
    window.location.href = './signup.htm';
  }
});