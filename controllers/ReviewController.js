import ReviewModel from "../models/ReviewModel.js";

class ReviewController {
  // [POST] /review/post-review
  async postReview(req, res) {
    const { user_id, item_id, order_id, rating, comment } = req.body;
    try {
      const response = await ReviewModel.addReviewQuery(
        user_id,
        item_id,
        order_id,
        rating,
        comment
      );
      console.log("response:", response);

      if (response) {
        if (response.message === "OK" && response.data) {
          return res.status(201).json({
            message: "Review added successfully",
            success: true,
            data: response.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to add review",
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
      console.error("Error in postReview:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  // [GET] /review/get-reviews/:item_id
  async getReviews(req, res) {
    const { item_id } = req.params;
    try {
      const response = await ReviewModel.getReviewsQuery(item_id);
      if (response) {
        if (
          response.message === "OK" &&
          response.data &&
          response.data.length >= 0
        ) {
          return res.status(200).json({
            message: "Reviews fetched successfully",
            success: true,
            data: response.data,
          });
        } else {
          return res.status(500).json({
            message: "Failed to fetch reviews",
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
      console.error("Error in getReviews:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getReviewByUserAndOrder(req, res) {
    const { order_id, item_id } = req.params;
    const { user_id } = req.body;

    try {
      const response = await ReviewModel.getReviewByUserAndOrderQuery(
        user_id,
        order_id,
        item_id
      );
      if (response) {
        if (response.message === "OK" && response.data) {
          return res.status(200).json({
            message: "Review fetched successfully",
            success: true,
            data: response.data,
          });
        } else {
          return res.status(200).json({
            message: "Failed to fetch review",
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
      console.error("Error in getReviewByUserAndOrder:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new ReviewController();
