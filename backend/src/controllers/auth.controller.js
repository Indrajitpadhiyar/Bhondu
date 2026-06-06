import AuthService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { env } from '../config/environment.js';

// Cookie options helper
const getCookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: maxAgeMs,
});

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Registration successful! Please check your email to verify your account.',
    data: { user: result },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  // Can get verification token from query params or request body
  const token = req.query.token || req.body.token;
  const result = await AuthService.verifyEmail(token);
  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.login(email, password);

  // Set HTTP Only Cookies
  res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15 mins
  res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully.',
    accessToken,
    refreshToken,
    data: { user },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (userId && refreshToken) {
    await AuthService.logout(userId, refreshToken);
  }

  // Clear HTTP Only Cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!oldRefreshToken) {
    return res.status(200).json({
      status: 'success',
      accessToken: null,
      message: 'No refresh token provided.'
    });
  }

  const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(oldRefreshToken);

  // Set updated cookies
  res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15 mins
  res.cookie('refreshToken', newRefreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

  res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken: newRefreshToken,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body.email);
  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.query.token || req.body.token;
  const { password } = req.body;
  const result = await AuthService.resetPassword(token, password);
  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await AuthService.changePassword(req.user._id, currentPassword, newPassword);

  // Clear cookies to force re-login with new password
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.googleLogin(idToken);

  // Set HTTP Only Cookies
  res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000)); // 15 mins
  res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

  res.status(200).json({
    status: 'success',
    message: 'Logged in with Google successfully.',
    accessToken,
    refreshToken,
    data: { user },
  });
});
