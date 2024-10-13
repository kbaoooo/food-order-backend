import DB from "../config/db.js";

class ReviewModel {
  async addReviewQuery(user_id, item_id, order_id, rating, comment) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO reviews (user_id, item_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
        [user_id, item_id, order_id, rating, comment]
      );
      if (result && result.affectedRows > 0) {
        let review_id = result.insertId;

        const [review] = await connection.query(
          "SELECT reviews.review_id, reviews.item_id, reviews.rating, reviews.comment, reviews.created_at, users.username FROM reviews INNER JOIN users ON reviews.user_id = users.user_id WHERE review_id = ?",
          [review_id]
        );

        if (review && review.length > 0) {
          return {
            message: "OK",
            data: review[0],
          };
        } else {
          return {
            message: "Failed",
            error: "Failed to fetch review",
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

  async getReviewsQuery(item_id) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        `SELECT reviews.review_id, reviews.item_id, reviews.rating, reviews.comment, reviews.created_at, users.username 
          FROM reviews 
          INNER JOIN users 
          ON reviews.user_id = users.user_id 
          WHERE item_id = ?
        `,
        [item_id]
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

  async getReviewByUserAndOrderQuery(user_id, order_id, item_id) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        `SELECT reviews.review_id, reviews.item_id, reviews.rating, reviews.comment, reviews.created_at, users.username 
          FROM reviews 
          INNER JOIN users 
          ON reviews.user_id = users.user_id 
          WHERE reviews.user_id = ? AND reviews.item_id = ? AND reviews.order_id = ?
        `,
        [user_id, item_id, order_id]
      );
      
      if (result && result.length > 0) {
        return {
          message: "OK",
          data: result[0],
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
}

export default new ReviewModel();
