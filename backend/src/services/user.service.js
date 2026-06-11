import UserRepository from '../repositories/user.repository.js';
import UploadService from './upload.service.js';
import AppError from '../utils/appError.js';

class UserService {
  async getProfile(userId) {
    const user = await UserRepository.findById(userId, 'wishlist');
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  }

  async updateProfile(userId, updateData, avatarFile) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Handle avatar upload if a new file is provided
    if (avatarFile) {
      // Upload new avatar buffer
      const uploadResult = await UploadService.uploadImageBuffer(avatarFile.buffer, 'avatars');
      
      // Delete old avatar from Cloudinary if it exists and isn't the default
      if (user.avatar && user.avatar.publicId) {
        await UploadService.deleteImage(user.avatar.publicId);
      }
      
      user.avatar = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    // Update text fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.phone) user.phone = updateData.phone;

    await user.save({ validateModifiedOnly: true });
    return user;
  }

  async addAddress(userId, addressData) {
    const user = await UserRepository.addAddress(userId, addressData);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user.addresses;
  }

  async updateAddress(userId, addressId, addressData) {
    const user = await UserRepository.updateAddress(userId, addressId, addressData);
    if (!user) {
      throw new AppError('User, address, or target ID not found.', 404);
    }
    return user.addresses;
  }

  async deleteAddress(userId, addressId) {
    const user = await UserRepository.deleteAddress(userId, addressId);
    if (!user) {
      throw new AppError('User or address ID not found.', 404);
    }
    return user.addresses;
  }

  async setDefaultAddress(userId, addressId) {
    const user = await UserRepository.setDefaultAddress(userId, addressId);
    if (!user) {
      throw new AppError('User or address ID not found.', 404);
    }
    return user.addresses;
  }

  async getWishlist(userId) {
    const user = await UserRepository.findById(userId, 'wishlist');
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user.wishlist;
  }

  async addToWishlist(userId, productId) {
    const user = await UserRepository.addToWishlist(userId, productId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user.wishlist;
  }

  async removeFromWishlist(userId, productId) {
    const user = await UserRepository.removeFromWishlist(userId, productId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user.wishlist;
  }
}

export default new UserService();
