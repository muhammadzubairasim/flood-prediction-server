import { z } from 'zod';

/**
 * Schema for creating a blog
 */
export const CreateBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must not exceed 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().max(500, "Excerpt must not exceed 500 characters").optional(),
  readTime: z.number().min(1, "Read time must be at least 1 minute").optional(),
  tags:z.array(z.string().min(1, "Tag must be at least 1 character").max(50, "Tag must not exceed 50 characters")).optional(),
});

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
