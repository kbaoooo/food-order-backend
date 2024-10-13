import express from "express";
import VoucherController from "../controllers/VoucherController.js";

const voucherRouter = express.Router();

// Routes for cart
voucherRouter.delete(
  "/delete-voucher/:voucher_id",
  VoucherController.deleteVoucher
);
voucherRouter.post("/add-voucher", VoucherController.addVoucher);
voucherRouter.post("/use-voucher", VoucherController.useVoucher);
voucherRouter.get("/vouchers", VoucherController.getVouchers);

export default voucherRouter;
