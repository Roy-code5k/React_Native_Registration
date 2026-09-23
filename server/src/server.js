require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

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
