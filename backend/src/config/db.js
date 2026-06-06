import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './environment.js';
import logger from '../utils/logger.js';

// Resolve DNS issues by setting default DNS servers if needed
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsError) {
  logger.warn('Failed to set custom DNS servers:', dnsError.message);
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection event error: ${err.message}`);
});
