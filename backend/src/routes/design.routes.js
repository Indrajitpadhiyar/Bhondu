import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import {
  createDesign,
  getDesignById,
  updateDesign,
  getMyDesigns,
  deleteDesign,
  duplicateDesign,
  getExportUrl,
} from '../controllers/design.controller.js';
import { recolorDesign } from '../controllers/ai-customizer.controller.js';

const router = Router();

// All routes require user authentication
router.use(authenticateUser);

router.post('/', createDesign);
router.post('/recolor', recolorDesign);
router.get('/my', getMyDesigns);
router.get('/:id', getDesignById);
router.patch('/:id', updateDesign);
router.delete('/:id', deleteDesign);
router.post('/:id/duplicate', duplicateDesign);
router.get('/:id/export', getExportUrl);

export default router;
