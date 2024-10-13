import DB from "../config/db.js";

class VoucherModel {
  async addVoucherQuery(data) {
    const connection = await DB.getConnection();
    try {
      const {
        code,
        codeDes,
        discountType,
        discountVal,
        minToDiscount,
        maxDiscount,
        usage,
        startDate,
        endDate,
      } = data;
      const [result] = await connection.query(
        "INSERT INTO vouchers (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_from, valid_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          code,
          codeDes,
          discountType,
          discountVal,
          minToDiscount,
          maxDiscount,
          usage,
          startDate,
          endDate,
        ]
      );

      if (result && result.affectedRows > 0) {
        const id = result.insertId;

        const [voucher] = await connection.query(
          "SELECT * FROM vouchers WHERE voucher_id = ?",
          [id]
        );

        if (voucher && voucher.length > 0) {
          return {
            message: "OK",
            data: voucher[0],
          };
        } else {
          return {
            message: "Failed",
            error: "Failed to fetch voucher",
          };
        }
      } else {
        return {
          message: "Failed",
          error: "Failed to insert data",
        };
      }
    } catch (error) {
      console.error("Error during query:", error);
      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }

  async getVouchersQuery() {
    const connection = await DB.getConnection();
    try {
      const [vouchers] = await connection.query("SELECT * FROM vouchers");
      return {
        message: "OK",
        data: vouchers,
      };
    } catch (error) {
      console.error("Error during query:", error);
      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }

  async deleteVoucherQuery(voucherId) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "DELETE FROM vouchers WHERE voucher_id = ?",
        [voucherId]
      );

      if (result.affectedRows > 0) {
        return {
          message: "OK",
        };
      } else {
        return {
          message: "Failed",
          error: "Failed to remove from cart",
        };
      }
    } catch (error) {
      console.error("Error during query:", error);
      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }

  async useVoucherQuery(voucher_id, order_id) {
    const connection = await DB.getConnection();

    try {
      const [voucher] = await connection.query(
        "SELECT * FROM vouchers WHERE voucher_id = ?",
        [voucher_id]
      );

      if (voucher && voucher.length > 0) {
        const [order] = await connection.query(
          "SELECT * FROM orders WHERE order_id = ?",
          [order_id]
        );

        if (order && order.length > 0) {
          const { total_amount } = order[0];
          const {
            discount_type,
            discount_value,
            min_order_amount,
            max_discount_amount,
            usage_limit,
            usage_count,
            valid_from,
            valid_to,
          } = voucher[0];

          
          const now = new Date();
          const validFrom = new Date(valid_from);
          const validTo = new Date(valid_to);
          
          if (usage_count < usage_limit) {
            if (now >= validFrom && now <= validTo) {
              if (total_amount >= min_order_amount) {
                let discount = 0;
                if (discount_type === "percentage") {
                  discount = (total_amount * discount_value) / 100;
                } else if (discount_type === "fixed") {
                  discount = discount_value;
                }

                if (discount > max_discount_amount) {
                  discount = max_discount_amount;
                }

                const [result] = await connection.query(
                  "UPDATE orders SET voucher_id = ?, total_discount = ? WHERE order_id = ?",
                  [voucher_id, discount, order_id]
                );

                if (result.affectedRows > 0) {
                  const [result2] = await connection.query(
                    "UPDATE vouchers SET usage_count = ? WHERE voucher_id = ?",
                    [usage_count + 1, voucher_id]
                  );

                  if (result2.affectedRows > 0) {
                    return {
                      message: "OK",
                      data: {
                        discount: discount,
                      },
                    };
                  } else {
                    return {
                      message: "Failed",
                      error: "Cập nhật voucher không thành công",
                    };
                  }
                } else {
                  return {
                    message: "Failed",
                    error: "Cập nhật đơn hàng không thành công",
                  };
                }
              } else {
                return {
                  message: "Failed",
                  error: "Đơn hàng không đạt yêu cầu tối thiểu",
                };
              }
            } else {
              return {
                message: "Failed",
                error: "Voucher không còn hiệu lực",
              };
            }
          } else {
            return {
              message: "Failed",
              error: "Voucher đã hết lượt sử dụng",
            };
          }
        } else {
          return {
            message: "Failed",
            error: "Không tìm thấy đơn hàng",
          };
        }
      } else {
        return {
          message: "Failed",
          error: "Không tìm thấy voucher",
        };
      }
    } catch (error) {
      console.error("Error during query:", error);
      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }
}

export default new VoucherModel();
