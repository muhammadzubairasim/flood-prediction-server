import { Router } from "express";
import { validateData, verifyToken } from "src/middlewares/auth.middleware";
import { PredictionRequestSchema } from "src/interfaces/schemas/create/prediction";
import * as predictionController from "src/controllers/prediction.controller";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// POST /predict - Make flood prediction
router.post("/", validateData(PredictionRequestSchema), predictionController.predict);

// GET /history - Get prediction history
router.get("/history", predictionController.getPredictionHistory);

export default router;