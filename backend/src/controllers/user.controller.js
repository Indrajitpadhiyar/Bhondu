import UserService from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await UserService.getProfile(req.user._id);
  res.status(200).json({
    status: 'success',
    data: { user: profile },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await UserService.updateProfile(req.user._id, req.body, req.file);
  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully.',
    data: { user: updatedUser },
  });
});

export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await UserService.addAddress(req.user._id, req.body);
  res.status(201).json({
    status: 'success',
    message: 'Address added successfully.',
    data: { addresses },
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const addresses = await UserService.updateAddress(req.user._id, addressId, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Address updated successfully.',
    data: { addresses },
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const addresses = await UserService.deleteAddress(req.user._id, addressId);
  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully.',
    data: { addresses },
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const addresses = await UserService.setDefaultAddress(req.user._id, addressId);
  res.status(200).json({
    status: 'success',
    message: 'Default address updated.',
    data: { addresses },
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await UserService.getWishlist(req.user._id);
  res.status(200).json({
    status: 'success',
    data: { wishlist },
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await UserService.addToWishlist(req.user._id, productId);
  res.status(200).json({
    status: 'success',
    message: 'Item added to wishlist.',
    data: { wishlist },
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await UserService.removeFromWishlist(req.user._id, productId);
  res.status(200).json({
    status: 'success',
    message: 'Item removed from wishlist.',
    data: { wishlist },
  });
});
