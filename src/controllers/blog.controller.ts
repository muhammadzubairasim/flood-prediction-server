import { NextFunction, Request, Response } from "express";
import { CreateBlogDTO, UpdateBlogDTO } from "src/interfaces/DTOs/blog";
import logger from "src/utils/logger";
import * as blogService from "src/services/blog.service";

/**
 * Create a new blog post
 */
export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.user.id;
    const blogData: CreateBlogDTO = req.body;

    const blog = await blogService.createBlog(authorId, blogData);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });
  } catch (error) {
    logger.error(`Error in createBlog controller: ${error}`);
    next(error);
  }
};

/**
 * Get all blogs
 */
export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await blogService.getAllBlogs(page, limit);

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getAllBlogs controller: ${error}`);
    next(error);
  }
};

/**
 * Get blog by ID
 */
export const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const blog = await blogService.getBlogById(id);

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog
    });
  } catch (error) {
    logger.error(`Error in getBlogById controller: ${error}`);
    next(error);
  }
};

/**
 * Get blogs by current user
 */
export const getMyBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await blogService.getBlogsByAuthor(authorId, page, limit);

    res.status(200).json({
      success: true,
      message: "Your blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in getMyBlogs controller: ${error}`);
    next(error);
  }
};

/**
 * Update blog
 */
export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;
    const updateData: UpdateBlogDTO = req.body;

    const updatedBlog = await blogService.updateBlog(id, authorId, updateData);

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog
    });
  } catch (error) {
    logger.error(`Error in updateBlog controller: ${error}`);
    next(error);
  }
};

/**
 * Delete blog
 */
export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;

    const result = await blogService.deleteBlog(id, authorId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    logger.error(`Error in deleteBlog controller: ${error}`);
    next(error);
  }
};
