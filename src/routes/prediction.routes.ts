import { Router } from "express";
import {  validateData } from "src/middlewares/auth.middleware";
import { PredictionRequestSchema } from "src/interfaces/schemas/create/prediction";
import * as predictionController from "src/controllers/prediction.controller";

const router = Router();

// POST /predict - Make flood prediction
router.post("/predict", validateData(PredictionRequestSchema), predictionController.predict);

export default router;
