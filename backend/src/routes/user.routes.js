import { Router } from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import { validate } from '../validators/validate.js';
import {
  updateProfileSchema,
  addressSchema,
  wishlistSchema,
} from '../validators/user.validator.js';

const router = Router();

// Protect all routes under user
router.use(authenticateUser);

// Profile
router.get('/profile', UserController.getProfile);
router.patch('/profile', uploadSingleImage, validate(updateProfileSchema), UserController.updateProfile);

// Addresses
router.post('/address', validate(addressSchema), UserController.addAddress);
router.put('/address/:addressId', validate(addressSchema), UserController.updateAddress);
router.delete('/address/:addressId', UserController.deleteAddress);
router.patch('/address/:addressId/default', UserController.setDefaultAddress);

// Wishlist
router.get('/wishlist', UserController.getWishlist);
router.post('/wishlist', validate(wishlistSchema), UserController.addToWishlist);
router.delete('/wishlist', validate(wishlistSchema), UserController.removeFromWishlist);

export default router;
