const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Handle all routes by serving index.html (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nottingham Companion Service running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
