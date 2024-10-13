import express from "express";
import FavourController from "../controllers/FavourController.js";
import { authMiddleware } from "../middleware/auth.js";
const favourRouter = express.Router();

// Get the menu
favourRouter.post("/toggle-favour", authMiddleware, FavourController.toggleFavour);
favourRouter.get("/get-favours", authMiddleware, FavourController.getFavours); 

export default favourRouter;
