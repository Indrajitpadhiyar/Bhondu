import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Reset token is required' }),
    password: z.string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Verification token is required' }),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }),
    newPassword: z.string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'New password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'New password must contain at least one special character'),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string({ required_error: 'Google ID token is required' }),
  }),
});
