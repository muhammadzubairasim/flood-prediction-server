import { z } from 'zod';

/**
 * Schema for updating feedback
 */
export const UpdateFeedbackSchema = z.object({
  content: z.string().min(5, "Feedback must be at least 5 characters").max(1000, "Feedback must not exceed 1000 characters")
});

export type UpdateFeedbackInput = z.infer<typeof UpdateFeedbackSchema>;
