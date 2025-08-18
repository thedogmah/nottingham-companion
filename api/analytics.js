const express = require('express');
const router = express.Router();
const UserAnalytics = require('../models/UserAnalytics');
const axios = require('axios');

// Track user analytics
router.post('/track', async (req, res) => {
  try {
    const {
      sessionId,
      page,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      cookiesAccepted,
      cookiesDeclined
    } = req.body;

    // Get IP address from request
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    
    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Parse user agent to get browser and OS info
    const browserInfo = parseUserAgent(userAgent);
    
    // Check if session already exists
    let userAnalytics = await UserAnalytics.findOne({ sessionId });
    
    if (userAnalytics) {
      // Update existing session
      userAnalytics.currentPage = page;
      userAnalytics.pageViews += 1;
      userAnalytics.lastVisit = new Date();
      userAnalytics.bounceRate = false; // Multiple page views
      
      if (cookiesAccepted !== undefined) {
        userAnalytics.cookiesAccepted = cookiesAccepted;
      }
      if (cookiesDeclined !== undefined) {
        userAnalytics.cookiesDeclined = cookiesDeclined;
      }
      
      await userAnalytics.save();
    } else {
      // Create new session
      const geoData = await getGeolocation(ipAddress);
      
      userAnalytics = new UserAnalytics({
        sessionId,
        ipAddress,
        country: geoData.country,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        userAgent,
        browser: browserInfo.browser,
        browserVersion: browserInfo.browserVersion,
        operatingSystem: browserInfo.operatingSystem,
        deviceType: browserInfo.deviceType,
        referrer,
        entryPage: page,
        currentPage: page,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        cookiesAccepted: cookiesAccepted || false,
        cookiesDeclined: cookiesDeclined || false
      });
      
      await userAnalytics.save();
    }
    
    res.json({ success: true, sessionId: userAnalytics.sessionId });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Failed to track analytics' });
  }
});

// Get analytics data for admin panel (last 20 users)
router.get('/recent', async (req, res) => {
  try {
    const recentUsers = await UserAnalytics.find()
      .sort({ lastVisit: -1 })
      .limit(20)
      .select('-__v');
    
    res.json({ success: true, users: recentUsers });
  } catch (error) {
    console.error('Error fetching recent analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics summary for admin panel
router.get('/summary', async (req, res) => {
  try {
    const totalUsers = await UserAnalytics.countDocuments();
    const todayUsers = await UserAnalytics.countDocuments({
      lastVisit: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const cookiesAccepted = await UserAnalytics.countDocuments({ cookiesAccepted: true });
    const cookiesDeclined = await UserAnalytics.countDocuments({ cookiesDeclined: true });
    
    // Get top countries
    const topCountries = await UserAnalytics.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get top browsers
    const topBrowsers = await UserAnalytics.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      summary: {
        totalUsers,
        todayUsers,
        cookiesAccepted,
        cookiesDeclined,
        topCountries,
        topBrowsers
      }
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

// Helper function to parse user agent
function parseUserAgent(userAgent) {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (ua.includes('chrome')) {
    browser = 'Chrome';
    browserVersion = ua.match(/chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    browserVersion = ua.match(/firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('safari')) {
    browser = 'Safari';
    browserVersion = ua.match(/version\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('edge')) {
    browser = 'Edge';
    browserVersion = ua.match(/edge\/(\d+)/)?.[1] || 'Unknown';
  }
  
  // OS detection
  let operatingSystem = 'Unknown';
  if (ua.includes('windows')) operatingSystem = 'Windows';
  else if (ua.includes('mac')) operatingSystem = 'macOS';
  else if (ua.includes('linux')) operatingSystem = 'Linux';
  else if (ua.includes('android')) operatingSystem = 'Android';
  else if (ua.includes('ios')) operatingSystem = 'iOS';
  
  // Device type detection
  let deviceType = 'desktop';
  if (ua.includes('mobile')) deviceType = 'mobile';
  else if (ua.includes('tablet')) deviceType = 'tablet';
  
  return { browser, browserVersion, operatingSystem, deviceType };
}

// Helper function to get geolocation from IP
async function getGeolocation(ipAddress) {
  try {
    // Skip local IPs
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress === 'unknown') {
      return { country: 'Local', region: 'Local', city: 'Local', latitude: null, longitude: null };
    }
    
    // Use ipapi.co for geolocation (free tier)
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`, {
      timeout: 5000
    });
    
    if (response.data && response.data.country_name) {
      return {
        country: response.data.country_name,
        region: response.data.region,
        city: response.data.city,
        latitude: response.data.latitude,
        longitude: response.data.longitude
      };
    }
  } catch (error) {
    console.log('Geolocation lookup failed:', error.message);
  }
  
  // Fallback
  return { country: 'Unknown', region: 'Unknown', city: 'Unknown', latitude: null, longitude: null };
}

module.exports = router;
