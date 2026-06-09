import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
} from '../middlewares/rateLimiter.middleware.js';
import { validate } from '../validators/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  googleLoginSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), AuthController.register);
router.get('/verify-email', AuthController.verifyEmail); // Supports browser query param link
router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail); // Supports JSON payload POST
router.post('/login', loginLimiter, validate(loginSchema), AuthController.login);
router.post('/google-login', validate(googleLoginSchema), AuthController.googleLogin);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', forgotPasswordLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', forgotPasswordLimiter, validate(resetPasswordSchema), AuthController.resetPassword);
router.post('/change-password', authenticateUser, validate(changePasswordSchema), AuthController.changePassword);

export default router;
