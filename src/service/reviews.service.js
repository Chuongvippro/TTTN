const { censorComment } = require("../utils/censor");

class reviewsService {
  constructor(reviewsRepo) {
    this.reviewsRepo = reviewsRepo;
  }

  async getProductReviews(productId, limit, offset) {
    const rawReviews = await this.reviewsRepo.getReviewsByProduct(
      productId,
      limit,
      offset,
    );

    //lọc các từ bị cấm qua util/censor
    const cleanReviews = rawReviews.map((review) => {
      return {
        ...review,
        comment: censorComment(review.comment),
      };
    });

    return cleanReviews;
  }

  async addReview(userId, productId, rating, comment) {
    return await this.reviewsRepo.addReview(userId, productId, rating, comment);
  }

  async updateReview(reviewId, userId, rating, comment) {
    return await this.reviewsRepo.updateReview(
      reviewId,
      userId,
      rating,
      comment,
    );
  }

  async deleteReview(reviewId, userId, userRole) {
    // 1. Kiểm tra xem có phải là admin/staff không
    const isAdminOrStaff =
      userRole === "admin" || userRole === "staff" || userRole === 1;

    if (isAdminOrStaff) {
      //nếu là admin/staff thì cho xóa
      return await this.reviewsRepo.deleteReview(reviewId, null);
    } else {
      //Nếu là User thường Repo phải check thêm user_id (chỉ được xóa của chính mình)
      return await this.reviewsRepo.deleteReview(reviewId, userId);
    }
  }
  // Admin: lấy toàn bộ đánh giá
  async getAllReviews(limit = 10, offset = 0) {
    return await this.reviewsRepo.getAllReviews(limit, offset);
  }
}

module.exports = reviewsService;
