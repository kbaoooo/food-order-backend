import express from 'express';
import CartController from '../controllers/CartController.js';
import { authMiddleware } from '../middleware/auth.js';

const cartRouter = express.Router();

// Routes for cart
cartRouter.post('/update-cart', authMiddleware, CartController.updateCart);
cartRouter.post('/remove-from-cart', authMiddleware, CartController.removeFromCart);
cartRouter.get('/get-cart', authMiddleware, CartController.getCart);

export default cartRouter;