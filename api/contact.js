const { connectToDatabase } = require('../db');
const CompanionInquiry = require('../models/CompanionInquiry');
const { sendCompanionInquiryEmail } = require('../utils/email');

async function handleContactSubmission(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Extract form data
    const {
      name,
      email,
      phone,
      serviceType,
      message,
      preferredDate,
      preferredTime,
      duration,
      location,
      budget,
      specialRequirements,
      utmSource,
      utmMedium,
      utmCampaign
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !serviceType || !message || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'serviceType', 'message', 'location']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate service type - updated to match current form options
    const validServiceTypes = ['companionship', 'local-guidance', 'social-support', 'walking-outings', 'casual-meetups', 'other'];
    if (!validServiceTypes.includes(serviceType)) {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    // Create new inquiry
    const inquiry = new CompanionInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceType,
      message: message.trim(),
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      preferredTime,
      duration,
      location: location.trim(),
      budget,
      specialRequirements,
      utmSource,
      utmMedium,
      utmCampaign,
      status: 'new',
      source: 'website'
    });

    // Save to database
    const savedInquiry = await inquiry.save();
    
    console.log(`✅ New companion inquiry saved: ${savedInquiry._id} from ${email}`);

    // Send email notification
    try {
      const emailResult = await sendCompanionInquiryEmail(savedInquiry);
      if (emailResult.success) {
        console.log(`✅ Email notification sent successfully for inquiry ${savedInquiry._id}`);
      } else {
        console.log(`⚠️ Email notification failed for inquiry ${savedInquiry._id}: ${emailResult.error}`);
      }
    } catch (emailError) {
      console.log(`⚠️ Email notification error for inquiry ${savedInquiry._id}:`, emailError);
      // Don't fail the whole request if email fails
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! I\'ll get back to you within 24 hours.',
      inquiryId: savedInquiry._id,
      status: savedInquiry.status
    });

  } catch (error) {
    console.error('❌ Error saving companion inquiry:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'An inquiry with this email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to submit inquiry. Please try again later.' 
    });
  }
}

module.exports = handleContactSubmission;
