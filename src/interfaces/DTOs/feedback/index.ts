import { CreateFeedbackSchema } from "src/interfaces/schemas/create/feedback";
import { UpdateFeedbackSchema } from "src/interfaces/schemas/update/feedback";
import { z } from "zod";

export type CreateFeedbackDTO = z.infer<typeof CreateFeedbackSchema>;
export type UpdateFeedbackDTO = z.infer<typeof UpdateFeedbackSchema>;

export interface FeedbackResponse {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
