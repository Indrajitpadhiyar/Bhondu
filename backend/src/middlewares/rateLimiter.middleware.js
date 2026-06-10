import rateLimit from 'express-rate-limit';
import { env } from '../config/environment.js';

const makeLimiter = (maxRequests, windowMinutes, customMessage) => {
  // TODO: TEMPORARY — rate limiting disabled. Remove this line & uncomment below to re-enable.
  return (req, res, next) => next();

  /*
  const isDev = env.NODE_ENV === 'development';
  if (isDev) {
    return (req, res, next) => next();
  }
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: customMessage || 'Too many requests. Please try again later.',
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  */
};


// Global API: 100 requests / 15 min
export const apiLimiter = makeLimiter(100, 15, 'Too many requests. Please try again later.');

// Login: 5 requests / 15 min
export const loginLimiter = makeLimiter(5, 15, 'Too many login attempts. Please try again after 15 minutes.');

// Register: 5 requests / 15 min
export const registerLimiter = makeLimiter(5, 15, 'Too many registration attempts. Please try again after 15 minutes.');

// Forgot Password: 3 requests / 15 min
export const forgotPasswordLimiter = makeLimiter(3, 15, 'Too many password reset requests. Please try again after 15 minutes.');

// Payment APIs: 10 requests / 15 min
export const paymentLimiter = makeLimiter(10, 15, 'Too many payment requests. Please try again after 15 minutes.');

// Admin APIs: 200 requests / 15 min
export const adminLimiter = makeLimiter(200, 15, 'Too many requests to admin panel. Please try again later.');
