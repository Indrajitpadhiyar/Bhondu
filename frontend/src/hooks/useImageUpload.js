import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance.js';

/**
 * Custom hook for production-grade image uploading with progress bars and retry logic.
 * 
 * @param {object} config - Configuration object
 * @param {string} config.folder - Cloudinary target subfolder (e.g. 'products', 'reviews', 'avatars')
 * @param {number} config.maxRetries - Maximum retry attempts on network failures
 * @returns {object} - Upload controls and state
 */
export const useImageUpload = ({ folder = 'products', maxRetries = 3 } = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [errors, setErrors] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadedAssets, setUploadedAssets] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Performs an upload attempt with exponential backoff retries.
   */
  const uploadWithRetry = useCallback(async (file, attempt = 1) => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const response = await axiosInstance.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Track upload progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressMap((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }));
        },
      });

      return response.data.data;
    } catch (error) {
      if (attempt <= maxRetries) {
        const backoffTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
        console.warn(
          `Upload failed for ${file.name}. Retrying in ${backoffTime}ms (Attempt ${attempt}/${maxRetries})...`
        );
        await delay(backoffTime);
        return uploadWithRetry(file, attempt + 1);
      }
      throw error;
    }
  }, [maxRetries]);

  /**
   * Uploads an array of image files.
   */
  const uploadFiles = useCallback(async (files) => {
    setIsUploading(true);
    setErrors([]);
    setProgressMap({});

    const urls = [];
    const assets = [];
    const pendingFiles = Array.from(files);

    // Initial validations
    const validatedFiles = [];
    const initialErrors = [];

    for (const file of pendingFiles) {
      // Validate File Size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        initialErrors.push(`${file.name} is too large (max 10MB).`);
        continue;
      }

      // Validate Extension client-side
      const ext = file.name.split('.').pop().toLowerCase();
      const allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
      if (!allowed.includes(ext)) {
        initialErrors.push(`${file.name} has an unsupported format (.${ext}).`);
        continue;
      }

      validatedFiles.push(file);
    }

    if (initialErrors.length > 0) {
      setErrors(initialErrors);
    }

    if (validatedFiles.length === 0) {
      setIsUploading(false);
      return { urls: [], assets: [] };
    }

    // Process uploads in parallel
    const uploadPromises = validatedFiles.map(async (file) => {
      try {
        setProgressMap((prev) => ({ ...prev, [file.name]: 0 }));
        const uploadResult = await uploadWithRetry(file);

        if (uploadResult.urls && uploadResult.urls.length > 0) {
          urls.push(...uploadResult.urls);
        }
        if (uploadResult.assets && uploadResult.assets.length > 0) {
          assets.push(...uploadResult.assets);
        }

        // Complete progress
        setProgressMap((prev) => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || `Failed to upload ${file.name}`;
        setErrors((prev) => [...prev, `${file.name}: ${errorMsg}`]);
        setProgressMap((prev) => ({ ...prev, [file.name]: -1 })); // -1 signifies failed state
      }
    });

    await Promise.all(uploadPromises);

    setUploadedUrls((prev) => [...prev, ...urls]);
    setUploadedAssets((prev) => [...prev, ...assets]);
    setIsUploading(false);

    return {
      urls,
      assets,
    };
  }, [uploadWithRetry]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgressMap({});
    setErrors([]);
    setUploadedUrls([]);
    setUploadedAssets([]);
  }, []);

  return {
    uploadFiles,
    isUploading,
    progressMap,
    errors,
    uploadedUrls,
    uploadedAssets,
    reset,
  };
};
