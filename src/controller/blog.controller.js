class blogController {
  constructor(blogService) {
    this.blogService = blogService;
    this.getBlogList = this.getBlogList.bind(this);
    this.getBlogDetail = this.getBlogDetail.bind(this);
    this.postComment = this.postComment.bind(this);
    // Admin
    this.getAdminBlog = this.getAdminBlog.bind(this);
    this.getCreatePost = this.getCreatePost.bind(this);
    this.postCreatePost = this.postCreatePost.bind(this);
    this.getEditPost = this.getEditPost.bind(this);
    this.postEditPost = this.postEditPost.bind(this);
    this.deletePost = this.deletePost.bind(this);

    this.updateAdminPost = this.updateAdminPost.bind(this);
    this.createAdminPost = this.createAdminPost.bind(this);
  }

  // GET /blog
  async getBlogList(req, res) {
    try {
      const { category, search, page } = req.query;
      const [data, categories] = await Promise.all([
        this.blogService.getPostList({ categorySlug: category, search, page }),
        this.blogService.getAllCategories(),
      ]);
      res.render("blog-list", {
        ...data,
        categories,
        currentCategory: category || null,
        search: search || "",
        user: req.user || null,
      });
    } catch (err) {
      console.error("Lỗi getBlogList:", err);
      res.status(500).send("Lỗi server");
    }
  }

  // GET /blog/:slug
  async getBlogDetail(req, res) {
    try {
      const result = await this.blogService.getPostDetail(req.params.slug);
      if (!result) return res.status(404).send("Bài viết không tồn tại");
      const categories = await this.blogService.getAllCategories();
      res.render("blog-detail", {
        ...result,
        categories,
        user: req.user || null,
      });
    } catch (err) {
      console.error("Lỗi getBlogDetail:", err);
      res.status(500).send("Lỗi server");
    }
  }

  // POST /blog/:slug/comment
  async postComment(req, res) {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({ message: "Vui lòng đăng nhập để bình luận!" });
      const { postId, content } = req.body;
      await this.blogService.addComment(postId, req.user.id, content);
      return res.json({ success: true, message: "Bình luận thành công!" });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  // ── ADMIN ──
  async getAdminBlog(req, res) {
    try {
      const posts = await this.blogService.getAllPostsAdmin();
      res.render("admin-blog", { posts, user: req.user });
    } catch (err) {
      console.error("Lỗi getAdminBlog:", err);
      res.status(500).send("Lỗi server");
    }
  }

  async getCreatePost(req, res) {
    try {
      const categories = await this.blogService.getAllCategories();
      res.render("admin-blog-form", { post: null, categories, user: req.user });
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  }

  async postCreatePost(req, res) {
    try {
      const { title, summary, content, categoryId } = req.body;
      const thumbnail = req.file ? `uploads/${req.file.filename}` : null;
      await this.blogService.createPost({
        title,
        summary,
        content,
        thumbnail,
        categoryId,
        authorId: req.user.id,
      });
      res.redirect("/admin/blog");
    } catch (err) {
      console.error("Lỗi postCreatePost:", err);
      res.redirect("/admin/blog?error=" + encodeURIComponent(err.message));
    }
  }

  async getEditPost(req, res) {
    try {
      const [post, categories] = await Promise.all([
        this.blogService.getPostById(req.params.id),
        this.blogService.getAllCategories(),
      ]);
      if (!post) return res.status(404).send("Không tìm thấy bài viết");
      res.render("admin-blog-form", { post, categories, user: req.user });
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  }

  async postEditPost(req, res) {
    try {
      const { title, summary, content, categoryId, status } = req.body;
      const thumbnail = req.file
        ? `uploads/${req.file.filename}`
        : req.body.existingThumbnail;
      await this.blogService.updatePost({
        id: req.params.id,
        title,
        summary,
        content,
        thumbnail,
        categoryId,
        status,
      });
      res.redirect("/admin/blog");
    } catch (err) {
      console.error("Lỗi postEditPost:", err);
      res.redirect("/admin/blog");
    }
  }

  async deletePost(req, res) {
    try {
      await this.blogService.deletePost(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createAdminPost(req, res) {
    try {
      const data = req.body;

      if (req.file) {
        data.thumbnail = "uploads/" + req.file.filename;
      }
      data.authorId = req.user.id;

      await this.blogService.createPost(data);

      return res
        .status(200)
        .json({ success: true, message: "Thêm bài viết thành công!" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message || "Tạo bài viết thất bại",
      });
    }
  }

  async updateAdminPost(req, res) {
    try {
      const data = req.body;
      data.id = req.params.id; 

      // Xử lý ảnh y như Product
      if (req.file) {
        data.thumbnail = "uploads/" + req.file.filename;
      }

      await this.blogService.updatePost(data);

      return res
        .status(200)
        .json({ success: true, message: "Cập nhật thành công!" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message || "Sửa bài viết thất bại",
      });
    }
  }
}

module.exports = blogController;
