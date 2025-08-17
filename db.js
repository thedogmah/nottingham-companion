const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ryanpaul00:paulryan87@irlvisacluster.v2gwif3.mongodb.net/visa-app?retryWrites=true&w=majority&appName=IRLVisaCluster';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    
    const opts = {
      bufferCommands: false,
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB successfully');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

module.exports = { connectToDatabase };
