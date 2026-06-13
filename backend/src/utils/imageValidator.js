import AppError from './appError.js';

/**
 * Validates file buffer by checking magic numbers (file signatures).
 * Protects against executable uploads and fake extensions.
 * 
 * @param {Buffer} buffer - File buffer from multer memory storage
 * @param {string} originalname - The original filename uploaded
 * @returns {object} - Object containing validated mimeType and extension
 */
export const validateImageBuffer = (buffer, originalname) => {
  if (!buffer || buffer.length < 12) {
    throw new AppError('File is corrupted, empty, or too small to be a valid image.', 400);
  }

  // 1. Validate Extension
  const parts = originalname.split('.');
  if (parts.length < 2) {
    throw new AppError('Filename must have an extension.', 400);
  }
  const ext = parts.pop().toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
  if (!allowedExtensions.includes(ext)) {
    throw new AppError(`Unsupported file extension: .${ext}. Only JPG, JPEG, PNG, WEBP, and AVIF are allowed.`, 400);
  }

  // 2. Validate Magic Numbers (File Signatures)
  const hex = buffer.toString('hex', 0, 12).toUpperCase();

  // JPEG/JPG: Starts with FF D8 FF
  const isJpeg = hex.startsWith('FFD8FF');
  
  // PNG: Starts with 89 50 4E 47 0D 0A 1A 0A
  const isPng = hex.startsWith('89504E470D0A1A0A');
  
  // WebP: RIFF header and WEBP container signature
  // RIFF starts with 52 49 46 46 (bytes 0-3), WEBP is at bytes 8-11: 57 45 42 50
  const isWebp = hex.startsWith('52494646') && hex.substring(16, 24) === '57454250';
  
  // AVIF: starts with ftypavif or ftypavis at index 4 (bytes 4-11: 66 74 79 70 61 76 69 66/73)
  const isAvif = hex.substring(8, 24) === '6674797061766966' || hex.substring(8, 24) === '6674797061766973';

  if (!isJpeg && !isPng && !isWebp && !isAvif) {
    throw new AppError('File content signature does not match any allowed image format. Upload rejected for security reasons.', 400);
  }

  // 3. Resolve actual MIME Type matching the magic number
  let mimeType = '';
  if (isJpeg) mimeType = 'image/jpeg';
  else if (isPng) mimeType = 'image/png';
  else if (isWebp) mimeType = 'image/webp';
  else if (isAvif) mimeType = 'image/avif';

  // Cross-reference extension with actual magic number type to prevent extension spoofing
  const isExtensionMismatch = 
    (mimeType === 'image/jpeg' && ext !== 'jpg' && ext !== 'jpeg') ||
    (mimeType === 'image/png' && ext !== 'png') ||
    (mimeType === 'image/webp' && ext !== 'webp') ||
    (mimeType === 'image/avif' && ext !== 'avif');

  if (isExtensionMismatch) {
    throw new AppError(`Extension spoofing detected! File claims to be .${ext} but contains a ${mimeType} signature.`, 400);
  }

  // Sanitize filename to prevent directory traversal attacks
  const safeBaseName = parts
    .join('.')
    .replace(/[^a-zA-Z0-9_-]/g, '_') // only alphanumeric, dash, and underscore
    .substring(0, 100); // truncate if too long

  const secureFilename = `${safeBaseName}_${Date.now()}.${ext}`;

  return {
    mimeType,
    extension: ext,
    secureFilename
  };
};
