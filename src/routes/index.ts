import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes'; 
import predictionRoutes from './prediction.routes';
import blogRoutes from './blog.routes';
import feedbackRoutes from './feedback.routes';

const router = Router();

// Health check for API routes
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Register all route modules
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/', predictionRoutes);

export default router;