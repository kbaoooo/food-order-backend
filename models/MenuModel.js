import DB from "../config/db.js";

class MenuModel {
  // [POST] /menu/add-food
  async addFoodQuery(data) {
    const { name, price, description, image, category } = data;
    const connection = await DB.getConnection();

    try {
      await connection.beginTransaction();

      // Insert into menucategories table
      const [categoryResult] = await connection.query(
        "SELECT * from menucategories WHERE name = ?",
        [category]
      );

      let category_id = null;

      if (categoryResult && categoryResult.length > 0) {
        category_id = categoryResult[0].category_id;
      } else {
        const [insertCategoryResult] = await connection.query(
          "INSERT INTO menucategories (name) VALUES (?)",
          [category]
        );
        category_id = insertCategoryResult.insertId;
      }

      // Insert into menuitems table
      await connection.query(
        "INSERT INTO menuitems (name, price, description, image_url, category_id) VALUES (?, ?, ?, ?, ?)",
        [name, price, description, image, category_id]
      );

      // Commit the transaction
      await connection.commit();
      console.log("Transaction completed");

      return {
        message: "OK",
        data: data,
      };
    } catch (err) {
      console.error("Error during transaction:", err);

      // Rollback the transaction in case of error
      await connection.rollback();

      return {
        message: "Failed",
        error: err,
      };
    } finally {
      connection.release();
    }
  }

  // [GET] /menu/get-menu
  async getMenuQuery(user_id) {
    const connection = await DB.getConnection();

    if (user_id) {
      try {
        // SQL query to join menuitems and menucategories
        const query = `
               SELECT 
                    menuitems.item_id, 
                    menuitems.name AS item_name, 
                    menuitems.price,   
                    menuitems.description, 
                    menuitems.image_url, 
                    menuitems.available,
                    menucategories.name AS category_name, 
                    favours.user_id,  
                    IF(favours.item_id IS NOT NULL, 1, 0) AS is_favour,
                    AVG(reviews.rating) AS average_rating
                FROM 
                    menuitems
                LEFT JOIN 
                    menucategories ON menuitems.category_id = menucategories.category_id
                LEFT JOIN 
                  reviews ON menuitems.item_id = reviews.item_id
                LEFT JOIN 
                    favours ON menuitems.item_id = favours.item_id AND favours.user_id = ? 
                GROUP BY 
                    menuitems.item_id
                ORDER BY 
                    menuitems.item_id;
            `;

        // Execute the query
        const [res] = await connection.query(query, [user_id]);

        // Return the results
        if (res.length > 0) {
          return {
            message: "OK",
            data: res,
          };
        } else {
          return {
            message: "Failed",
            error: "No data found",
          };
        }
      } catch (err) {
        console.error("Failed to retrieve menu:", err);
        return {
          message: "Failed",
          error: err,
        };
      } finally {
        connection.release();
      }
    } else {
      try {
        // SQL query to join menuitems and menucategories
        const query = `
                SELECT 
                  menuitems.item_id, 
                  menuitems.name AS item_name, 
                  menuitems.price, 
                  menuitems.description, 
                  menuitems.image_url, 
                  menucategories.name AS category_name,
                  AVG(reviews.rating) AS average_rating
              FROM 
                  menuitems
              INNER JOIN 
                  menucategories 
                  ON menuitems.category_id = menucategories.category_id
              LEFT JOIN 
                  reviews 
                  ON menuitems.item_id = reviews.item_id
              GROUP BY 
                  menuitems.item_id
              ORDER BY 
                  menuitems.item_id;

            `;

        // Execute the query
        const [res] = await connection.query(query);

        // Return the results
        if (res.length > 0) {
          return {
            message: "OK",
            data: res,
          };
        } else {
          return {
            message: "Failed",
            error: "No data found",
          };
        }
      } catch (error) {
        console.log("Error in getMenuQuery:", error);
        return {
          message: "Internal server error",
        };
      } finally {
        connection.release();
      }
    }
  }

  // [GET] /menu/get-food
  async getFoodQuery(item_id) {
    const connection = await DB.getConnection();

    try {
      const getFoodQuery = `
                SELECT 
                    menuitems.item_id, 
                    menuitems.name AS item_name, 
                    menuitems.price, 
                    menuitems.description, 
                    menuitems.image_url, 
                    menuitems.available,
                    menucategories.name AS category_name,
                    AVG(reviews.rating) AS average_rating
                FROM 
                    menuitems 
                INNER JOIN 
                    menucategories 
                ON 
                    menuitems.category_id = menucategories.category_id
                LEFT JOIN 
                  reviews ON menuitems.item_id = reviews.item_id
                WHERE
                    menuitems.item_id = ?
                GROUP BY 
                    menuitems.item_id

            `;
      const [res] = await connection.query(getFoodQuery, [item_id]);
      if (res.length > 0) {
        return {
          message: "OK",
          data: res[0],
        };
      } else {
        return {
          message: "Failed",
          error: "No data found",
        };
      }
    } catch (error) {
      console.error("Failed to retrieve food:", error);

      return {
        message: "Failed",
        error: error,
      };
    } finally {
      connection.release();
    }
  }

  // [POST] /menu/remove-food
  async removeFoodQuery(item_id) {
    const connection = await DB.getConnection();

    try {
      await connection.beginTransaction();
      console.log("Transaction started");

      // Delete from menuitems table
      await connection.query("DELETE FROM menuitems WHERE item_id = ?", [
        item_id,
      ]);

      // Commit the transaction
      await connection.commit();
      console.log("Transaction completed");

      return {
        message: "OK",
      };
    } catch (err) {
      console.error("Error during transaction:", err);

      // Rollback the transaction in case of error
      await connection.rollback();

      return {
        message: "Failed",
        error: err,
      };
    } finally {
      connection.release();
    }
  }
}

export default new MenuModel();
