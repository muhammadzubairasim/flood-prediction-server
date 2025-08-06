import prisma from "src/config/prisma/prisma.client";
import { CreateFeedbackDTO, UpdateFeedbackDTO } from "src/interfaces/DTOs/feedback";
import CustomError from "src/shared/exceptions/CustomError";
import logger from "src/utils/logger";

/**
 * Create new feedback
 */
export const createFeedback = async (userId: string, feedbackData: CreateFeedbackDTO) => {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        ...feedbackData,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            expertise: true

          }
        }
      }
    });

    logger.info(`Feedback created successfully by user ${userId}`);
    return feedback;
  } catch (error) {
    logger.error(`Error creating feedback: ${error}`);
    throw new CustomError(500, "Failed to create feedback");
  }
};

/**
 * Get all feedback with pagination
 */
export const getAllFeedback = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio:true,
              expertise: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.feedback.count()
    ]);

    return {
      feedback,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error fetching feedback: ${error}`);
    throw new CustomError(500, "Failed to fetch feedback");
  }
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = async (id: string) => {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar:true,
            bio:true,
            expertise: true

          }
        }
      }
    });

    if (!feedback) {
      throw new CustomError(404, "Feedback not found");
    }

    return feedback;
  } catch (error) {
    logger.error(`Error fetching feedback: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Failed to fetch feedback");
  }
};

/**
 * Get feedback by user
 */
export const getFeedbackByUser = async (userId: string, page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              expertise: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.feedback.count({ where: { userId } })
    ]);

    return {
      feedback,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error fetching user feedback: ${error}`);
    throw new CustomError(500, "Failed to fetch user feedback");
  }
};

/**
 * Update feedback
 */
export const updateFeedback = async (id: string, userId: string, updateData: UpdateFeedbackDTO) => {
  try {
    // Check if feedback exists and belongs to the user
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id }
    });

    if (!existingFeedback) {
      throw new CustomError(404, "Feedback not found");
    }

    if (existingFeedback.userId !== userId) {
      throw new CustomError(403, "You can only update your own feedback");
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            expertise: true
          }
        }
      }
    });

    logger.info(`Feedback ${id} updated by user ${userId}`);
    return updatedFeedback;
  } catch (error) {
    logger.error(`Error updating feedback: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Failed to update feedback");
  }
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (id: string, userId: string) => {
  try {
    // Check if feedback exists and belongs to the user
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id }
    });

    if (!existingFeedback) {
      throw new CustomError(404, "Feedback not found");
    }

    if (existingFeedback.userId !== userId) {
      throw new CustomError(403, "You can only delete your own feedback");
    }

    await prisma.feedback.delete({
      where: { id }
    });

    logger.info(`Feedback ${id} deleted by user ${userId}`);
    return { success: true, message: "Feedback deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting feedback: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Failed to delete feedback");
  }
};
