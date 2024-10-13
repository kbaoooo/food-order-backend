import DB from "../config/db.js";

class OrderModel {
  async createOrderQuery(order) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO orders (user_id, total_amount, voucher_id, total_discount) VALUES (?, ?, ?, ?)",
        [
          order.user_id,
          order.total_amount,
          order.voucher_id,
          order.total_discount,
        ]
      );
      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
          data: {
            order_id: result.insertId,
            user_id: order.user_id,
            total_amount: order.total_amount,
            voucher_id: order.voucher_id,
            total_discount: order.total_discount,
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

  async bulkCreateOrderItemsQuery(order_id, order_items) {
    const connection = await DB.getConnection();
    try {
      const bulkValues = order_items.map((item) => [
        order_id,
        item.item_id,
        item.quantity,
        item.price,
      ]);

      const [result] = await connection.query(
        "INSERT INTO orderitems (order_id, item_id, quantity, price) VALUES ?",
        [bulkValues]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
          data: {
            order_id,
            order_items,
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

  async checkUnavailableFoodsQuery(item_list) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        `SELECT item_id, name, available FROM menuitems WHERE item_id IN (?) AND available = 0`,
        [item_list]
      );

      if (result && result.length > 0) {
        return {
          message: "Failed",
          error: "Unavailable items found",
          data: result,
        };
      } else {
        return {
          message: "OK",
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

  async getPrevOrderInfoQuery(order_id, user_id) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `SELECT orders.order_id, orders.total_amount, orders.voucher_id, vouchers.code , orders.total_discount, orders.created_at, orderitems.order_item_id, 
        orderitems.item_id, orderitems.price, orderitems.quantity, menuitems.category_id, menuitems.name, 
        menuitems.image_url, menucategories.name AS category_name, payments.payment_id, payments.payment_method, 
        payments.payment_status, orders.status AS order_status, orders.note
        FROM orders
        INNER JOIN orderitems ON orders.order_id = orderitems.order_id 
        LEFT JOIN vouchers ON orders.voucher_id = vouchers.voucher_id 
        LEFT JOIN payments ON orders.order_id = payments.order_id
        INNER JOIN menuitems ON orderitems.item_id = menuitems.item_id 
        INNER JOIN menucategories ON menuitems.category_id = menucategories.category_id 
        WHERE orders.order_id = ? AND orders.user_id = ? AND orders.status != 'canceled' 
        GROUP BY menuitems.name 
        `,
        [order_id, user_id]
      );

      if (result && result.length > 0) {
        const allowedKeys = [
          "order_item_id",
          "item_id",
          "price",
          "quantity",
          "category_id",
          "name",
          "image_url",
          "category_name",
        ];

        const filteredProducts = result.map((item) => {
          return Object.keys(item)
            .filter((key) => allowedKeys.includes(key))
            .reduce((acc, key) => {
              acc[key] = item[key];
              return acc;
            }, {});
        });

        const paymentData = {
          order_id: result[0].order_id,
          total_amount: result[0].total_amount,
          voucher_id: result[0].voucher_id,
          voucher_code: result[0].code,
          total_discount: result[0].total_discount,
          created_at: result[0].created_at,
          payment_id: result[0].payment_id,
          payment_method: result[0].payment_method,
          payment_status: result[0].payment_status,
          order_status: result[0].order_status,
          note: result[0].note,
          products: filteredProducts,
        };

        return {
          message: "OK",
          data: paymentData,
        };
      } else {
        return {
          message: "Failed",
          error: "No data found",
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

  async getOrderInfoQuery(order_id, user_id) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `SELECT orders.order_id, orders.total_amount, orders.voucher_id, vouchers.code , orders.total_discount, orders.created_at, orderitems.order_item_id, 
        orderitems.item_id, orderitems.price, orderitems.quantity, menuitems.category_id, menuitems.name, 
        menuitems.image_url, menucategories.name AS category_name, payments.payment_id, payments.payment_method, 
        payments.payment_status, orders.status AS order_status, orders.note
        FROM orders
        INNER JOIN orderitems ON orders.order_id = orderitems.order_id 
        LEFT JOIN vouchers ON orders.voucher_id = vouchers.voucher_id 
        LEFT JOIN payments ON orders.order_id = payments.order_id
        INNER JOIN menuitems ON orderitems.item_id = menuitems.item_id 
        INNER JOIN menucategories ON menuitems.category_id = menucategories.category_id 
        WHERE orders.order_id = ? AND orders.user_id = ? AND orders.status != 'canceled' AND IF (payments.payment_method = 'zalopay',  payments.payment_status = 'completed', payments.payment_id IS NOT NULL)
        GROUP BY menuitems.name 
        `,
        [order_id, user_id]
      );

      if (result && result.length > 0) {
        const allowedKeys = [
          "order_item_id",
          "item_id",
          "price",
          "quantity",
          "category_id",
          "name",
          "image_url",
          "category_name",
        ];

        const filteredProducts = result.map((item) => {
          return Object.keys(item)
            .filter((key) => allowedKeys.includes(key))
            .reduce((acc, key) => {
              acc[key] = item[key];
              return acc;
            }, {});
        });

        const paymentData = {
          order_id: result[0].order_id,
          total_amount: result[0].total_amount,
          voucher_id: result[0].voucher_id,
          voucher_code: result[0].code,
          total_discount: result[0].total_discount,
          created_at: result[0].created_at,
          payment_id: result[0].payment_id,
          payment_method: result[0].payment_method,
          payment_status: result[0].payment_status,
          order_status: result[0].order_status,
          note: result[0].note,
          products: filteredProducts,
        };

        return {
          message: "OK",
          data: paymentData,
        };
      } else {
        return {
          message: "Failed",
          error: "No data found",
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

  async getOrdersByUserQuery(user_id) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `SELECT orders.order_id, orders.total_amount, orders.voucher_id, vouchers.code, orders.note, orders.status, 
        orders.note, orders.created_at, payments.payment_method, payments.payment_status, payments.payment_id
        FROM orders
        LEFT JOIN vouchers ON orders.voucher_id = vouchers.voucher_id 
        LEFT JOIN payments ON orders.order_id = payments.order_id
        WHERE orders.user_id = ? AND orders.status != 'canceled' AND IF (payments.payment_method = 'zalopay',  payments.payment_status = 'completed', payments.payment_id IS NOT NULL)
        ORDER BY orders.created_at DESC
        `,
        [user_id]
      );

      if (result && result.length >= 0) {
        return {
          message: "OK",
          data: result,
        };
      } else {
        return {
          message: "Failed",
          error: "No data found",
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

  async updateOrderStatusQuery(order_id, user_id, status) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `UPDATE orders SET status = ? WHERE order_id = ? AND user_id = ?`,
        [status, order_id, user_id]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
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

  async sendNoteQuery(note, order_id, user_id) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `UPDATE orders SET note = ? WHERE order_id = ? AND user_id = ?`,
        [note, +order_id, user_id]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
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
}

export default new OrderModel();
