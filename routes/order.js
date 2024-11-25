import express from "express";
import OrderController from "../controllers/OrderController.js";
import { authMiddleware } from "../middleware/auth.js";

const orderRouter = express.Router();

// Routes for cart
orderRouter.post("/create-order", authMiddleware, OrderController.createOrder);
orderRouter.post(
  "/bulk-create-order-items",
  OrderController.bulkCreateOrderItems
);
orderRouter.get(
  "/get-orders-by-user",
  authMiddleware,
  OrderController.getOrdersByUser
);
orderRouter.get(
  "/get-all-orders",
  authMiddleware,
  OrderController.getAllOrders
);
orderRouter.get(
  "/get-prev-order-info/:order_id",
  authMiddleware,
  OrderController.getPrevOrderInfo
);
orderRouter.get(
  "/get-order-info/:order_id",
  authMiddleware,
  OrderController.getOrderInfo
);
orderRouter.get(
  "/get-order-info-by-order/:order_id/:user_id",
  authMiddleware,
  OrderController.getOrderInfoByOrder
);
orderRouter.post(
  "/update-order-status",
  authMiddleware,
  OrderController.updateOrderStatus
);
orderRouter.post(
  "/check-unvailable-foods",
  OrderController.checkUnavailableFoods
);
orderRouter.get(
  "/get-revenue-by-month",
  authMiddleware,
  OrderController.getRevenueByMonth
);
orderRouter.get(
  "/get-revenue-per-month",
  authMiddleware,
  OrderController.getRevenuePerMonth
);
orderRouter.get(
  "/get-revenue-by-day",
  authMiddleware,
  OrderController.getRevenueByDay
);
orderRouter.post("/send-note", authMiddleware, OrderController.sendNote);

export default orderRouter;
