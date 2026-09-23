const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('No MONGO_URI provided in environment. Initializing embedded in-memory MongoDB instance...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      mongoUri = mongodInstance.getUri();
      console.log(`Embedded in-memory MongoDB started at: ${mongoUri}`);
    } else {
      console.log(`Connecting to specified MongoDB URI: ${mongoUri.split('@')[1] || mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      maxPoolSize: 50, // Maintain up to 50 concurrent socket connections for high concurrency
      minPoolSize: 5,  // Maintain a minimum pool of warm connections
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas cluster is unreachable
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
      console.log('Embedded in-memory MongoDB stopped.');
    }
  } catch (error) {
    console.error(`Error disconnecting DB: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
