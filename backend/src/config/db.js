import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './environment.js';
import logger from '../utils/logger.js';
import User from '../models/user.model.js';

// Resolve DNS issues by setting default DNS servers if needed
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsError) {
  logger.warn('Failed to set custom DNS servers:', dnsError.message);
}

const seedAdminUser = async () => {
  try {
    const email = env.ADMIN_EMAIL;
    const password = env.ADMIN_PASWORD;

    if (!email || !password) {
      logger.warn('⚠️ ADMIN_EMAIL or ADMIN_PASWORD not configured. Skipping admin seeding.');
      return;
    }

    let admin = await User.findOne({ email }).select('+password');
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email,
        password,
        role: 'Admin',
        isVerified: true,
      });
      await admin.save();
      logger.info(`👑 Admin user successfully created: ${email}`);
    } else {
      let isModified = false;
      if (admin.role !== 'Admin') {
        admin.role = 'Admin';
        isModified = true;
      }
      if (!admin.isVerified) {
        admin.isVerified = true;
        isModified = true;
      }
      // Check if password changed in environment variable
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        admin.password = password; // Pre-save hook will hash it
        isModified = true;
      }

      if (isModified) {
        await admin.save();
        logger.info(`👑 Admin credentials or role updated in database: ${email}`);
      }
    }
  } catch (error) {
    logger.error(`❌ Error seeding Admin user: ${error.message}`);
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedAdminUser();
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
