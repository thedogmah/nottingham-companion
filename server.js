const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectToDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB on startup
connectToDatabase()
  .then(() => console.log('🚀 Server started with MongoDB connection'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// API Routes
app.use('/api/contact', require('./api/contact'));
app.use('/api/admin/inquiries', require('./api/admin/inquiries'));

// Serve static files from the root directory
app.use(express.static(__dirname));

// Handle all routes by serving index.html (for SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Nottingham Companion Service running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log(`📊 MongoDB: Connected to visa-app database`);
  console.log(`🔧 Admin Panel: http://localhost:${PORT}/admin/ryanadmin.html`);
});
