import { PredictionRequestDTO, PredictionResponse } from "src/interfaces/DTOs/prediction";
import CustomError from "src/shared/exceptions/CustomError";
import logger from "src/utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PREDICTION_SERVICE_URL = 'http://localhost:8000/predict';

/**
 * Make prediction request to external flood prediction service
 * @param predictionData - Data for flood prediction
 * @returns Prediction response from external service
 */
export const makePrediction = async (predictionData: PredictionRequestDTO): Promise<PredictionResponse> => {
  try {
    logger.info(`Making prediction request with data: ${JSON.stringify(predictionData)}`);

    const response = await fetch(PREDICTION_SERVICE_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Prediction service error: ${response.status} - ${errorText}`);
      throw new CustomError(response.status, `Prediction service error: ${errorText}`);
    }

    const predictionResult = await response.json();
    
    logger.info(`Prediction successful: ${JSON.stringify(predictionResult)}`);

    return {
      success: true,
      message: "Prediction completed successfully",
      prediction: predictionResult,
      data: predictionResult
    };

  } catch (error) {
    logger.error(`Error making prediction: ${error}`);
    
    if (error instanceof CustomError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new CustomError(503, "Unable to connect to prediction service");
    }
    
    throw new CustomError(500, "Failed to make prediction");
  }
};

/**
 * Save prediction history to database
 * @param userId - User ID
 * @param inputData - Input parameters used for prediction
 * @param predictionResult - Result from prediction service
 */
export const savePredictionHistory = async (
  userId: string, 
  inputData: PredictionRequestDTO,
  predictionResult: any
): Promise<void> => {
  try {
    await prisma.predictionHistory.create({
      data: {
        userId,
        inputSummary: inputData,
        predictions: predictionResult.predictions,
        consensus: predictionResult.consensus,
        bestModelName: predictionResult.best_model_prediction.model_name,
        bestPrediction: predictionResult.best_model_prediction.prediction,
        bestPredictionLabel: predictionResult.best_model_prediction.prediction_label,
        bestFloodProbability: predictionResult.best_model_prediction.flood_probability,
        bestConfidence: predictionResult.best_model_prediction.confidence,
        bestModelAccuracy: predictionResult.best_model_prediction.model_accuracy,
        bestModelAuc: predictionResult.best_model_prediction.model_auc,
      },
    });
    
    logger.info(`Prediction history saved for user: ${userId}`);
  } catch (error) {
    logger.error(`Error saving prediction history: ${error}`);
    throw new CustomError(500, "Failed to save prediction history");
  }
};

/**
 * Get prediction history for a user
 * @param userId - User ID
 * @param page - Page number
 * @param limit - Items per page
 */
export const getPredictionHistory = async (
  userId: string, 
  page: number = 1, 
  limit: number = 10
) => {
  try {
    const skip = (page - 1) * limit;
    
    const [predictions, total] = await Promise.all([
      prisma.predictionHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.predictionHistory.count({
        where: { userId },
      }),
    ]);

    const formattedPredictions = predictions.map(p => ({
      id: p.id,
      input_summary: p.inputSummary,
      predictions: p.predictions,
      consensus: p.consensus,
      best_model_prediction: {
        model_name: p.bestModelName,
        prediction: p.bestPrediction,
        prediction_label: p.bestPredictionLabel,
        flood_probability: p.bestFloodProbability,
        confidence: p.bestConfidence,
        model_accuracy: p.bestModelAccuracy,
        model_auc: p.bestModelAuc,
      },
      created_at: p.createdAt,
    }));

    return {
      predictions: formattedPredictions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error(`Error getting prediction history: ${error}`);
    throw new CustomError(500, "Failed to get prediction history");
  }
};