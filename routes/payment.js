import express from "express";
import PaymentController from "../controllers/PaymentController.js";
import { authMiddleware } from "../middleware/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/insert-payment", authMiddleware, PaymentController.insertPayment);
paymentRouter.post("/create-payment", PaymentController.createPayment);
paymentRouter.post("/callback", PaymentController.callback);
paymentRouter.post("/order-status/:transaction_id",  PaymentController.orderStatus);
paymentRouter.post("/update-payment-status", PaymentController.updatePaymentStatus);

export default paymentRouter;
