import menuRouter from "./menu.js";
import userRouter from "./user.js";
import cartRouter from "./cart.js";
import reviewRouter from "./review.js";
import voucherRouter from "./voucher.js";
import orderRouter from "./order.js";
import favourRouter from "./favour.js";
import paymentRouter from "./payment.js";
import express from "express";

function routes(app) {
  app.use("/images", express.static("uploads"));
  app.use("/api/menu", menuRouter);
  app.use("/api/auth", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/review", reviewRouter);
  app.use("/api/voucher", voucherRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/favour", favourRouter);
  app.use("/api/payment", paymentRouter);
}

export default routes;
