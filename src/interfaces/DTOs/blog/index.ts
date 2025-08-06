import { CreateBlogSchema } from "src/interfaces/schemas/create/blog";
import { UpdateBlogSchema } from "src/interfaces/schemas/update/blog";
import { z } from "zod";

export type CreateBlogDTO = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogDTO = z.infer<typeof UpdateBlogSchema>;

export interface BlogResponse {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
