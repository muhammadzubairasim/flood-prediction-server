import { NextFunction, Request, Response } from "express";
import { CreateFeedbackDTO, UpdateFeedbackDTO } from "src/interfaces/DTOs/feedback";
import logger from "src/utils/logger";
import * as feedbackService from "src/services/feedback.service";

/**
 * Create new feedback
 */
export const createFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const feedbackData: CreateFeedbackDTO = req.body;

    const feedback = await feedbackService.createFeedback(userId, feedbackData);

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback
    });
  } catch (error) {
    logger.error(`Error in createFeedback controller: ${error}`);
    next(error);
  }
};

/**
 * Get all feedback (admin only)
 */
export const getAllFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await feedbackService.getAllFeedback(page, limit);

    res.status(200).json({
      success: true,
      message: "Feedback fetched successfully",
      data: result.feedback,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getAllFeedback controller: ${error}`);
    next(error);
  }
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const feedback = await feedbackService.getFeedbackById(id);

    res.status(200).json({
      success: true,
      message: "Feedback fetched successfully",
      data: feedback
    });
  } catch (error) {
    logger.error(`Error in getFeedbackById controller: ${error}`);
    next(error);
  }
};

/**
 * Get feedback by current user
 */
export const getMyFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await feedbackService.getFeedbackByUser(userId, page, limit);

    res.status(200).json({
      success: true,
      message: "Your feedback fetched successfully",
      data: result.feedback,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getMyFeedback controller: ${error}`);
    next(error);
  }
};

/**
 * Update feedback
 */
export const updateFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData: UpdateFeedbackDTO = req.body;

    const updatedFeedback = await feedbackService.updateFeedback(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: updatedFeedback
    });
  } catch (error) {
    logger.error(`Error in updateFeedback controller: ${error}`);
    next(error);
  }
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await feedbackService.deleteFeedback(id, userId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    logger.error(`Error in deleteFeedback controller: ${error}`);
    next(error);
  }
};
