// Chạy: node migrate.js
require("dotenv").config();

// Dùng chính config db của project — không cần sửa gì
const connection = require("./src/config/db");

async function migrate() {
  try {
    const conn = await connection.getConnection();
    console.log("✅ Kết nối MySQL thành công!");
    conn.release();
  } catch (err) {
    console.error("❌ Không kết nối được MySQL:", err.message);
    process.exit(1);
  }

  const tables = [
    {
      name: "carts",
      sql: `CREATE TABLE IF NOT EXISTS carts (
        id         INT NOT NULL AUTO_INCREMENT,
        user_id    INT NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_id (user_id),
        CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
    {
      name: "cart_items",
      sql: `CREATE TABLE IF NOT EXISTS cart_items (
        id         INT NOT NULL AUTO_INCREMENT,
        cart_id    INT NOT NULL,
        product_id INT NOT NULL,
        quantity   INT NOT NULL DEFAULT 1,
        added_at   TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY cart_product (cart_id, product_id),
        KEY fk_cartitem_product (product_id),
        CONSTRAINT fk_cartitem_cart    FOREIGN KEY (cart_id)    REFERENCES carts    (id) ON DELETE CASCADE,
        CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
    {
      name: "orders",
      sql: `CREATE TABLE IF NOT EXISTS orders (
        id             INT NOT NULL AUTO_INCREMENT,
        user_id        INT DEFAULT NULL,
        full_name      VARCHAR(150) NOT NULL,
        phone          VARCHAR(20) NOT NULL,
        address        TEXT NOT NULL,
        note           TEXT DEFAULT NULL,
        payment_method ENUM('cash','transfer') NOT NULL DEFAULT 'cash',
        status         ENUM('pending','confirmed','shipping','delivered','cancelled') NOT NULL DEFAULT 'pending',
        total_price    DECIMAL(12,2) NOT NULL DEFAULT 0,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY fk_order_user (user_id),
        CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
    {
      name: "order_items",
      sql: `CREATE TABLE IF NOT EXISTS order_items (
        id         INT NOT NULL AUTO_INCREMENT,
        order_id   INT NOT NULL,
        product_id INT DEFAULT NULL,
        name       VARCHAR(150) NOT NULL,
        price      DECIMAL(10,2) NOT NULL,
        quantity   INT NOT NULL DEFAULT 1,
        img        VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (id),
        KEY fk_orderitem_order   (order_id),
        KEY fk_orderitem_product (product_id),
        CONSTRAINT fk_orderitem_order   FOREIGN KEY (order_id)   REFERENCES orders   (id) ON DELETE CASCADE,
        CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
    {
      name: "blog_posts",
      sql: `CREATE TABLE IF NOT EXISTS blog_posts (
    id          INT NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL,
    summary     TEXT,
    content     LONGTEXT,
    category_id INT,
    author_id   INT,
    status      ENUM('draft', 'published') DEFAULT 'draft',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
    {
      name: "blog_comments",
      sql: `CREATE TABLE IF NOT EXISTS blog_comments (
        id         INT NOT NULL AUTO_INCREMENT,
        post_id    INT NOT NULL,
        user_id    INT NOT NULL,
        content    TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE,
        CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
    {
      name: "blog_categories",
      sql: `CREATE TABLE IF NOT EXISTS blog_categories (
        id   INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    },
  ];

  for (const table of tables) {
    try {
      await connection.query(table.sql);
      console.log(`✅ Bảng '${table.name}' sẵn sàng!`);
    } catch (err) {
      console.error(`❌ Lỗi bảng '${table.name}':`, err.message);
    }
  }

  console.log("\n🎉 Migration hoàn tất! Chạy lại: npm run dev");
  process.exit(0);
}

migrate();
