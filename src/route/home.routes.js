const express = require("express");
const homeRouter = express.Router();
const { checkUserLogin } = require("../middleware/authMiddleware");
const connection = require("../config/db");

// ── Category ──
const CategoryRepo = require("../repo/category.repo");
const CategoryService = require("../service/category.service");
const CategoryController = require("../controller/category.controller");
const Category_Repo = new CategoryRepo(connection);
const Category_Service = new CategoryService(Category_Repo);
const category_Controller = new CategoryController(Category_Service);

// ── Sale ──
const SaleRepo = require("../repo/sale.repo");
const Sale_Repo = new SaleRepo(connection);

// ── Product ──
const productRepo = require("../repo/product.repo");
const productService = require("../service/product.service");
const homeController = require("../controller/home.controller");
const productController = require("../controller/product.controller");

const product_Repo = new productRepo(connection);
// ✅ FIX: truyền đủ 3 tham số — productRepo, categoryRepo, saleRepo
const product_Service = new productService(
  product_Repo,
  Category_Repo,
  Sale_Repo,
);
const home_Controller = new homeController(product_Service, Category_Service);
const product_Controller = new productController(product_Service);

// GET / — Trang chủ
homeRouter.get("/", checkUserLogin, home_Controller.getHomePage);

// GET /products — Trang danh sách sản phẩm
homeRouter.get("/products", checkUserLogin, (req, res) => {
  const user = req.user || null;
  res.render("listProduct", {
    user,
    name: user ? user.user_name || user.email : "Khách",
  });
});

// GET /products/detail/:id — Chi tiết sản phẩm
homeRouter.get(
  "/products/detail/:id",
  checkUserLogin,
  product_Controller.getProductDetail,
);

module.exports = homeRouter;
