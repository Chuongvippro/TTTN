class reviewsRepo {
  constructor(connection) {
    this.connection = connection;
  }

  async getReviewsByProduct(productId, limit, offset) {
    const [rows] = await this.connection.query(
      `
    SELECT u.user_name as userName,r.id, r.rating, r.comment, r.created_at as createdAt, r.user_id
    FROM reviews r 
    LEFT JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = ? AND r.status = 1
    ORDER BY r.created_at DESC 
    LIMIT ? OFFSET ?
  `,
      [productId, Number(limit), Number(offset)],
    );

    return rows;
  }

  async addReview(userId, productId, rating, comment) {
    const [result] = await this.connection.query(
      `INSERT INTO reviews (user_id, product_id, rating, comment, status, created_at) 
       VALUES (?, ?, ?, ?, 1, NOW())`,
      [userId, productId, rating, comment],
    );
    return result;
  }

  async updateReview(reviewId, userId, rating, comment) {
    // Chỉ cho phép sửa nếu đúng user_id đó tạo ra đánh giá (Bảo mật tầng DB)
    const [result] = await this.connection.query(
      `UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?`,
      [rating, comment, reviewId, userId],
    );
    return result;
  }
  async deleteReview(reviewId, userId = null) {
    let query = `DELETE FROM reviews WHERE id = ?`;
    let params = [reviewId];

    // Nếu Service truyền xuống userId, thì ghép thêm điều kiện vào
    if (userId) {
      query += ` AND user_id = ?`;
      params.push(userId);
    }

    const [result] = await this.connection.query(query, params);
    return result;
  }

  async getAllReviews(limit = 10, offset = 0) {
    const [rows] = await this.connection.query(
      `SELECT r.*, u.user_name, p.name AS product_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.status = 1
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)],
    );
    const [[{ total }]] = await this.connection.query(
      "SELECT COUNT(*) as total FROM reviews WHERE status = 1",
    );
    return { reviews: rows, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = reviewsRepo;
