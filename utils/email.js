const nodemailer = require('nodemailer');

// Create transporter - using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send companion inquiry email
const sendCompanionInquiryEmail = async (inquiryData) => {
  try {
    const transporter = createTransporter();
    
    const emailContent = `
New Companion Service Inquiry

Name: ${inquiryData.name}
Email: ${inquiryData.email}
Phone: ${inquiryData.phone}
Location: ${inquiryData.location}

Service Type: ${inquiryData.serviceType}
Duration: ${inquiryData.duration || 'Not specified'}
Preferred Date: ${inquiryData.preferredDate || 'Not specified'}
Preferred Time: ${inquiryData.preferredTime || 'Not specified'}

Message:
${inquiryData.message}

Additional Details:
- UTM Source: ${inquiryData.utmSource || 'Not tracked'}
- UTM Medium: ${inquiryData.utmMedium || 'Not tracked'}
- UTM Campaign: ${inquiryData.utmCampaign || 'Not tracked'}

Inquiry ID: ${inquiryData._id}
Status: ${inquiryData.status}
Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}

---
This inquiry was submitted through the MateDate website contact form.
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'ryanbirks00@gmail.com',
      subject: 'Friendship - New Companion Service Inquiry',
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendCompanionInquiryEmail
};
