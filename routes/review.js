import express from 'express';
import ReviewController from '../controllers/ReviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const reviewRouter = express.Router();

// Routes for cart
reviewRouter.post('/post-review', authMiddleware, ReviewController.postReview);
reviewRouter.get('/get-review-by-user/:order_id/:item_id', authMiddleware, ReviewController.getReviewByUserAndOrder);
reviewRouter.get('/get-reviews/:item_id',  ReviewController.getReviews);

export default reviewRouter;