import { Router } from 'express';
import multer from 'multer';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
  listGraphics,
  listCategories,
  createGraphic,
  deleteGraphic,
} from '../controllers/graphic.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', listGraphics);
router.get('/categories', listCategories);

// Admin-only actions
router.post(
  '/',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  upload.single('file'),
  createGraphic
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  deleteGraphic
);

export default router;
