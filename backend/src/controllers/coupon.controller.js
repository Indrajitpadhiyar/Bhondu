import Coupon from '../models/coupon.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';

// 1. Validate a coupon code (Public)
export const validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, cartAmount } = req.body;

  if (!code) {
    return next(new AppError('Coupon code is required.', 400));
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    return next(new AppError('Invalid coupon code.', 404));
  }

  // Check Expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return next(new AppError('This coupon has expired.', 400));
  }

  // Check Usage Limits
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return next(new AppError('This coupon usage limit has been reached.', 400));
  }

  // Check Minimum Order Amount
  if (cartAmount && cartAmount < coupon.minOrderAmount) {
    return next(new AppError(`Minimum order amount of ₹${coupon.minOrderAmount} required to use this coupon.`, 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      }
    }
  });
});

// 2. Admin: Create a coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, description, type, value, minOrderAmount, maxUses, expiresAt } = req.body;

  if (!code || !type || value === undefined) {
    return next(new AppError('Code, type, and value are required.', 400));
  }

  // Check if coupon exists
  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    return next(new AppError('Coupon code already exists.', 400));
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    type,
    value,
    minOrderAmount: minOrderAmount || 0,
    maxUses,
    expiresAt,
  });

  res.status(201).json({
    status: 'success',
    data: {
      coupon,
    },
  });
});

// 3. Admin: List all coupons
export const listCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: coupons.length,
    data: {
      coupons,
    },
  });
});

// 4. Admin: Delete a coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    return next(new AppError('Coupon not found.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
