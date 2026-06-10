import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';
import UserRepository from '../repositories/user.repository.js';
import EmailService from './email.service.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';
import { getCache } from '../config/redis.js';

class AuthService {
  // Helper: Generate Access Token
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    });
  }

  // Helper: Generate Refresh Token
  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    });
  }

  async register(userData) {
    const { name, email, phone, password } = userData;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 400);
    }

    const user = await UserRepository.create({
      name,
      email,
      phone,
      password,
      isVerified: true,
    });

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async verifyEmail(token) {
    const user = await UserRepository.findByVerificationToken(token);
    if (!user) {
      throw new AppError('Verification token is invalid or has expired.', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Send Welcome Email
    EmailService.sendWelcomeEmail(user.email, user.name);

    return { message: 'Email verified successfully!' };
  }

  async login(email, password) {
    // Find user and select password explicitly
    const user = await UserRepository.findByEmail(email, true);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }



    // Generate tokens
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Add to user's refresh tokens
    user.refreshTokens.push(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshTokens;

    return {
      user: userObj,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId, refreshToken) {
    const user = await UserRepository.findById(userId);
    if (user) {
      // Remove current refresh token
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save({ validateBeforeSave: false });
    }
    return { success: true };
  }

  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new AppError('Refresh token required.', 400);
    }

    // 1) Verify signature of token
    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
    }

    // 2) Concurrency & Duplicate Check via Cache
    const cache = getCache();
    const cachedRotated = await cache.get(`rotated_token:${oldRefreshToken}`);
    if (cachedRotated) {
      try {
        const { accessToken, refreshToken } = JSON.parse(cachedRotated);
        logger.info(`🔄 Concurrency/duplicate refresh request detected for token. Returning cached credentials.`);
        return {
          accessToken,
          refreshToken,
        };
      } catch (e) {
        // Fall back to DB check if JSON parse fails
      }
    }

    // 3) Find user by decoded ID
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found.', 401);
    }

    // 4) Token reuse detection (Security mechanism)
    // If the oldRefreshToken is not in the user's active refresh tokens array,
    // it implies the token has already been used or stolen.
    if (!user.refreshTokens.includes(oldRefreshToken)) {
      // Suspected theft: invalidate all user refresh tokens immediately to force re-login
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      logger.warn(`🛑 Token reuse detected for User: ${user._id}. All sessions revoked.`);
      throw new AppError('Security breach suspected. All sessions cleared. Please log in again.', 403);
    }

    // 5) Rotate token: remove old token, create new access and refresh tokens
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);

    const newAccessToken = this.generateAccessToken(user._id);
    const newRefreshToken = this.generateRefreshToken(user._id);

    user.refreshTokens.push(newRefreshToken);

    try {
      await user.save({ validateBeforeSave: false });
    } catch (err) {
      // If there's a version/concurrency conflict, double-check cache to see if a parallel thread succeeded
      const doubleCheckCached = await cache.get(`rotated_token:${oldRefreshToken}`);
      if (doubleCheckCached) {
        try {
          const { accessToken, refreshToken } = JSON.parse(doubleCheckCached);
          logger.info(`🔄 Resolved concurrent Mongoose VersionError collision using cached rotated token.`);
          return {
            accessToken,
            refreshToken,
          };
        } catch (e) {}
      }
      logger.error('Error saving user during token refresh rotation:', err);
      throw new AppError('Unable to update session. Please try again.', 500);
    }

    // Cache the rotated token details with a 15-second expiration to handle concurrent retries
    try {
      await cache.set(
        `rotated_token:${oldRefreshToken}`,
        JSON.stringify({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }),
        'EX',
        15
      );
    } catch (cacheErr) {
      logger.warn('Failed to cache rotated token:', cacheErr.message);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Do not reveal that the email doesn't exist for security reasons,
      // but return a generic response. However, we'll log it.
      logger.info(`Forgot password request for non-existent email: ${email}`);
      return { message: 'If that email address exists, we have sent a password reset link.' };
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send reset email
    EmailService.sendPasswordResetEmail(user.email, user.name, resetToken);

    return { message: 'If that email address exists, we have sent a password reset link.' };
  }

  async resetPassword(token, newPassword) {
    const user = await UserRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Reset token is invalid or has expired.', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Invalidate active sessions since credentials changed
    user.refreshTokens = [];
    
    await user.save();

    return { message: 'Password has been reset successfully!' };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400);
    }

    user.password = newPassword;
    // Invalidate other sessions
    user.refreshTokens = [];
    await user.save();

    return { message: 'Password updated successfully!' };
  }

  async googleLogin(idToken) {
    if (!idToken) {
      throw new AppError('Google token is required.', 400);
    }

    let payload;
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!response.ok) {
        throw new AppError('Invalid Google credential token.', 400);
      }
      payload = await response.json();
    } catch (err) {
      throw new AppError('Failed to verify Google token with authentication servers.', 400);
    }

    // Security check: Verify audience matches Google Client ID
    const clientId = env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    if (payload.aud !== clientId) {
      throw new AppError('Google token security validation failed: Invalid client audience.', 400);
    }

    let user = await UserRepository.findByEmail(payload.email);
    if (!user) {
      // Create a new user with Google credentials
      user = await UserRepository.create({
        name: payload.name,
        email: payload.email,
        password: crypto.randomBytes(16).toString('hex') + 'A1!a', // Strong random password
        avatar: {
          url: payload.picture || 'https://res.cloudinary.com/demo/image/upload/v1600000000/sample.jpg',
        },
        isVerified: true,
      });
    } else {
      // Mark as verified if logging in with Google
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Add to user's active refresh tokens list
    user.refreshTokens.push(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshTokens;

    return {
      user: userObj,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
