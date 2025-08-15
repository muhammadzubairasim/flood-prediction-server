import { NextFunction, Request, Response } from "express";
import { PredictionRequestDTO } from "src/interfaces/DTOs/prediction";
import logger from "src/utils/logger";
import * as predictionService from "src/services/prediction.service";

/**
 * Handle flood prediction request
 */
export const predict = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const predictionData: PredictionRequestDTO = req.body;
    const userId = req.user?.id;

    logger.info(`Prediction request received from user: ${userId || 'anonymous'}`);

    // Call the prediction service
    const predictionResult = await predictionService.makePrediction(predictionData);

    // Save prediction history if user is authenticated
    if (userId && predictionResult.prediction) {
      try {
        await predictionService.savePredictionHistory(
          userId,
          predictionData,
          predictionResult.prediction
        );
      } catch (error) {
        logger.error(`Failed to save prediction history: ${error}`);
        // Don't fail the request if history saving fails
      }
    }

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

/**
 * Get user's prediction history
 */
export const getPredictionHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination parameters"
      });
      return;
    }

    const historyData = await predictionService.getPredictionHistory(userId, page, limit);

    res.status(200).json({
      success: true,
      message: "Prediction history retrieved successfully",
      data: historyData
    });

  } catch (error) {
    logger.error(`Error getting prediction history: ${error}`);
    next(error);
  }
};