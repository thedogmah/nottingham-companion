const { connectToDatabase } = require('../../db');
const CompanionInquiry = require('../../models/CompanionInquiry');

async function handleAdminInquiries(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get all inquiries, sorted by newest first
    const inquiries = await CompanionInquiry.find({})
      .sort({ createdAt: -1 })
      .limit(100) // Limit to last 100 inquiries
      .lean(); // Convert to plain objects for better performance
    
    // Return inquiries data
    res.status(200).json({
      success: true,
      inquiries: inquiries,
      total: inquiries.length
    });

  } catch (error) {
    console.error('❌ Admin inquiries error:', error);
    res.status(500).json({ 
      error: 'Failed to load inquiries',
      details: error.message
    });
  }
}

module.exports = handleAdminInquiries;
