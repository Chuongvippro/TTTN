class orderRepo {
  constructor(connection) {
    this.connection = connection;
  }

  async createOrder(
    userId,
    fullName,
    phone,
    address,
    note,
    paymentMethod,
    totalPrice,
  ) {
    const [result] = await this.connection.query(
      `INSERT INTO orders (user_id, full_name, phone, address, note, payment_method, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || null,
        fullName,
        phone,
        address,
        note || null,
        paymentMethod,
        totalPrice,
      ],
    );
    return result.insertId;
  }

  async createOrderItems(orderId, items) {
    if (!items || items.length === 0) return;
    const values = items.map((item) => [
      orderId,
      item.product_id || item.id,
      item.name,
      item.price,
      item.quantity,
      item.img || null,
    ]);
    return await this.connection.query(
      `INSERT INTO order_items (order_id, product_id, name, price, quantity, img) VALUES ?`,
      [values],
    );
  }

  async updateProductStock(productId, quantity) {
    const sql =
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
    return await this.connection.query(sql, [quantity, productId, quantity]);
  }

  async clearCartAfterOrder(userId) {
    const [cart] = await this.connection.query(
      `SELECT id FROM carts WHERE user_id = ?`,
      [userId],
    );
    if (!cart || cart.length === 0) return;
    await this.connection.query(`DELETE FROM cart_items WHERE cart_id = ?`, [
      cart[0].id,
    ]);
  }

  async getOrderById(orderId) {
    const [[order]] = await this.connection.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId],
    );
    if (!order) return null;
    const [items] = await this.connection.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId],
    );
    order.items = items;
    return order;
  }

  // Lấy tất cả đơn hàng của user (kèm items)
  async getUserOrders(userId) {
    const [orders] = await this.connection.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
    );
    if (!orders || orders.length === 0) return [];

    const orderIds = orders.map((o) => o.id);
    const [items] = await this.connection.query(
      `SELECT * FROM order_items WHERE order_id IN (?)`,
      [orderIds],
    );

    // Gắn items vào từng order
    return orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));
  }

  //phần của admin
  // Lấy tất cả đơn hàng kèm phân trang cho Admin
  async getAllOrders(page = 1, size = 10) {
    const offset = (page - 1) * size;
    const sql = `
            SELECT 
                o.*, 
                u.user_name AS orderer_name,
                o.full_name AS receiver_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?`;

    const [rows] = await this.connection.query(sql, [size, offset]);
    return rows;
  }

  // Đếm tổng số đơn để làm phân trang
  async countOrders() {
    const [rows] = await this.connection.query(
      "SELECT COUNT(*) as total FROM orders",
    );
    return rows[0].total;
  }

  // Cập nhật trạng thái đơn hàng
  async updateStatus(id, status) {
    const sql = "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?";
    const [result] = await this.connection.query(sql, [status, id]);
    return result;
  }

  //lấy chi tiết sản phẩm
  async getOrderItemsByOrderId(orderId) {
    const sql = `
      SELECT 
        oi.*, 
        p.name AS original_product_name 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`;

    const [rows] = await this.connection.query(sql, [orderId]);
    return rows;
  }

  //user xem hàng bản thân
  async findByUserId(userId) {
    // Lấy đơn hàng mới nhất lên đầu
    const [rows] = await this.connection.query(
      `SELECT id, total_price, status, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  }

  // Cập nhật trạng thái đơn hàng 
  async updateStatusForUser(orderId, userId, status) {
    const query = "UPDATE orders SET status = ? WHERE id = ? AND user_id = ?";
    // Xóa .promise() đi là xong
    const [result] = await this.connection.execute(query, [status, orderId, userId]);
    return result.affectedRows > 0;
  }

  // Lấy trạng thái hiện tại để kiểm tra 
  async getStatus(orderId, userId) {
    const query = "SELECT status FROM orders WHERE id = ? AND user_id = ?";
    // Xóa .promise() đi là xong
    const [rows] = await this.connection.execute(query, [orderId, userId]);
    return rows.length > 0 ? rows[0].status : null;
  }
}

module.exports = orderRepo;
