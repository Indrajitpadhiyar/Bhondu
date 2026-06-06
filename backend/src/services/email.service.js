import nodemailer from 'nodemailer';
import { env } from '../config/environment.js';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: `"${env.CLOUDINARY_NAME} Support" <${env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`📧 Email sent successfully to ${to}: Message ID: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
      // Return false instead of throwing, so the user flow is not broken if mail transport fails in sandbox
      return false;
    }
  }

  async sendVerificationEmail(to, name, token) {
    const subject = 'Verify Your Email Address - BHONDU';
    const verificationUrl = `http://localhost:${env.PORT}/api/v1/auth/verify-email?token=${token}`;
    
    if (env.NODE_ENV === 'development') {
      logger.info(`🔑 [DEV ONLY] Verification link for ${to}: ${verificationUrl}`);
    }
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Welcome to BHONDU!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>Alternatively, you can copy and paste the following token to complete your email verification process:</p>
        <p style="background-color: #f4f4f4; padding: 10px; text-align: center; font-family: monospace; font-size: 16px; border-radius: 4px;">${token}</p>
        <p>This verification link and token will expire in 24 hours.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">If you did not create a BHONDU account, please ignore this email.</p>
      </div>
    `;

    const text = `Hi ${name},\n\nPlease verify your account by visiting: ${verificationUrl}\n\nToken: ${token}\n\nThank you,\nBHONDU Team`;

    return this.sendEmail({ to, subject, html, text });
  }

  async sendPasswordResetEmail(to, name, token) {
    const subject = 'Reset Your Password - BHONDU';
    const resetUrl = `http://localhost:${env.PORT}/api/v1/auth/reset-password?token=${token}`;

    if (env.NODE_ENV === 'development') {
      logger.info(`🔑 [DEV ONLY] Password reset link for ${to}: ${resetUrl}`);
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset for your BHONDU account. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Alternatively, you can copy and paste the following token in your application:</p>
        <p style="background-color: #f4f4f4; padding: 10px; text-align: center; font-family: monospace; font-size: 16px; border-radius: 4px;">${token}</p>
        <p>This reset request is valid for 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    const text = `Hi ${name},\n\nYou requested a password reset. Reset url: ${resetUrl}\n\nToken: ${token}\n\nBHONDU Team`;

    return this.sendEmail({ to, subject, html, text });
  }

  async sendWelcomeEmail(to, name) {
    const subject = 'Welcome to BHONDU!';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #000; text-align: center;">You're Verified! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Your email has been verified successfully. Welcome to BHONDU, your premier destination for the latest in premium fashion.</p>
        <p>Start exploring our collections and build your dream wardrobe today!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Shopping</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">Sent by BHONDU Fashion Platform.</p>
      </div>
    `;

    const text = `Hi ${name},\n\nWelcome to BHONDU! Your account has been verified successfully.\n\nHappy Shopping,\nBHONDU Team`;

    return this.sendEmail({ to, subject, html, text });
  }
}

export default new EmailService();
