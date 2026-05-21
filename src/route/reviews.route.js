const express = require("express");
const { sign } = require("jsonwebtoken");
const reviewsRoute = express.Router();

const {
  authMiddleware,
  checkUserLogin,
} = require("../middleware/authMiddleware");

const connection = require("../config/db");
const reviewsRepo = require("../repo/reviews.repo");
const reviewsService = require("../service/reviews.service");
const reviewsController = require("../controller/reviews.controller");

const reviews_Repo = new reviewsRepo(connection);
const reviews_Service = new reviewsService(reviews_Repo);
const reviews_Controller = new reviewsController(reviews_Service);

reviewsRoute.get("/getReviews/product/:id", reviews_Controller.getReviews);
reviewsRoute.post("/add", checkUserLogin, reviews_Controller.addReview);
reviewsRoute.put(
  "/update/:id",
  checkUserLogin,
  reviews_Controller.updateReview,
);
reviewsRoute.delete(
  "/delete/:id",
  checkUserLogin,
  reviews_Controller.deleteReview,
);
module.exports = reviewsRoute;
