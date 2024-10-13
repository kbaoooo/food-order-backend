import DB from "../config/db.js";

class FavourModel {
  async toggleFavourQuery(user_id, item_id) {
    const connection = await DB.getConnection();

    try {
      await connection.beginTransaction();

      const [response] = await connection.query(
        "SELECT * FROM favours WHERE user_id = ? AND item_id = ?",
        [user_id, item_id]
      );

      if (response.length > 0) {
        await connection.query(
          "DELETE FROM favours WHERE user_id = ? AND item_id = ?",
          [user_id, item_id]
        );
      } else {
        await connection.query(
          "INSERT INTO favours (user_id, item_id) VALUES (?, ?)",
          [user_id, item_id]
        );
      }

      await connection.commit();

      return {
        message: "OK",
      };
    } catch (error) {
      console.error("Failed to toggle favour:", error);

      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }

  async getFavourQuery(user_id) {
    const connection = await DB.getConnection();

    try {
      const [response] = await connection.query(
        "SELECT favours.item_id, menuitems.name, menuitems.available, menucategories.name as category_name, menuitems.description, menuitems.price, menuitems.image_url, 1 AS is_favour FROM favours INNER JOIN menuitems ON favours.item_id = menuitems.item_id INNER JOIN menucategories ON menuitems.category_id = menucategories.category_id WHERE user_id = ? ORDER BY menuitems.item_id;",
        [user_id]
      );

      if (response.length > 0) {
        return {
          message: "OK",
          data: response,
        };
      } else {
        return {
          message: "Failed",
          error: "No data found",
        };
      }
    } catch (error) {
      console.error("Failed to retrieve favours:", error);

      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }
}

export default new FavourModel();
