import MenuModel from "../models/MenuModel.js";
import fs from "fs";

class MenuController {
  // [POST] /menu/add-food
  async addFoodToMenu(req, res) {
    let image_file = `${req.file.filename}`;
    let { name, price, description, category } = req.body;
    let data = { name, price, description, image: image_file, category };
    try {
      const result = await MenuModel.addFoodQuery(data);
      if (result) {
        if (result.message === "OK" && result.data) {
          return res.status(201).json({
            message: "Food added successfully",
            success: true,
            data: result.data,
          });
        } else {
          fs.unlink(`uploads/${image_file}`, async (err) => {
            if (err) {
              console.error("Failed to delete image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });

          return res.status(500).json({
            message: "Failed to add food",
            success: false,
            error: result.error,
          });
        }
      } else {
        fs.unlink(`uploads/${image_file}`, async (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          } else {
            console.log("Image deleted successfully");
          }
        });
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.log("Error in addFoodToMenu:", error);
      fs.unlink(`uploads/${image_file}`, async (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async updateFood(req, res) {
    let image_file;

    if (req.file) {
      image_file = `${req.file.filename}`;
    } else {
      image_file = undefined;
    }

    let {
      item_id,
      item_name,
      price,
      description,
      category_id,
      available,
      image: default_image,
    } = req.body;

    let data = {
      item_id,
      item_name,
      price,
      description,
      category_id,
      available,
    };

    if (image_file !== undefined) {
      data.image = image_file;
    }

    if (default_image !== undefined) {
      data.image = default_image;
    }

    try {
      const result = await MenuModel.updateFoodQuery(data);

      if (result) {
        if (result.message === "OK" && result.data) {
          return res.status(200).json({
            message: "Food updated successfully",
            success: true,
            data: result.data,
          });
        } else {
          fs.unlink(`uploads/${image_file}`, async (err) => {
            if (err) {
              console.error("Failed to delete image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });
          return res.status(500).json({
            message: "Failed to update food",
            success: false,
            error: result.error,
          });
        }
      } else {
        fs.unlink(`uploads/${image_file}`, async (err) => {
          if (err) {
            console.error("Failed to delete image:", err);
          } else {
            console.log("Image deleted successfully");
          }
        });
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.log("Error in updateFood:", error);
      fs.unlink(`uploads/${image_file}`, async (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [GET] /menu/get-menu
  async getMenu(req, res) {
    const { user_id } = req.body;

    try {
      const result = await MenuModel.getMenuQuery(user_id);
      if (result) {
        if (result.message === "OK" && result.data) {
          return res.status(200).json({
            message: "Menu fetched successfully",
            success: true,
            data: result.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to fetch menu",
            success: false,
            error: result.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.log("Error in getMenu:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [POST] /menu/get-food
  async getFood(req, res) {
    let { item_id } = req.params;

    if (!item_id) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    try {
      const food = await MenuModel.getFoodQuery(item_id);
      if (food) {
        if (food.message === "OK" && food.data) {
          return res.status(200).json({
            message: "Food fetched successfully",
            success: true,
            data: food.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to fetch food",
            success: false,
            error: food.error,
          });
        }
      } else {
        return res.status(500).json({
          message: "Something went wrong. Please try again",
        });
      }
    } catch (error) {
      console.log("Error in getFood:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [POST] /menu/remove-food
  async removeFood(req, res) {
    let { item_id } = req.body;

    if (!item_id) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    try {
      const food = await MenuModel.getFoodQuery(item_id);
      if (food) {
        if (food.message === "OK" && food.data) {
          const foodData = food.data;
          fs.unlink(`uploads/${foodData.image_url}`, async (err) => {
            if (err) {
              console.error("Failed to delete image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });

          const result = await MenuModel.removeFoodQuery(item_id);

          if (result) {
            if (result.message === "OK") {
              return res.status(200).json({
                message: "Food removed successfully",
                success: true,
              });
            } else {
              return res.status(500).json({
                message: "Failed to remove food",
                success: false,
                error: result.error,
              });
            }
          } else {
            return res.status(500).json({
              message: "Something went wrong. Please try again",
            });
          }
        }
      } else {
        return res.status(500).json({
          message: "Failed to fetch food",
          success: false,
          error: food.error,
        });
      }
    } catch (error) {
      console.log("Error in removeFood:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getCategories(req, res) {
    try {
      const response = await MenuModel.getCategoriesQuery();

      if (response) {
        if (response.message === "OK" && response.data) {
          return res.status(200).json({
            message: "Categories fetched successfully",
            success: true,
            data: response.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to fetch categories",
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
      console.log("Error in getCategories:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async toggleFavour(req, res) {}
}

export default new MenuController();
