const express = require("express");
const adminRoute = express.Router();
const {
  authMiddleware,
  checkUserLogin,
  isAdmin,
} = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const connection = require("../config/db");

// ── Product ──
const saleRepo = require("../repo/sale.repo");
const ProductRepo = require("../repo/product.repo");
const ProductService = require("../service/product.service");
const ProductController = require("../controller/product.controller");

// ── Category ──
const CategoryRepo = require("../repo/category.repo");
const CategoryService = require("../service/category.service");
const CategoryController = require("../controller/category.controller");

// ── User ──
const UserRepo = require("../repo/user.repo");
const UserService = require("../service/user.service");
const UserController = require("../controller/user.controller");

// ── Order ──
const OrderRepo = require("../repo/order.repo");
const OrderService = require("../service/order.service");
const OrderController = require("../controller/order.controller");

// ── Blog ──
const BlogRepo = require("../repo/blog.repo");
const BlogService = require("../service/blog.service");
const BlogController = require("../controller/blog.controller");

// ── Reviews ──
const ReviewsRepo = require("../repo/reviews.repo");
const ReviewsService = require("../service/reviews.service");
const ReviewsController = require("../controller/reviews.controller");

//-sale
const SaleRepo = require("../repo/sale.repo");
const SaleService = require("../service/sale.service");
const SaleController = require("../controller/sale.controller");

// ── Instances ──
const Product_Repo = new ProductRepo(connection);
const Category_Repo = new CategoryRepo(connection);
const User_Repo = new UserRepo(connection);
const Order_Repo = new OrderRepo(connection);
const Sale_Repo = new saleRepo(connection);
const Cart_Repo = require("../repo/cart.repo");
const Blog_Repo = new BlogRepo(connection);
const Reviews_Repo = new ReviewsRepo(connection);

const Product_Service = new ProductService(
  Product_Repo,
  Category_Repo,
  Sale_Repo,
);
const Category_Service = new CategoryService(Category_Repo);
const User_Service = new UserService(User_Repo);
const Order_Service = new OrderService(Order_Repo, new Cart_Repo(connection));
const Blog_Service = new BlogService(Blog_Repo);
const Reviews_Service = new ReviewsService(Reviews_Repo);
const Sale_Service = new SaleService(Sale_Repo);

const Product_Controller = new ProductController(Product_Service);
const Category_Controller = new CategoryController(Category_Service);
const User_Controller = new UserController(User_Service);
const Order_Controller = new OrderController(Order_Service);
const Blog_Controller = new BlogController(Blog_Service);
const Reviews_Controller = new ReviewsController(Reviews_Service);
const Sale_Controller = new SaleController(Sale_Service);
// ═══════════════ ROUTES ═══════════════

adminRoute.get("/", checkUserLogin, (req, res) => {
  res.render("admin", { user: req.user });
});

// ── Products ──
adminRoute.get("/products", Product_Controller.getAllProduct);
adminRoute.post(
  "/create/product",
  upload.single("img"),
  Product_Controller.createProduct,
);
adminRoute.post("/delete/product", Product_Controller.deleteProduct);
adminRoute.post("/restore/product", Product_Controller.restoreProduct);
adminRoute.post(
  "/update/product",
  upload.single("img"),
  Product_Controller.updateProduct,
);

// ── Categories ──
adminRoute.get("/categories", Category_Controller.getAllcategories);
adminRoute.get("/getCategories", Category_Controller.getAllcategories);
adminRoute.post("/create/category", Category_Controller.createCategory);
adminRoute.post("/update/category", Category_Controller.updateCategory);
adminRoute.post("/delete/category", Category_Controller.deleteCategory);
adminRoute.post("/restore/category", Category_Controller.restoreCategory);

// ── Users ──
adminRoute.get("/users", User_Controller.getAllAccount);
adminRoute.post(
  "/create/user",
  authMiddleware,
  isAdmin,
  User_Controller.createUser,
);
adminRoute.post(
  "/delete/user",
  authMiddleware,
  isAdmin,
  User_Controller.deleteUser,
);
adminRoute.post("/restore/user", User_Controller.restoreUser);
adminRoute.post(
  "/update/user",
  authMiddleware,
  isAdmin,
  User_Controller.updateUser,
);

// ── Orders ──
adminRoute.get("/orders", Order_Controller.getAllOrder);
adminRoute.post("/update/order-status", Order_Controller.updateOrderStatus);
adminRoute.get("/order-detail/:id", Order_Controller.getOrderDetail);

// ── Blog Admin ──
adminRoute.get("/blogs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const data = await Blog_Service.getPostList({ page, limit });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

adminRoute.get("/blog-categories", async (req, res) => {
  try {
    const cats = await Blog_Service.getAllCategories();
    return res.json(cats);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

adminRoute.post(
  "/blogs/create",
  authMiddleware,
  upload.single("thumbnail"),
  Blog_Controller.createAdminPost,
);

adminRoute.post(
  "/blogs/update/:id",
  authMiddleware,
  upload.single("thumbnail"),
  Blog_Controller.updateAdminPost,
);

adminRoute.delete("/blogs/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Blog_Service.deletePost(req.params.id);
    return res.json({ success: true, message: "Xóa bài viết thành công!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
// ── Reviews Admin ──
adminRoute.get("/reviews", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const data = await Reviews_Service.getAllReviews(limit, offset);
    return res.json({
      reviews: data.reviews,
      totalPages: data.totalPages,
      currentPage: page,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

adminRoute.delete(
  "/reviews/delete/:id",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      await Reviews_Service.deleteReview(req.params.id, null, "admin");
      return res.json({ success: true, message: "Xóa đánh giá thành công!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
);

//giảm giá
adminRoute.get("/sales", Sale_Controller.getAllSales);
adminRoute.post(
  "/create/sale",
  authMiddleware,
  isAdmin,
  Sale_Controller.createSale,
);
adminRoute.post(
  "/update/sale",
  authMiddleware,
  isAdmin,
  Sale_Controller.updateSale,
);
adminRoute.post(
  "/delete/sale",
  authMiddleware,
  isAdmin,
  Sale_Controller.deleteSale,
);
adminRoute.post(
  "/delete/sale",
  authMiddleware,
  isAdmin,
  Sale_Controller.deleteSale,
);

module.exports = adminRoute;
