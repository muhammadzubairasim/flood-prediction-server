import { verifyToken } from './../middlewares/auth.middleware';
import { Router } from "express";
import { UpdateUserSchema } from "src/interfaces/schemas/update/user";
import { validateData } from "src/middlewares/auth.middleware";
import * as userController from "src/controllers/user.controller";

const router = Router()

// Update user information
router.patch("/update", verifyToken, validateData(UpdateUserSchema), userController.updateUser);

// Get user by ID
router.get("/:id", verifyToken, userController.getUserById);

export default router;