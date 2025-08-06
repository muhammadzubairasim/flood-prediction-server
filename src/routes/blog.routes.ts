import { Router } from "express";
import { verifyToken, validateData } from "src/middlewares/auth.middleware";
import { CreateBlogSchema } from "src/interfaces/schemas/create/blog";
import { UpdateBlogSchema } from "src/interfaces/schemas/update/blog";
import * as blogController from "src/controllers/blog.controller";

const router = Router();

// All routes require authentication
router.use(verifyToken);

// Create blog
router.post("/", validateData(CreateBlogSchema), blogController.createBlog);

// Get all blogs (public to authenticated users)
router.get("/", blogController.getAllBlogs);

// Get current user's blogs
router.get("/my-blogs", blogController.getMyBlogs);

// Get blog by ID
router.get("/:id", blogController.getBlogById);

// Update blog (only author can update)
router.put("/:id", validateData(UpdateBlogSchema), blogController.updateBlog);

// Delete blog (only author can delete)
router.delete("/:id", blogController.deleteBlog);

export default router;
