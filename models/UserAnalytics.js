const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  // User identification
  sessionId: { type: String, required: true, unique: true },
  ipAddress: { type: String, required: true },
  
  // Location data
  country: { type: String },
  region: { type: String },
  city: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  
  // Browser and device information
  userAgent: { type: String, required: true },
  browser: { type: String },
  browserVersion: { type: String },
  operatingSystem: { type: String },
  deviceType: { type: String }, // mobile, tablet, desktop
  
  // Page and session data
  referrer: { type: String },
  entryPage: { type: String, required: true },
  currentPage: { type: String, required: true },
  pageViews: { type: Number, default: 1 },
  
  // Cookie consent
  cookiesAccepted: { type: Boolean, default: false },
  cookiesDeclined: { type: Boolean, default: false },
  
  // Timestamps
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  sessionStart: { type: Date, default: Date.now },
  sessionEnd: { type: Date },
  
  // Additional analytics
  timeOnSite: { type: Number, default: 0 }, // in seconds
  bounceRate: { type: Boolean, default: true }, // true if single page visit
  
  // UTM parameters
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
  utmTerm: { type: String },
  utmContent: { type: String }
}, { 
  timestamps: true 
});

// Indexes for better query performance
userAnalyticsSchema.index({ sessionId: 1 });
userAnalyticsSchema.index({ ipAddress: 1 });
userAnalyticsSchema.index({ firstVisit: -1 });
userAnalyticsSchema.index({ lastVisit: -1 });
userAnalyticsSchema.index({ country: 1, city: 1 });

module.exports = mongoose.models.UserAnalytics || mongoose.model('UserAnalytics', userAnalyticsSchema);
