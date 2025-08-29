document.addEventListener('DOMContentLoaded', function() {
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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Backend API call for login
            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.token) {
                    // Store token and redirect
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result));
                    window.location.href = 'user.htm';
                } else {
                    alert('Login failed: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            });
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Confirm password validation
            if (data.password !== data.confirm_password) {
                alert('Passwords do not match!');
                return;
            }
            
            // Backend API call for signup
            fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.token) {
                    alert('Account created successfully! Please login.');
                    window.location.href = 'login.htm';
                } else {
                    alert('Signup failed: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Signup failed. Please try again.');
            });
        });
    }
});