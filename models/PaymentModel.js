import DB from "../config/db.js";
import axios from "axios";

class PaymentModel {
  async insertPaymentQuery(payment) {
    const { order_id, amount, payment_method, payment_status, transaction_id } =
      payment;

    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id) VALUES (?, ?, ?, ?, ?)",
        [order_id, amount, payment_method, payment_status, transaction_id]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
          data: {
            payment_id: result.insertId,
            order_id,
            amount,
            payment_method,
            payment_status,
            transaction_id,
          },
        };
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

  async updatePaymentStatusQuery(transaction_id, status, username) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `UPDATE payments 
        INNER JOIN orders ON payments.order_id = orders.order_id 
        INNER JOIN users on users.user_id = orders.user_id 
        SET payments.payment_status = ? 
        WHERE users.username = ? AND payments.transaction_id = ?`,
        [status, username, transaction_id]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
          data: {
            username,
            transaction_id,
            status,
          },
        };
      } else {
        return {
          message: "Failed",
          error: "Failed to update data",
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

  async createPaymentQuery(endpoint, order) {
    const result = await axios.post(endpoint, null, {
      params: order,
    });

    return result;
  }
}

export default new PaymentModel();
