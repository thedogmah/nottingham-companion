const fs = require('fs');
const path = require('path');

async function handleImagesRequest(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const imagesDir = path.join(__dirname, '../images');
    
    // Check if images directory exists
    if (!fs.existsSync(imagesDir)) {
      return res.json({
        success: true,
        images: [],
        message: 'Images directory not found'
      });
    }
    
    // Read images directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    // Create image objects with metadata
    const images = imageFiles.map(file => {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      
      return {
        filename: file,
        name: name,
        src: `/images/${file}`,
        type: ext.substring(1).toUpperCase()
      };
    });
    
    // Sort images alphabetically
    images.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({
      success: true,
      images: images,
      total: images.length
    });

  } catch (error) {
    console.error('❌ Error scanning images directory:', error);
    res.status(500).json({ 
      error: 'Failed to scan images directory',
      details: error.message
    });
  }
}

module.exports = handleImagesRequest;
