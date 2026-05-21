const express = require("express");
const blogRoute = express.Router();
const multer = require("multer");
const path = require("path");

const {
  checkUserLogin,
  authMiddleware,
} = require("../middleware/authMiddleware");
const connection = require("../config/db");
const blogRepo = require("../repo/blog.repo");
const blogService = require("../service/blog.service");
const blogController = require("../controller/blog.controller");

const blog_Repo = new blogRepo(connection);
const blog_Service = new blogService(blog_Repo);
const blog_Controller = new blogController(blog_Service);

// Multer cho ảnh thumbnail
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ── PUBLIC ──
blogRoute.get("/", checkUserLogin, blog_Controller.getBlogList);
blogRoute.get("/:slug", checkUserLogin, blog_Controller.getBlogDetail);
blogRoute.post("/comment", authMiddleware, blog_Controller.postComment);

// ── ADMIN ──
blogRoute.get("/admin/list", authMiddleware, blog_Controller.getAdminBlog);
blogRoute.get("/admin/create", authMiddleware, blog_Controller.getCreatePost);
blogRoute.post(
  "/admin/create",
  authMiddleware,
  upload.single("thumbnail"),
  blog_Controller.postCreatePost,
);
blogRoute.get("/admin/edit/:id", authMiddleware, blog_Controller.getEditPost);
blogRoute.post(
  "/admin/edit/:id",
  authMiddleware,
  upload.single("thumbnail"),
  blog_Controller.postEditPost,
);
blogRoute.delete(
  "/admin/delete/:id",
  authMiddleware,
  blog_Controller.deletePost,
);

module.exports = blogRoute;
