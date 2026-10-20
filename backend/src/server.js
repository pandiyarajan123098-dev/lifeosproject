const app = require('./app');
const { getPool, checkHealth } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = app.listen(PORT, async () => {
    console.log(`===============================================`);
    console.log(`🚀 LifeOS Backend API running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);

    // Attempt DB connection check
    try {
      const health = await checkHealth();
      if (health.status === 'connected') {
        console.log(`✅ SQL Server connected: [${health.server}/${health.database}]`);
      } else if (health.status === 'unconfigured') {
        console.log(`ℹ️  SQL Server credentials not yet configured in .env.`);
      } else {
        console.warn(`⚠️  SQL Server connection test: ${health.message}`);
      }
    } catch (dbErr) {
      console.warn(`⚠️  Initial database connection check deferred:`, dbErr.message);
    }
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
