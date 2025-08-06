import prisma from "src/config/prisma/prisma.client";
import { CreateBlogDTO, UpdateBlogDTO } from "src/interfaces/DTOs/blog";
import CustomError from "src/shared/exceptions/CustomError";
import logger from "src/utils/logger";

/**
 * Create a new blog post
 */
export const createBlog = async (authorId: string, blogData: CreateBlogDTO) => {
  try {
    logger.info(`Creating blog with data: ${JSON.stringify(blogData)}`);
    const blog = await prisma.blogs.create({
      data: {
        readTime: blogData.readTime,
        ...blogData,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            expertise: true,  
          }
        }
      }
    });

    logger.info(`Blog created successfully by user ${JSON.stringify(blog)}`);
    return blog;
  } catch (error) {
    logger.error(`Error creating blog: ${error}`);
    throw new CustomError(500, "Failed to create blog");
  }
};

/**
 * Get all blogs with pagination
 */
export const getAllBlogs = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const [blogs, total] = await Promise.all([
      prisma.blogs.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              expertise: true,

            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.blogs.count()
    ]);

    return {
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error fetching blogs: ${error}`);
    throw new CustomError(500, "Failed to fetch blogs");
  }
};

/**
 * Get blog by ID
 */
export const getBlogById = async (id: string) => {
  try {
    const blog = await prisma.blogs.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            expertise: true,
          }
        }
      }
    });

    if (!blog) {
      throw new CustomError(404, "Blog not found");
    }

    return blog;
  } catch (error) {
    logger.error(`Error fetching blog: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Failed to fetch blog");
  }
};

/**
 * Get blogs by author
 */
export const getBlogsByAuthor = async (authorId: string, page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const [blogs, total] = await Promise.all([
      prisma.blogs.findMany({
        where: { authorId },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              expertise: true,

            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.blogs.count({ where: { authorId } })
    ]);

    return {
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error fetching author blogs: ${error}`);
    throw new CustomError(500, "Failed to fetch author blogs");
  }
};

/**
 * Update blog
 */
export const updateBlog = async (id: string, authorId: string, updateData: UpdateBlogDTO) => {
  try {
    // Check if blog exists and belongs to the author
    const existingBlog = await prisma.blogs.findUnique({
      where: { id }
    });

    if (!existingBlog) {
      throw new CustomError(404, "Blog not found");
    }

    if (existingBlog.authorId !== authorId) {
      throw new CustomError(403, "You can only update your own blogs");
    }

    const updatedBlog = await prisma.blogs.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            expertise: true,
          }
        }
      }
    });

    logger.info(`Blog ${id} updated by user ${authorId}`);
    return updatedBlog;
  } catch (error) {
    logger.error(`Error updating blog: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Failed to update blog");
  }
};

/**
 * Delete blog
 */
export const deleteBlog = async (id: string, authorId: string) => {
  try {
    // Check if blog exists and belongs to the author
    const existingBlog = await prisma.blogs.findUnique({
      where: { id }
    });

    if (!existingBlog) {
      throw new CustomError(404, "Blog not found");
    }

    if (existingBlog.authorId !== authorId) {
      throw new CustomError(403, "You can only delete your own blogs");
    }

    await prisma.blogs.delete({
      where: { id }
    });

    logger.info(`Blog ${id} deleted by user ${authorId}`);
    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting blog: ${error}`);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, "Failed to delete blog");
  }
};
