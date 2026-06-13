import supabase from '../config/supabase.js';
import BlankTemplate from '../models/blank-template.model.js';
import PrintArea from '../models/print-area.model.js';
import Product from '../models/product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';
import cloudinary from '../config/cloudinary.js';

// 1. Analyze flat template image (Simulated Grounding DINO + SAM + OCR Pipeline)
export const analyzeTemplate = asyncHandler(async (req, res, next) => {
  const { productId, name, frontImage, backImage } = req.body;

  if (!productId || !name || !frontImage) {
    return next(new AppError('Please provide productId, name, and at least a frontImage URL.', 400));
  }

  // Verify product exists in MongoDB
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found in MongoDB.', 404));
  }

  let jobId = `job_analyze_${Date.now()}`;
  let supabaseJobId = null;

  // Insert job record into Supabase if client is active
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ai_segmentation_jobs')
        .insert([
          {
            product_id: productId.toString(),
            status: 'queued',
            logs: 'Initializing AI customizer scanner pipeline...'
          }
        ])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        supabaseJobId = data[0].id;
        jobId = supabaseJobId;
      }
    } catch (err) {
      logger.error(`Failed to register job in Supabase: ${err.message}`);
    }
  }

  // Run the computer vision models pipeline asynchronously (Simulated)
  setTimeout(async () => {
    try {
      logger.info(`[AI Customizer] Starting pipeline for job: ${jobId}`);

      if (supabase && supabaseJobId) {
        await supabase
          .from('ai_segmentation_jobs')
          .update({ status: 'processing', logs: 'Grounding DINO detecting text and sponsor layers...' })
          .eq('id', supabaseJobId);
      }

      // Simulated Delay for SAM & ControlNet inpainting
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (supabase && supabaseJobId) {
        await supabase
          .from('ai_segmentation_jobs')
          .update({ logs: 'SAM extracting clothing masks and creating normal/occlusion maps...' })
          .eq('id', supabaseJobId);
      }

      await new Promise(resolve => setTimeout(resolve, 2500));

      // 1. Create the inpainted templates & print zone bounds
      // We use the uploaded frontImage as the inpainted base mockup image
      const frontMockup = frontImage;
      const backMockup = backImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600';

      // 2. Save base templates to MongoDB
      const template = await BlankTemplate.create({
        productId,
        name,
        views: [
          { viewId: 'front', mockupImageUrl: frontMockup, width: 600, height: 600 },
          { viewId: 'back', mockupImageUrl: backMockup, width: 600, height: 600 },
          { viewId: 'left-sleeve', mockupImageUrl: frontMockup, width: 600, height: 600 },
          { viewId: 'right-sleeve', mockupImageUrl: frontMockup, width: 600, height: 600 }
        ],
        isActive: true
      });

      // 3. Define print area offsets in MongoDB
      const printAreas = [
        // Front Chest
        { templateId: template._id, viewId: 'front', x: 185, y: 110, width: 230, height: 380, safeMargin: 10, unit: 'px' },
        // Back Name & Number
        { templateId: template._id, viewId: 'back', x: 185, y: 80, width: 230, height: 400, safeMargin: 10, unit: 'px' },
        // Left Sleeve
        { templateId: template._id, viewId: 'left-sleeve', x: 200, y: 200, width: 200, height: 200, safeMargin: 5, unit: 'px' },
        // Right Sleeve
        { templateId: template._id, viewId: 'right-sleeve', x: 200, y: 200, width: 200, height: 200, safeMargin: 5, unit: 'px' }
      ];
      await PrintArea.insertMany(printAreas);

      // 4. Save texture shader maps and segmented polygons in Supabase
      if (supabase) {
        const { data: textureData, error: texError } = await supabase
          .from('ai_jersey_textures')
          .insert([
            {
              product_id: productId.toString(),
              name: name,
              base_image_url: frontMockup,
              normal_map_url: 'https://res.cloudinary.com/dvgxs3u4h/image/upload/v1/mock_normal_map.png',
              occlusion_map_url: 'https://res.cloudinary.com/dvgxs3u4h/image/upload/v1/mock_occlusion_map.png'
            }
          ])
          .select();

        if (texError) throw texError;

        if (textureData && textureData.length > 0) {
          const textureId = textureData[0].id;

          // Save vector print zone masks
          const masks = [
            {
              texture_id: textureId,
              side: 'front',
              zone: 'chest',
              clipping_path: { points: [[185, 110], [415, 110], [415, 490], [185, 490]] },
              bounding_box: { x: 185, y: 110, width: 230, height: 380 },
              confidence: 0.985
            },
            {
              texture_id: textureId,
              side: 'back',
              zone: 'number_back',
              clipping_path: { points: [[185, 170], [415, 170], [415, 350], [185, 350]] },
              bounding_box: { x: 185, y: 170, width: 230, height: 180 },
              confidence: 0.978
            }
          ];

          await supabase.from('ai_print_masks').insert(masks);
        }

        // Complete the job status
        await supabase
          .from('ai_segmentation_jobs')
          .update({
            status: 'completed',
            logs: 'Scan finished. Inpainting models, normal shaders and vector masks generated.'
          })
          .eq('id', supabaseJobId);
      }

      logger.info(`[AI Customizer] Scan complete for job ${jobId}. Template registered.`);
    } catch (err) {
      logger.error(`[AI Customizer] Pipeline error for job ${jobId}: ${err.message}`);
      if (supabase && supabaseJobId) {
        await supabase
          .from('ai_segmentation_jobs')
          .update({ status: 'failed', error_message: err.message })
          .eq('id', supabaseJobId);
      }
    }
  }, 100); // Trigger background logic immediately

  res.status(202).json({
    status: 'success',
    data: {
      jobId,
      message: 'AI Scan pipeline initialized. Processing details.'
    }
  });
});

// 2. Fetch scan job details
export const getJobStatus = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  if (supabase && jobId.includes('-')) {
    // Looks like a Supabase UUID
    const { data, error } = await supabase
      .from('ai_segmentation_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      return next(new AppError(`Supabase Job fetch failed: ${error.message}`, 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        jobId: data.id,
        status: data.status,
        logs: data.logs,
        errorMessage: data.error_message
      }
    });
  }

  // Simulated fallback status
  res.status(200).json({
    status: 'success',
    data: {
      jobId,
      status: 'completed',
      logs: 'Mock job finished successfully.'
    }
  });
});

// 3. AI Recoloring / Shader mapping endpoint
export const recolorDesign = asyncHandler(async (req, res, next) => {
  const { templateId, baseColor, targetColors } = req.body;

  if (!templateId || !baseColor) {
    return next(new AppError('Template ID and baseColor are required.', 400));
  }

  // Simulate recolored asset path.
  // In a real pipeline, the fastapi container recolors the image using fragment shaders and uploads to Cloudinary.
  // We return a mock url mapped to the base color
  const recoloredImageUrl = `https://res.cloudinary.com/dvgxs3u4h/image/upload/b_rgb:${baseColor.replace('#', '')}/v1/custom-jersey-overlay.png`;

  res.status(200).json({
    status: 'success',
    data: {
      recoloredImageUrl
    }
  });
});
