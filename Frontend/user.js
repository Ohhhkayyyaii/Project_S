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
const API_ENDPOINTS = {
  GET_PROJECTS: '/api/projects',
  GET_PROJECT: '/api/projects/{id}',
  LIKE_PROJECT: '/api/projects/{id}/like',
  VIEW_PROJECT: '/api/projects/{id}/view'
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
async function loadProjects() {
  showLoader();
  
  try {
    const response = await fetch(API_ENDPOINTS.GET_PROJECTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const projects = await response.json();
    console.log('Loaded projects:', projects);
    renderProjects(projects);
    
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

