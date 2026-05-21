class CategoryRepo {
  constructor(connection) {
    this.connection = connection;
  }

  // Lấy hết loại ở trang home (Chỉ lấy loại đang active)
  async getAllcategories() {
    const [rows] = await this.connection.query(
      `SELECT * FROM categories WHERE status = ?`,
      ["active"],
    );
    return rows;
  }

  // Lấy danh sách categories có phân trang
  async getListCategories(page = 1, size = 10) {
    const offset = (page - 1) * size;
    const [rows] = await this.connection.query(
      `SELECT * FROM categories ORDER BY id ASC LIMIT ? OFFSET ?`,
      [size, offset],
    );
    return rows;
  }

  // Đếm tổng số loại
  async countCategories() {
    const [rows] = await this.connection.query(
      `SELECT COUNT(*) as total FROM categories`,
    );
    return rows[0].total;
  }

  async checkCategory(id) {
    const [rows] = await this.connection.query(
      "SELECT id FROM categories WHERE id = ?",
      [id],
    );
    return rows.length > 0;
  }

  async createCategory(data) {
    const [result] = await this.connection.query(
      `INSERT INTO categories (name, description, status) VALUES (?, ?, ?)`,
      [data.name, data.description, data.status],
    );
    return result;
  }

  async updateCategory(id, data) {
    const [result] = await this.connection.query(
      `UPDATE categories SET name = ?, description = ?, status = ? WHERE id = ?`,
      [data.name, data.description, data.status, id],
    );
    return result;
  }

  // Xóa mềm (Soft Delete)
  async deleteCategory(id) {
    const [result] = await this.connection.query(
      `UPDATE categories SET status = 'inactive' WHERE id = ?`,
      [id],
    );
    return result;
  }

  // Khôi phục
  async restoreCategory(id) {
    const [result] = await this.connection.query(
      `UPDATE categories SET status = 'active' WHERE id = ?`,
      [id],
    );
    return result;
  }
}

module.exports = CategoryRepo;