import DB from "../config/db.js";

class CardModel {
  async updateCartQuery(user_id, item_id, quantity) {
    const connection = await DB.getConnection();
    try {
      await connection.beginTransaction();
      const [cartResult] = await connection.query(
        "SELECT * FROM cart WHERE user_id = ? AND item_id = ?",
        [user_id, item_id]
      );

      if (cartResult && cartResult.length > 0) {
        console.log("cartResult:", cartResult);

        const [result] = await connection.query(
          "UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?",
          [quantity, user_id, item_id]
        );

        if (result) {
          await connection.commit();
          return {
            message: "OK",
            data: cartResult[0].cart_id,
          };
        } else {
          await connection.rollback();
          return {
            message: "Failed",
            error: "Failed to add to cart",
          };
        }
      } else {
        const [result] = await connection.query(
          "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)",
          [user_id, item_id, quantity]
        );
        if (result.affectedRows > 0) {
          await connection.commit();
          return {
            message: "OK",
            data: result.insertId,
          };
        } else {
          await connection.rollback();
          return {
            message: "Failed",
            error: "Failed to add to cart",
          };
        }
      }
    } catch (error) {
      console.error("Error during transaction:", error);
      await connection.rollback();
      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }

  async getCartQuery(user_id) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        "SELECT cart.cart_id, cart.user_id, menucategories.name, quantity, menuitems.item_id, menuitems.name, menuitems.description, menuitems.price, menuitems.image_url FROM cart INNER JOIN menuitems ON cart.item_id = menuitems.item_id INNER JOIN menucategories ON menuitems.category_id = menucategories.category_id WHERE user_id = ?",
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

  async removeFromCartQuery(cart_id, user_id) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        "DELETE FROM cart WHERE cart_id = ? AND user_id = ?",
        [cart_id, user_id]
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
}

export default new CardModel();
