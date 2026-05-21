document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("username")) {
    const user = await getProfile();
    if (user) renderProfile(user);
  }

});

async function getProfile() {
  const res = await fetch("/user/api/profile");

  if (res.status === 401) {
    alert("Chưa đăng nhập");
    window.location.href = "/";
    return null;
  }

  return await res.json();
}

function renderProfile(user) {
  console.log("Dữ liệu user nhận được:", user);
  const fields = {
    username: user.username || user.user_name || "Chưa có tên",
    email: user.email || "Chưa có email",
    phone: user.phone || "Chưa có",
    role: user.role || "User",
    address: user.address || "trống",
  };
  for (const [id, value] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = value;
    } else {
      console.warn(
        `Cảnh báo: Không tìm thấy thẻ có id="${id}" trên trang này.`,
      );
    }
  }
}

// Hàm hiện form và ẩn các khu vực khác
function updateInforUser() {
  const editForm = document.getElementById("editForm");
  const staticInfo = document.getElementById("staticInfo"); // Khu vực hiện thông tin tĩnh
  const ordersSection = document.getElementById("myOrdersSection");

  // Hiện form
  editForm.style.display = "block";
  if (staticInfo) staticInfo.style.display = "none";
  if (ordersSection) ordersSection.style.display = "none";

  // Điền dữ liệu hiện tại từ các thẻ span vào input
  document.getElementById("edit-username").value =
    document.getElementById("username").innerText;
  document.getElementById("edit-phone").value =
    document.getElementById("phone").innerText === "Chưa có"
      ? ""
      : document.getElementById("phone").innerText;
  document.getElementById("edit-address").value =
    document.getElementById("address").innerText === "trống"
      ? ""
      : document.getElementById("address").innerText;
}

// Hàm hủy chỉnh sửa
function cancelEdit() {
  document.getElementById("editForm").style.display = "none";
  if (document.getElementById("staticInfo"))
    document.getElementById("staticInfo").style.display = "block";
}

async function saveUserInfo() {
  const username = document.getElementById("edit-username").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  const address = document.getElementById("edit-address").value.trim();

  if (!username) {
    alert("Tên hiển thị không được để trống nha m!");
    return;
  }

  try {
    const res = await fetch("/user/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        phone: phone,
        address: address,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Cập nhật thông tin thành công! 🐾");

      // Cập nhật lại giao diện
      document.getElementById("username").innerText = username;
      document.getElementById("phone").innerText = phone || "Chưa có";
      document.getElementById("address").innerText = address || "";

      // Đóng form
      cancelEdit();
    } else {
      alert("Lỗi rồi: " + (result.message || "Không xác định"));
    }
  } catch (err) {
    console.error("Lỗi khi save profile:", err);
    alert("Hệ thống đang bận, thử lại sau nhé m!");
  }
}

//xem đơn hàng của bản thân
async function fetchAndRenderOrders() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  ordersList.innerHTML =
    '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Đang tải...</div>';

  try {
    const res = await fetch("/user/order/my-orders");
    const data = await res.json();

    if (!data || data.length === 0) {
      ordersList.innerHTML =
        '<p class="text-center text-muted">Bạn chưa có đơn hàng nào. 🐾</p>';
      return;
    }

    let html = "";
    data.forEach((order) => {
      const isPending = order.status === "pending";
      html += `
        <div class="order-card-item" style="border: 1px solid #eee; border-radius: 15px; padding: 15px; margin-bottom: 15px; background: #fff;">
            <div class="d-flex justify-content-between">
                <span class="fw-bold text-primary">#${order.id}</span>
                <span class="badge status-${order.status}">${order.status}</span>
            </div>
            <div class="mt-2 small text-muted">
                <div>Ngày đặt: ${new Date(order.created_at).toLocaleDateString("vi-VN")}</div>
                <div class="fw-bold text-dark">Tổng tiền: ${Number(order.total_price).toLocaleString("vi-VN")}₫</div>
            </div>
            <div class="text-end mt-2">
                <a href="/user/order/history?orderId=${order.id}" class="btn btn-sm btn-outline-secondary">Chi tiết</a>
                ${isPending ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">Hủy đơn</button>` : ""}
            </div>
        </div>`;
    });
    ordersList.innerHTML = html;
  } catch (err) {
    console.error("Lỗi fetch đơn hàng:", err);
    ordersList.innerHTML =
      '<p class="text-center text-danger">Lỗi khi tải đơn hàng.</p>';
  }
}

async function showMyOrders() {
  const ordersSection = document.getElementById("myOrdersSection");
  const staticInfo = document.getElementById("staticInfo");
  const editForm = document.getElementById("editForm");

  if (!ordersSection) return;

  if (ordersSection.style.display === "block") {
    ordersSection.style.display = "none";
    if (staticInfo) staticInfo.style.display = "block";
    return;
  }

  ordersSection.style.display = "block";
  if (editForm) editForm.style.display = "none";
  if (staticInfo) staticInfo.style.display = "none";

  fetchAndRenderOrders();
}

async function cancelOrder(orderId) {
  if (!confirm("Bạn có chắc muốn hủy đơn này không? 😿")) return;

  try {
    const res = await fetch(`/user/api/order/cancel/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Đã hủy đơn hàng thành công! 🐾");

      
      const ordersList = document.getElementById("ordersList");
      if (ordersList) {
        // Đang ở trang profile → fetch lại list
        const ordersSection = document.getElementById("myOrdersSection");
        if (ordersSection) ordersSection.style.display = "block";
        await fetchAndRenderOrders();
      } else {
        // Đang ở trang history → reload trang
        window.location.reload();
      }
    } else {
      const result = await res.json();
      alert("Lỗi: " + (result.message || "Không thể hủy"));
    }
  } catch (err) {
    console.error("Lỗi:", err);
  }
}
