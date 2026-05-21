class blogRepo {
  constructor(connection) {
    this.connection = connection;
  }

  // ── Bài viết ──
  async getAllPosts({ categorySlug, search, page = 1, limit = 6 }) {
    const offset = (page - 1) * limit;
    let where = `WHERE p.status = 'published'`;
    const params = [];

    if (categorySlug) {
      where += ` AND c.slug = ?`;
      params.push(categorySlug);
    }
    if (search) {
      where += ` AND (p.title LIKE ? OR p.summary LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const [posts] = await this.connection.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              u.user_name AS author_name,
              (SELECT COUNT(*) FROM blog_comments cm WHERE cm.post_id = p.id) AS comment_count
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await this.connection.query(
      `SELECT COUNT(*) AS total FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       ${where}`,
      params
    );

    return { posts, total, totalPages: Math.ceil(total / limit), currentPage: page };
  }

  async getPostBySlug(slug) {
    const [[post]] = await this.connection.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              u.user_name AS author_name
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.slug = ? AND p.status = 'published'`,
      [slug]
    );
    return post || null;
  }

  async incrementViews(postId) {
    await this.connection.query(
      `UPDATE blog_posts SET views = views + 1 WHERE id = ?`, [postId]
    );
  }

  async getRelatedPosts(categoryId, excludeId, limit = 3) {
    const [posts] = await this.connection.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.status = 'published'
       ORDER BY p.created_at DESC LIMIT ?`,
      [categoryId, excludeId, limit]
    );
    return posts;
  }

  // ── Danh mục ──
  async getAllCategories() {
    const [cats] = await this.connection.query(
      `SELECT c.*, COUNT(p.id) AS post_count
       FROM blog_categories c
       LEFT JOIN blog_posts p ON p.category_id = c.id AND p.status = 'published'
       GROUP BY c.id ORDER BY c.name`
    );
    return cats;
  }

  // ── Bình luận ──
  async getCommentsByPostId(postId) {
    const [comments] = await this.connection.query(
      `SELECT cm.*, u.user_name, u.avatar
       FROM blog_comments cm
       LEFT JOIN users u ON cm.user_id = u.id
       WHERE cm.post_id = ?
       ORDER BY cm.created_at DESC`,
      [postId]
    );
    return comments;
  }

  async addComment(postId, userId, content) {
    const [result] = await this.connection.query(
      `INSERT INTO blog_comments (post_id, user_id, content) VALUES (?, ?, ?)`,
      [postId, userId, content]
    );
    return result.insertId;
  }

  // ── Admin ──
  async getAllPostsAdmin() {
    const [posts] = await this.connection.query(
      `SELECT p.*, c.name AS category_name, u.user_name AS author_name,
              (SELECT COUNT(*) FROM blog_comments cm WHERE cm.post_id = p.id) AS comment_count
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC`
    );
    return posts;
  }

  async createPost(title, slug, summary, content, thumbnail, categoryId, authorId) {
    const [result] = await this.connection.query(
      `INSERT INTO blog_posts (title, slug, summary, content, thumbnail, category_id, author_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'published')`,
      [title, slug, summary, content, thumbnail || null, categoryId || null, authorId]
    );
    return result.insertId;
  }

  async updatePost(id, title, slug, summary, content, thumbnail, categoryId, status) {
    await this.connection.query(
      `UPDATE blog_posts SET title=?, slug=?, summary=?, content=?, thumbnail=?, category_id=?, status=?
       WHERE id=?`,
      [title, slug, summary, content, thumbnail || null, categoryId || null, status, id]
    );
  }

  async deletePost(id) {
    await this.connection.query(`DELETE FROM blog_posts WHERE id = ?`, [id]);
  }

  async getPostById(id) {
    const [[post]] = await this.connection.query(
      `SELECT * FROM blog_posts WHERE id = ?`, [id]
    );
    return post || null;
  }
}

module.exports = blogRepo;