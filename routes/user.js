import express from "express";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

// Routes for cart
userRouter.post('/verify-email', UserController.verifyEmail);
userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);
userRouter.post('/logout', UserController.logout);
userRouter.post('/update-user-info', authMiddleware, UserController.updateUserInfo);
userRouter.get('/me', authMiddleware, UserController.getUser);
 

export default userRouter;
