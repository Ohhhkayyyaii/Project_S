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


//////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {

    // Get the toggle button and main header elements
    // const container = document.querySelector('.container');
    const toggler = document.querySelector('.toggler');
    const mainHeader = document.querySelector('.main-header');
    const showcase = document.querySelector('.showcase');
    const grid = document.querySelector('.grid-container');
    const projectHeading = document.querySelector('.project-heading');
    const footer = document.querySelector('.footer');
    const footercontent = document.querySelector('.footer-content');
    const navitems = document.querySelectorAll('.nav-list-item');

    // Add click event listener to the toggle button
    toggler.addEventListener('click', function () {
        // Toggle the 'active' class on the main header and showcase
        mainHeader.classList.toggle('active');
        showcase.classList.toggle('active');
        // container.classList.toggle('active');
        grid.classList.toggle('active');
        projectHeading.classList.toggle('active');
        footer.classList.toggle('active');
        footercontent.classList.toggle('active');
        footercontent.classList.toggle('active');
        navitems.classList.toggle('active');
        
       
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
            // container.classList.remove('active');
            grid.classList.remove('active');
            projectHeading.classList.remove('active');
            footer.classList.remove('active');
            footercontent.classList.remove('active');
            navitems.classList.remove('active');
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
                // container.classList.remove('active');
                grid.classList.remove('active');
                projectHeading.classList.remove('active');
                footer.classList.remove('active');
                footercontent.classList.remove('active');
                navitems.classList.remove('active');

                const icon = toggler.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });
});

//API endpoints
const API_ENDPOINTS = {
  LIKE_PROJECT: '/api/projects/{id}/like',
  VIEW_PROJECT: '/api/projects/{id}/view',
  GET_PROJECT: '/api/projects/{id}'
};

// Helper function to format numbers (1.2k, etc.)
function formatCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

// Like functionality
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
    likeCount.textContent = formatCount(isLiked ? currentLikes + 1 : currentLikes - 1);
    
    // Send to backend
    try {
      const response = await fetch(API_ENDPOINTS.LIKE_PROJECT.replace('{id}', projectId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if needed
          // 'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ liked: isLiked })
      });
      
      if (!response.ok) {
        // Revert UI if API call fails
        likeElement.classList.toggle('active');
        likeIcon.classList.toggle('fas');
        likeIcon.classList.toggle('far');
        likeCount.textContent = formatCount(currentLikes);
        throw new Error('Like action failed');
      }
      
      // Update with actual count from server
      const result = await response.json();
      likeCount.textContent = formatCount(result.likesCount);
      
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
    viewsCount.textContent = formatCount(currentViews + 1);
    
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
        viewsCount.textContent = formatCount(result.viewsCount);
      } else {
        // Revert if API call fails
        viewsCount.textContent = formatCount(currentViews);
      }
      
      // Redirect to project page
      window.location.href = `/projects/${projectId}`;
      
    } catch (error) {
      console.error('Error recording view:', error);
      // Revert on error
      viewsCount.textContent = formatCount(currentViews);
      // Still redirect even if view count fails
      window.location.href = `/projects/${projectId}`;
    }
  }
});

// Utility function to update project data from backend
async function updateProjectData(projectId) {
  try {
    const response = await fetch(API_ENDPOINTS.GET_PROJECT.replace('{id}', projectId));
    if (response.ok) {
      const project = await response.json();
      
      // Update all elements with data-field attributes
      document.querySelectorAll(`[data-project-id="${projectId}"]`).forEach(element => {
        const field = element.dataset.field;
        if (project[field] !== undefined) {
          if (field === 'image' || field === 'user-image') {
            element.style.backgroundImage = `url('${project[field]}')`;
          } else if (field === 'likes' || field === 'views') {
            element.textContent = formatCount(project[field]);
          } else {
            element.textContent = project[field];
          }
        }
      });
    }
  } catch (error) {
    console.error('Error updating project data:', error);
  }
}

// Initialize project data on page load
document.addEventListener('DOMContentLoaded', function() {
  // Get all project IDs on the page
  const projectIds = [...new Set(
    Array.from(document.querySelectorAll('[data-project-id]'))
      .map(el => el.dataset.projectId)
  )];
  
  // Update each project's data
  projectIds.forEach(updateProjectData);
});
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