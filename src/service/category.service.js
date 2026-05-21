class CategoryService {
  constructor(categoryRepo) {
    this.categoryRepo = categoryRepo;
  }

  async getAllcategories(page = null, size = 10) {
    // Nếu không có page thì lấy hết (cho trang chủ)
    if (!page) {
      return await this.categoryRepo.getAllcategories();
    }

    // Nếu có page thì lấy theo phân trang (cho trang admin)
    const data = await this.categoryRepo.getListCategories(page, size);
    const totalItems = await this.categoryRepo.countCategories();
    const totalPages = Math.ceil(totalItems / size);

    return {
      data,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  async createCategory(data) {
    const { name, description, status } = data;

    if (!name) {
      throw new Error("Vui lòng nhập tên loại sản phẩm");
    }

    const newCategory = {
      name: name.trim(),
      description: description ? description.trim() : "",
      status: status || "active",
    };

    const result = await this.categoryRepo.createCategory(newCategory);

    return {
      message: "Thêm loại sản phẩm thành công",
      data: {
        id: result.insertId,
        ...newCategory,
      },
    };
  }

  async updateCategory(data) {
    const { id, name, description, status } = data;

    if (!id) throw new Error("Thiếu id loại");
    if (!name) throw new Error("Tên loại không được để trống");

    const updateData = {
      name: name.trim(),
      description: description ? description.trim() : "",
      status: status || "active",
    };

    await this.categoryRepo.updateCategory(id, updateData);

    return {
      message: "Cập nhật loại thành công",
    };
  }

  async deleteCategory(id) {
    if (!id) throw new Error("Không có id loại");
    await this.categoryRepo.deleteCategory(id);
    return { message: "Đã tắt loại thành công" };
  }

  async restoreCategory(id) {
    if (!id) throw new Error("Không có id loại");
    await this.categoryRepo.restoreCategory(id);
    return { message: "Đã bật lại loại" };
  }
}

module.exports = CategoryService;