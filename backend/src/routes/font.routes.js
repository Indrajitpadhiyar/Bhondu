import { Router } from 'express';
import multer from 'multer';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import { listFonts, createFont, deleteFont } from '../controllers/font.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const fontUploadFields = upload.fields([
  { name: 'woff2', maxCount: 1 },
  { name: 'ttf', maxCount: 1 },
]);

router.get('/', listFonts);

// Admin-only actions
router.post(
  '/',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  fontUploadFields,
  createFont
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  deleteFont
);

export default router;
