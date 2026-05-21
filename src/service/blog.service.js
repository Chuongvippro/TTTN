// Hàm tạo slug từ tiêu đề tiếng Việt
function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

class blogService {
  constructor(blogRepo) {
    this.blogRepo = blogRepo;
  }

  async getPostList({ categorySlug, search, page }) {
    return await this.blogRepo.getAllPosts({
      categorySlug,
      search,
      page: parseInt(page) || 1,
    });
  }

  async getPostDetail(slug) {
    const post = await this.blogRepo.getPostBySlug(slug);
    if (!post) return null;
    await this.blogRepo.incrementViews(post.id);
    const comments = await this.blogRepo.getCommentsByPostId(post.id);
    const related = await this.blogRepo.getRelatedPosts(
      post.category_id,
      post.id,
    );
    return { post, comments, related };
  }

  async getAllCategories() {
    return await this.blogRepo.getAllCategories();
  }

  async addComment(postId, userId, content) {
    if (!content || !content.trim())
      throw new Error("Nội dung bình luận không được để trống!");
    return await this.blogRepo.addComment(postId, userId, content.trim());
  }

  // Admin
  async getAllPostsAdmin() {
    return await this.blogRepo.getAllPostsAdmin();
  }

  async createPost({
    title,
    summary,
    content,
    thumbnail,
    categoryId,
    authorId,
  }) {
    if (!title?.trim()) throw new Error("Tiêu đề không được để trống!");
    if (!content?.trim()) throw new Error("Nội dung không được để trống!");
    const slug = toSlug(title) + "-" + Date.now();
    return await this.blogRepo.createPost(
      title.trim(),
      slug,
      summary,
      content,
      thumbnail,
      categoryId,
      authorId,
    );
  }

  async updatePost({
    id,
    title,
    summary,
    content,
    thumbnail,
    categoryId,
    status,
  }) {
    let finalThumbnail = thumbnail;

    // Nếu Frontend không up file mới (biến thumbnail bị bỏ trống/undefined)
    if (thumbnail === undefined) {
      const oldPost = await this.blogRepo.getPostById(id);
      finalThumbnail = oldPost ? oldPost.thumbnail : null;
    }
    const slug = toSlug(title) + "-" + id;
    await this.blogRepo.updatePost(
      id,
      title,
      slug,
      summary,
      content,
      finalThumbnail,
      categoryId,
      status,
    );
  }

  async deletePost(id) {
    await this.blogRepo.deletePost(id);
  }

  async getPostById(id) {
    return await this.blogRepo.getPostById(id);
  }
}

module.exports = blogService;
