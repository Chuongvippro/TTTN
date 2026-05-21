class cartRepo {
  constructor(connection) {
    this.connection = connection;
  }

  // Tìm giỏ hàng theo userId
  async findCartByUserId(userId) {
    const [rows] = await this.connection.query(
      `SELECT id FROM carts WHERE user_id = ?`,
      [userId],
    );
    return rows[0];
  }

  // Tạo giỏ hàng mới
  async createCart(userId) {
    const [result] = await this.connection.query(
      `INSERT INTO carts (user_id) VALUES (?)`,
      [userId],
    );
    return result.insertId;
  }

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  async findCartItem(cartId, productId) {
    const [rows] = await this.connection.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?`,
      [cartId, productId],
    );
    return rows[0];
  }

  // Thêm mới sản phẩm vào giỏ
  async addCartItem(cartId, productId, quantity) {
    return await this.connection.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
      [cartId, productId, quantity],
    );
  }

  // Cập nhật số lượng sản phẩm đã có
  async updateCartItemQuantity(cartId, productId, newQuantity) {
    return await this.connection.query(
      `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?`,
      [newQuantity, cartId, productId],
    );
  }

  async getCartCount(userId) {
    const [rows] = await this.connection.query(
      `select sum(ci.quantity) as total
      from carts c
      join cart_items ci on c.id = ci.cart_id
      where c.user_id = ?`,
      [userId],
    );
    return rows[0];
  }

  async getFullCart(userId) {
    const [rows] = await this.connection.query(
      `SELECT p.id, p.name, p.price, p.img, p.stock, ci.quantity, c.id as cartId,
              s.percent, 
              ROUND(p.price * (1 - IFNULL(s.percent, 0) / 100)) AS sale_price
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN sale s ON p.sale_id = s.id AND s.status = 'active' AND (s.expired_at > NOW() OR s.expired_at IS NULL)
       WHERE c.user_id = ?`,
      [userId],
    );
    return rows;
  }

  async getProductsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(",");

    const [rows] = await this.connection.query(
      `SELECT p.id, p.name, p.price, p.img, p.stock,
              s.percent, 
              ROUND(p.price * (1 - IFNULL(s.percent, 0) / 100)) AS sale_price 
       FROM products p
       LEFT JOIN sale s ON p.sale_id = s.id AND s.status = 'active' AND (s.expired_at > NOW() OR s.expired_at IS NULL)
       WHERE p.id IN (${placeholders})`,
      ids,
    );
    return rows;
  }

  async updateCart(cartId, productId, quantity) {
    const rows = await this.connection.query(
      `update cart_items set quantity = ?  where cart_id = ? and product_id = ?`,
      [quantity, cartId, productId],
    );
    return rows;
  }

  // Xóa sản phẩm khỏi giỏ
  async removeCartItem(cartId, productId) {
    const [result] = await this.connection.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`,
      [cartId, productId],
    );
    return result;
  }
}

module.exports = cartRepo;
