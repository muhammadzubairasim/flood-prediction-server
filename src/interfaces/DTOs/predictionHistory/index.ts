// ...existing code...

export interface ModelPrediction {
  model_name: string;
  prediction: number;
  prediction_label: string;
  flood_probability: number;
  confidence: number;
  model_accuracy: number;
  model_auc: number;
}

export interface MultiModelPredictionOutput {
  input_summary: Record<string, any>;
  predictions: ModelPrediction[];
  consensus: Record<string, any>;
  best_model_prediction: ModelPrediction;
}

export interface PredictionHistoryItem {
  id: string;
  input_summary: Record<string, any>;
  predictions: ModelPrediction[];
  consensus: Record<string, any>;
  best_model_prediction: ModelPrediction;
  created_at: Date;
}

export interface PredictionHistoryResponse {
  predictions: PredictionHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}