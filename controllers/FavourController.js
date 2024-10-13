import FavourModel from "../models/FavourModel.js";

class FavourController {
  async toggleFavour(req, res) {
    const { user_id, item_id } = req.body;

    try {
      const response = await FavourModel.toggleFavourQuery(
        user_id,
        item_id
      );

      if (response.message === "OK") {
        return res.status(200).json({
          success: true,
          message: "OK",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed",
          error: response.error,
        });
      }
    } catch (error) {
      console.error("Failed to toggle favour:", error);

      return res.status(500).json({
        message: "Failed",
        error: error,
      });
    }
  }

  async getFavours(req, res) {
    const { user_id } = req.body;

    try {
      const response = await FavourModel.getFavourQuery(user_id);

      if (response.message === "OK") {
        return res.status(200).json({
          success: true,
          message: "OK",
          data: response.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed",
          error: response.error,
        });
      }
    } catch (error) {
      console.error("Failed to get favours:", error);

      return res.status(500).json({
        message: "Failed",
        error: error,
      });
    }
  }
}

export default new FavourController();
