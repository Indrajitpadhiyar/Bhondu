import { Router } from 'express';
import * as ProductController from '../controllers/product.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/seed', ProductController.seedProducts);
router.get('/:id', ProductController.getProductDetails);

// Admin-only endpoints
router.post('/', authenticateUser, authorizeRoles('Admin', 'Super Admin'), ProductController.createProduct);
router.patch('/:id', authenticateUser, authorizeRoles('Admin', 'Super Admin'), ProductController.updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Super Admin'), ProductController.deleteProduct);

export default router;
