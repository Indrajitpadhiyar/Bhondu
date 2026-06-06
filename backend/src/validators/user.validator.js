import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Must provide at least one field to update',
  }),
});

export const addressSchema = z.object({
  body: z.object({
    street: z.string({ required_error: 'Street is required' }).trim().min(3, 'Street is too short'),
    city: z.string({ required_error: 'City is required' }).trim().min(2, 'City is too short'),
    state: z.string({ required_error: 'State is required' }).trim().min(2, 'State is too short'),
    postalCode: z.string({ required_error: 'Postal code is required' }).trim().min(3, 'Postal code is too short'),
    country: z.string({ required_error: 'Country is required' }).trim().min(2, 'Country is too short'),
    isDefault: z.boolean().optional().default(false),
  }),
});

export const wishlistSchema = z.object({
  body: z.object({
    productId: z.string({ required_error: 'Product ID is required' }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  }),
});
