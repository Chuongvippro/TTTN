const express = require("express");
const cartRoute = express.Router();

const { checkUserLogin } = require("../middleware/authMiddleware");
const connection = require("../config/db");

const cartRepo = require("../repo/cart.repo");
const cartService = require("../service/cart.service");
const cartController = require("../controller/cart.controller");

const cart_Repo = new cartRepo(connection);
const cart_Service = new cartService(cart_Repo);
const cart_Controller = new cartController(cart_Service);

// API giỏ hàng
cartRoute.post("/api/add", checkUserLogin, cart_Controller.addToCart);
cartRoute.post("/api/local", cart_Controller.getCartLocal);
cartRoute.post("/api/update-qty", checkUserLogin, cart_Controller.updateCart);
cartRoute.delete("/api/remove", checkUserLogin, cart_Controller.removeFromCart);

module.exports = cartRoute;
