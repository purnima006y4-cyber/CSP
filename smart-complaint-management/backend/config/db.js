const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_complaint_management';
    
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.error(`
--------------------------------------------------------------------------------
ATTENTION: MongoDB is not currently reachable!
1. If using LOCAL MongoDB: Ensure MongoDB Service is running (run 'mongod' or start service).
2. If using MONGODB ATLAS: Set MONGO_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/smart_complaint_management" in backend/.env
--------------------------------------------------------------------------------
    `);
    // Do not crash server in dev so that API can report friendly error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
