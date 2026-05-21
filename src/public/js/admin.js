let currentPage = 1;
const pageSize = 10;
async function loadSection(type, event, page = 1) {
  //lấy quyền của tài khoản
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = currentUser.role || "user";
  if (event) {
    document
      .querySelectorAll(".menu-btn")
      .forEach((btn) => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");
  }
  const box = document.getElementById("content-box");
  currentPage = page;

  if (type === "dashboard") {
    box.innerHTML = `
      <h2>Bạn đã đến với trang dành cho admin</h2>
      <p>Vui lòng chọn các chức năng bên trái</p>
    `;
    return;
  }
  try {
    const res = await fetch(`/admin/${type}?page=${page}`);
    if (!res.ok) {
      throw new Error("Module không tồn tại");
    }
    const data = await res.json();

    if (type === "products") {
      const products = data.data;
      const totalPages = data.totalPages;
      let html = `
    <div class="table-header">
      <h2>Danh sách sản phẩm</h2>
      <button class="btn-add" onclick="openAddProduct()">+ Thêm sản phẩm</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên sản phẩm</th>
          <th>Giá gốc</th>
          <th>Mã giảm giá</th> <th>Số lượng</th>
          <th>Thú cưng</th>
          <th>Trạng thái</th>
          <th>Ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
  `;

      products.forEach((p) => {
        const isInactive = p.status === "inactive";
        const rowStyle = isInactive
          ? "background-color: #f8d7da; color: #721c24;"
          : "";
        const stockStyle = p.stock < 1 ? "color: red; font-weight: bold;" : "";

        const saleBadge = p.code_sale
          ? `<span class="badge" style="background: #e3f2fd; color: #0d47a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85rem;">${p.code_sale} (-${p.percent}%)</span>`
          : '<span style="color: #bbb; font-weight: normal;">—</span>';

        html += `
    <tr style="${rowStyle}">
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${Number(p.price).toLocaleString("vi-VN")}₫</td>
      
      <td>${saleBadge}</td>

      <td style="${stockStyle}">${p.stock ?? 0}</td>
      <td style="text-align:center;">
        ${{ dog: "🐕 Chó", cat: "🐈 Mèo", rabbit: "🐇 Thỏ", hamster: "🐹 Hamster", other: "🦎 Khác", all: "—" }[p.pet_type] || "—"}
      </td>
      <td><span class="status-${p.status}">${p.status}</span></td>
      <td>
        <img src="/${p.img}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;" />
      </td>
      <td>
        <button class="btn-edit" onclick='openAddProduct(${JSON.stringify(p)})'>Sửa</button>
        ${
          isInactive
            ? `<button class="btn-restore" style="background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" 
                       onclick="handleRestore('product', ${p.id})">Khôi phục</button>`
            : `<button class="btn-delete" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" 
                       onclick="deleteProduct(${p.id})">Xóa</button>`
        }
      </td>
    </tr>
    `;
      });

      html += `</tbody></table>`;

      html += `<div class="pagination" style="margin-top: 20px; text-align: center;">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `
          <button 
            style="margin: 0 5px; padding: 5px 10px; ${i === currentPage ? "background: #007bff; color: white;" : ""}"
            onclick="loadSection('${type}', null, ${i})"
          >
            ${i}
          </button>`;
      }
      html += `</div>`;

      box.innerHTML = html;
    }

    if (type === "users") {
      const user = data.data;
      const totalPages = data.totalPages;
      let html = `
        <div class="table-header">
          <h2>Danh sách người dùng</h2>
          <button class="btn-add" onclick="openAddUser()">+ Thêm người dùng</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Trạng thái</th> 
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
      `;

      user.forEach((u) => {
        // 1. Kiểm tra trạng thái banned (Sửa từ p thành u)
        const isBanned = u.status === "banned";

        // 2. Thiết lập màu sắc nút bấm và text (Dùng chung toggleStatus như m muốn)
        const btnColor = isBanned ? "#28a745" : "#dc3545"; // Xanh để mở, Đỏ để khóa
        const btnText = isBanned ? "Mở khóa" : "Khóa";
        const targetStatus = isBanned ? "active" : "banned";

        // 3. Style cho dòng bị banned
        const rowStyle = isBanned
          ? "background-color: #f8d7da; color: #721c24; font-weight: 500;"
          : "";

        html += `
          <tr style="${rowStyle}">
            <td>${u.id}</td>
            <td>${u.user_name}</td>
            <td>${u.email}</td>
            <td>
              <span class="badge ${isBanned ? "bg-danger" : "bg-success"}" 
                    style="padding: 2px 8px; border-radius: 4px; font-size: 12px; color: white;">
                ${u.status}
              </span>
            </td>
              
          <td>
            <button class="btn-edit" onclick='openAddUser(${JSON.stringify(u)})'>Sửa</button>
            ${
              userRole === "admin"
                ? isBanned
                  ? `<button class="btn-restore" style="background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" 
                            onclick="handleRestore('user', ${u.id})">Khôi phục</button>`
                  : `<button class="btn-delete" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" 
                            onclick="deleteUser(${u.id})">Xóa</button>`
                : ""
            }
          </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;

      //phân trang
      html += `<div class="pagination" style="margin-top: 20px; text-align: center;">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `
          <button 
            style="margin: 0 5px; padding: 5px 10px; ${i === currentPage ? "background: #007bff; color: white;" : ""}"
            onclick="loadSection('${type}', null, ${i})"
          >
            ${i}
          </button>`;
      }
      html += `</div>`;

      box.innerHTML = html;
    }

    if (type === "blogs") {
      loadBlogSection(page);
      return;
    }

    if (type === "reviews") {
      loadReviewsSection(page);
      return;
    }

    if (type === "categories") {
      const categories = data.data || [];
      const totalPages = data.totalPages || 1;

      let html = `
            <div class="table-header">
                <h2>Danh sách danh mục</h2>
                ${userRole === "admin" ? '<button class="btn-add" onclick="openAddCategory()">+ Thêm danh mục</button>' : ""}            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
            `;

      categories.forEach((c) => {
        //kiểm tra trạng thái
        const isInactive = c.status === "inactive";

        const rowStyle = isInactive
          ? "background-color: #f8d7da; font-weight: bold; color: #721c24;"
          : "";

        html += `
        <tr style="${rowStyle}">
          <td>${c.id}</td>
          <td><b>${c.name}</b></td>
          <td>${c.description || ""}</td>
          <td><span class="status-${c.status}">${c.status}</span></td>
          <td>
          ${
            userRole === "admin"
              ? `
            <button class="btn-edit" onclick='openAddCategory(${JSON.stringify(c)})'>Sửa</button>
            ${
              isInactive
                ? `<button class="btn-restore" onclick="handleRestore('category', ${c.id})"...>Bật lại</button>`
                : `<button class="btn-delete" onclick="deleteCategory(${c.id})">Tắt</button>`
            }
          `
              : '<span style="color:#aaa;">Chỉ xem</span>'
          } 
        </td>
        </tr>
        `;
      });

      html += `
        </tbody>
      </table>
      `;

      html += `<div class="pagination" style="margin-top: 20px; text-align: center;">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `
          <button 
            style="margin: 0 5px; padding: 5px 10px; ${i === currentPage ? "background: #007bff; color: white;" : ""}"
            onclick="loadSection('${type}', null, ${i})"
          >
            ${i}
          </button>`;
      }
      html += `</div>`;

      box.innerHTML = html;
    }

    if (type === "orders") {
      const orders = data.data || [];
      const totalPages = data.totalPages || 1;

      // Lưu dữ liệu vào biến global để dùng cho biểu đồ
      window.currentOrdersData = orders;

      let html = `
        <div class="table-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h2>Quản lý đơn hàng</h2>
          <button id="btn-toggle-view" onclick="toggleOrderView()" 
                  style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
            📊 Xem biểu đồ doanh thu
          </button>
        </div>

        <div id="order-table-view">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
      `;

      orders.forEach((o) => {
        html += `
          <tr>
            <td>#${o.id}</td>
            <td>${o.full_name}</td>
            <td>${o.phone}</td>
            <td>${Number(o.total_price).toLocaleString("vi-VN")}₫</td>
            <td><span class="status-${o.status}">${o.status}</span></td>
            <td>
              <button class="btn-view" onclick="openOrderDetail(${o.id})">Chi tiết</button>
              <select id="select-status-${o.id}" 
                      onchange="checkStatusChange(${o.id}, '${o.status}')" ...>
                      style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">
                <option value="pending" ${o.status === "pending" ? "selected" : ""}>Chờ xử lý</option>
                <option value="confirmed" ${o.status === "confirmed" ? "selected" : ""}>Xác nhận</option>
                <option value="shipping" ${o.status === "shipping" ? "selected" : ""}>Đang giao</option>
                <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Đã giao</option>
                <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Hủy</option>
              </select>
              <button id="btn-save-${o.id}" 
                      onclick="updateOrderStatus(${o.id})" 
                      style="display:none; background:#28a745; color:white; border:none; padding:5px 10px; border-radius:4px; margin-left:5px; cursor:pointer;">
                Lưu
              </button>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;

      // Phân trang cho đơn hàng
      html += `<div class="pagination" style="margin-top: 20px; text-align: center;">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `
          <button style="margin: 0 5px; padding: 5px 10px; ${i === currentPage ? "background: #007bff; color: white;" : ""}"
            onclick="loadSection('orders', null, ${i})">${i}</button>`;
      }
      html += `</div></div> `;

      // Khu vực hiển thị Biểu đồ (Mặc định ẩn)
      html += `
        <div id="order-chart-view" style="display: none; background: white; padding: 30px; border-radius: 8px; margin-top: 20px;">
          <h3 style="text-align: center; margin-bottom: 20px; color: #333;">Biểu đồ doanh thu trang hiện tại</h3>
          <div style="height: 400px; width: 100%;">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
      `;

      box.innerHTML = html;
    }

    if (type === "sales") {
      const sales = data.data;
      const totalPages = data.totalPages;
      let html = `
    <div class="table-header">
      <h2>Danh sách chương trình khuyến mãi</h2>
      <button class="btn-add" onclick="openSaleModal()">+ Thêm khuyến mãi</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã giảm giá</th>
          <th>Phần trăm (%)</th>
          <th>Thời gian</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
  `;

      sales.forEach((s) => {
        const now = new Date();
        const endDate = new Date(s.expired_at);
        const startDate = new Date(s.start_at);

        const timeDiff = endDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let statusHtml = "";

        if (now > endDate || s.status === "inactive") {
          statusHtml = `<span class="badge-status expired" style="background-color: #ffe0e3; color: #d63031; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; display: inline-block;">Đã kết thúc</span>`;
        } else if (now < startDate) {
          statusHtml = `<span class="badge-status upcoming" style="background-color: #e3f2fd; color: #0d47a1; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; display: inline-block;">Sắp diễn ra</span>`;
        } else {
          statusHtml = `<span class="badge-status active" style="background-color: #e6f4ea; color: #137333; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; display: inline-block;">Còn ${daysLeft} ngày</span>`;
        }

        const dateRange = `${new Date(s.start_at).toLocaleDateString("vi-VN")} - ${new Date(s.expired_at).toLocaleDateString("vi-VN")}`;

        html += `
      <tr>
        <td>${s.id}</td>
        <td><strong>${s.code_sale || "—"}</strong></td>
        <td style="color: #d63031; font-weight: bold;">-${s.percent}%</td>
        <td><small>${dateRange}</small></td>
        <td>${statusHtml}</td>
        <td>
          <button class="btn-edit" onclick='openSaleModal(${JSON.stringify(s)})'>Sửa</button>
          ${s.status === "active" && now <= endDate ? `<button class="btn-delete" style="background-color: #d63031; color: white;" onclick="deleteSale(${s.id})">Tắt</button>` : `<button class="btn-delete" disabled style="background-color: #ccc; color: #666; cursor: not-allowed;">Tắt</button>`}
        </td>
      </tr>
    `;
      });

      html += `</tbody></table>`;
      box.innerHTML = html;
    }
  } catch (err) {
    box.innerHTML = `
      <h2>⚠️ ${err.message}</h2>
      <p>Module này hiện không khả dụng</p>
    `;
  }
}
//tạo sản phẩm mới/xóa sản phẩm
let editProductId = null;

async function openAddProduct(product = null) {
  document.getElementById("product-modal").classList.add("show");
  const title = document.querySelector("#product-modal h2");

  try {
    const [catRes, saleRes] = await Promise.all([
      fetch("/admin/getCategories"),
      fetch("/admin/sales?size=100"),
    ]);

    const categories = await catRes.json();
    const saleResult = await saleRes.json();
    const allSales = saleResult.data || [];

    const selectCat = document.getElementById("category");
    let catHtml = `<option value="">-- Chọn loại --</option>`;
    categories.forEach((c) => {
      catHtml += `<option value="${c.id}">${c.name}</option>`;
    });
    selectCat.innerHTML = catHtml;

    const selectSale = document.getElementById("product_sale_id");
    let saleHtml = `<option value="">-- Không giảm giá (Giá gốc) --</option>`;

    const now = new Date();
    const activeUnexpiredSales = allSales.filter(
      (s) =>
        s.status === "active" &&
        new Date(s.expired_at) > now &&
        new Date(s.start_at) <= now,
    );

    activeUnexpiredSales.forEach((s) => {
      saleHtml += `<option value="${s.id}">${s.code_sale || `Giảm -${s.percent}%`} (Hạn: ${new Date(s.expired_at).toLocaleDateString("vi-VN")})</option>`;
    });
    selectSale.innerHTML = saleHtml;

    const preview = document.getElementById("preview-img");
    const imgInput = document.getElementById("img");

    if (product) {
      editProductId = product.id;
      title.innerText = "Sửa sản phẩm";

      document.getElementById("name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("stock").value = product.stock;
      document.getElementById("description").value = product.description;
      document.getElementById("category").value = product.category_id;
      document.getElementById("pet_type").value = product.pet_type || "all";

      document.getElementById("product_sale_id").value = product.sale_id || "";

      if (product.img) {
        preview.src = "/" + product.img;
        preview.style.display = "block";
      }
    } else {
      title.innerText = "Thêm sản phẩm";
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("stock").value = "";
      document.getElementById("category").value = "";
      document.getElementById("description").value = "";
      document.getElementById("pet_type").value = "all";
      document.getElementById("product_sale_id").value = "";

      preview.src = "";
      preview.style.display = "none";
      editProductId = null;
    }

    imgInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      }
    };
  } catch (err) {
    console.error("Lỗi khi chuẩn bị modal sản phẩm:", err);
  }
}

async function submitProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const category_id = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const pet_type = document.getElementById("pet_type").value;
  const sale_id = document.getElementById("product_sale_id").value;
  const fileInput = document.getElementById("img");
  const messageBox = document.getElementById("form-message");

  const payload = {
    id: editProductId,
    name,
    price,
    stock,
    description,
    category_id,
    pet_type,
    file: fileInput.files[0],
    sale_id: sale_id || null,
  };

  try {
    let res;
    if (editProductId) {
      res = await updateProduct(payload);
    } else {
      res = await createProduct(payload);
    }
    messageBox.innerText = res.message;
    messageBox.className = "form-message success";

    setTimeout(() => {
      closeProductModal();
      loadSection("products");
      messageBox.innerText = "";
    }, 1000);
  } catch (err) {
    messageBox.innerText = err.message;
    messageBox.className = "form-message error";
  }
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.classList.remove("show");
    modal.classList.add("hidden");
  }
}

//thêm/xóa/sửa user(account)
let editUserId = null;
async function openAddUser(user = null) {
  document.getElementById("user-modal").classList.add("show");
  const title = document.querySelector("#user-modal h2");
  checkRoleUI();

  if (user) {
    editUserId = user.id;
    title.innerText = "Sửa người dùng";

    document.getElementById("user_name").value = user.user_name;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone ?? "";
    document.getElementById("password").value = "";
  } else {
    title.innerText = "Thêm người dùng";

    document.getElementById("user_name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("password").value = "";
    editUserId = null;
  }
}
function checkRoleUI() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const roleGroup = document.getElementById("role-group");

  if (!user || user.role !== "admin") {
    roleGroup.style.display = "none";
  } else {
    roleGroup.style.display = "block";
  }
}

function closeUserModal() {
  document.getElementById("user-modal").classList.remove("show");
}

async function submitUser() {
  const user_name = document.getElementById("user_name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const messageBox = document.getElementById("user-form-message");

  try {
    let res;

    if (editUserId) {
      res = await updateUser({
        id: editUserId,
        user_name,
        email,
        phone,
        password,
        role,
      });
    } else {
      res = await createUser({
        user_name,
        email,
        phone,
        password,
        role,
      });
    }

    messageBox.innerText = res.message;
    messageBox.className = "form-message success";

    setTimeout(() => {
      closeUserModal();
      loadSection("users");
      messageBox.innerText = "";
    }, 1000);
  } catch (err) {
    messageBox.innerText = err.message;
    messageBox.className = "form-message error";
  }
}

//thêm/xóa/sửa loại sản phẩm
let editCategoryId = null;
function openAddCategory(category = null) {
  document.getElementById("category-modal").classList.add("show");
  const title = document.getElementById("cat-modal-title");

  if (category) {
    editCategoryId = category.id;
    title.innerText = "Sửa danh mục";
    document.getElementById("cat_name").value = category.name;
    document.getElementById("cat_description").value =
      category.description || "";
    document.getElementById("cat_status").value = category.status || "active";
  } else {
    editCategoryId = null;
    title.innerText = "Thêm danh mục";
    document.getElementById("cat_name").value = "";
    document.getElementById("cat_description").value = "";
    document.getElementById("cat_status").value = "active";
  }
}

function closeCategoryModal() {
  document.getElementById("category-modal").classList.remove("show");
}

async function submitCategory() {
  const name = document.getElementById("cat_name").value;
  const description = document.getElementById("cat_description").value;
  const status = document.getElementById("cat_status").value;
  const messageBox = document.getElementById("cat-form-message");

  if (!name || name.trim() === "") {
    messageBox.innerText = "Vui lòng nhập tên danh mục!";
    messageBox.className = "form-message error";
    return;
  }

  try {
    let res;

    // Gom chung data lại cho gọn
    const payload = {
      name: name.trim(),
      description: description.trim(),
      status: status,
    };

    if (editCategoryId) {
      res = await updateCategory({
        id: editCategoryId,
        ...payload,
      });
    } else {
      res = await createCategory(payload);
    }

    messageBox.innerText = res.message;
    messageBox.className = "form-message success";

    setTimeout(() => {
      closeCategoryModal();
      loadSection("categories");
      messageBox.innerText = "";
    }, 1000);
  } catch (err) {
    messageBox.innerText = err.message;
    messageBox.className = "form-message error";
  }
}

// Hàm này gọi từ nút "Chi tiết" ở ngoài bảng
async function openOrderDetail(orderId) {
  const result = await getOrderDetailData(orderId);

  if (result && result.success) {
    const items = result.data;
    // Thêm class "table" để nó kế thừa style sẵn có của trang admin
    let html = `
            <table class="table" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; text-align: center;">Ảnh</th>
                        <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                        <th style="padding: 12px; text-align: center;">Giá</th>
                        <th style="padding: 12px; text-align: center;">SL</th>
                        <th style="padding: 12px; text-align: right;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
        `;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px; text-align: center;">
                        <img src="/${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">
                    </td>
                    <td style="padding: 10px; font-weight: 600; color: #444;">${item.name}</td>
                    <td style="padding: 10px; text-align: center;">${Number(item.price).toLocaleString("vi-VN")}₫</td>
                    <td style="padding: 10px; text-align: center;">x${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; font-weight: 700;">
                        ${(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </td>
                </tr>
            `;
    }

    html += `</tbody></table>`;

    document.getElementById("order-items-list").innerHTML = html;
    document.getElementById("modal-total-amount").innerText =
      Number(result.totalAmount).toLocaleString("vi-VN") + "₫";
    document.getElementById("order-detail-modal").classList.add("show");
  }
}

// Hàm đóng modal
function closeOrderDetailModal() {
  document.getElementById("order-detail-modal").classList.remove("show");
}

// Hàm kiểm tra để hiện/ẩn nút lưu
function checkStatusChange(orderId, originalStatus) {
  const currentStatus = document.getElementById(
    `select-status-${orderId}`,
  ).value;
  const saveBtn = document.getElementById(`btn-save-${orderId}`);

  if (currentStatus !== originalStatus) {
    saveBtn.style.display = "inline-block";
  } else {
    saveBtn.style.display = "none";
  }
}

//hiển thị biểu đồ doanh thu
let orderChartInstance = null;

function toggleOrderView() {
  const tableView = document.getElementById("order-table-view");
  const chartView = document.getElementById("order-chart-view");
  const btn = document.getElementById("btn-toggle-view");

  if (tableView.style.display !== "none") {
    // Chuyển sang xem Biểu đồ
    tableView.style.display = "none";
    chartView.style.display = "block";
    btn.innerHTML = "📋 Xem danh sách đơn hàng";
    btn.style.background = "#007bff";

    renderOrderChart();
  } else {
    // Quay lại xem Bảng
    tableView.style.display = "block";
    chartView.style.display = "none";
    btn.innerHTML = "📊 Xem biểu đồ doanh thu";
    btn.style.background = "#28a745";
  }
}

function renderOrderChart() {
  const ctx = document.getElementById("revenueChart").getContext("2d");

  // Nếu chart cũ đang tồn tại thì xóa đi để vẽ mới
  if (orderChartInstance) {
    orderChartInstance.destroy();
  }

  const orders = window.currentOrdersData || [];

  const revenueByDate = {};

  orders.forEach((o) => {
    //nếu chưa giao thì k tính vào biểu đồ
    if (o.status !== "delivered") return;
    const dateStr = o.created_at
      ? new Date(o.created_at).toLocaleDateString("vi-VN")
      : "Không rõ ngày";

    const price = parseFloat(o.total_price);

    if (revenueByDate[dateStr]) {
      revenueByDate[dateStr] += price;
    } else {
      revenueByDate[dateStr] = price;
    }
  });

  const labels = Object.keys(revenueByDate);

  const dataValues = Object.values(revenueByDate);

  // Vẽ biểu đồ
  orderChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: dataValues,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString("vi-VN") + "₫";
            },
          },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

// ═══════════════════════════════════════════════════════
//  BLOG MANAGEMENT
// ═══════════════════════════════════════════════════════

async function loadBlogSection(page = 1) {
  const box = document.getElementById("content-box");
  try {
    const res = await fetch(`/admin/blogs?page=${page}`);
    const data = await res.json();
    const posts = data.posts || [];
    const totalPages = data.totalPages || 1;

    window.currentBlogPosts = posts;
    let html = `
      <div class="table-header">
        <h2>📝 Quản lý bài viết Blog</h2>
        <button class="btn-add" onclick="openBlogModal()">+ Thêm bài viết</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Lượt xem</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>`;

    // TRONG VÒNG LẶP posts.forEach của hàm loadBlogSection:
    posts.forEach((p) => {
      const date = new Date(p.created_at).toLocaleDateString("vi-VN");
      const statusColor = p.status === "published" ? "#28a745" : "#ffc107";
      const shortTitle =
        p.title.length > 60 ? p.title.substring(0, 60) + "..." : p.title;

      html += `
    <tr>
      <td>${p.id}</td>
      <td style="font-weight: bold; color: #333;" title="${p.title}">${shortTitle}</td>
      <td>${p.category_name || "—"}</td>
      <td>
        <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
          ${p.status}
        </span>
      </td>
      <td style="text-align: center;">${p.views || 0}</td>
      <td>${date}</td>
      <td>
        <button class="btn-edit" onclick='openBlogModal(${JSON.stringify(p)})'>Sửa</button>
        <button class="btn-delete" onclick="deleteBlogPost(${p.id})">Xóa</button>
      </td>
    </tr>`;
    });

    html += `</tbody></table>`;

    // Pagination
    if (totalPages > 1) {
      html += `<div class="pagination" style="margin-top:20px;text-align:center;">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button style="margin:0 5px;padding:5px 10px;${i === page ? "background:#007bff;color:white;" : ""}" onclick="loadBlogSection(${i})">${i}</button>`;
      }
      html += `</div>`;
    }

    box.innerHTML = html;
  } catch (err) {
    box.innerHTML = `<h2>⚠️ ${err.message}</h2>`;
  }
}

// Mở modal Blog
let editBlogId = null;

async function openBlogModal(post = null) {
  try {
    const res = await fetch("/admin/blog-categories");
    const cats = await res.json();
    const select = document.getElementById("blog_category");
    let html = `<option value="">-- Chọn danh mục --</option>`;
    cats.forEach((c) => {
      html += `<option value="${c.id}">${c.name}</option>`;
    });
    select.innerHTML = html;
  } catch (e) {
    console.log("Không load được blog categories");
  }

  const modal = document.getElementById("blog-modal");
  modal.classList.add("show"); // Bật show y như Product
  const title = document.getElementById("blog-modal-title");

  const preview = document.getElementById("blog-img-preview");
  const imgInput = document.getElementById("blog_img");

  if (post) {
    editBlogId = post.id;
    title.innerText = "Sửa bài viết";

    document.getElementById("blog_title").value = post.title || "";
    document.getElementById("blog_summary").value = post.summary || "";
    document.getElementById("blog_content").value = post.content || "";
    document.getElementById("blog_category").value = post.category_id || "";
    document.getElementById("blog_status").value = post.status || "published";

    // Hiển thị ảnh cũ y như Product
    if (post.thumbnail) {
      preview.src = "/" + post.thumbnail;
      preview.style.display = "block";
    } else {
      preview.src = "";
      preview.style.display = "none";
    }
  } else {
    editBlogId = null;
    title.innerText = "Thêm bài viết";

    document.getElementById("blog_title").value = "";
    document.getElementById("blog_summary").value = "";
    document.getElementById("blog_content").value = "";
    document.getElementById("blog_category").value = "";
    document.getElementById("blog_status").value = "published";

    preview.src = "";
    preview.style.display = "none";
  }

  imgInput.value = ""; // Reset file input
}
document.getElementById("blog_img").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const preview = document.getElementById("blog-img-preview");
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
});

function closeBlogModal() {
  const modal = document.getElementById("blog-modal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
  document.getElementById("blog-form-message").innerText = "";
}

async function submitBlog() {
  const title = document.getElementById("blog_title").value.trim();
  const summary = document.getElementById("blog_summary").value.trim();
  const content = document.getElementById("blog_content").value.trim();
  const categoryId = document.getElementById("blog_category").value;
  const status = document.getElementById("blog_status").value;
  const file = document.getElementById("blog_img").files[0];
  const msgBox = document.getElementById("blog-form-message");

  if (!title || !content) {
    msgBox.innerText = "Vui lòng nhập đủ thông tin (Tiêu đề, Nội dung)!";
    msgBox.className = "form-message error";
    return;
  }

  const formData = new FormData();
  if (editBlogId) formData.append("id", editBlogId);
  formData.append("title", title);
  formData.append("summary", summary);
  formData.append("content", content);
  formData.append("categoryId", categoryId);
  formData.append("status", status);

  //có file thì append k thì bỏ
  if (file) {
    formData.append("thumbnail", file);
  }

  try {
    const url = editBlogId
      ? `/admin/blogs/update/${editBlogId}`
      : "/admin/blogs/create";
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    msgBox.innerText = editBlogId
      ? "✅ Cập nhật thành công!"
      : "✅ Thêm bài viết thành công!";
    msgBox.className = "form-message success";

    setTimeout(() => {
      closeBlogModal();
      loadSection("blogs");
    }, 1000);
  } catch (err) {
    msgBox.innerText = err.message;
    msgBox.className = "form-message error";
  }
}

async function deleteBlogPost(id) {
  if (!confirm("Xóa bài viết này?")) return;
  try {
    const res = await fetch(`/admin/blogs/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    loadSection("blogs");
  } catch (err) {
    alert(err.message);
  }
}

async function deleteBlogPost(id) {
  if (!confirm("Xóa bài viết này?")) return;
  try {
    const res = await fetch(`/admin/blogs/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    loadSection("blogs");
  } catch (err) {
    alert(err.message);
  }
}

// ═══════════════════════════════════════════════════════
//  REVIEWS MANAGEMENT
// ═══════════════════════════════════════════════════════

async function loadReviewsSection(page = 1) {
  const box = document.getElementById("content-box");
  try {
    const res = await fetch(`/admin/reviews?page=${page}`);
    const data = await res.json();
    const reviews = data.reviews || [];
    const totalPages = data.totalPages || 1;

    let html = `
      <div class="table-header">
        <h2>⭐ Quản lý đánh giá sản phẩm</h2>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Sản phẩm</th>
            <th>Rating</th>
            <th>Nội dung</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>`;

    reviews.forEach((r) => {
      const stars = "⭐".repeat(r.rating);
      const date = new Date(r.created_at || r.createdAt).toLocaleDateString(
        "vi-VN",
      );
      const shortComment = r.comment
        ? r.comment.length > 60
          ? r.comment.substring(0, 60) + "..."
          : r.comment
        : "—";
      html += `
        <tr>
          <td>${r.id}</td>
          <td>${r.user_name || r.userName || "—"}</td>
          <td>${r.product_name || `SP #${r.product_id}`}</td>
          <td style="color:#f59e0b;font-weight:700;">${stars} (${r.rating}/5)</td>
          <td title="${r.comment || ""}">${shortComment}</td>
          <td>${date}</td>
          <td>
            <button class="btn-delete" onclick="deleteReviewAdmin(${r.id})">Xóa</button>
          </td>
        </tr>`;
    });

    html += `</tbody></table>`;

    if (totalPages > 1) {
      html += `<div class="pagination" style="margin-top:20px;text-align:center;">`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button style="margin:0 5px;padding:5px 10px;${i === page ? "background:#007bff;color:white;" : ""}" onclick="loadReviewsSection(${i})">${i}</button>`;
      }
      html += `</div>`;
    }

    box.innerHTML = html;
  } catch (err) {
    box.innerHTML = `<h2>⚠️ ${err.message}</h2>`;
  }
}

async function deleteReviewAdmin(id) {
  if (!confirm("Xóa đánh giá này?")) return;
  try {
    const res = await fetch(`/admin/reviews/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    loadSection("reviews");
  } catch (err) {
    alert(err.message);
  }
}

//giảm giá
let editSaleId = null;

async function openSaleModal(sale = null) {
  document.getElementById("sale-modal").classList.add("show");
  const title = document.getElementById("sale-modal-title");

  //lấy loại sản phẩm
  try {
    const res = await fetch("/admin/getCategories");
    const categories = await res.json();
    const selectSaleCat = document.getElementById("sale_apply_category");
    let saleCatHtml = `<option value="">-- Không áp dụng theo loại --</option>`;
    categories.forEach((c) => {
      saleCatHtml += `<option value="${c.id}">${c.name}</option>`;
    });
    selectSaleCat.innerHTML = saleCatHtml;
  } catch (err) {
    console.error("Lỗi lấy danh mục cho sale:", err);
  }
  //lấy ngày hiện tại
  const nowLocal = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);
  if (sale) {
    editSaleId = sale.id;
    title.innerText = "Sửa chương trình Sale";
    document.getElementById("sale_code").value = sale.code_sale || "";
    document.getElementById("sale_percent_input").value = sale.percent;
    document.getElementById("sale_description").value = sale.description || "";
    document.getElementById("sale_status").value = sale.status || "active";
    document.getElementById("sale_apply_all").checked = false;

    // Format ngày giờ để hiển thị vào thẻ datetime-local
    document.getElementById("sale_start").value = new Date(
      new Date(sale.start_at).getTime() -
        new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
    document.getElementById("sale_end").value = new Date(
      new Date(sale.expired_at).getTime() -
        new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
  } else {
    editSaleId = null;
    title.innerText = "Thêm chương trình Sale";
    document.getElementById("sale_code").value = "";
    document.getElementById("sale_percent_input").value = "";
    document.getElementById("sale_start").value = nowLocal;
    document.getElementById("sale_end").value = "";
    document.getElementById("sale_description").value = "";
    document.getElementById("sale_status").value = "active";
    document.getElementById("sale_apply_all").checked = false;
  }
  const startInput = document.getElementById("sale_start");
  const endInput = document.getElementById("sale_end");

  // Khống chế không cho ngày bắt đầu trước thời điểm hiện tại
  startInput.min = nowLocal;
  // Khống chế không cho ngày kết thúc trước thời điểm hiện tại
  endInput.min = nowLocal;
  startInput.addEventListener("change", function () {
    endInput.min = this.value;
    if (endInput.value && endInput.value < this.value) {
      endInput.value = this.value; // Nếu lỡ chọn ngày kết thúc trước ngày bắt đầu thì reset bằng ngày bắt đầu
    }
  });
}

function closeSaleModal() {
  document.getElementById("sale-modal").classList.remove("show");
}

async function submitSale() {
  const code_sale = document.getElementById("sale_code").value.trim();
  const percent = document.getElementById("sale_percent_input").value;
  const startRaw = document.getElementById("sale_start").value;
  const expiredRaw = document.getElementById("sale_end").value;
  const description = document.getElementById("sale_description").value.trim();
  const status = document.getElementById("sale_status").value;
  const messageBox = document.getElementById("sale-form-message");
  const apply_all = document.getElementById("sale_apply_all").checked;
  const apply_category_id = document.getElementById("sale_apply_category").value;

  if (!percent || !startRaw || !expiredRaw) {
    messageBox.innerText = "Vui lòng nhập đủ % giảm và thời gian!";
    messageBox.className = "form-message error";
    return;
  }
  if (new Date(startRaw) >= new Date(expiredRaw)) {
    messageBox.innerText = "Ngày kết thúc phải lớn hơn ngày bắt đầu!";
    messageBox.className = "form-message error";
    return;
  }
  const start_at = startRaw.replace("T", ") ") + ":00";
  const expired_at = expiredRaw.replace("T", " ") + ":00";

  try {
    const payload = {
      code_sale,
      percent,
      start_at,
      expired_at,
      description,
      status,
      apply_all,
      apply_category_id,
    };

    // Nếu đang ở chế độ sửa thì  thêm  id vào payload
    if (editSaleId) {
      payload.id = editSaleId;
    }

    const res = await saveSale(payload);

    messageBox.innerText = res.message || "Lưu khuyến mãi thành công!";
    messageBox.className = "form-message success";

    setTimeout(() => {
      closeSaleModal();
      loadSection("sales");
      messageBox.innerText = "";
    }, 1000);
  } catch (err) {
    messageBox.innerText = err.message;
    messageBox.className = "form-message error";
  }
}
