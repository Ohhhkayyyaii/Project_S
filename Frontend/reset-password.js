document.getElementById('resetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Client-side check
    if (newPassword !== confirmPassword) {
        messageDiv.textContent = 'Passwords do not match.';
        messageDiv.className = 'error';
        return;
    }

    submitBtn.textContent = 'Resetting...';
    submitBtn.disabled = true;
    messageDiv.textContent = '';

    // Get the token from the URL (passed from enter-otp.html)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // If there's no token, redirect back to login
    if (!token) {
        alert('Invalid reset link. Please start the process again.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // 3. CALL THIS API TO FINALLY RESET THE PASSWORD
        const response = await fetch('https://your-backend.com/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the token to prove identity
            },
            body: JSON.stringify({
                newPassword: newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = 'Password reset successfully! Redirecting to login...';
            messageDiv.className = 'success';
            setTimeout(() => {
                window.location.href = 'login.html?message=Password+reset+successfully';
            }, 2000);
        } else {
            messageDiv.textContent = data.message || 'Error resetting password.';
            messageDiv.className = 'error';
        }

    } catch (error) {
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.className = 'error';
    } finally {
        submitBtn.textContent = 'Reset Password';
        submitBtn.disabled = false;
    }
});