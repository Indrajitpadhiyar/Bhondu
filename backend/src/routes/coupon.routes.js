import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import {
  validateCoupon,
  createCoupon,
  listCoupons,
  deleteCoupon,
} from '../controllers/coupon.controller.js';

const router = Router();

// Public: Validate coupon
router.post('/validate', validateCoupon);

// Admin-only actions
router.post(
  '/',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  createCoupon
);

router.get(
  '/',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  listCoupons
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('Admin', 'Super Admin'),
  deleteCoupon
);

export default router;
