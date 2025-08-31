document.addEventListener('DOMContentLoaded', function() {
    // API Configuration
    const API_BASE_URL = 'http://localhost:5000/api';
    
    // Password strength indicator
    const passwordInput = document.getElementById('signup-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            
            strengthBar.style.width = strength + '%';
            
            if (strength < 50) {
                strengthBar.style.background = '#e74c3c';
                strengthText.textContent = 'Weak password';
            } else if (strength < 75) {
                strengthBar.style.background = '#f39c12';
                strengthText.textContent = 'Medium password';
            } else {
                strengthBar.style.background = '#2ecc71';
                strengthText.textContent = 'Strong password';
            }
        });
    }
    
    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok && result.token) {
                    // Store token and user data
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result));
                    
                    // Show success message
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect to user dashboard
                    setTimeout(() => {
                        window.location.href = 'user.htm';
                    }, 1500);
                } else {
                    showMessage(result.message || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Login failed. Please try again.', 'error');
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Confirm password validation
            if (data.password !== data.confirm_password) {
                showMessage('Passwords do not match!', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(data.email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                // Register user directly (no OTP required)
                showMessage('Creating your account...', 'info');
                
                const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: data.fullname || data.name,
                        email: data.email,
                        password: data.password
                    })
                });
                
                const registerResult = await registerResponse.json();
                
                if (registerResponse.ok && registerResult.token) {
                    // Store token and user data
                    localStorage.setItem('authToken', registerResult.token);
                    localStorage.setItem('user', JSON.stringify(registerResult));
                    
                    showMessage('Account created successfully! Redirecting...', 'success');
                    
                    // Redirect to user dashboard
                    setTimeout(() => {
                        window.location.href = 'user.htm';
                    }, 1500);
                } else {
                    showMessage(registerResult.message || 'Account creation failed', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Signup failed. Please try again.', 'error');
            }
        });
    }
    
    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});