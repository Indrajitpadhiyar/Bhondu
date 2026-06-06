import BaseRepository from './base.repository.js';
import User from '../models/user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, selectPassword = false) {
    let query = this.model.findOne({ email: email.toLowerCase() });
    if (selectPassword) {
      query = query.select('+password');
    }
    return query;
  }

  async findByVerificationToken(token) {
    return this.model.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
  }

  async findByResetToken(token) {
    return this.model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }

  async addAddress(userId, addressData) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    // If it's marked default or if it's the first address, make it default
    if (addressData.isDefault || user.addresses.length === 0) {
      addressData.isDefault = true;
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(addressData);
    await user.save();
    return user;
  }

  async updateAddress(userId, addressId, addressData) {
    const user = await this.findById(userId);
    if (!user) return null;

    const address = user.addresses.id(addressId);
    if (!address) return null;

    // Update fields
    Object.assign(address, addressData);

    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();
    return user;
  }

  async deleteAddress(userId, addressId) {
    const user = await this.findById(userId);
    if (!user) return null;

    const address = user.addresses.id(addressId);
    if (!address) return null;

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);

    // If we deleted the default address and there are remaining addresses, set the first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return user;
  }

  async setDefaultAddress(userId, addressId) {
    const user = await this.findById(userId);
    if (!user) return null;

    const address = user.addresses.id(addressId);
    if (!address) return null;

    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    return user;
  }

  async addToWishlist(userId, productId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
  }

  async removeFromWishlist(userId, productId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
  }
}

export default new UserRepository();
