const mongoose = require('mongoose');

const companionInquirySchema = new mongoose.Schema({
  // Contact Information
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Service Details
  serviceType: { 
    type: String, 
    enum: ['errands', 'local-guidance', 'life-admin', 'companionship', 'other'],
    required: true 
  },
  
  // Request Details
  message: { type: String, required: true },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  duration: { type: String }, // e.g., "2 hours", "half day", "full day"
  
  // Location
  location: { type: String, required: true }, // Nottingham area
  
  // Status and Tracking
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'new' 
  },
  
  // Additional Information
  budget: { type: String }, // e.g., "£50-100", "£100+"
  specialRequirements: { type: String },
  
  // System Fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Admin Notes
  adminNotes: { type: String },
  assignedTo: { type: String }, // Admin username
  
  // Response Tracking
  responseSent: { type: Boolean, default: false },
  responseDate: { type: Date },
  
  // Source Tracking
  source: { type: String, default: 'website' }, // website, phone, referral
  utmSource: { type: String }, // Google Ads tracking
  utmMedium: { type: String },
  utmCampaign: { type: String }
}, { 
  timestamps: true 
});

// Index for better query performance
companionInquirySchema.index({ email: 1, createdAt: -1 });
companionInquirySchema.index({ status: 1, createdAt: -1 });
companionInquirySchema.index({ serviceType: 1, createdAt: -1 });

module.exports = mongoose.models.CompanionInquiry || mongoose.model('CompanionInquiry', companionInquirySchema);
