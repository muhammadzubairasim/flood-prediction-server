import { z } from 'zod';

/**
 * Schema for updating a user
 */
export const UpdateUserSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    username: z.string().min(3, "Username must be at least 3 characters").optional(),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").optional(),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .optional(),
    bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
    avatar: z.string().url("Avatar must be a valid URL").optional(),
    expertise: z.array(z.string().min(1, "Expertise items cannot be empty")).max(10, "Maximum 10 expertise areas allowed").optional(),
    roles: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;