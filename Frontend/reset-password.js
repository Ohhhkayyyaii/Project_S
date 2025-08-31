document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('message');
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Client-side validation
        if (newPassword.length < 6) {
            messageDiv.textContent = 'Password must be at least 6 characters long.';
            messageDiv.className = 'error';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match.';
            messageDiv.className = 'error';
            return;
        }

        // Get email from localStorage
        const email = localStorage.getItem('resetEmail');
        if (!email) {
            messageDiv.textContent = 'Session expired. Please start the reset process again.';
            messageDiv.className = 'error';
            return;
        }

        submitBtn.textContent = 'Resetting...';
        submitBtn.disabled = true;
        messageDiv.textContent = '';
        messageDiv.className = '';

        try {
            // Reset password using email (since OTP was already verified)
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Password reset successfully! Redirecting to login...';
                messageDiv.className = 'success';
                
                // Clear stored email
                localStorage.removeItem('resetEmail');
                
                setTimeout(() => {
                    window.location.href = 'login.htm';
                }, 2000);
            } else {
                messageDiv.textContent = data.message || 'Error resetting password. Please try again.';
                messageDiv.className = 'error';
            }

        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Network error. Please try again.';
            messageDiv.className = 'error';
        } finally {
            submitBtn.textContent = 'Reset Password';
            submitBtn.disabled = false;
        }
    });
    
    // Add CSS for message styling
    const style = document.createElement('style');
    style.textContent = `
        #message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        }
        
        #message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        #message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .auth-links {
            text-align: center;
            margin-top: 20px;
        }
        
        .auth-links a {
            color: #007bff;
            text-decoration: none;
        }
        
        .auth-links a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
});