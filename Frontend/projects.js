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
toggler.addEventListener('click', function () {
    // Toggle the 'active' class on the main header and showcase
    mainHeader.classList.toggle('active');
    showcase.classList.toggle('active');
    container.classList.toggle('active');
    grid.classList.toggle('active');
    projectHeading.classList.toggle('active');
    explore.classList.toggle('active');
    footer.classList.toggle('active');

    // Change the icon based on the state
    const icon = toggler.querySelector('i');
    if (mainHeader.classList.contains('active')) {
        icon.classList.remove('fa-bars-staggered');
        icon.classList.add('fa-xmark'); 
    } else {
        icon.classList.remove('fa-xmark');
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

                const icon = toggler.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars-staggered');
            }
        });
    });
});
// API endpoints (backend should provide these)
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