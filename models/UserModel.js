import DB from "../config/db.js";
import moment from "moment";

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
            error: "User not found",
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

  async updateUserRoleQuery(email, isAdmin) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "UPDATE users SET isAdmin = ? WHERE email = ?",
        [isAdmin, email]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
        };
      } else {
        return {
          message: "Failed",
          error: "Failed to update user privilege",
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

  async getAdminsQuery() {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "SELECT user_id, username, email, address, phone_number, isAdmin, isVeryfied FROM users WHERE isAdmin = 1 OR isAdmin = 2 AND isVeryfied = 1 ORDER BY isAdmin DESC"
      );

      if (result && result.length > 0) {
        return {
          message: "OK",
          data: result,
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

  async sendOTPQuery(user_id, otp, expiresAt) {
    const connection = await DB.getConnection();

    try {
      // insert OTP into database
      const [insertResult] = await connection.query(
        "INSERT INTO otp_requests (user_id, otp, expires_at) VALUES (?, ?, ?)",
        [user_id, otp, expiresAt]
      );

      if (insertResult && insertResult.affectedRows > 0) {
        return {
          message: "OK",
          data: {
            otp,
          },
        };
      } else {
        return {
          message: "Failed",
          error: "Failed to insert OTP",
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

  async verifyOTPQuery(user_id, otp) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        "SELECT * FROM otp_requests WHERE user_id = ? AND otp = ? AND is_valid = 1",
        [user_id, otp]
      );

      if (result && result.length > 0) {
        const otpData = result[0];
        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        if (moment(now).isAfter(otpData.expires_at)) {
          const [updateResult] = await connection.query(
            "UPDATE otp_requests SET is_valid = 0 WHERE id = ?",
            [otpData.id]
          );

          if (updateResult && updateResult.affectedRows > 0) {
            return {
              message: "Failed",
              error: "OTP is expired",
            };
          } else {
            return {
              message: "Failed",
              error: "Failed to update OTP",
            };
          }
        }

        return {
          message: "OK",
        };
      } else {
        return {
          message: "Failed",
          error: "OTP is invalid",
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

  async resetPasswordQuery(email, password) {
    const connection = await DB.getConnection();

    try {
      const [result] = await connection.query(
        `UPDATE users 
        SET password_hash = ? 
        WHERE email = ?`,
        [password, email]
      );

      if (result && result.affectedRows > 0) {
        return {
          message: "OK",
        };
      } else {
        return {
          message: "Failed",
          error: "Failed to update password",
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
