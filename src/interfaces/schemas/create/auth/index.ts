import { z } from 'zod';

// Base user schema
export const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  expertise: z.array(z.string().min(1, "Expertise items cannot be empty")).max(10, "Maximum 10 expertise areas allowed").optional().default([]),
  roles: z.array(z.string())
});

// Verification code schema
export const verificationCodeSchema = z.object({
  code: z.string().length(4, "Verification code must be 4 digits"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});

// Password reset schema
export const passwordResetSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
