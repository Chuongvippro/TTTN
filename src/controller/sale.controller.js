class SaleController {
  constructor(saleService) {
    this.saleService = saleService;

    this.getAllSales = this.getAllSales.bind(this);
    this.createSale = this.createSale.bind(this);
    this.updateSale = this.updateSale.bind(this);
    this.deleteSale = this.deleteSale.bind(this);
  }

  async getAllSales(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;

      const result = await this.saleService.getAllSales(page, size);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async createSale(req, res) {
    try {
      const data = req.body;
      const result = await this.saleService.createSale(data);

      // Tạo thành công trả về 201
      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: err.message || "Tạo giảm giá thất bại" });
    }
  }

  async updateSale(req, res) {
    try {
      const data = req.body;
      const result = await this.saleService.updateSale(data);

      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: err.message || "Sửa giảm giá thất bại" });
    }
  }

  async deleteSale(req, res) {
    try {
      const { id } = req.body;
      const result = await this.saleService.deleteSale(id);

      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message || "Xóa thất bại" });
    }
  }

  async deleteSale(req, res) {
    try {
      const { id } = req.body; // Lấy id từ body do Frontend gửi lên dạng JSON

      const result = await this.saleService.deleteSale(id);

      // Trả kết quả về cho Frontend với mã 200 (Thành công)
      return res.status(200).json(result);
    } catch (err) {
      console.error("Lỗi tại SaleController.deleteSale:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Xóa giảm giá thất bại",
      });
    }
  }
}

module.exports = SaleController;
