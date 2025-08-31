document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const MIN_DISPLAY_TIME = 700;
    const HIDE_DELAY = 500;
    const start = Date.now();

    function hidePreloader() {
      const elapsed = Date.now() - start;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, HIDE_DELAY);
      }, remainingTime);
    }

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      setTimeout(hidePreloader, 4000);
    }
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

  // Add click event listener to the toggle button
  if (toggler) {
    toggler.addEventListener('click', function () {
      // Toggle the 'active' class on the main header and showcase
      if (mainHeader) mainHeader.classList.toggle('active');
      if (showcase) showcase.classList.toggle('active');
      if (container) container.classList.toggle('active');
      if (grid) grid.classList.toggle('active');
      if (projectHeading) projectHeading.classList.toggle('active');
      if (explore) explore.classList.toggle('active');
      if (footer) footer.classList.toggle('active');

      // Change the icon based on the state
      const icon = toggler.querySelector('i');
      if (icon && mainHeader) {
        if (mainHeader.classList.contains('active')) {
          icon.classList.remove('fa-bars-staggered');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars-staggered');
        }
      }
    });
  }

  // Close the sidebar when clicking outside of it on mobile
  document.addEventListener('click', function (event) {
    if (window.innerWidth <= 768 &&
        mainHeader && mainHeader.classList.contains('active') &&
        !mainHeader.contains(event.target) &&
        !toggler.contains(event.target)) {
      mainHeader.classList.remove('active');
      if (showcase) showcase.classList.remove('active');
      if (container) container.classList.remove('active');
      if (grid) grid.classList.remove('active');
      if (projectHeading) projectHeading.classList.remove('active');
      if (explore) explore.classList.remove('active');
      if (footer) footer.classList.remove('active');

      const icon = toggler.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars-staggered');
      }
    }
  });

  // Add event listeners for nav items to close sidebar on mobile when clicked
  const navItems = document.querySelectorAll('.nav-list-item');
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        if (mainHeader) mainHeader.classList.remove('active');
        if (showcase) showcase.classList.remove('active');
        if (container) container.classList.remove('active');
        if (grid) grid.classList.remove('active');
        if (projectHeading) projectHeading.classList.remove('active');
        if (explore) explore.classList.remove('active');
        if (footer) footer.classList.remove('active');

        const icon = toggler.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars-staggered');
        }
      }
    });
  });
});

// Mobile swipe functionality for slider
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  
  let isTransitioning = false;
  let touchStartX = 0;
  let touchEndX = 0;
  let normalSpeed = '20s';
  let fastSpeed = '5s';
  
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    if (isTransitioning) return;
    
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    if (Math.abs(touchEndX - touchStartX) < 50) return;
    
    slider.style.animation = 'none';
    void slider.offsetWidth;
    slider.style.animation = `rotate ${fastSpeed} linear infinite`;
    isTransitioning = true;
    
    setTimeout(() => {
      slider.style.animation = `rotate ${normalSpeed} linear infinite`;
      isTransitioning = false;
    }, 1500);
  }
  
  if ('ontouchstart' in window) {
    slider.addEventListener('touchstart', handleTouchStart, false);
    slider.addEventListener('touchend', handleTouchEnd, false);
  }
});

// API endpoints
// CHANGED: Updated all endpoints to use full localhost:5000 URLs for backend integration
const API_ENDPOINTS = {
  GET_PROJECTS: 'http://localhost:5000/api/projects',
  GET_PROJECT: 'http://localhost:5000/api/projects/{id}',
  LIKE_PROJECT: 'http://localhost:5000/api/projects/{id}/like',
  VIEW_PROJECT: 'http://localhost:5000/api/projects/{id}/view'
};

// CHANGED: Added pagination and sorting parameters
const DEFAULT_PARAMS = {
  limit: 10,
  page: 1,
  sort: 'createdAt',
  order: 'desc'
};

// Utility functions
function showLoader() {
  console.log('Loading projects...');
}

function hideLoader() {
  console.log('Loading complete');
}

function showError(message) {
  console.error('Error:', message);
}

function viewProjectDetails(projectId) {
  console.log('Viewing project:', projectId);
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Render projects data from backend
function renderProjects(projects) {
  const gridContainer = document.getElementById('projects-grid');
  if (!gridContainer) {
    console.log('Projects grid container not found');
    return;
  }
  
  gridContainer.innerHTML = '';
  
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
          <span class="stat-value" data-field="likes">${project.likes_count || 0}</span>
          <span class="stat-label">Likes</span>
        </div>
        <div class="stat">
          <span class="stat-value" data-field="views">${project.views_count || 0}</span>
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

// Main loadProjects function
async function loadProjects(params = {}) {
  showLoader();
  
  try {
    // CHANGED: Add query parameters for pagination and sorting
    const queryParams = new URLSearchParams({
      ...DEFAULT_PARAMS,
      ...params
    });
    
    const url = `${API_ENDPOINTS.GET_PROJECTS}?${queryParams}`;
    console.log('Fetching projects from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Loaded projects:', result);
    
    // CHANGED: Handle new backend response structure with { data, meta }
    const projects = result.data || result; // Backward compatibility
    const meta = result.meta || null;
    
    renderProjects(projects);
    
    // Log pagination info if available
    if (meta && meta.pagination) {
      console.log('Pagination info:', meta.pagination);
    }
    
  } catch (error) {
    console.error('Error loading projects:', error);
    showError('Failed to load projects. Please try again.');
  } finally {
    hideLoader();
  }
}

// Event listeners for user actions
document.addEventListener('click', function(event) {
  if (event.target.matches('[data-action="view-details"]')) {
    const projectId = event.target.dataset.projectId;
    viewProjectDetails(projectId);
  }
});

// Load projects when page is ready
document.addEventListener('DOMContentLoaded', function() {
  // Load projects after a short delay
  setTimeout(loadProjects, 1000);
});

<<<<<<< HEAD
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
=======
>>>>>>> 32bfa8389976ddaea10770b7053f4fb642773d64
