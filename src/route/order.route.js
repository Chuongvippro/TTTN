const express = require("express");
const orderRoute = express.Router();
const {
  checkUserLogin,
  authMiddleware,
} = require("../middleware/authMiddleware");
const connection = require("../config/db");
const orderRepo = require("../repo/order.repo");
const cartRepo = require("../repo/cart.repo");
const orderService = require("../service/order.service");
const orderController = require("../controller/order.controller");

const order_Repo = new orderRepo(connection);
const cart_Repo = new cartRepo(connection);
const order_Service = new orderService(order_Repo, cart_Repo);
const order_Controller = new orderController(order_Service);

// GET /order/checkout  — render trang thanh toán
orderRoute.get("/checkout", checkUserLogin, order_Controller.getCheckoutPage);

// POST /order/api/place — đặt hàng
orderRoute.post("/api/place", checkUserLogin, order_Controller.placeOrder);

// GET /order/my-orders — theo dõi đơn hàng (cần login)
orderRoute.get("/my-orders", authMiddleware, order_Controller.getMyOrders);

module.exports = orderRoute;
