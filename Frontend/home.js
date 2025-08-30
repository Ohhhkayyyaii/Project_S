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
document.addEventListener('DOMContentLoaded', () => {
  // Select the content element
  const contentText = document.querySelector('.content-text');

  // Add a delay of 2 seconds before making the content visible
  setTimeout(() => {
    contentText.classList.add('visible');
  }, 500); // 2-second delay
});

document.addEventListener('DOMContentLoaded', function () {

    // Get the toggle button and main header elements
    const container = document.querySelector('.container');
    const grid = document.querySelector('.grid-container');
    const projectHeading = document.querySelector('.project-heading');
    const explore = document.querySelector('.explore');
    const footer = document.querySelector('.footer');
    const footercontent = document.querySelector('.footer-content');
    const toggler = document.querySelector('.toggler');
    const mainHeader = document.querySelector('.main-header');
    const showcase = document.querySelector('.showcase');
    const cardcontent = document.querySelectorAll('.card-content');
    const blockBoxes = document.querySelectorAll('.block-box'); // Select all block-box elements

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
        footercontent.classList.toggle('active');
        
        // This will toggle 'active' on each block-box when toggler is clicked
        blockBoxes.forEach(block => {
            block.classList.toggle('active');
        });
         cardcontent.forEach(content => {
            content.classList.toggle('active');
        });
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
            footercontent.classList.remove('active');
                    // blackbox.classList.toggle('active');


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
                footercontent.classList.remove('active');
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
  document.getElementById('skeleton-loader').classList.add('visible');
  document.getElementById('projects-grid').classList.add('hidden');
}

// Hide skeleton loader
function hideSkeletonLoader() {
  document.getElementById('skeleton-loader').classList.remove('visible');
  document.getElementById('projects-grid').classList.remove('hidden');
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
    // Backend not available - show demo content after short delay
    setTimeout(() => {
      showFallbackContent();
    }, 1500); // Show after 1.5s to make skeleton visible
  } finally {
    hideSkeletonLoader();
  }
}
document.addEventListener('DOMContentLoaded', function() {
    // Handle rating clicks
    document.addEventListener('click', function(e) {
        // Check if a rating option was clicked
        if (e.target.classList.contains('rating-option')) {
            const ratingValue = e.target.dataset.value;
            const container = e.target.closest('.rating-container');
            const projectId = container.dataset.projectId;
            
            // Send rating to backend
            fetch(`/api/projects/${projectId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: ratingValue })
            })
            .then(response => response.json())
            .then(data => {
                // Update the displayed rating
                container.querySelector('.rating-value').textContent = data.average_rating;
                container.querySelector('.rating-count').textContent = `(${data.rating_count})`;
                
                // Highlight the selected rating
                document.querySelectorAll('.rating-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.target.classList.add('selected');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
        // Show rating options when clicking the star area
        if (e.target.closest('.current-rating')) {
            const container = e.target.closest('.rating-container');
            const popup = container.querySelector('.rating-popup');
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        }
    });
    
    // Close popups when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.rating-container')) {
            document.querySelectorAll('.rating-popup').forEach(popup => {
                popup.style.display = 'none';
            });
        }
    });
});