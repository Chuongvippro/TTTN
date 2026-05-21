class reviewsController {
  constructor(reviewsService) {
    this.reviewsService = reviewsService;

    this.getReviews = this.getReviews.bind(this);
    this.addReview = this.addReview.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.updateReview = this.updateReview.bind(this);
  }

  async getReviews(req, res) {
    try {
      const productId = req.params.id;
      const limit = parseInt(req.query.limit) || 5;
      //lấy offset từ url, nếu k có thì lấy 5 đánh giá mới nhất
      const offset = parseInt(req.query.offset) || 0;

      if (!productId) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu id sản phẩm" });
      }

      // Truyền offset xuống
      const reviews = await this.reviewsService.getProductReviews(
        productId,
        limit,
        offset,
      );

      return res.json({
        success: true,
        reviews: reviews,
      });
    } catch (error) {
      console.error("Lỗi Controller getReviews:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi server khi tải đánh giá" });
    }
  }

  async addReview(req, res) {
    try {
      const userId = req.user.id;

      const { productId, rating, comment } = req.body;

      if (!productId || !rating || !comment) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu thông tin đánh giá" });
      }

      await this.reviewsService.addReview(userId, productId, rating, comment);

      return res.json({ success: true, message: "Thêm đánh giá thành công!" });
    } catch (error) {
      console.error("Lỗi Controller addReview:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi lưu đánh giá" });
    }
  }

  async updateReview(req, res) {
    try {
      const reviewId = req.params.id;
      const userId = req.user.id;
      const { rating, comment } = req.body;

      if (!rating || !comment) {
        return res
          .status(400)
          .json({ success: false, message: "Thiếu nội dung sửa" });
      }

      const result = await this.reviewsService.updateReview(
        reviewId,
        userId,
        rating,
        comment,
      );

      // Nếu affectedRows = 0 nghĩa là user_id không khớp hoặc reviewId không tồn tại
      if (result.affectedRows === 0) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền sửa đánh giá này!",
        });
      }

      return res.json({ success: true, message: "Cập nhật thành công" });
    } catch (error) {
      console.error("Lỗi updateReview:", error);
      return res.status(500).json({ success: false });
    }
  }

  async deleteReview(req, res) {
    try {
      const reviewId = req.params.id;
      const userId = req.user.id;
      const userRole = req.user ? req.user.role : "user";

      const result = await this.reviewsService.deleteReview(
        reviewId,
        userId,
        userRole,
      );

      if (result.affectedRows === 0) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Bạn không có quyền xóa đánh giá này!",
          });
      }

      return res.json({ success: true, message: "Xóa thành công" });
    } catch (error) {
      console.error("Lỗi deleteReview:", error);
      return res.status(500).json({ success: false });
    }
  }
}

module.exports = reviewsController;
