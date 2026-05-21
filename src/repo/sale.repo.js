class SaleRepo {
  constructor(connection) {
    this.connection = connection;
  }

  async getAllSales(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await this.connection.query(
      `SELECT * FROM sale ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  }

  async countAllSales() {
    const [rows] = await this.connection.query(
      `SELECT COUNT(*) as total FROM sale`,
    );
    return rows[0].total;
  }

  async createSale(data) {
    const [result] = await this.connection.query(
      `INSERT INTO sale (code_sale, percent, start_at, expired_at, description, status) 
       VALUES (?, ?, ?, ?, ?,?)`,
      [
        data.code_sale || null,
        data.percent,
        data.start_at,
        data.expired_at,
        data.description || null,
        data.status,
      ],
    );
    return result;
  }

  async updateSale(id, data) {
    const [result] = await this.connection.query(
      `UPDATE sale 
       SET code_sale = ?, percent = ?, start_at = ?, expired_at = ?, description = ? , status = ?
       WHERE id = ?`,
      [
        data.code_sale || null,
        data.percent,
        data.start_at,
        data.expired_at,
        data.description || null,
        data.status,
        id,
      ],
    );
    return result;
  }

  async deleteSale(id) {
    const [result] = await this.connection.query(
      `UPDATE sale SET status = 'inactive' WHERE id = ?`,
      [id],
    );
    return result;
  }
  // Cập nhật sale_id cho TẤT CẢ sản phẩm đang hoạt động
  async applySaleToAllProducts(newSaleId, newPercent) {
    const sql = `
      UPDATE products p
      LEFT JOIN sale s ON p.sale_id = s.id
      SET p.sale_id = ?
      WHERE p.status = 'active'
        AND (
          p.sale_id IS NULL 
          OR s.id IS NULL
          OR s.status = 'inactive' 
          OR s.expired_at < NOW() 
          OR s.percent < ?
        )
    `;
    const [result] = await this.connection.query(sql, [newSaleId, newPercent]);
    return result;
  }
  // Gỡ sale_id khỏi toàn bộ sản phẩm khi chương trình giảm giá bị tắt hoặc xóa
  async removeSaleFromProducts(saleId) {
    const [result] = await this.connection.query(
      `UPDATE products SET sale_id = NULL WHERE sale_id = ?`,
      [saleId],
    );
    return result;
  }

  // Cập nhật sale_id cho toàn bộ sản phẩm thuộc một LOẠI cụ thể
  async applySaleToCategory(categoryId, saleId, newPercent) {
    const sql = `
      UPDATE products p
      LEFT JOIN sale s ON p.sale_id = s.id
      SET p.sale_id = ?
      WHERE p.status = 'active' 
        AND p.category_id = ?
        AND (
          p.sale_id IS NULL 
          OR s.id IS NULL
          OR s.status = 'inactive' 
          OR s.expired_at < NOW() 
          OR s.percent < ?
        )
    `;
    const [result] = await this.connection.query(sql, [
      saleId,
      categoryId,
      newPercent,
    ]);
    return result;
  }
}

module.exports = SaleRepo;
