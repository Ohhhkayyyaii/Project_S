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
        // 1. CALL THIS API
        const response = await fetch('https://your-backend.com/api/auth/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                purpose: 'reset' // Tell the backend this OTP is for password reset
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 2. ON SUCCESS, REDIRECT TO OTP PAGE
            messageDiv.textContent = 'Verification code sent! Redirecting...';
            messageDiv.className = 'success';
            // Pass the email and purpose to the OTP page
            setTimeout(() => {
                window.location.href = `enter-otp.html?email=${encodeURIComponent(email)}&purpose=reset`;
            }, 1500);
        } else {
            // ALWAYS show a generic success message for security, even on error.
            messageDiv.textContent = 'If an account with that email exists, a verification code has been sent.';
            messageDiv.className = 'success';
            console.error('API Error:', data); // Log the actual error for debugging
        }

    } catch (error) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'error';
        console.error('Error:', error);
    } finally {
        submitBtn.textContent = 'Send Verification Code';
        submitBtn.disabled = false;
    }
});