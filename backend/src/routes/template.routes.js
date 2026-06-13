import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
  createTemplate,
  getTemplatesByProduct,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  definePrintArea,
  getPrintAreaByView,
} from '../controllers/template.controller.js';
import { analyzeTemplate, getJobStatus } from '../controllers/ai-customizer.controller.js';

const router = Router();

// Public / Authenticated Customer routes
router.get('/product/:productId', getTemplatesByProduct);
router.get('/jobs/:jobId', getJobStatus);
router.get('/:id', getTemplateById);
router.get('/:templateId/print-area/:viewId', getPrintAreaByView);

// Admin only routes
router.post(
  '/',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  createTemplate
);

router.patch(
  '/:id',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  updateTemplate
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  deleteTemplate
);

router.post(
  '/print-area',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  definePrintArea
);

router.post(
  '/analyze',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  analyzeTemplate
);

export default router;
