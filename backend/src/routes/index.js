import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import uploadRoutes from './upload.routes.js';
import templateRoutes from './template.routes.js';
import designRoutes from './design.routes.js';
import fontRoutes from './font.routes.js';
import graphicRoutes from './graphic.routes.js';
import couponRoutes from './coupon.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/templates', templateRoutes);
router.use('/designs', designRoutes);
router.use('/fonts', fontRoutes);
router.use('/graphics', graphicRoutes);
router.use('/coupons', couponRoutes);

export default router;

