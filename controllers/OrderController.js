import Order from "../models/OrderModel.js";
import { sendOrderStatusNoti } from "../utils/sendOrderStatusNoti.js";

class OrderController {
  async createOrder(req, res) {
    const { user_id, total_amount, voucher_id, total_discount } = req.body;
    
    const order = {
      user_id,
      total_amount,
      voucher_id,
      total_discount,
    };

    try {
      const response = await Order.createOrderQuery(order);

      if (response && response.message === "OK" && response.data) {

        return res.status(200).json({
          message: "Order created successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to create order",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async bulkCreateOrderItems(req, res) {
    const { order_id, order_items } = req.body;

    try {
      const response = await Order.bulkCreateOrderItemsQuery(
        order_id,
        order_items
      );

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Order items created successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to create order items",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async checkUnavailableFoods(req, res) {
    const { food_list } = req.body;

    try {
      const response = await Order.checkUnavailableFoodsQuery(food_list);

      if (response && response.message === "OK") {
        return res.status(200).json({
          message: "No unavailable foods",
          success: true,
        });
      } else {
        return res.status(200).json({
          message: "Unavailable foods found",
          success: false,
          data: response.data,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getPrevOrderInfo(req, res) {
    const { order_id } = req.params;
    const { user_id } = req.body;

    try {
      const response = await Order.getPrevOrderInfoQuery(order_id, user_id);

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Order info retrieved successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to retrieve order info",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOrderInfo(req, res) {
    const { order_id } = req.params;
    const { user_id } = req.body;

    try {
      const response = await Order.getOrderInfoQuery(order_id, user_id);

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Order info retrieved successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to retrieve order info",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOrderInfoByOrder(req, res) {
    const { order_id, user_id } = req.params;

    try {
      const response = await Order.getOrderInfoQuery(order_id, user_id);

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Order info retrieved successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to retrieve order info",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOrdersByUser(req, res) {
    const { user_id } = req.body;

    try {
      const response = await Order.getOrdersByUserQuery(user_id);

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Orders retrieved successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to retrieve orders",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllOrders(req, res) {
    try {
      const response = await Order.getAllOrdersQuery();

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Orders retrieved successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to retrieve orders",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateOrderStatus(req, res) {
    const { order_id, status, order_customer_id, user = null } = req.body;

    try {
      const response = await Order.updateOrderStatusQuery(
        order_id,
        order_customer_id,
        status
      );

      if (response && response.message === "OK") {
        if (user) {
          switch (status) {
            case "pending":
              // Send notification to user
              await sendOrderStatusNoti(user, "pending", order_id);
              break;
            case "confirmed":
              // Send notification to user
              await sendOrderStatusNoti(user, "confirmed", order_id);
              break;
            case "preparing":
              // Send notification to user
              await sendOrderStatusNoti(user, "preparing", order_id);
              break;
            case "completed":
              // Send notification to user
              await sendOrderStatusNoti(user, "completed", order_id);
              break;
            case "canceled":
              // Send notification to user
              await sendOrderStatusNoti(user, "canceled", order_id);
              break;
            default:
              break;
          }
        }

        return res.status(200).json({
          message: "Order status updated successfully",
          success: true,
        });
      } else {
        return res.status(500).json({
          message: "Failed to update order status",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async sendNote(req, res) {
    const { order_id, note, user_id } = req.body;

    try {
      const response = await Order.sendNoteQuery(note, order_id, user_id);

      if (response && response.message === "OK") {
        return res.status(200).json({
          message: "Note sent successfully",
          success: true,
        });
      } else {
        return res.status(500).json({
          message: "Failed to send note",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getRevenueByMonth(req, res) {
    try {
      const response = await Order.getRevenueByMonthQuery();

      if (response && response.message === "OK") {
        return res.status(200).json({
          message: "Revenue fetched successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to fetch revenue",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getRevenuePerMonth(req, res) {
    try {
      const response = await Order.getRevenuePerMonthQuery();

      if(response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Revenue fetched successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to fetch revenue",
          success: false,
          error: response.error,
        });
      }
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getRevenueByDay(req, res) {
    try {
      const response = await Order.getRevenueByDayQuery();

      if(response && response.message === "OK") {
        console.log(response.data);
        
        return res.status(200).json({
          message: "Revenue fetched successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to fetch revenue",
          success: false,
          error: response.error,
        });
      }
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}


export default new OrderController();
