class ProductRepo {
  constructor(connection) {
    this.connection = connection;
  }

  // ==========================================
  // 1. DÀNH CHO ADMIN (Quản lý tất cả)
  // ==========================================
  async getAllForUser(page = 1, size = 10) {
    const offset = (page - 1) * size;
    const [rows] = await this.connection.query(
      `SELECT p.*, s.percent, ROUND(p.price * (1 - s.percent / 100)) AS sale_price 
       FROM products p
       LEFT JOIN sale s ON p.sale_id = s.id AND s.status = 'active' AND (s.expired_at > NOW() OR s.expired_at IS NULL)
       WHERE p.status = 'active' AND p.stock >= 1 
       ORDER BY p.id DESC 
       LIMIT ? OFFSET ?`,
      [size, offset],
    );
    return rows;
  }
  // Admin lấy hết để quản lý, kể cả hàng hết hay đang tạm ngưng (inactive)
  async getAll(page = 1, size = 10) {
    const offset = (page - 1) * size;

    const [rows] = await this.connection.query(
      `SELECT p.*, s.code_sale, s.percent 
       FROM products p
       LEFT JOIN sale s ON p.sale_id = s.id
       ORDER BY p.id DESC 
       LIMIT ? OFFSET ?`,
      [size, offset],
    );
    return rows;
  }

  // Đếm tất cả sản phẩm trong kho cho Admin
  async countAll() {
    const [rows] = await this.connection.query(
      `SELECT COUNT(*) as total FROM products`,
    );
    return rows[0].total;
  }

  // Soft Delete: Thay vì xóa hẳn, mình chuyển trạng thái sang inactive
  async deleteProduct(id) {
    return await this.connection.query(
      `UPDATE products SET status = 'inactive' WHERE id = ?`,
      [id],
    );
  }

  async restoreStatus(id) {
    // Trả trạng thái về 'active'
    const [result] = await this.connection.query(
      `UPDATE products SET status = 'active' WHERE id = ?`,
      [id],
    );
    return result;
  }

  // ==========================================
  // 2. DÀNH CHO USER (Chỉ lấy hàng 'active' và stock >= 1)
  // ==========================================

  // Lấy danh sách sản phẩm cho khách xem
  async getListProduct({
    categoryId,
    keyword,
    sort,
    pet_type,
    isSale,
    page = 1,
    limit = 10,
  }) {
    const offset = (page - 1) * limit;
    let sql = `
        SELECT p.*, s.percent, ROUND(p.price * (1 - s.percent / 100)) AS sale_price 
        FROM products p
        LEFT JOIN sale s ON p.sale_id = s.id AND s.status = 'active' AND (s.expired_at > NOW() OR s.expired_at IS NULL)
        WHERE p.status = 'active' AND p.stock >= 1
    `;
    let params = [];

    if (categoryId) {
      sql += " AND category_id = ?";
      params.push(categoryId);
    }

    if (keyword) {
      sql += " AND name LIKE ?";
      params.push(`%${keyword}%`);
    }
    if (pet_type) {
      sql += " AND pet_type = ?";
      params.push(pet_type);
    }
    if (isSale === "true" || isSale === true) {
      sql += " AND s.percent > 0";
    }

    // --- Xử lý sắp xếp (Sort Logic) ---
    switch (sort) {
      case "price_asc":
        sql += " ORDER BY price ASC";
        break;
      case "price_desc":
        sql += " ORDER BY price DESC";
        break;
      case "oldest":
        sql += " ORDER BY id ASC";
        break;
      case "newest":
      default:
        sql += " ORDER BY p.id DESC"; // Mặc định sản phẩm mới nhất lên đầu
        break;
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await this.connection.query(sql, params);
    return rows;
  }

  // Đếm sản phẩm cho khách (Phải khớp với điều kiện lọc ở trên)
  async countAllForUser({ categoryId, keyword, pet_type, isSale }) {
    let sql = `
        SELECT COUNT(*) as total 
        FROM products p
        LEFT JOIN sale s ON p.sale_id = s.id AND s.status = 'active' AND (s.expired_at > NOW() OR s.expired_at IS NULL)
        WHERE p.status = 'active' AND p.stock >= 1
    `;
    let params = [];

    if (categoryId) {
      sql += " AND category_id = ?";
      params.push(categoryId);
    }

    if (keyword) {
      sql += " AND name LIKE ?";
      params.push(`%${keyword}%`);
    }
    if (pet_type) {
      sql += " AND pet_type = ?";
      params.push(pet_type);
    }
    if (isSale === "true" || isSale === true) {
      sql += " AND s.percent > 0";
    }

    const [rows] = await this.connection.query(sql, params);
    return rows[0].total;
  }

  // Tìm kiếm nhanh (Chỉ hiện hàng đang bán và còn hàng)
  async searchProduct(keyword) {
    const [rows] = await this.connection.query(
      "SELECT * FROM products WHERE name LIKE ? AND status = 'active' AND stock >= 1 LIMIT 5",
      [`%${keyword}%`],
    );
    return rows;
  }

  // ==========================================
  // 3. CÁC HÀM KHÁC
  // ==========================================

  async getById(id) {
    // Với User thì nên check thêm status = 'active' để tránh khách mò link trực tiếp
    const query = `
      SELECT 
        p.*, 
        s.percent,
        ROUND(p.price * (1 - IFNULL(s.percent, 0) / 100)) AS sale_price,
        COUNT(r.id) AS reviewCount, 
        IFNULL(ROUND(AVG(r.rating), 1), 5.0) AS rating
      FROM products p
      LEFT JOIN sale s ON p.sale_id = s.id AND s.status = 'active' AND (s.expired_at > NOW() OR s.expired_at IS NULL)
      LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 1
      WHERE p.id = ?
      GROUP BY p.id, s.id
    `;
    const [rows] = await this.connection.query(query, [id]);
    return rows[0] || null;
  }

  async createProduct(data) {
    const [result] = await this.connection.query(
      `INSERT INTO products (name, price, stock, description, category_id, status, img, pet_type, sale_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.price,
        data.stock,
        data.description,
        data.category_id,
        data.status || "active",
        data.img,
        data.pet_type,
        data.sale_id,
      ],
    );
    return result;
  }

  async updateProduct(id, data) {
    const [result] = await this.connection.query(
      `UPDATE products 
       SET name = ?, price = ?, stock = ?, description = ?, category_id = ?, status = ?, img = ?, pet_type = ?, sale_id = ? 
       WHERE id = ?`,
      [
        data.name,
        data.price,
        data.stock,
        data.description,
        data.category_id,
        data.status,
        data.img,
        data.pet_type,
        data.sale_id,
        id,
      ],
    );
    return result;
  }

  async getUrlImg(id) {
    const [rows] = await this.connection.query(
      `SELECT img FROM products WHERE id = ?`,
      [id],
    );
    // Trả về chuỗi path ảnh để Service xử lý logic so sánh ảnh cũ/mới
    return rows.length > 0 ? rows[0].img : null;
  }

  async getSaleProducts(limit = 8) {
    const [rows] = await this.connection.query(
      `SELECT
          p.*,
          s.percent,
          s.expired_at,
          ROUND(p.price * (1 - s.percent / 100)) AS sale_price
       FROM products p
       INNER JOIN sale s ON p.sale_id = s.id
       WHERE s.status = 'active'
         AND (s.expired_at > NOW() OR s.expired_at IS NULL)
         AND p.status = 'active'
         AND p.stock > 0 
       ORDER BY s.percent DESC
       LIMIT ?`,
      [limit],
    );
    return rows;
  }
}

module.exports = ProductRepo;
