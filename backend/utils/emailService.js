const nodemailer = require('nodemailer');

// Create transporter for Brevo
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.BREVO_API_KEY
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = 'email_verification') => {
  try {
    const transporter = createTransporter();
    
    const subject = purpose === 'email_verification' 
      ? 'Verify Your Email - Project Showcase'
      : 'Reset Your Password - Project Showcase';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
          <h1>Project Showcase</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">
            ${purpose === 'email_verification' ? 'Verify Your Email' : 'Reset Your Password'}
          </h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            ${purpose === 'email_verification' 
              ? 'Thank you for signing up! Please use the verification code below to complete your registration.'
              : 'You requested a password reset. Use the code below to set a new password.'
            }
          </p>
          
          <div style="background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
            <h3 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h3>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            This code will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: #999;">
          <p>&copy; 2024 Project Showcase. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  createTransporter
};
