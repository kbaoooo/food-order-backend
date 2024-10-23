import express from "express";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

// Routes for cart
userRouter.post("/verify-email", UserController.verifyEmail);
userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", UserController.logout);
userRouter.post(
  "/update-user-info",
  authMiddleware,
  UserController.updateUserInfo
);
userRouter.get("/me", authMiddleware, UserController.getUser);
userRouter.get("/get-user-by-id/:user_id", authMiddleware, UserController.getUserById);
userRouter.get("/get-admins", authMiddleware, UserController.getAdmins);
userRouter.post("/update-user-role", authMiddleware, UserController.updateUserRole);
userRouter.post("/send-otp", UserController.sendOTP);
userRouter.post("/verify-otp", UserController.verifyOTP);
userRouter.post("/reset-password", UserController.resetPassword);

export default userRouter;
