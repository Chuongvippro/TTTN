async function createProduct(data) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category_id", data.category_id);
    formData.append("description", data.description);
    formData.append("pet_type", data.pet_type);

    if (data.sale_id) {
      formData.append("sale_id", data.sale_id);
    }

    if (data.file) {
      formData.append("img", data.file);
    }

    const res = await fetch("/admin/create/product", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Cập nhật thất bại");
    }

    return result;
  } catch (err) {
    console.error("Lỗi cập nhật:", err.message);
    alert(err.message);
    throw err;
  }
}
async function deleteProduct(id) {
  try {
    const res = await fetch("/admin/delete/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Xóa thất bại");
    }

    loadSection("products");
  } catch (err) {
    console.error("Lỗi xoá:", err.message);
    alert(err.message);
  }
}

async function updateProduct(data) {
  try {
    const formData = new FormData();

    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category_id", data.category_id);
    formData.append("description", data.description);

    formData.append("is_sale", data.is_sale ? 1 : 0);
    formData.append("sale_percent", data.sale_percent || 0);
    formData.append("sale_expired_at", data.sale_expired_at || "");
    formData.append("pet_type", data.pet_type);
    formData.append("sale_id", data.sale_id || "");
    if (data.file) {
      formData.append("img", data.file);
    }

    const res = await fetch("/admin/update/product", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Cập nhậ thất bại");
    }

    return result;
  } catch (err) {
    console.error("Lỗi cập nhật:", err.message);
    alert(err.message);
  }
}

//user
async function createUser(data) {
  try {
    const res = await fetch("/admin/create/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Tạo sản phẩm thất bại");
    }

    return result;
  } catch (err) {
    console.error("Lỗi create:", err.message);
    throw err;
  }
}
async function deleteUser(id) {
  try {
    const res = await fetch("/admin/delete/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Xóa thất bại");
    }

    loadSection("users");
  } catch (err) {
    console.error("Lỗi xoá:", err.message);
    alert(err.message);
  }
}

async function updateUser(data) {
  try {
    const res = await fetch("/admin/update/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Cập nhật thất bại");
    }

    return result;
  } catch (err) {
    console.error("Lỗi cập nhật:", err.message);
    alert(err.message);
  }
}

//thêm/xóa/sửa loại sản phẩm
async function createCategory(data) {
  try {
    const res = await fetch("/admin/create/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả JSON");
    }

    if (!res.ok) {
      throw new Error(result.message || "Tạo danh mục thất bại");
    }

    return result;
  } catch (err) {
    console.error("Lỗi create category:", err.message);
    throw err;
  }
}

async function deleteCategory(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
    return;
  }

  try {
    const res = await fetch("/admin/delete/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không xóa được loại");
    }

    if (!res.ok) {
      throw new Error(result.message || "Xóa thất bại");
    }

    loadSection("categories");
  } catch (err) {
    console.error("Lỗi xoá category:", err.message);
    alert(err.message);
  }
}

async function updateCategory(data) {
  try {
    const res = await fetch("/admin/update/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const text = await res.text();

    let result;

    //call back tránh lỗi
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không sửa được loại");
    }

    if (!res.ok) {
      throw new Error(result.message || "Cập nhật danh mục thất bại");
    }

    return result;
  } catch (err) {
    console.error("Lỗi cập nhật category:", err.message);
    throw err;
  }
}
// Hàm KHÔI PHỤC (Restore / Active) dùng chung
async function handleRestore(type, id) {
  if (
    !confirm(`Bạn có muốn khôi phục ${type} này về trạng thái hoạt động không?`)
  )
    return;

  try {
    const res = await fetch(`/admin/restore/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Khôi phục thất bại");

    alert("Đã khôi phục thành công! ✨");
    loadSection(
      type === "product"
        ? "products"
        : type === "user"
          ? "users"
          : "categories",
    );
  } catch (err) {
    alert(err.message);
  }
}

// Hàm lấy chi tiết đơn hàng
async function getOrderDetailData(orderId) {
  try {
    const res = await fetch(`/admin/order-detail/${orderId}`);
    if (!res.ok) throw new Error("Không thể lấy dữ liệu đơn hàng");
    return await res.json();
  } catch (err) {
    console.error("Lỗi API getOrderDetailData:", err);
    alert("Lỗi: " + err.message);
    return null;
  }
}

// Hàm cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId) {
  const newStatus = document.getElementById(`select-status-${orderId}`).value;

  try {
    const res = await fetch("/admin/update/order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });

    const data = await res.json();
    if (data.success || res.ok) {
      alert("Cập nhật thành công! 🐾");
      loadSection("orders"); // Load lại bảng để reset nút Lưu
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (err) {
    console.error("Lỗi API updateOrderStatus:", err);
    alert("Không thể kết nối server!");
  }
}

//giảm giá(thêm/sửa)
async function saveSale(data) {
  // Check xem có id không: Có id là update, không có id là create
  const action = data.id ? "update" : "create";

  try {
    // Gọi API tương ứng: /admin/create/sale hoặc /admin/update/sale
    const res = await fetch(`/admin/${action}/sale`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    let result;

    // Bắt lỗi server không trả về JSON
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả về JSON hợp lệ");
    }

    if (!res.ok) {
      const actionName = action === "update" ? "Cập nhật" : "Tạo";
      throw new Error(result.message || `${actionName} khuyến mãi thất bại`);
    }

    return result;
  } catch (err) {
    console.error(`Lỗi ${action} sale:`, err.message);
    throw err;
  }
}

//xóa giảm giá
async function deleteSale(id) {
  if (
    !confirm("Bạn có chắc chắn muốn dừng chương trình khuyến mãi này không?")
  ) {
    return;
  }

  try {
    const res = await fetch("/admin/delete/sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Server không trả về JSON hợp lệ");
    }

    if (!res.ok) {
      throw new Error(result.message || "Xóa khuyến mãi thất bại");
    }

    alert(result.message || "Đã tắt khuyến mãi thành công! ✨");

    // Load lại bảng quản lý khuyến mãi sau khi xóa thành công
    loadSection("sales");
  } catch (err) {
    console.error("Lỗi khi xóa sale:", err.message);
    alert(err.message);
  }
}

