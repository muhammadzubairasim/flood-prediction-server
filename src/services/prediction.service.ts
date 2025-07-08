import { PredictionRequestDTO, PredictionResponse } from "src/interfaces/DTOs/prediction";
import CustomError from "src/shared/exceptions/CustomError";
import logger from "src/utils/logger";

const PREDICTION_SERVICE_URL = 'https://flood-prediction-model-production.up.railway.app/predict';

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
    
    // Handle fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new CustomError(503, "Unable to connect to prediction service");
    }
    
    throw new CustomError(500, "Failed to make prediction");
  }
};
