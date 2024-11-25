import express from "express";
import multer from "multer";
import MenuController from "../controllers/MenuController.js";
import { authMiddleware } from "../middleware/auth.js";
import { checkMenuMiddleware } from "../middleware/checkMenu.js";

const menuRouter = express.Router();

// image upload
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Routes for menu
// Add a item new menu
menuRouter.post(
  "/add-food",
  upload.single("image"),
  MenuController.addFoodToMenu
);

//
menuRouter.post(
  "/edit-food",
  upload.single("image"),
  MenuController.updateFood
);

// Get the menu
menuRouter.get("/get-menu", checkMenuMiddleware, MenuController.getMenu);

// GET categories
menuRouter.get("/get-categories", MenuController.getCategories);

// Get food
menuRouter.get("/get-food/:item_id", MenuController.getFood);

// Remove a item from menu
menuRouter.post("/remove-food", MenuController.removeFood);

menuRouter.post("/favour", MenuController.toggleFavour);

export default menuRouter;
