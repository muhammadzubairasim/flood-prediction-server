import { NextFunction, Request, Response } from "express";
import { PredictionRequestDTO } from "src/interfaces/DTOs/prediction";
import logger from "src/utils/logger";
import * as predictionService from "src/services/prediction.service";

/**
 * Handle flood prediction request
 */
export const predict = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const predictionData: PredictionRequestDTO = req.body;

    logger.info(`Prediction request received from user: ${req.user?.id || 'anonymous'}`);

    // Call the prediction service
    const predictionResult = await predictionService.makePrediction(predictionData);

    // Return the prediction result
    res.status(200).json({
      success: true,
      message: "Prediction completed successfully",
      data: predictionResult.prediction
    });

  } catch (error) {
    logger.error(`Error in prediction controller: ${error}`);
    next(error);
  }
};
