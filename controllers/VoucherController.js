import VoucherModel from "../models/VoucherModel.js";

class VoucherController {
  // [POST] /api/voucher/post-voucher
  async addVoucher(req, res) {
    const data = req.body;
    try {
      const response = await VoucherModel.addVoucherQuery(data);

      if (response) {
        if (response.message === "OK" && response.data) {
          return res.status(201).json({
            message: "Voucher added successfully",
            success: true,
            data: response.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to add voucher",
            success: false,
            error: response.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.error("Error in addVoucher:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [GET] /api/voucher/vouchers
  async getVouchers(req, res) {
    try {
      const response = await VoucherModel.getVouchersQuery();

      if (response) {
        if (response.message === "OK" && response.data) {
          return res.status(200).json({
            message: "Vouchers fetched successfully",
            success: true,
            data: response.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to add voucher",
            success: false,
            error: response.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.error("Error in addVoucher:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [DELETE] /api/voucher/delete-voucher/:voucher_id
  async deleteVoucher(req, res) {
    const voucherId = req.params.voucher_id;

    try {
      const response = await VoucherModel.deleteVoucherQuery(voucherId);

      if (response) {
        if (response.message === "OK") {
          return res.status(200).json({
            message: "Voucher deleted successfully",
            success: true,
          });
        } else {
          return res.status(500).json({
            message: "Failed to delete voucher",
            success: false,
            error: response.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.error("Error in deleteVoucher:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [POST] /api/voucher/use-voucher
  async useVoucher(req, res) {
    const { voucher_id, order_id } = req.body;

    try {
      const response = await VoucherModel.useVoucherQuery(voucher_id, order_id);

      if (response) {
        if (response.message === "OK") {
          return res.status(200).json({
            message: "Voucher used successfully",
            success: true,
          });
        } else {
          return res.status(400).json({
            message: "Failed to use voucher",
            success: false,
            error: response.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.error("Error in useVoucher:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new VoucherController();
