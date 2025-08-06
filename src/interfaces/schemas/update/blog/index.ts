import { z } from 'zod';

/**
 * Schema for updating a blog
 */
export const UpdateBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must not exceed 200 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").optional(),
  excerpt: z.string().max(500, "Excerpt must not exceed 500 characters").optional(),
  readTime: z.number().min(1, "Read time must be at least 1 minute").optional(),
  tags: z.array(z.string()).max(10, "You can add up to 10 tags").optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
