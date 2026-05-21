class SaleService {
  constructor(saleRepo) {
    this.saleRepo = saleRepo;
  }

  async getAllSales(page = 1, size = 10) {
    const data = await this.saleRepo.getAllSales(page, size);
    const totalItems = await this.saleRepo.countAllSales();
    const totalPages = Math.ceil(totalItems / size);

    return {
      data,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  async createSale(data) {
    const { code_sale, percent, start_at, expired_at, description, apply_all } =
      data;

    if (!percent || !start_at || !expired_at) {
      throw new Error("Vui lòng nhập đầy đủ % giảm và thời gian");
    }

    if (new Date(start_at) >= new Date(expired_at)) {
      throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
    }

    const newSale = {
      code_sale: code_sale ? code_sale.trim() : null,
      percent: Number(percent),
      start_at,
      expired_at,
      description: description ? description.trim() : "",
      status: data.status || "active",
    };

    const result = await this.saleRepo.createSale(newSale);

    //nếu chọn tất cả thì đồng loạt sale cho tất cả
    const newSaleId = result.insertId;
    if (apply_all === true) {
      await this.saleRepo.applySaleToAllProducts(
        newSaleId,
        Number(data.percent),
      );
    }
    if (data.apply_category_id) {
      await this.saleRepo.applySaleToCategory(
        data.apply_category_id,
        saleId,
        Number(data.percent),
      );
    }
    return {
      message: "Tạo chương trình giảm giá thành công",
      data: {
        id: result.insertId,
        ...newSale,
      },
    };
  }

  async updateSale(data) {
    const { id, code_sale, percent, start_at, expired_at, description } = data;

    if (!id) throw new Error("Thiếu ID giảm giá");
    if (!percent || !start_at || !expired_at) {
      throw new Error("Vui lòng nhập đầy đủ % giảm và thời gian");
    }
    if (new Date(start_at) >= new Date(expired_at)) {
      throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
    }

    const updatedSale = {
      code_sale: code_sale ? code_sale.trim() : null,
      percent: Number(percent),
      start_at,
      expired_at,
      description: description ? description.trim() : "",
      status: data.status || "active",
    };

    const result = await this.saleRepo.updateSale(id, updatedSale);

    if (result.affectedRows === 0) {
      throw new Error("giảm giá không tồn tại hoặc không có thay đổi");
    }
    if (data.status === "inactive") {
      await this.saleRepo.removeSaleFromProducts(id);
    } else {
      
      if (data.apply_all === true) {
        await this.saleRepo.applySaleToAllProducts(id, Number(data.percent));
      } 
      else if (data.apply_category_id) {

        await this.saleRepo.removeSaleFromProducts(id); 
        await this.saleRepo.applySaleToCategory(
          data.apply_category_id,
          id,
          Number(data.percent),
        );
      } 
      else {
        await this.saleRepo.removeSaleFromProducts(id);
      }
    }
    return {
      message: "Cập nhật giảm giá thành công",
      data: {
        id,
        ...updatedSale,
      },
    };
  }

  async deleteSale(id) {
    if (!id) throw new Error("Không có id giảm giá");

    await this.saleRepo.removeSaleFromProducts(id);
    const result = await this.saleRepo.deleteSale(id);

    if (result.affectedRows === 0) {
      throw new Error("Không tìm thấy giảm giá này");
    }

    return { message: "Xóa giảm giá thành công" };
  }
}

module.exports = SaleService;
