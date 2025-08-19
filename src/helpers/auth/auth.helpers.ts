// generate token for user signup
import jwt, { SignOptions } from "jsonwebtoken"
import env from "src/config/env"
import prisma from "src/config/prisma/prisma.client";
import { otpPurpose } from "src/interfaces/enums/auth";
import { sendEmail } from "src/services/email.service"
import CustomError from "src/shared/exceptions/CustomError";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';





// generate token helper
export const generateToken = (payload:any , expiresIn?:number): string => {
  if(!expiresIn){
    if(payload.isVerified){
      expiresIn = 60 * 60 * 24; // 24 hours
    }else{
      expiresIn = 60 * 5; // 5 minutes
    }
  }
    const options: SignOptions = { expiresIn: expiresIn }
    return jwt.sign(payload, String(env.JWT_SECRET), options)
}


// 4 digit code randome number 
export const generateRandomCode = (): string => {
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomCode.toString();
}
const emailTemplates = {
  verification: (otp: string) => `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f9; padding: 20px; border-radius: 10px;">
      <div style="background-color: #2c3e50; color: #fff; padding: 20px; text-align: center; border-radius: 10px;">
        <h2>Email Verification</h2>
      </div>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Please use the following OTP to verify your email address for flood prediction updates:</p>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #333; border: 2px solid #ddd; border-radius: 5px;">
        ${otp}
      </div>
      <p style="font-size: 16px; color: #333;">This code will expire in 1 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you didn’t request this, please ignore this email.</p>
      <footer style="font-size: 12px; text-align: center; color: #777; margin-top: 30px;">
        <p>Flood Prediction Model | <a href="http://www.floodprediction.com" style="color: #2c3e50;">Visit our site</a></p>
      </footer>
    </div>
  `,
  
  passwordReset: (otp: string) => `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f9; padding: 20px; border-radius: 10px;">
      <div style="background-color: #2c3e50; color: #fff; padding: 20px; text-align: center; border-radius: 10px;">
        <h2>Password Reset</h2>
      </div>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Please use the following OTP to reset your password for your flood prediction account:</p>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #333; border: 2px solid #ddd; border-radius: 5px;">
        ${otp}
      </div>
      <footer style="font-size: 12px; text-align: center; color: #777; margin-top: 30px;">
        <p>Flood Prediction Model | <a href="http://www.floodprediction.com" style="color: #2c3e50;">Visit our site</a></p>
      </footer>
    </div>
  `,
  
  welcome: (name: string) => `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f9; padding: 20px; border-radius: 10px;">
      <div style="background-color: #2c3e50; color: #fff; padding: 20px; text-align: center; border-radius: 10px;">
        <h2>Welcome to Flood Prediction Model!</h2>
      </div>
      <p style="font-size: 16px; color: #333;">Hello ${name},</p>
      <p style="font-size: 16px; color: #333;">Thank you for joining our flood prediction platform. We are excited to have you on board and help you stay informed about flood risks and prediction models.</p>
      <p style="font-size: 16px; color: #333;">To get started, please <a href="http://www.floodprediction.com" style="color: #2c3e50;">visit our dashboard</a> to check flood risk predictions for your area.</p>
      <footer style="font-size: 12px; text-align: center; color: #777; margin-top: 30px;">
        <p>Flood Prediction Model | <a href="http://www.floodprediction.com" style="color: #2c3e50;">Visit our site</a></p>
      </footer>
    </div>
  `
};

export async function sendVerificationEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address'
  }, emailTemplates.verification(otp));
  }

export async function sendPasswordResetEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: 'Reset Your Password'
  }, emailTemplates.passwordReset(otp));
}



export async function generateAndSaveRefreshToken(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyRefreshToken(token: string ): Promise<{userId: string}> {
  // Check if token exists in database
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token: token },
    include: { user: true },
  });

  if (!refreshToken) {
    throw new Error('Invalid refresh token');
  }


  // Check if token is expired
  if (refreshToken.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.refreshToken.delete({ where: { id: refreshToken.id } });
    throw new Error('Refresh token expired');
  }

  return { userId:refreshToken.userId};
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.delete({ where: { token } });
}

export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
// Add this function at the top of your file or in a separate helper file
export const createJwtPayload = (user: any) => {
  return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
      isVerified: user.isEmailVerified || false,
  };
};

export const findLatestValidOtp = async (userId: string) => {
  return await prisma.otp.findFirst({
    where: {
      userId,
      expiresAt: {
        gte: new Date(),
      },
      isActive: true,
    },
    orderBy: {
      requestedAt: 'desc',
    },
  });
};

/**
 * Validate an OTP against stored hash
 */
export const validateOtp = async (otpRecord: any, otp: string) => {
  if (!otpRecord) {
    throw new CustomError(400, 'Invalid or expired OTP');
  }

  if (!otpRecord.isActive) {
    throw new CustomError(400, 'OTP has already been used');
  }

  const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValidOtp) {
    throw new CustomError(400, 'Invalid OTP');
  }

  return true;
};

/**
 * Deactivate a specific OTP by ID
 */
export const deactivateOtp = async (id: string) => {
  await prisma.otp.update({
    where: {
      id: id
    },
    data: {
      isActive: false,
    }
  });
};

/**
 * Deactivate all active OTPs for a user
 */
export const deactivateUserOtps = async (userId: string) => {
  await prisma.otp.updateMany({
    where: {
      userId,
      isActive: true,
    },
    data: {
      isActive: false,
    }
  });
};

/**
 * Create a password reset token for a user
 */
export const createPasswordResetToken = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new CustomError(404, 'User not found');
  }
  
  const resetPayload = {
    id: user.id,
    email: user.email,
    purpose: 'password_reset'
  };
  
  // Generate token valid for 5 minutes
  return {
    resetToken: generateToken(resetPayload, 5000),
    user
  };
};
