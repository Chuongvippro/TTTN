class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService; 

    this.getAllcategories = this.getAllcategories.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.restoreCategory = this.restoreCategory.bind(this);
  }

  async getAllcategories(req, res) {
    try {
      const page = req.query.page ? parseInt(req.query.page) : null;
      const size = parseInt(req.query.size) || 10;

      const result = await this.categoryService.getAllcategories(page, size);
      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }

  async createCategory(req, res) {
    try {
      const data = req.body;
      const result = await this.categoryService.createCategory(data);
      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: err.message || "Tạo danh mục loại thất bại" });
    }
  }

  async updateCategory(req, res) {
    try {
      const data = req.body;
      const result = await this.categoryService.updateCategory(data);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: err.message || "Sửa danh mục loại thất bại" });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.body;
      const result = await this.categoryService.deleteCategory(id);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: err.message || "Tắt danh mục loại thất bại" });
    }
  }

  async restoreCategory(req, res) {
    try {
      const { id } = req.body;
      const result = await this.categoryService.restoreCategory(id);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: err.message || "Bật lại danh mục loại thất bại" });
    }
  }
}

module.exports = CategoryController;