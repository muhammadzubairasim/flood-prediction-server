import { z } from 'zod';

/**
 * Schema for flood prediction request
 */
export const PredictionRequestSchema = z.object({
  aspect: z.number().min(0, "Aspect must be a positive number"),
  dem: z.number().min(0, "DEM must be a positive number"),
  distroads: z.number().min(0, "Distance to roads must be a positive number"),
  distwater: z.number().min(0, "Distance to water must be a positive number"),
  hand: z.number().min(0, "HAND must be a positive number"),
  ndvi: z.number().min(0, "NDVI must be a positive number"),
  rainfreq: z.number().min(0, "Rain frequency must be a positive number"),
  ratio: z.number().min(0, "Ratio must be a positive number"),
  slope: z.number().min(0, "Slope must be a positive number"),
  twi: z.number().min(0, "TWI must be a positive number")
});

export type PredictionRequest = z.infer<typeof PredictionRequestSchema>;
