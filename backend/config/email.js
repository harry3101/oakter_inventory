const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'harsh9599566@gmail.com',
    pass: 'kjna exvn bews gopp'
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Call verify on startup
verifyTransporter();

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: {
        name: 'Asset Management System',
        address: 'harsh9599566@gmail.com'
      },
      to,
      subject,
      text,
      html,
      // Add headers to improve deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Enhanced error handling
    if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Please check your email credentials and make sure 2-Step Verification is enabled with a valid App Password.');
    } else if (error.code === 'ESOCKET') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

// Function to send asset assignment email
const sendAssignmentEmail = async (employee, asset, assignmentDate) => {
  const subject = `Asset Assignment: ${asset.name}`;
  const html = `
    <h1>Asset Assignment Notification</h1>
    <p>Dear ${employee.name},</p>
    <p>You have been assigned the following asset:</p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
      <h2>Asset Details:</h2>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Asset Name:</strong> ${asset.name}</li>
        <li><strong>Asset Type:</strong> ${asset.type}</li>
        <li><strong>Serial Number:</strong> ${asset.serialNumber}</li>
        <li><strong>Assignment Date:</strong> ${new Date(assignmentDate).toLocaleDateString()}</li>
      </ul>
    </div>
    <p>Please take good care of this asset and report any issues immediately.</p>
    <p>Best regards,<br>Asset Management Team</p>
  `;

  const text = `
    Asset Assignment Notification
    
    Dear ${employee.name},
    
    You have been assigned the following asset:
    
    Asset Name: ${asset.name}
    Asset Type: ${asset.type}
    Serial Number: ${asset.serialNumber}
    Assignment Date: ${new Date(assignmentDate).toLocaleDateString()}
    
    Please take good care of this asset and report any issues immediately.
    
    Best regards,
    Asset Management Team
  `;

  return sendEmail(employee.email, subject, text, html);
};

module.exports = {
  sendEmail,
  verifyTransporter,
  sendAssignmentEmail
}; 