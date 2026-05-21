class cartController {
  constructor(cartService) {
    this.cartService = cartService;

    this.addToCart      = this.addToCart.bind(this);
    this.getCartCount   = this.getCartCount.bind(this);
    this.getCartApi     = this.getCartApi.bind(this);
    this.getCartLocal   = this.getCartLocal.bind(this);
    this.updateCart     = this.updateCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }

  async addToCart(req, res) {
    try {
      // ✅ FIX: Kiểm tra req.user trước — route dùng checkUserLogin (soft)
      // nên req.user có thể là null khi token hết hạn hoặc chưa login
      if (!req.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }

      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Thiếu ID sản phẩm" });
      }

      await this.cartService.addToCart(userId, productId, Number(quantity) || 1);

      return res.json({ message: "Đã thêm vào giỏ hàng thành công" });
    } catch (err) {
      console.error("Lỗi addToCart:", err);
      return res.status(500).json({ message: err.sqlMessage || err.message || "Lỗi khi thêm vào giỏ hàng" });
    }
  }

  async getCartCount(req, res) {
    try {
      // ✅ FIX: null check
      if (!req.user) {
        return res.json({ count: 0 });
      }

      const userId = req.user.id;
      const result = await this.cartService.getCartCount(userId);
      return res.json({ count: Number(result.total) || 0 });
    } catch (err) {
      console.error("Lỗi getCartCount:", err);
      return res.status(500).json({ message: "Lỗi lấy số lượng giỏ hàng" });
    }
  }

  async getCartApi(req, res) {
    try {
      // ✅ FIX: null check
      if (!req.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }

      const userId   = req.user.id;
      const cartItems = await this.cartService.getFullCart(userId);
      return res.json(cartItems);
    } catch (err) {
      console.error("Lỗi getCartApi:", err);
      return res.status(500).json({ message: "Lỗi lấy dữ liệu giỏ hàng" });
    }
  }

  async getCartLocal(req, res) {
    try {
      const { cart } = req.body;
      if (!cart || !Array.isArray(cart)) {
        return res.json([]);
      }

      const cartDetails = await this.cartService.getCartLocal(cart);
      return res.json(cartDetails);
    } catch (err) {
      console.error("Lỗi getCartLocal:", err);
      return res.status(500).json({ message: "Lỗi lấy chi tiết giỏ hàng local" });
    }
  }

  async updateCart(req, res) {
    try {
      // ✅ FIX: null check
      if (!req.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }

      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId || quantity === undefined) {
        return res.status(400).json({ message: "Thiếu id sản phẩm hoặc số lượng" });
      }

      await this.cartService.updateCart(userId, productId, quantity);
      return res.json({ message: "Cập nhật giỏ thành công" });
    } catch (err) {
      console.error("Lỗi updateCart:", err);
      return res.status(500).json({ message: "Lỗi cập nhật giỏ hàng" });
    }
  }

  async removeFromCart(req, res) {
    try {
      // ✅ FIX: null check
      if (!req.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }

      const userId    = req.user.id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Thiếu ID sản phẩm cần xóa" });
      }

      await this.cartService.removeFromCart(userId, productId);
      return res.json({ message: "Xóa thành công!" });
    } catch (err) {
      console.error("Lỗi removeFromCart:", err);
      return res.status(500).json({ message: "Lỗi xóa sản phẩm khỏi giỏ" });
    }
  }
}

module.exports = cartController;