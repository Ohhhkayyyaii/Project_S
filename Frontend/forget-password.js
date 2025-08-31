document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('message');
        const email = document.getElementById('email').value;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        messageDiv.textContent = '';
        messageDiv.className = '';

        try {
            // Send OTP for password reset
            const response = await fetch(`${API_BASE_URL}/otp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    purpose: 'password_reset'
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                messageDiv.textContent = 'Verification code sent! Redirecting to OTP page...';
                messageDiv.className = 'success';
                
                // Store email for OTP verification
                localStorage.setItem('resetEmail', email);
                
                // Redirect to OTP page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'otp.htm?purpose=password_reset';
                }, 2000);
            } else {
                // Show error message
                messageDiv.textContent = data.message || 'Failed to send verification code. Please try again.';
                messageDiv.className = 'error';
            }

        } catch (error) {
            messageDiv.textContent = 'Network error. Please check your connection and try again.';
            messageDiv.className = 'error';
            console.error('Error:', error);
        } finally {
            submitBtn.textContent = 'Send Verification Code';
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