import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import cryto from "crypto";
import { sendVerificationMail } from "../utils/sendVerificationMail.js";

const createToken = (user_id) => {
  const info = {
    user_id,
  };
  return jwt.sign(info, process.env.JWT_SECRET);
};

class UserController {
  // [GET] /api/auth/user
  async getUser(req, res) {
    const { user_id } = req.body;

    try {
      const response = await UserModel.getUserQuery(user_id);
      if (response) {
        if (response.message === "OK" && response.data) {
          const users = response.data;
          return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            data: users,
          });
        } else {
          return res.status(500).json({
            message: "Failed to fetch users",
            success: false,
            error: response.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /api/auth/login
  async login(req, res) {
    const { email, password } = req.body;
    
    try {
      const response = await UserModel.getUserByEmailQuery(email);
      
      if (response && response.message === "OK" && response.data) {
        
        const user = response.data;
        
        if(!user.isVeryfied) {
          return res.status(400).json({
            message: "Email not verified",
            success: false,
          });
        }

        const validPassword = await bcrypt.compare(
          password,
          user.password_hash
        );
        
        if (validPassword && user.isVeryfied) {

          const token = createToken(user.user_id);

          return res.status(200).json({
            message: "Login successful",
            success: true,
            data: {
              user,
              token,
            },
          });
        } else {
          return res.status(400).json({
            message: "Invalid email or password",
            success: false,
          });
        }
      } else {
        return res.status(400).json({
          message: "Invalid email or password",
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /api/auth/register
  async register(req, res) {
    const { name, email, password } = req.body;

    try {
      // Check user exists
      const getUser = await UserModel.getUserByEmailQuery(email);

      let existingUser = null;
      if (getUser && getUser.message === "OK" && getUser.data) {
        existingUser = getUser.data;
      }

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
          success: false,
          data: existingUser,
        });
      }

      // validate email and password
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Invalid email",
          success: false,
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
          success: false,
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = {
        name,
        email,
        password: hashedPassword,
        email_token: cryto.randomBytes(64).toString("hex"),
      };

      // Register user
      const response = await UserModel.registerQuery(newUser);

      if (response && response.message === "OK" && response.data) {
        const user = response.data;
        
        // Send verification email

        await sendVerificationMail(user);
        
        return res.status(201).json({
          message: "User registered successfully",
          success: true,
          data: {
            user,
          },
        });
      } else {
        return res.status(500).json({
          message: "Failed to register user",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyEmail(req, res) {
    const { email_token } = req.body;
    
    if (!email_token)
      return res.status(400).json({ message: "Email token not found" });

    try {
      const response = await UserModel.getUserByEmailQuery(null, email_token);
      
      const user = response.data;

      if (response && response.message === "OK" && user) {
        const response = await UserModel.verifyEmailQuery(email_token);
        
        const token = createToken(user.user_id);

        if (response && response.message === "OK") {
          const userVerified = {
            ...user,
            isVeryfied: 1,
          };
          
          return res.status(200).json({
            message: "Email verified successfully",
            success: true,
            data: {
              user: userVerified,
              token,
            },
          });
        } else {
          return res.status(500).json({
            message: "Failed to verify email",
            success: false,
            error: response.error,
          });
        }
      } else {
        return res.status(400).json({
          message: "Invalid email token",
          success: false,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req, res) {}

  async updateUserInfo(req, res) {
    const { user_id, phone, address } = req.body;

    try {
      const response = await UserModel.updateUserInfoQuery(
        user_id,
        phone,
        address
      );

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "User info updated successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to update user info",
          success: false,
          error: response.error,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUser(req, res) {
    const { user_id } = req.body;

    try {
      const response = await UserModel.getUserQuery(user_id);

      if (response && response.message === "OK" && response.data) {
        return res.status(200).json({
          message: "User fetched successfully",
          success: true,
          data: response.data,
        });
      } else {
        return res.status(500).json({
          message: "Failed to fetch user",
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

export default new UserController();
