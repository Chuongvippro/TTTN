class userRepo {
  constructor(connection) {
    this.connection = connection;
  }

  // ==========================================
  // 1. XÁC THỰC & ĐĂNG NHẬP (Chỉ cho User 'active')
  // ==========================================

  async findByEmail(email) {
    // Chỉ tìm những thằng đang active để cho phép đăng nhập
    const [rows] = await this.connection.query(
      `SELECT * FROM users WHERE email = ? AND status = 'active'`,
      [email],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findUserById(id) {
    // Lấy thông tin cá nhân cũng chỉ cho tài khoản đang active
    const [rows] = await this.connection.query(
      `SELECT * FROM users WHERE id = ? AND status = 'active'`,
      [id],
    );
    return rows[0] || null;
  }
  
  //lấy cho admin xem
  async findUserByIdForAdmin(id) {
    const [rows] = await this.connection.query(
      `SELECT * FROM users WHERE id = ?`, 
      [id],
    );
    return rows[0] || null;
  }

  // ==========================================
  // 2. QUẢN LÝ NGƯỜI DÙNG (DÀNH CHO ADMIN)
  // ==========================================

  // Admin lấy tất cả để quản lý (biết ai bị khóa, ai đang hoạt động)
  async getAll(page = 1, size = 10) {
    const offset = (page - 1) * size;
    const [rows] = await this.connection.query(
      `SELECT id, user_name, email, phone, role, status, created_at 
       FROM users 
       ORDER BY id DESC LIMIT ? OFFSET ?`,
      [size, offset],
    );
    return rows;
  }

  async countAll() {
    const [rows] = await this.connection.query(
      `SELECT COUNT(*) as total FROM users`,
    );
    return rows[0].total;
  }

  // Chuyển sang Soft Delete: Chuyển status về 'banned' thay vì xóa khỏi DB
  async deleteUser(id) {
    const [result] = await this.connection.query(
      `UPDATE users SET status = 'banned' WHERE id = ?`,
      [id],
    );
    return result;
  }

  async restoreStatus(id) {
    // Trả trạng thái về 'active'
    const [result] = await this.connection.query(
      `UPDATE users SET status = 'active' WHERE id = ?`,
      [id],
    );
    return result;
  }

  // ==========================================
  // 3. CHỨC NĂNG CẬP NHẬT (ADMIN & USER)
  // ==========================================

  async signInUser(user) {
    return await this.connection.query(
      `INSERT INTO users(user_name, email, password, created_at, status)
       VALUES(?,?,?,?, 'active')`,
      [user.user_name, user.email, user.password, user.created_at],
    );
  }

  async updateUser(id, data) {
    // Admin có thể cập nhật mọi thứ, kể cả status
    let sql = `UPDATE users SET user_name = ?, email = ?, phone = ?, role = ?, status = ?`;
    let params = [
      data.user_name,
      data.email,
      data.phone,
      data.role,
      data.status,
    ];

    if (data.password) {
      sql = `UPDATE users SET user_name = ?, email = ?, password = ?, phone = ?, role = ?, status = ?`;
      params = [
        data.user_name,
        data.email,
        data.password,
        data.phone,
        data.role,
        data.status,
      ];
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    const [result] = await this.connection.query(sql, params);
    return result;
  }

  async updateProfile(userId, data) {
    // User tự update profile của mình
    const [result] = await this.connection.query(
      `UPDATE users SET user_name = ?, phone = ?, address = ? WHERE id = ? AND status = 'active'`,
      [data.username, data.phone, data.address, userId],
    );
    return result;
  }
}

module.exports = userRepo;
