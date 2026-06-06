import logger from './src/utils/logger.js';

// Handle uncaught exceptions before loading other modules
process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Import config and connect to DB
import { env } from './src/config/environment.js';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';

const port = env.PORT;

// Establish database connection
connectDB();

// Start Server
const server = app.listen(port, () => {
  logger.info(`🚀 Server running on port ${port} in ${env.NODE_ENV} mode.`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down gracefully...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal (e.g. from hosting environment like Heroku)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
