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

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const API_ENDPOINTS = {
  GET_USER_PROFILE: `${API_BASE_URL}/auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  CREATE_PROJECT: `${API_BASE_URL}/projects`,
  GET_USER_PROJECTS: `${API_BASE_URL}/projects?owner={userId}`,
  DELETE_PROJECT: `${API_BASE_URL}/projects/{id}`,
  UPDATE_PROJECT: `${API_BASE_URL}/projects/{id}`
};

// Check authentication status
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'login.htm';
    return false;
  }
  return true;
}

// Load user profile
async function loadUserProfile() {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_ENDPOINTS.GET_USER_PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      updateProfileInterface(user);
      loadUserProjects(user._id);
        } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = 'login.htm';
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Update profile interface with user data
function updateProfileInterface(user) {
  // Update profile form fields
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  
  // Update profile display
  const profileName = document.querySelector('.profile-name');
  const profileEmail = document.querySelector('.profile-email');
  
  if (profileName) profileName.textContent = user.name || 'User';
  if (profileEmail) profileEmail.textContent = user.email || '';
}

// Load user's projects
async function loadUserProjects(userId) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_ENDPOINTS.GET_USER_PROJECTS.replace('{userId}', userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      const projects = result.data || result;
      renderUserProjects(projects);
    }
  } catch (error) {
    console.error('Error loading user projects:', error);
  }
}

// Render user's projects
function renderUserProjects(projects) {
  const projectsContainer = document.getElementById('user-projects');
  if (!projectsContainer) return;
  
  projectsContainer.innerHTML = '';
  
  if (!projects || projects.length === 0) {
    projectsContainer.innerHTML = '<div class="no-projects">You haven\'t created any projects yet.</div>';
    return;
  }
  
  projects.forEach(project => {
    const projectCard = createUserProjectCard(project);
    projectsContainer.appendChild(projectCard);
  });
}

// Create user project card
function createUserProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'user-project-card';
  card.dataset.projectId = project.id || project._id;
  
  const avgRating = project.avgRating || (project.ratingCount > 0 ? (project.ratingSum / project.ratingCount).toFixed(1) : 0);
  const ratingCount = project.ratingCount || 0;
  
  card.innerHTML = `
    <div class="project-info">
      <h3 class="project-title">${escapeHtml(project.title)}</h3>
      <p class="project-description">${escapeHtml(project.description)}</p>
      <div class="project-stats">
        <span class="rating">⭐ ${avgRating} (${ratingCount} ratings)</span>
        <span class="created">Created: ${new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
    <div class="project-actions">
      <button class="edit-project-btn" data-project-id="${project.id || project._id}">Edit</button>
      <button class="delete-project-btn" data-project-id="${project.id || project._id}">Delete</button>
    </div>
  `;
  
  return card;
}

// Handle project creation
function handleCreateProject(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const projectData = {
    title: formData.get('title'),
    description: formData.get('description'),
    imageUrl: formData.get('imageUrl') || '',
    techStack: formData.get('techStack') ? formData.get('techStack').split(',').map(tech => tech.trim()) : [],
    links: {
      demo: formData.get('demoUrl') || '',
      repo: formData.get('repoUrl') || ''
    }
  };
  
  createProject(projectData);
}

// Create project API call
async function createProject(projectData) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_ENDPOINTS.CREATE_PROJECT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    
    if (response.ok) {
      const result = await response.json();
      showMessage('Project created successfully!', 'success');
      
      // Reload user projects
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      loadUserProjects(user._id);
      
      // Reset form
      document.getElementById('create-project-form').reset();
    } else {
      const error = await response.json();
      showMessage(error.message || 'Failed to create project', 'error');
    }
  } catch (error) {
    console.error('Error creating project:', error);
    showMessage('Failed to create project. Please try again.', 'error');
  }
}

// Handle project deletion
async function deleteProject(projectId) {
  if (!confirm('Are you sure you want to delete this project?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_ENDPOINTS.DELETE_PROJECT.replace('{id}', projectId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      showMessage('Project deleted successfully!', 'success');
      
      // Remove from DOM
      const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
      if (projectCard) {
        projectCard.remove();
      }
    } else {
      const error = await response.json();
      showMessage(error.message || 'Failed to delete project', 'error');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    showMessage('Failed to delete project. Please try again.', 'error');
  }
}

// Handle project editing
function editProject(projectId) {
  // For now, redirect to a simple edit form
  // In a full implementation, you'd show a modal or navigate to an edit page
  showMessage('Edit functionality coming soon!', 'info');
}

// Update profile
async function updateProfile(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const profileData = {
    name: formData.get('name'),
    email: formData.get('email')
  };
  
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (response.ok) {
      const result = await response.json();
      showMessage('Profile updated successfully!', 'success');
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(result));
    } else {
      const error = await response.json();
      showMessage(error.message || 'Failed to update profile', 'error');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Failed to update profile. Please try again.', 'error');
  }
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

function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.message');
  existingMessages.forEach(msg => msg.remove());
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  
  // Add styles
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  
  if (type === 'success') {
    messageDiv.style.backgroundColor = '#2ecc71';
  } else if (type === 'error') {
    messageDiv.style.backgroundColor = '#e74c3c';
  } else {
    messageDiv.style.backgroundColor = '#3498db';
  }
  
  document.body.appendChild(messageDiv);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

// Logout functionality
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = 'home.htm';
}

// Event listeners
document.addEventListener('click', function(event) {
  // Handle logout
  if (event.target.textContent === 'LOGOUT' || event.target.closest('.logout-btn')) {
    event.preventDefault();
    logout();
  }
  
  // Handle project deletion
  if (event.target.classList.contains('delete-project-btn')) {
    const projectId = event.target.dataset.projectId;
    deleteProject(projectId);
  }
  
  // Handle project editing
  if (event.target.classList.contains('edit-project-btn')) {
    const projectId = event.target.dataset.projectId;
    editProject(projectId);
  }
});

// Form submissions
document.addEventListener('DOMContentLoaded', function() {
  // Profile update form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', updateProfile);
  }
  
  // Project creation form
  const createProjectForm = document.getElementById('create-project-form');
  if (createProjectForm) {
    createProjectForm.addEventListener('submit', handleCreateProject);
  }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication first
  if (!checkAuth()) {
    return;
  }
  
  // Load user profile
  loadUserProfile();
});