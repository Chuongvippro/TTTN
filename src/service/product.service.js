class ProductService {
  constructor(productRepo, categoryRepo, saleRepo) {
    this.productRepo = productRepo;
    this.categoryRepo = categoryRepo;
    this.saleRepo = saleRepo;
  }

  // Dành cho User - Chỉ lấy hàng Active và còn Stock
  async getAllForUser(page = 1, size = 10) {
    const data = await this.productRepo.getAllForUser(page, size);
    const totalItems = await this.productRepo.countAll();
    const totalPages = Math.ceil(totalItems / size);

    return {
      data, 
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  async getAll(page = 1, size = 10) {
    const data = await this.productRepo.getAll(page, size);

    const totalItems = await this.productRepo.countAll();
    const totalPages = Math.ceil(totalItems / size);

    return {
      data,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  async createProduct(data) {
    const {
      id,
      name,
      price,
      stock,
      description,
      category_id,
      img,
      pet_type,
      sale_id, 
    } = data;

    if (!name || !price || !category_id || !stock || !description) {
      throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    if (isNaN(price) || Number(price) <= 0) {
      throw new Error("Giá phải là số hợp lệ");
    }

    if (stock && isNaN(stock)) {
      throw new Error("Số lượng không hợp lệ");
    }

    // Check loại sản phẩm xem có tồn tại không
    const isExist = await this.categoryRepo.checkCategory(category_id);
    if (!isExist) {
      throw new Error("Loại sản phẩm không tồn tại");
    }

    const newProduct = {
      name: name.trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      description: description ? description.trim() : "",
      category_id: Number(category_id),
      status: "active",
      img: img || null,
      pet_type: pet_type || "both",
      sale_id: sale_id ? Number(sale_id) : null, 
    };

    const result = await this.productRepo.createProduct(newProduct);

    return {
      message: "Thêm sản phẩm thành công",
      data: {
        id: result.insertId,
        ...newProduct,
      },
    };
  }

  async updateProduct(data) {
    const {
      id,
      name,
      price,
      stock,
      description,
      category_id,
      img,
      pet_type,
      sale_id, 
    } = data;

    if (!id) {
      throw new Error("Thiếu id sản phẩm");
    }

    if (isNaN(price) || Number(price) <= 0) {
      throw new Error("Giá phải là số hợp lệ");
    }

    if (stock && isNaN(stock)) {
      throw new Error("Số lượng không hợp lệ");
    }

    const isExist = await this.categoryRepo.checkCategory(category_id);
    if (!isExist) {
      throw new Error("Loại sản phẩm không tồn tại");
    }

    const oldImg = await this.productRepo.getUrlImg(id);
    const finalImg = img ? img : oldImg;

    const updateProduct = {
      name: name.trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      description: description ? description.trim() : "",
      category_id: Number(category_id),
      status: "active",
      img: finalImg,
      pet_type: pet_type || "both",
      sale_id: sale_id ? Number(sale_id) : null, 
    };

    const result = await this.productRepo.updateProduct(id, updateProduct);

    return {
      message: "Sửa sản phẩm thành công",
      data: {
        id: id,
        ...updateProduct,
      },
    };
  }

  async deleteProduct(id) {
    if (!id) throw new Error("Không có id sản phẩm");

    // Chỉ gọi xóa bên Product thôi
    const result = await this.productRepo.deleteProduct(id);
    return result;
  }

  async getListProduct(params) {
    let {
      categoryId,
      keyword,
      sort,
      pet_type,
      isSale,
      page = 1,
      limit = 10,
    } = params;

    if (!page || page < 1) page = 1;
    if (!limit || limit > 50) limit = 10;

    keyword = keyword?.trim();

    const products = await this.productRepo.getListProduct({
      categoryId,
      keyword,
      sort,
      pet_type,
      isSale,
      page,
      limit,
    });

    const totalItems = await this.productRepo.countAllForUser({
      categoryId,
      keyword,
      pet_type,
      isSale,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      products,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  async restoreProduct(id) {
    if (!id) throw new Error("Thiếu ID sản phẩm để khôi phục");

    const result = await this.productRepo.restoreStatus(id);
    if (result.affectedRows === 0)
      throw new Error("Sản phẩm không tồn tại hoặc đã là active");

    return { success: true, message: "Khôi phục sản phẩm thành công! ✨" };
  }

  async getSearchProduct(keyword) {
    if (!keyword) {
      return { products: [] };
    }

    const products = await this.productRepo.searchProduct(keyword);

    return {
      products,
    };
  }

  async getById(id) {
    return await this.productRepo.getById(id);
  }

  async getSaleProducts(limit = 8) {
    return await this.productRepo.getSaleProducts(limit);
  }
}

module.exports = ProductService;
