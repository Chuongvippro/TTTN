const express = require("express");
const userRoute = express.Router();

// Database & Middleware
const connection = require("../config/db");
const {
  checkUserLogin,
  authRequired,
} = require("../middleware/authMiddleware");

// ==========================================
// 1. KHỞI TẠO REPO, SERVICE, CONTROLLER
// ==========================================

// --- User ---
const refreshRepo = require("../repo/refresh.repo");
const userRepo = require("../repo/user.repo");
const userService = require("../service/user.service");
const userController = require("../controller/user.controller");

const refresh_repo = new refreshRepo(connection);
const user_repo = new userRepo(connection);
const user_service = new userService(user_repo, refresh_repo);
const user_controller = new userController(user_service);

//loại sản phẩn(category)
const CategoryRepo = require("../repo/category.repo");
const CategoryService = require("../service/category.service");
const CategoryController = require("../controller/category.controller");

const Category_Repo = new CategoryRepo(connection);
const Category_Service = new CategoryService(Category_Repo);
const category_Controller = new CategoryController(Category_Service);

// --- Sản phẩm (Product) ---
const saleRepo = require("../repo/sale.repo");
const productRepo = require("../repo/product.repo");
const productService = require("../service/product.service");
const productController = require("../controller/product.controller");

const sale_Repo = new saleRepo(connection);
const product_Repo = new productRepo(connection);
const Product_Service = new productService(
  product_Repo,
  Category_Repo,
  sale_Repo,
);
const product_Controller = new productController(Product_Service);

// --- Giỏ hàng (Cart) ---
const cartRepo = require("../repo/cart.repo");
const cartService = require("../service/cart.service");
const cartController = require("../controller/cart.controller");

const cart_Repo = new cartRepo(connection);
const cart_Service = new cartService(cart_Repo);
const cart_Controller = new cartController(cart_Service);

//đơn hàng
const orderRepo = require("../repo/order.repo");
const orderService = require("../service/order.service");
const orderController = require("../controller/order.controller");

const order_Repo = new orderRepo(connection);
const order_Service = new orderService(order_Repo, cart_Repo);
const order_Controller = new orderController(order_Service);

// ==========================================
// 2. ROUTER ĐỊNH TUYẾN
// ==========================================

// ------------------------------------------
// Xác thực & Tài khoản (Auth & Profile)
// ------------------------------------------
userRoute.get("/login", (req, res) => {
  res.render("login");
});

userRoute.get("/signIn", (req, res) => {
  res.render("signIn");
});

userRoute.post("/login", user_controller.loginUser);
userRoute.post("/api/signIn", user_controller.signInUser);
userRoute.post("/logout", user_controller.logOut);

userRoute.get("/profile", authRequired, (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

userRoute.get("/api/profile", checkUserLogin, user_controller.getProfile);
// Route cập nhật thông tin (Lấy từ bản DEMO)
userRoute.put(
  "/api/profile/update",
  checkUserLogin,
  user_controller.updateProfile,
);

// ------------------------------------------
// Sản phẩm (Products)
// ------------------------------------------
userRoute.get("/getCategories", category_Controller.getAllcategories);
userRoute.get("/product", product_Controller.getListProduct);
userRoute.get("/search", product_Controller.getSearchProduct);

userRoute.get("/products", checkUserLogin, (req, res) => {
  const user = req.user || null;
  res.render("listProduct", {
    user,
    name: user ? user.username || user.email : "Khách",
  });
});

// ------------------------------------------
// Giỏ hàng (Cart)
// ------------------------------------------
userRoute.get("/cart", authRequired, (req, res) => {
  res.render("cart", {
    user: req.user,
    title: "Giỏ hàng",
  });
});

userRoute.get("/cart/count", checkUserLogin, cart_Controller.getCartCount);
userRoute.get("/api/cart", authRequired, cart_Controller.getCartApi);

//lấy đơn hàng của user
userRoute.get("/order/my-orders", authRequired, order_Controller.getMyOrders);
// Giao diện trang Lịch sử đơn hàng (Khi bấm nút "Chi tiết" sẽ chạy vào đây)
userRoute.get("/order/history", authRequired, async (req, res) => {
  try {
    // Gọi thẳng service đã được khởi tạo sẵn ở đầu file user.route.js
    const orders = await order_Service.getUserOrders(req.user.id);
    res.render("my-orders", { user: req.user, orders });
  } catch (err) {
    console.error("Lỗi khi tải trang đơn hàng:", err);
    res.status(500).send("Lỗi tải trang đơn hàng");
  }
});
userRoute.put(
  "/api/order/cancel/:id",
  authRequired,
  order_Controller.cancelOrder,
);

module.exports = userRoute;
