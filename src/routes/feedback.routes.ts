import { Router } from "express";
import { verifyToken, validateData } from "src/middlewares/auth.middleware";
import { CreateFeedbackSchema } from "src/interfaces/schemas/create/feedback";
import { UpdateFeedbackSchema } from "src/interfaces/schemas/update/feedback";
import * as feedbackController from "src/controllers/feedback.controller";

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Create feedback
router.post("/", validateData(CreateFeedbackSchema), feedbackController.createFeedback);

// Get all feedback (admin can see all)
router.get("/", feedbackController.getAllFeedback);

// Get current user's feedback
router.get("/my-feedback", feedbackController.getMyFeedback);

// Get feedback by ID
router.get("/:id", feedbackController.getFeedbackById);

// Update feedback (only owner can update)
router.put("/:id", validateData(UpdateFeedbackSchema), feedbackController.updateFeedback);

// Delete feedback (only owner can delete)
router.delete("/:id", feedbackController.deleteFeedback);

export default router;
