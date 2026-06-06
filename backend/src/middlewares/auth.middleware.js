import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';
import UserRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const authenticateUser = asyncHandler(async (req, res, next) => {
  let token;

  // 1) Read token from Authorization Header or Cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to gain access.', 401));
  }

  // 2) Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  // 3) Check if user still exists
  const currentUser = await UserRepository.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4) Check if user email is verified
  if (!currentUser.isVerified) {
    return next(new AppError('Please verify your email address to access this resource.', 403));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
