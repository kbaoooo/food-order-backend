import PaymentModel from "../models/PaymentModel.js";
import CryptoJS from "crypto-js";
import axios from "axios";
import qs from "qs";
import { sendPaymentStatus } from "../utils/sendPaymenStatusNoti.js";

const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

class PaymentController {
  async insertPayment(req, res) {
    const { order_id, amount, payment_method, payment_status, transaction_id } =
      req.body;

    const payment = {
      order_id,
      amount,
      payment_method,
      payment_status,
      transaction_id,
    };

    try {
      const response = await PaymentModel.insertPaymentQuery(payment);

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "Payment created successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to create payment",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createPayment(req, res) {
    const {
      amount,
      items,
      username,
      phone,
      email,
      address,
      transaction_id,
      order_id,
    } = req.body;

    const embed_data = {
      redirecturl: "http://localhost:5173/tracking-orders",
    };

    const order = {
      app_id: config.app_id,
      app_trans_id: transaction_id, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: username,
      app_time: Date.now(), // miliseconds
      phone: phone,
      email: email,
      address: address,
      title: "Thanh toán đơn hàng - Tomato",
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: parseInt(amount),
      description: `Nhà hàng Tomato - Thanh toán cho đơn hàng #${transaction_id}`,
      bank_code: "",
      callback_url:
        "https://702e-2001-ee0-4161-6c75-340e-f164-3bff-c18b.ngrok-free.app/api/payment/callback",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await PaymentModel.createPaymentQuery(
        config.endpoint,
        order
      );
      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  callback(req, res) {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);

        console.log("callback data =", dataJson);

        // cập nhật trạng thái cho đơn hàng
        let username = dataJson["app_user"];
        let transaction_id = dataJson["app_trans_id"];

        const updatePaymentStatus = async () => {
          await PaymentModel.updatePaymentStatusQuery(
            transaction_id,
            "completed",
            username
          );
        };

        updatePaymentStatus();

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
  }

  async updatePaymentStatus(req, res) {
    const { transaction_id, status, username, user = null } = req.body;

    try {
      const response = await PaymentModel.updatePaymentStatusQuery(
        transaction_id,
        status,
        username
      );

      if (response && response.message === "OK" && response.data) {
        if (user) {
          if (status === "completed") {
            await sendPaymentStatus(user);
          }
        }
        return res.status(200).json({
          message: "Payment status updated successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to update payment status",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async orderStatus(req, res) {
    const transaction_id = req.params.transaction_id;
    let postData = {
      app_id: config.app_id,
      app_trans_id: transaction_id, // Input your app_trans_id
    };

    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
      method: "post",
      url: "https://sb-openapi.zalopay.vn/v2/query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };

    try {
      const response = await axios(postConfig);

      return res.status(200).json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async refundPayment(req, res) {
    const { payment_method } = req.body;

    if (payment_method === "money") {
      return res.status(200).json({
        message: "This payment method does not support refund",
        success: true,
      });
    }

    const now = new Date();

    // Extract year, month, day in yy, mm, dd format
    const year = String(now.getFullYear()).slice(2); // last two digits of year
    const month = String(now.getMonth() + 1).padStart(2, "0"); // month is 0-indexed, so we add 1
    const day = String(now.getDate()).padStart(2, "0");

    // Generate a random 10-digit number
    const randomPart = Math.floor(Math.random() * 1e10)
      .toString()
      .padStart(10, "0");

    const postConfig = {
      endpoint: "https://sb-openapi.zalopay.vn/v2/query_refund",
    };

    const refundId = `${year}${month}${day}_${config.app_id}_${randomPart}`
    
    const params = {
      app_id: config.app_id,
      timestamp: Date.now(), // miliseconds
      m_refund_id: refundId,
    };

    const data = config.app_id + "|" + params.m_refund_id + "|" + params.timestamp; // app_id|m_refund_id|timestamp

    console.log("data =", data);
    console.log("m_refund_id =", params.m_refund_id);
    
    
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const response = await axios.post(postConfig.endpoint, null, { params });

      return res.status(200).json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default new PaymentController();
