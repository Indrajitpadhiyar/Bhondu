import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';

class UploadService {
  async uploadImageBuffer(fileBuffer, folder = 'avatars') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `bhondu/${folder}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary Upload Error: ${error.message}`);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  async deleteImage(publicId) {
    if (!publicId) return null;
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`Cloudinary Image Deleted: ${publicId}`);
      return result;
    } catch (error) {
      logger.error(`Cloudinary Delete Error: ${error.message}`);
      throw error;
    }
  }
}

export default new UploadService();
