class orderService {
  constructor(orderRepo, cartRepo) {
    this.orderRepo = orderRepo;
    this.cartRepo = cartRepo;
  }

  async placeOrder({
    userId,
    fullName,
    phone,
    address,
    note,
    paymentMethod,
    localCart,
  }) {
    let items = [];

    if (userId) {
      items = await this.cartRepo.getFullCart(userId);
    } else {
      items = await this.cartRepo.getProductsByIds(localCart.map((i) => i.id));
      items = items.map((p) => {
        const local = localCart.find((i) => i.id == p.id);
        return { ...p, quantity: local ? local.quantity : 1 };
      });
    }

    if (!items || items.length === 0) throw new Error("Giỏ hàng trống!");

    //lấy giảm giá
    items = items.map((item) => {
      const hasSale = item.percent && item.percent > 0;
      const finalPrice = hasSale
        ? parseFloat(item.sale_price)
        : parseFloat(item.price);
      return {
        ...item,
        price: finalPrice, // Đè luôn giá gốc bằng giá đã giảm
      };
    });

    //KIỂM TRA TỒN KHO TRƯỚC KHI ĐẶT
    for (const item of items) {
      if (item.stock < item.quantity) {
        throw new Error(
          `Sản phẩm ${item.name} hiện chỉ còn ${item.stock} cái, không đủ hàng!`,
        );
      }
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    // TẠO ĐƠN HÀNG
    const orderId = await this.orderRepo.createOrder(
      userId,
      fullName,
      phone,
      address,
      note,
      paymentMethod,
      totalPrice,
    );
    await this.orderRepo.createOrderItems(orderId, items);

    //CẬP NHẬT TRỪ SỐ LƯỢNG KHO
    for (const item of items) {
      // M gọi repo để thực hiện lệnh UPDATE sản phẩm
      await this.orderRepo.updateProductStock(item.id, item.quantity);
    }

    if (userId) await this.orderRepo.clearCartAfterOrder(userId);

    return { orderId, totalPrice, itemCount: items.length };
  }

  async getUserOrders(userId) {
    return await this.orderRepo.getUserOrders(userId);
  }

  async getAllOrder(page = 1, size = 10) {
    const data = await this.orderRepo.getAllOrders(page, size);
    const totalItems = await this.orderRepo.countOrders();
    const totalPages = Math.ceil(totalItems / size);

    return {
      data, // Mảng đơn hàng
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  //cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, status) {
    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái đơn hàng không hợp lệ!");
    }

    const result = await this.orderRepo.updateStatus(id, status);

    if (result.affectedRows === 0) {
      throw new Error("Không tìm thấy đơn hàng hoặc cập nhật thất bại!");
    }

    return { message: "Cập nhật trạng thái thành công" };
  }

  //lấy chi tiết đơn hàng
  async getOrderDetail(orderId) {
    if (!orderId) {
      throw new Error("Mã đơn hàng không hợp lệ!");
    }

    // Gọi Repo lấy mảng các sản phẩm
    const items = await this.orderRepo.getOrderItemsByOrderId(orderId);

    if (!items || items.length === 0) {
      throw new Error("Đơn hàng này không có sản phẩm nào!");
    }

    // Tính toán tổng tiền của toàn bộ sản phẩm trong đơn
    const totalAmount = items.reduce((sum, item) => {
      return sum + parseFloat(item.price) * parseInt(item.quantity);
    }, 0);

    return {
      items, // Đây là mảng chứa 1 hoặc nhiều sản phẩm
      totalAmount,
    };
  }

  //user lấy đơn hàng bản thân
  async getMyOrders(userId) {
    if (!userId) throw new Error("Thiếu ID người dùng");

    const orders = await this.orderRepo.findByUserId(userId);
    return orders;
  }

  async cancelOrder(orderId, userId) {
    const currentStatus = await this.orderRepo.getStatus(orderId, userId);

    if (!currentStatus) {
      throw new Error("Không tìm thấy đơn hàng của m!");
    }

    if (currentStatus !== "pending") {
      throw new Error(
        "Đơn đã được xác nhận hoặc đang giao, không hủy được đâu m!",
      );
    }

    return await this.orderRepo.updateStatusForUser(
      orderId,
      userId,
      "cancelled",
    );
  }
}

module.exports = orderService;
