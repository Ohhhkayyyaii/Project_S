document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.getElementById('preloader');
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
});

document.addEventListener('DOMContentLoaded', function () {
    const toggler = document.querySelector('.toggler');
    const mainHeader = document.querySelector('.main-header');
    const showcase = document.querySelector('.showcase');
    const grid = document.querySelector('.grid-container');
    const projectHeading = document.querySelector('.project-heading');
    const footer = document.querySelector('.footer');
    const footercontent = document.querySelector('.footer-content');
    const navitems = document.querySelectorAll('.nav-list-item');

    toggler.addEventListener('click', function () {
        mainHeader.classList.toggle('active');
        showcase.classList.toggle('active');
        grid.classList.toggle('active');
        projectHeading.classList.toggle('active');
        footer.classList.toggle('active');
        footercontent.classList.toggle('active');
        navitems.forEach(item => item.classList.toggle('active'));
       
        const icon = toggler.querySelector('i');
        if (mainHeader.classList.contains('active')) {
            icon.classList.remove('fa-bars-staggered');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars-staggered');
        }
    });

    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768 &&
            mainHeader.classList.contains('active') &&
            !mainHeader.contains(event.target) &&
            !toggler.contains(event.target)) {
            mainHeader.classList.remove('active');
            showcase.classList.remove('active');
            grid.classList.remove('active');
            projectHeading.classList.remove('active');
            footer.classList.remove('active');
            footercontent.classList.remove('active');
            navitems.forEach(item => item.classList.remove('active'));

            const icon = toggler.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars-staggered');
        }
    });

    const navItems = document.querySelectorAll('.nav-list-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                mainHeader.classList.remove('active');
                showcase.classList.remove('active');
                grid.classList.remove('active');
                projectHeading.classList.remove('active');
                footer.classList.remove('active');
                footercontent.classList.remove('active');
                navitems.forEach(item => item.classList.remove('active'));

                const icon = toggler.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });
});

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const API_ENDPOINTS = {
  GET_PROJECTS: `${API_BASE_URL}/projects`,
  GET_PROJECT: `${API_BASE_URL}/projects/{id}`,
  RATE_PROJECT: `${API_BASE_URL}/projects/{id}/rate`,
  LIKE_PROJECT: `${API_BASE_URL}/projects/{id}/like`,
  VIEW_PROJECT: `${API_BASE_URL}/projects/{id}/view`
};

// Load projects from backend
async function loadProjects() {
  try {
    showLoader();
    
    const response = await fetch(API_ENDPOINTS.GET_PROJECTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const projects = result.data || result;
    renderProjects(projects);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    showError('Failed to load projects. Please try again.');
    showFallbackProjects();
  } finally {
    hideLoader();
  }
}

// Render projects from backend data
function renderProjects(projects) {
  const gridContainer = document.getElementById('projects-grid');
  gridContainer.innerHTML = '';
  
  if (!projects || projects.length === 0) {
    gridContainer.innerHTML = '<div class="no-projects">No projects available yet.</div>';
    return;
  }
  
  projects.forEach(project => {
    const projectCard = createProjectCard(project);
    gridContainer.appendChild(projectCard);
  });
}

// Create project card HTML
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'block';
  card.dataset.projectId = project.id || project._id;
  
  const avgRating = project.avgRating || (project.ratingCount > 0 ? (project.ratingSum / project.ratingCount).toFixed(1) : 0);
  const ratingCount = project.ratingCount || 0;
  const likesCount = project.likes_count || 0;
  const viewsCount = project.views_count || 0;
  
  card.innerHTML = `
    <div class="card-content">
      <div class="image" data-field="image_url" style="background-image: url('${project.imageUrl || './images/4.web.png'}');">
      </div>

      <div class="grid-content">
        <div class="title-content" data-field="title">${escapeHtml(project.title)}</div>

        <div class="user-info">
          <div class="user-img" data-field="user_avatar"
            style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALsAAACUCAMAAAD8tKi7AAAAM1BMVEXk5ueutLeor7LV2Nrn6eqrsbXq7O22u77a3d7h4+TKztDHy83CxsmzuLvR1NalrLC8wcPnKtRzAAAEoUlEQVR4nO2c23KtIAxAFcIdkf//2oPu3dbu7lYu0eAc11On04fVTAwIicNwc3Nzc3PzXwBSgtEhwfXyM7VPPoY7xeaZrcyzUE6b9P9Qa+0Bgw5+ZGL8BptHH0zf9iC5n8SL+AMhlNfQr73UcXwr/tQfo5bUju+Bwf9l/gi+7zLywAX72/xhr7uzB+MyzFd7Z/qyBx130mUjHw217hbQU7Z6kp86yhvQBeYLrJu0AT2XqafQdxL54qivaGrthZTrFepC9fDAmvwK800+0mcN5Nb1V5ij3h8AL35OP5g5beRhqEqYBxOp+iB9g7twlIEHXm++BJ4ya6CuxnwG3hOqh6awJzidfFvYSQOvW8OeNmVE6uAaw065QDWHPWUNjTvwyt3AFkZTJmXrk7oSSQIvEcKeoFAfNI47RYmXFiNlxpFiUyMVijrJOwigqNOc1hgc91ERvHXzmlfsNxAcNLXvIT8I57vbC7s7JHVhT3eX/rrucLsv7merXzpn5IWf1UvXyAuvTXh7AoK3Pry92PnuV94DX/ndA6vAkxxk47xrTyTHqVc+47jy2RIEjDM9gpVpwSDEfSY6B4aWi7IHwlOdYfP283eym/nK6/hN2COVevteUhDelRnVdkdJ2X0FoS1pSDsKmtYn4mZJaKrxxF1jYKsX15loSd0QK+UFzU5mC1TWGqGozYflmrXqpXvqo1GvamtAuCptgVDe20n/nD6RtlC+gxLzSWHvleDkJWYD8PxqIyhu9v4CdG6dZ76TPuYvYLDvB2xegs54j6NCoNVu6FkXLcxvAMl/GW56xnxUvc4IJQBs/HU2a4yh49msYUl7bqN4nYlLv1Cuy0T/DgxGBz8to4gisQwjTjHozqf5tiwzidY5ZwPXi/VlxJfE/w61Tw6rpzFGa80/SD+n3wxd/wuwjgpb531UaprW2rI+s5NSKnpnbUof2V2RBClNqi/JcRX+USXF85fL/8AN9DMDnVS4e4R5b1ld/2Qp9EMH+slAWzW/1vM9lhlobii3BwApURSrOycQbPRBE9VOSJny54jzvr6YfDDnZ48cQsxJ8D39UTlzbumBAasDZYn+iRPoafHxM04v8JNZ8VOOJgG0G3FuVjewGI63B+MmdPNxzRx+7J4hvVuUDGaX2U/xyKdW6rY7mj378bDWsVRcquc9M2EHNQIB3z8GaEfYI3YKtmkNzZeP2KGH5tG9fPkR97QSsBrbsmCorUyN16jF8hFvoUJrQc1FYMkjjEuWyysU+aZx8nr5CeG1BKHBp1K+PfIECfOUb00bvE7xCvm2DpXG7w+0yrf1eZyzD/gNZutXWInU4l4vX90cRFViNkyVKU+b7A9qP77Q2MiGRF3PBNJMcyNVl5pVX6/Ch7lydZwOcQTm4sBXfO/sIMr7ymQXD+qKKNzX1H2r7SAK+8xlpBbeUNgWV/WducMoOi6j3Pr+pGwzbOh3MltKPmEAGmfeDQsWClKmfZADlaKkqf024WHkuzfPoGAz51fJU08fcyhIeNPLXuYDkb+ZxPj4Fi4qe1tQPwdxGNnu/vnJ/H6Ysxenr36pbshV/9mqRk+++83NTW/8A+01RORg7LJmAAAAAElFTkSuQmCC');">
          </div>
          <div class="user-name" data-field="username">${escapeHtml(project.author_name || 'Anonymous')}</div>
        </div>

        <div class="about" data-field="description">${escapeHtml(project.description)}</div>

        <div class="like-views">
          <div class="likes" data-field="likes_count" data-project-id="${project.id || project._id}">
            <i class="far fa-heart like-icon"></i>
            <span class="likes-count">${likesCount}</span>
          </div>

          <div class="views" data-field="views_count" data-project-id="${project.id || project._id}">
            <i class="far fa-eye view-icon"></i>
            <span class="views-count">${viewsCount}</span>
          </div>
        </div>
        
        <div class="rating-container" data-project-id="${project.id || project._id}">
          <div class="current-rating" data-field="rating">
            <i class="fas fa-star rating-icon"></i>
            <span class="rating-value">${avgRating}</span>
            <span class="rating-count">(${ratingCount})</span>
          </div>

          <div class="rating-popup">
            <div class="rating-options">
              <span class="rating-option" data-value="1">1</span>
              <span class="rating-option" data-value="2">2</span>
              <span class="rating-option" data-value="3">3</span>
              <span class="rating-option" data-value="4">4</span>
              <span class="rating-option" data-value="5">5</span>
              <span class="rating-option" data-value="6">6</span>
              <span class="rating-option" data-value="7">7</span>
              <span class="rating-option" data-value="8">8</span>
              <span class="rating-option" data-value="9">9</span>
              <span class="rating-option" data-value="10">10</span>
            </div>
            <div class="rating-label">Rate this project</div>
          </div>
        </div>
      </div>
    </div>

    <button class="view-project-btn" data-action="view-details" data-project-id="${project.id || project._id}">
      View
    </button>
  `;
  
  return card;
}

// Show fallback projects when backend is not available
function showFallbackProjects() {
  const fallbackProjects = [
    {
      id: 'demo1',
      title: 'Sample Project 1',
      description: 'This is a sample project description. It showcases the project features and technologies used.',
      author_name: 'Demo User',
      avgRating: 4.5,
      ratingCount: 12,
      likes_count: 25,
      views_count: 150,
      imageUrl: './images/4.web.png'
    },
    {
      id: 'demo2', 
      title: 'Sample Project 2',
      description: 'Another sample project to demonstrate the platform functionality.',
      author_name: 'Demo User',
      avgRating: 4.2,
      ratingCount: 8,
      likes_count: 18,
      views_count: 95,
      imageUrl: './images/4.web.png'
    }
  ];
  
  renderProjects(fallbackProjects);
}

// Utility functions
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showLoader() {
  const gridContainer = document.getElementById('projects-grid');
  if (gridContainer) {
    gridContainer.style.opacity = '0.5';
  }
}

function hideLoader() {
  const gridContainer = document.getElementById('projects-grid');
  if (gridContainer) {
    gridContainer.style.opacity = '1';
  }
}

function showError(message) {
  console.error(message);
}

// Event listeners for project interactions
document.addEventListener('click', async function(e) {
  // Handle likes
  if (e.target.closest('.likes')) {
    const likeElement = e.target.closest('.likes');
    const projectId = likeElement.dataset.projectId;
    const likeIcon = likeElement.querySelector('.like-icon');
    const likeCount = likeElement.querySelector('.likes-count');
    
    // Immediate UI feedback
    likeElement.classList.toggle('active');
    const isLiked = likeElement.classList.contains('active');
    likeIcon.classList.toggle('fas', isLiked);
    likeIcon.classList.toggle('far', !isLiked);
    
    // Update count optimistically
    const currentLikes = parseInt(likeCount.textContent) || 0;
    likeCount.textContent = isLiked ? currentLikes + 1 : currentLikes - 1;
    
    // Send to backend
    try {
      const response = await fetch(API_ENDPOINTS.LIKE_PROJECT.replace('{id}', projectId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked: isLiked })
      });
      
      if (!response.ok) {
        // Revert UI if API call fails
        likeElement.classList.toggle('active');
        likeIcon.classList.toggle('fas');
        likeIcon.classList.toggle('far');
        likeCount.textContent = currentLikes;
        throw new Error('Like action failed');
      }
      
      // Update with actual count from server
      const result = await response.json();
      likeCount.textContent = result.likesCount || likeCount.textContent;
      
    } catch (error) {
      console.error('Error updating like:', error);
    }
  }
  
  // Handle project views
  if (e.target.closest('.view-project-btn')) {
    const button = e.target.closest('.view-project-btn');
    const projectId = button.dataset.projectId;
    const viewsElement = document.querySelector(`.views[data-project-id="${projectId}"]`);
    const viewsCount = viewsElement.querySelector('.views-count');
    
    // Immediate UI update (optimistic)
    const currentViews = parseInt(viewsCount.textContent) || 0;
    viewsCount.textContent = currentViews + 1;
    
    // Send view to backend
    try {
      const response = await fetch(API_ENDPOINTS.VIEW_PROJECT.replace('{id}', projectId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        // Update with actual count from server
        const result = await response.json();
        viewsCount.textContent = result.viewsCount || viewsCount.textContent;
      } else {
        // Revert if API call fails
        viewsCount.textContent = currentViews;
      }
      
      // Redirect to project page or demo URL
      window.open('https://github.com', '_blank');
      
    } catch (error) {
      console.error('Error recording view:', error);
      // Revert on error
      viewsCount.textContent = currentViews;
      // Still redirect even if view count fails
      window.open('https://github.com', '_blank');
    }
  }
  
  // Handle rating clicks
  if (e.target.classList.contains('rating-option')) {
    const ratingValue = e.target.dataset.value;
    const container = e.target.closest('.rating-container');
    const projectId = container.dataset.projectId;
    
    // Send rating to backend
    fetch(API_ENDPOINTS.RATE_PROJECT.replace('{id}', projectId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: parseInt(ratingValue) })
    })
    .then(response => response.json())
    .then(data => {
      // Update the displayed rating
      container.querySelector('.rating-value').textContent = data.avgRating;
      container.querySelector('.rating-count').textContent = `(${data.count})`;
      
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

// Close rating popups when clicking outside
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load projects after a short delay
  setTimeout(loadProjects, 1000);
  initializeRatings();
});