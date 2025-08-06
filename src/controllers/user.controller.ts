
// update user info
import { NextFunction, Request, Response } from "express";
import { updateUserInfo } from "src/interfaces/DTOs/user";
import logger from "src/utils/logger";
import * as userService from "src/services/user.service";

export const updateUser = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const userId = req.user.id;
        const userData: updateUserInfo = req.body;
    
        // Call the user service to update user information
        const updatedUser = await userService.updateUser(userId, userData);
    
        // Return the updated user information
        res.status(200).json({
        success: true,
        message: "User information updated successfully",
        data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        // Call the user service to get user by ID
        const result = await userService.getUserById(id);
        
        // Return the user information
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: result.user
        });
    } catch (error) {
        logger.error(`Error in getUserById controller: ${error}`);
        next(error);
    }
}