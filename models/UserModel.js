import DB from "../config/db.js";

class UserModel {
  // [GET] /api/auth/user
  async getUserByEmailQuery(email, email_token) {
    if (email) {
      const connection = await DB.getConnection();
      try {
        const [result] = await connection.query(
          "SELECT user_id, username, email, address, phone_number, isAdmin, isVeryfied, password_hash FROM users WHERE email = ?",
          [email]
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

    if (email_token) {
      const connection = await DB.getConnection();
      try {
        const [result] = await connection.query(
          "SELECT user_id, username, email, address, phone_number, isAdmin, isVeryfied FROM users WHERE email_token = ?",
          [email_token]
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

  // [POST] /api/auth/register
  async registerQuery(user) {
    const connection = await DB.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO users (username, email, password_hash, email_token) VALUES (?, ?, ?, ?)",
        [user.name, user.email, user.password, user.email_token]
      );
      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
          data: {
            id: result.insertId,
            name: user.name,
            email: user.email,
            email_token: user.email_token,
            isVeryfied: 0,
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

  async verifyEmailQuery(email_token) {
    const connection = await DB.getConnection();
    try {
      await connection.query(
        "UPDATE users SET email_token = NULL, isVeryfied = 1 WHERE email_token = ?",
        [email_token]
      );

      return {
        message: "OK",
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

  async updateUserInfoQuery(user_id, phone, address) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "UPDATE users SET phone_number = ?, address = ? WHERE user_id = ?",
        [phone, address, user_id]
      );

      if (result && result.affectedRows > 0) {
        const [userInfo] = await connection.query(
          "SELECT phone_number, address FROM users WHERE user_id = ?",
          [user_id]
        );

        if (userInfo && userInfo.length > 0) {
          return {
            message: "OK",
            data: userInfo[0],
          };
        } else {
          return {
            message: "Failed",
            error: "Failed to fetch user info",
          };
        }
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

  async getUserQuery(user_id) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "SELECT user_id, username, email, address, phone_number, isAdmin, isVeryfied FROM users WHERE user_id = ?",
        [user_id]
      );

      if (result && result.length > 0) {
        return {
          message: "OK",
          data: result[0],
        };
      } else {
        return {
          message: "Failed",
          error: "Failed to fetch user",
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

export default new UserModel();
