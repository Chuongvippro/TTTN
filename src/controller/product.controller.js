class ProductController {
  constructor(productService) {
    this.productService = productService;

    this.getAllProduct = this.getAllProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.restoreProduct = this.restoreProduct.bind(this);

    this.getListProduct = this.getListProduct.bind(this);
    this.getSearchProduct = this.getSearchProduct.bind(this);
    this.getProductDetail = this.getProductDetail.bind(this);
  }

  async getAllProduct(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;

      const result = await this.productService.getAll(page, size);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async createProduct(req, res) {
    try {
      const data = req.body;
      // lưu path vào data
      if (req.file) {
        data.img = "uploads/" + req.file.filename;
      }
      const result = await this.productService.createProduct(data);

      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message || "Tạo sản phẩm thất bại",
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.body;
      const result = await this.productService.deleteProduct(id);

      return res.status(200).json(result); // Đổi thành 200 vì thường delete thành công trả về 200
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message || "Xóa thất bại" });
    }
  }

  async restoreProduct(req, res) {
    try {
      const { id } = req.body;
      const result = await this.productService.restoreProduct(id);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const data = req.body;
      if (req.file) {
        data.img = "uploads/" + req.file.filename;
      }

      const result = await this.productService.updateProduct(data);

      return res.status(200).json(result); // Đổi thành 200 vì update trả về 200 sẽ chuẩn hơn 201
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message || "Sửa sản phẩm thất bại",
      });
    }
  }

  // Nghiệp vụ user
  async getListProduct(req, res) {
    try {
      const { categoryId, keyword, pet_type, isSale, sort, page, limit } =
        req.query;

      const result = await this.productService.getListProduct({
        categoryId,
        keyword,
        sort,
        pet_type,
        isSale,
        page: Number(page),
        limit: Number(limit),
      });

      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm" });
    }
  }

  // Tìm kiếm sản phẩm
  async getSearchProduct(req, res) {
    try {
      const keyword = req.query.keyword;

      const result = await this.productService.getSearchProduct(keyword);
      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Lỗi tìm kiếm sản phẩm" });
    }
  }

  async getProductDetail(req, res) {
    try {
      const { id } = req.params;
      const user = req.user || null;

      const rawProduct = await this.productService.getById(id);

      if (!rawProduct) {
        return res.status(404).send("Không tìm thấy sản phẩm này!");
      }

      const product = {
        ...rawProduct,
        originalPrice: rawProduct.sale_price ? rawProduct.price : null, 
        price: rawProduct.sale_price || rawProduct.price,
        images: rawProduct.img
          ? [`/${rawProduct.img}`]
          : ["https://place-puppy.com/200x200"],
        category: "Sản phẩm",
        rating: rawProduct.rating ? parseFloat(rawProduct.rating) : 5,
        reviewCount: rawProduct.reviewCount
          ? parseInt(rawProduct.reviewCount)
          : 0,
      };

      res.render("product-detail", {
        title: product.name,
        activePage: "products",
        user: user,
        product: product,
        reviews: [],
        relatedProducts: [],
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi lấy chi tiết sản phẩm");
    }
  }
}

module.exports = ProductController;
