import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';
import { validateImageBuffer } from '../utils/imageValidator.js';
import UploadedAsset from '../models/uploaded-asset.model.js';

class UploadService {
  /**
   * Uploads and automatically optimizes an image buffer using dynamic Cloudinary quality tiers.
   * Also pre-generates responsive sizes and records metadata to the database.
   * 
   * @param {Buffer} fileBuffer - Image buffer from multer
   * @param {string} folder - Destination subfolder
   * @param {string} originalname - Original file name for validation
   * @param {string} userId - ID of the uploading admin/user
   * @returns {Promise<object>} - Object with secure optimized URL, public ID, and saved asset document
   */
  async uploadImageBuffer(fileBuffer, folder = 'avatars', originalname = 'image.jpg', userId) {
    // 1. Security Check & File Type Validation
    const { mimeType, extension, secureFilename } = validateImageBuffer(fileBuffer, originalname);
    const originalSize = fileBuffer.length;

    // 2. Select Quality Preset Based on Upload Size (Perceptual auto levels)
    // - Size < 300 KB: Keep original quality (auto:best)
    // - Size 300 KB - 1 MB: Light optimization (auto:best)
    // - Size 1 MB - 3 MB: Intelligent compression (auto:good)
    // - Size > 3 MB: Aggressive optimize, visually identical (auto:good)
    let qualityParam = 'auto:good';
    if (originalSize < 1000 * 1024) {
      qualityParam = 'auto:best';
    } else {
      qualityParam = 'auto:good';
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `bhondu/${folder}`,
          resource_type: 'image',
          public_id: secureFilename.split('.')[0], // Name without extension
          // Pre-generate optimized and resized responsive assets synchronously (eager_async: false)
          eager: [
            { width: 300, crop: 'limit', quality: qualityParam, fetch_format: 'auto' },  // Thumbnail
            { width: 600, crop: 'limit', quality: qualityParam, fetch_format: 'auto' },  // Medium (Product Card)
            { width: 1200, crop: 'limit', quality: qualityParam, fetch_format: 'auto' }, // Large (Product Page)
            { width: 2000, crop: 'limit', quality: qualityParam, fetch_format: 'auto' }, // Zoom
            { quality: qualityParam, fetch_format: 'auto' }                              // Optimized Original
          ],
          eager_async: false,
        },
        async (error, result) => {
          if (error) {
            logger.error(`Cloudinary Upload Error: ${error.message}`);
            return reject(error);
          }

          try {
            // Retrieve results from eager array
            const thumbRes = result.eager[0];
            const mediumRes = result.eager[1];
            const largeRes = result.eager[2];
            const zoomRes = result.eager[3];
            const optOriginalRes = result.eager[4];

            const optimizedSize = optOriginalRes.bytes;
            const compressionRatio = Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100));

            // Write metadata to database (if userId is available)
            let asset = null;
            if (userId) {
              asset = await UploadedAsset.create({
                userId,
                originalName: originalname,
                mimeType,
                extension,
                originalUrl: result.secure_url,
                originalSize,
                originalWidth: result.width,
                originalHeight: result.height,
                optimizedUrl: optOriginalRes.secure_url,
                optimizedSize,
                optimizedWidth: optOriginalRes.width,
                optimizedHeight: optOriginalRes.height,
                format: optOriginalRes.format,
                compressionRatio,
                optimizationStatus: 'completed',
                thumbnailUrl: thumbRes.secure_url,
                mediumUrl: mediumRes.secure_url,
                largeUrl: largeRes.secure_url,
                zoomUrl: zoomRes.secure_url,
                publicId: result.public_id,
                folder,
              });
              logger.info(`Asset optimized and saved to database: ${asset._id} (${compressionRatio}% space saved)`);
            }

            resolve({
              url: optOriginalRes.secure_url, // Return the optimized original URL for store use
              publicId: result.public_id,
              asset,
            });
          } catch (dbError) {
            logger.error(`Failed to register asset in DB: ${dbError.message}`);
            // Fallback to resolving with Cloudinary details if db fails to avoid breaking request flow
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              error: dbError.message,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Deletes an image from Cloudinary
   * 
   * @param {string} publicId - Cloudinary public id
   * @returns {Promise<object>}
   */
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
