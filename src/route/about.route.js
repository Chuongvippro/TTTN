const express    = require("express");
const aboutRoute = express.Router();
const { checkUserLogin } = require("../middleware/authMiddleware");

aboutRoute.get("/", checkUserLogin, (req, res) => {
  res.render("about", { user: req.user || null });
});

module.exports = aboutRoute;