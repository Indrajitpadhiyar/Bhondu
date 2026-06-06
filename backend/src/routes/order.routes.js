import { Router } from 'express';
import * as OrderController from '../controllers/order.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderDetails);

// Admin status update
router.patch('/:id/status', authorizeRoles('Admin', 'Super Admin'), OrderController.updateOrderStatus);

export default router;
