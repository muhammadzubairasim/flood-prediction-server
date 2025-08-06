import { z } from 'zod';

/**
 * Schema for creating feedback
 */
export const CreateFeedbackSchema = z.object({
  content: z.string().min(5, "Feedback must be at least 5 characters").max(1000, "Feedback must not exceed 1000 characters")
});

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
