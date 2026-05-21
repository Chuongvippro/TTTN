class orderController {
  constructor(orderService) {
    this.orderService = orderService;

    this.getCheckoutPage = this.getCheckoutPage.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.getAllOrder = this.getAllOrder.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.getOrderDetail = this.getOrderDetail.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }

  // GET /order/checkout
  async getCheckoutPage(req, res) {
    try {
      res.render("checkout", { user: req.user || null });
    } catch (err) {
      console.error("Lỗi getCheckoutPage:", err);
      res.status(500).send("Lỗi server");
    }
  }

  // POST /order/api/place
  async placeOrder(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const { fullName, phone, address, note, paymentMethod, localCart } =
        req.body;

      if (!fullName?.trim())
        return res
          .status(400)
          .json({ message: "Vui lòng nhập họ tên người nhận!" });
      if (!phone?.trim())
        return res
          .status(400)
          .json({ message: "Vui lòng nhập số điện thoại!" });
      if (!address?.trim())
        return res
          .status(400)
          .json({ message: "Vui lòng nhập địa chỉ giao hàng!" });
      if (!["cash", "transfer"].includes(paymentMethod)) {
        return res
          .status(400)
          .json({ message: "Phương thức thanh toán không hợp lệ!" });
      }

      const result = await this.orderService.placeOrder({
        userId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note ? note.trim() : null,
        paymentMethod,
        localCart: localCart || [],
      });

      return res.json({
        success: true,
        message: "Đặt hàng thành công!",
        orderId: result.orderId,
        totalPrice: result.totalPrice,
        itemCount: result.itemCount,
      });
    } catch (err) {
      console.error("Lỗi placeOrder:", err);
      return res
        .status(500)
        .json({ message: err.message || "Đặt hàng thất bại!" });
    }
  }

  // GET /order/my-orders
  async getMyOrders(req, res) {
    try {
      if (!req.user) return res.redirect("/user/login");
      const orders = await this.orderService.getUserOrders(req.user.id);
      res.render("my-orders", { user: req.user, orders });
    } catch (err) {
      console.error("Lỗi getMyOrders:", err);
      res.status(500).send("Lỗi server");
    }
  }

  //phần của admin
  async getAllOrder(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;

      const result = await this.orderService.getAllOrder(page, size);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  //cập nhật trạng thái đơn hàng
  async updateOrderStatus(req, res) {
    try {
      const { id, status } = req.body;

      if (!id || !status) {
        return res
          .status(400)
          .json({ message: "Thiếu thông tin đơn hàng hoặc trạng thái!" });
      }

      const result = await this.orderService.updateOrderStatus(id, status);
      return res.json(result);
    } catch (err) {
      console.error("Lỗi updateOrderStatus:", err.message);
      return res.status(500).json({ message: err.message });
    }
  }

  //lấy chi tiết sản phẩm
  async getOrderDetail(req, res) {
    try {
      const orderId = req.params.id;

      // Gọi service lấy dữ liệu
      const result = await this.orderService.getOrderDetail(orderId);

      // Trả về JSON cho Frontend render vào Modal
      return res.json({
        success: true,
        data: result.items,
        totalAmount: result.totalAmount,
      });
    } catch (err) {
      console.error("Lỗi Controller getOrderDetail:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  //user lấy đơn hàng bản thân
  async getMyOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await this.orderService.getMyOrders(userId);

      return res.json(orders);
    } catch (err) {
      console.error("Lỗi getMyOrders:", err);
      return res
        .status(500)
        .json({ message: "Không thể lấy danh sách đơn hàng" });
    }
  }

  async cancelOrder(req, res) {
    try {
      const orderId = req.params.id;
      const userId = req.user.id; // Lấy từ middleware auth

      const success = await this.orderService.cancelOrder(orderId, userId);

      if (success) {
        return res.status(200).json({ message: "Hủy đơn thành công! 🐾" });
      } else {
        return res.status(400).json({ message: "Hủy đơn thất bại!" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = orderController;
