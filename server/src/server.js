require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const Competition = require('./models/Competition');
const seedData = require('./seed/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database has no competitions
    const count = await Competition.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Running initial seed data...');
      await seedData();
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Feedants Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🏆 Competition API: http://localhost:${PORT}/api/v1/competitions`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
