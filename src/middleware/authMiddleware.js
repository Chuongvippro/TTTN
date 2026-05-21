const jwt = require("jsonwebtoken");
const connection = require("../config/db");
const { generateAccessToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}

function checkUserLogin(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = payload;
  } catch (err) {
    req.user = null;
  }

  next();
}

function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền" });
  }

  next();
}

async function authRequired(req, res, next) {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      req.user = payload;
      return next();
    } catch (err) {
      console.log("Access Token hết hạn, đang kiểm tra Refresh Token...");
    }
  }

  if (!refreshToken) {
    return res.redirect("/login");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error(
      "Refresh Token không hợp lệ hoặc hết hạn 7 ngày:",
      err.message,
    );
    return res.redirect("/login");
  }
}

module.exports = { authMiddleware, checkUserLogin, isAdmin, authRequired };
