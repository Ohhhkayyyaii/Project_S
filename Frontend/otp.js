document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    // Get elements
    const otpDigits = document.querySelectorAll('.otp-digit');
    const otpHiddenInput = document.getElementById('otp');
    const toggleVisibilityBtn = document.getElementById('toggleOtpVisibility');
    const resendBtn = document.getElementById('resendOtp');
    const resendLink = document.getElementById('resendLink');
    const otpForm = document.getElementById('otpForm');
    
    let otpVisible = false;
    let resendTimer = null;
    let resendTimeLeft = 60; // 60 seconds wait time
    
    // Get purpose and email from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const purpose = urlParams.get('purpose') || 'email_verification';
    const userEmail = urlParams.get('email') || localStorage.getItem('verifyEmail') || localStorage.getItem('resetEmail') || 'user@example.com';
    
    // Update page title and description based on purpose
    const pageTitle = document.querySelector('.auth-header h2');
    const pageDescription = document.querySelector('.auth-header p');
    
    if (purpose === 'password_reset') {
        pageTitle.textContent = 'Reset Password';
        pageDescription.textContent = 'Enter the verification code sent to your email to reset your password.';
    } else {
        pageTitle.textContent = 'Verify Email';
        pageDescription.textContent = 'Enter the verification code sent to your email.';
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    // Auto-focus first OTP digit
    otpDigits[0].focus();
    
    // OTP digit input handling
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', function(e) {
            const value = e.target.value;
            
            if (value.length === 1) {
                // Mark as filled
                this.classList.add('filled');
                
                // Move to next field if available
                if (index < otpDigits.length - 1) {
                    otpDigits[index + 1].focus();
                }
            } else if (value.length === 0) {
                // Remove filled class
                this.classList.remove('filled');
                
                // Move to previous field if available
                if (index > 0) {
                    otpDigits[index - 1].focus();
                }
            }
            
            updateHiddenOtpValue();
        });
        
        // Handle paste event
        digit.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            
            if (/^\d{6}$/.test(pastedData)) {
                // Fill all fields with pasted data
                pastedData.split('').forEach((num, i) => {
                    if (otpDigits[i]) {
                        otpDigits[i].value = num;
                        otpDigits[i].classList.add('filled');
                    }
                });
                
                // Focus last field
                if (otpDigits[5]) {
                    otpDigits[5].focus();
                }
                
                updateHiddenOtpValue();
            }
        });
        
        // Handle backspace key
        digit.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                otpDigits[index - 1].focus();
            }
        });
    });
    
    // Update hidden OTP value
    function updateHiddenOtpValue() {
        const otpValue = Array.from(otpDigits).map(digit => digit.value).join('');
        otpHiddenInput.value = otpValue;
    }
    
    // Toggle OTP visibility
    toggleVisibilityBtn.addEventListener('click', function() {
        otpVisible = !otpVisible;
        const icon = this.querySelector('i');
        
        if (otpVisible) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            otpDigits.forEach(digit => {
                digit.type = 'text';
            });
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            otpDigits.forEach(digit => {
                digit.type = 'password';
            });
        }
    });
    
    // Handle form submission
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const otp = otpHiddenInput.value;
        const submitBtn = document.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        
        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit code.');
            return;
        }
        
        submitBtn.textContent = 'Verifying...';
        submitBtn.disabled = true;
        
        // Verify OTP
        fetch(`${API_BASE_URL}/otp/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                otp: otp,
                purpose: purpose
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // OTP verification successful
                if (purpose === 'password_reset') {
                    // Redirect to reset password page
                    localStorage.setItem('resetEmail', userEmail);
                    window.location.href = 'reset-password.htm';
                } else {
                    // Email verification - redirect to login
                    alert('Email verified successfully! Please login.');
                    window.location.href = 'login.htm';
                }
            } else {
                alert(data.message || 'Invalid OTP. Please try again.');
                clearOtpFields();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Verification failed. Please try again.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Clear OTP fields
    function clearOtpFields() {
        otpDigits.forEach(digit => {
            digit.value = '';
            digit.classList.remove('filled');
            digit.type = otpVisible ? 'text' : 'password';
        });
        otpHiddenInput.value = '';
        otpDigits[0].focus();
    }
    
    // Resend OTP functionality
    function setupResendTimer() {
        resendBtn.disabled = true;
        resendLink.style.display = 'none';
        
        resendTimer = setInterval(() => {
            resendTimeLeft--;
            
            if (resendTimeLeft <= 0) {
                clearInterval(resendTimer);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Resend Code';
                resendLink.style.display = 'inline';
                resendTimeLeft = 60;
            } else {
                resendBtn.textContent = `Resend (${resendTimeLeft}s)`;
            }
        }, 1000);
    }
    
    // Handle resend OTP
    resendBtn.addEventListener('click', function() {
        if (!this.disabled) {
            resendOtp();
        }
    });
    
    resendLink.addEventListener('click', function(e) {
        e.preventDefault();
        resendOtp();
    });
    
    function resendOtp() {
        fetch(`${API_BASE_URL}/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: userEmail,
                purpose: purpose
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('New verification code sent!');
                clearOtpFields();
                setupResendTimer();
            } else {
                alert('Failed to resend code. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to resend code. Please try again.');
        });
    }
    
    // Initialize resend timer
    setupResendTimer();
});

        // Submit to backend

        verifyOtp(otpValue);

    });

    

    // Verify OTP with backend

    function verifyOtp(otp) {

        // Show loading state

        const submitBtn = otpForm.querySelector('.auth-btn');

        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Verifying...';

        submitBtn.disabled = true;

        

        fetch('/api/auth/verify-otp', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify({

                email: userEmail,

                otp: otp

            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.success) {

                // OTP verification successful

                alert('Email verified successfully!');

                window.location.href = '/dashboard'; // Redirect to dashboard

            } else {

                alert('Invalid OTP. Please try again.');

                clearOtpFields();

            }

        })

        .catch(error => {

            console.error('Error:', error);

            alert('Verification failed. Please try again.');

        })

        .finally(() => {

            submitBtn.textContent = originalText;

            submitBtn.disabled = false;

        });

    }

    

    // Clear OTP fields

    function clearOtpFields() {

        otpDigits.forEach(digit => {

            digit.value = '';

            digit.classList.remove('filled');

            digit.type = otpVisible ? 'text' : 'password';

        });

        otpHiddenInput.value = '';

        otpDigits[0].focus();

    }

    

    // Resend OTP functionality

    function setupResendTimer() {

        resendBtn.disabled = true;

        resendLink.style.display = 'none';

        

        resendTimer = setInterval(() => {

            resendTimeLeft--;

            

            if (resendTimeLeft <= 0) {

                clearInterval(resendTimer);

                resendBtn.disabled = false;

                resendBtn.textContent = 'Resend Code';

                resendLink.style.display = 'inline';

                resendTimeLeft = 60;

            } else {

                resendBtn.textContent = `Resend (${resendTimeLeft}s)`;

            }

        }, 1000);

    }

    

    // Handle resend OTP

    resendBtn.addEventListener('click', function() {

        if (!this.disabled) {

            resendOtp();

        }

    });

    

    resendLink.addEventListener('click', function(e) {

        e.preventDefault();

        resendOtp();

    });

    

    function resendOtp() {

        fetch('/api/auth/resend-otp', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify({ email: userEmail })

        })

        .then(response => response.json())

        .then(data => {

            if (data.success) {

                alert('New verification code sent!');

                clearOtpFields();

                setupResendTimer();

            } else {

                alert('Failed to resend code. Please try again.');

            }

        })

        .catch(error => {

            console.error('Error:', error);

            alert('Failed to resend code. Please try again.');

        });

    }

    

    // Initialize resend timer

    setupResendTimer();

});
