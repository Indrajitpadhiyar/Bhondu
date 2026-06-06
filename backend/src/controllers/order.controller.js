import Order from '../models/order.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { ROLES } from '../constants/roles.js';

export const createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, totalPrice, shippingPrice } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    totalPrice,
    shippingPrice,
  });

  res.status(201).json({
    status: 'success',
    data: { order },
  });
});

export const getOrders = asyncHandler(async (req, res, next) => {
  let filter = {};
  
  // If not admin, user can only see their own orders
  if (req.user.role === ROLES.CUSTOMER) {
    filter.user = req.user._id;
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders },
  });
});

export const getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Authorize: user must own the order or be an admin
  if (req.user.role === ROLES.CUSTOMER && order.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to view this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});
