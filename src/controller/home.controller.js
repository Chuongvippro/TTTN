class homeController {
  constructor(productService, categoryService) {
    this.productService = productService;
    this.categoryService = categoryService;
    this.getHomePage = this.getHomePage.bind(this);
  }

  async getHomePage(req, res) {
    try {
      const user = req.user || null;

      // 1. Sản phẩm nổi bật
      const resultProducts = await this.productService.getAllForUser(1, 8);
      const rawProducts = resultProducts.data || [];

      const featuredProducts = rawProducts.map((p) => ({
        ...p,
        image: p.img ? `/${p.img}` : "/uploads/default.jpg",
      }));

      // 2. Danh mục
      const categories = await this.categoryService.getAllcategories();

      // 3. ✅ Sản phẩm đang giảm giá — lấy từ DB thực tế
      const rawSaleProducts = await this.productService.getSaleProducts(8);
      const saleProducts = rawSaleProducts.map((p) => ({
        ...p,
        image: p.img ? `/${p.img}` : "/uploads/default.jpg",
        originalPrice: p.price, // giá gốc
        price: p.sale_price || p.price, // giá sau giảm
        badge: `Sale ${p.percent}%`,
      }));

      // 4. Render
      res.render("home", {
        title: "Trang chủ",
        activePage: "home",
        user,
        name: user ? user.user_name || user.email : "Khách",
        featuredProducts,
        saleProducts, // ✅ truyền xuống view
        categories,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi load trang chủ");
    }
  }
}

module.exports = homeController;
