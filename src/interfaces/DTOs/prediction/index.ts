import { PredictionRequestSchema } from "src/interfaces/schemas/create/prediction";
import { z } from "zod";

export type PredictionRequestDTO = z.infer<typeof PredictionRequestSchema>;

export interface PredictionResponse {
  success: boolean;
  message: string;
  prediction?: any;
  data?: any;
}
