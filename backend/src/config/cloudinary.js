import { v2 as cloudinary } from 'cloudinary';
import { env } from './environment.js';
import logger from '../utils/logger.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

logger.info('☁️ Cloudinary configured successfully.');

export default cloudinary;
