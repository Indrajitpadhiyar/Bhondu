import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().url({ message: "MONGO_URI must be a valid connection string" }),
  
  // JWT
  JWT_ACCESS_SECRET: z.string().default('bhondu_access_secret_key_12345'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('bhondu_refresh_secret_key_67890'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  
  // Cloudinary
  CLOUDINARY_NAME: z.string().default('Bhondu'),
  CLOUDINARY_API_KEY: z.string().default('336296596924377'),
  CLOUDINARY_API_SECRET: z.string().default('q_8QTGTzS5n_8kDPZGsaUtVN7Dg'),
  
  // Redis (Optional)
  REDIS_URL: z.string().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Nodemailer (Email)
  SMTP_HOST: z.string().default('smtp.mailtrap.io'),
  SMTP_PORT: z.coerce.number().default(2525),
  SMTP_USER: z.string().default('mock_user'),
  SMTP_PASS: z.string().default('mock_pass'),
  SMTP_FROM_EMAIL: z.string().email().default('no-reply@bhondu.com'),
  
  // Admin Credentials
  ADMIN_EMAIL: z.string().email().default('idrtech23@gmail.com'),
  ADMIN_PASWORD: z.string().default('IDRtech@23'),
  
  // Supabase Configuration
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Stripe Configuration
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
});

const parseEnv = () => {
  // Support case-insensitive key name for Cloudinary Api Key
  const envObj = {
    ...process.env,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_key,
    ADMIN_PASWORD: process.env.ADMIN_PASWORD || process.env.ADMIN_PASSWORD,
  };

  const parsed = envSchema.safeParse(envObj);

  if (!parsed.success) {
    console.error('❌ Environment validation failed:', JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }

  return parsed.data;
};

export const env = parseEnv();
