const express = require('express');
const router = express.Router();
const { sendEmail, verifyTransporter } = require('../config/email');

// Helper function to retry operations
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

router.get('/test-email', async (req, res) => {
  try {
    // First verify the transporter with retry
    const isVerified = await retryOperation(async () => {
      const verified = await verifyTransporter();
      if (!verified) {
        throw new Error('Verification failed');
      }
      return true;
    });

    if (!isVerified) {
      return res.status(500).json({
        success: false,
        message: 'Email configuration verification failed after multiple attempts.'
      });
    }

    // Try to send a test email with retry
    await retryOperation(async () => {
      await sendEmail(
        'harsh9599566@gmail.com',
        'Test Email from Asset Management System',
        'This is a test email to verify the email configuration.',
        `
          <h1>Test Email</h1>
          <p>This is a test email to verify the email configuration.</p>
          <p>If you received this email, your email configuration is working correctly.</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
        `
      );
    });

    res.json({
      success: true,
      message: 'Test email sent successfully. Please check your inbox.'
    });
  } catch (error) {
    console.error('Test email failed:', error);
    
    // Enhanced error handling
    let errorMessage = 'Failed to send test email. ';
    if (error.message.includes('Authentication failed')) {
      errorMessage = 'Email authentication failed. Please ensure:\n' +
        '1. 2-Step Verification is enabled on your Google account\n' +
        '2. You\'re using a valid App Password\n' +
        '3. Your Gmail account is not locked or restricted';
    } else if (error.message.includes('Network error')) {
      errorMessage = 'Network error occurred. Please check your internet connection.';
    } else {
      errorMessage += error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

module.exports = router; 