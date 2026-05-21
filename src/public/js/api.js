// ═══════════════════════════════════════════
//  1. CẤU HÌNH API & AUTH (REFRESH TOKEN)
// ═══════════════════════════════════════════
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function callAPI(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401 && url !== "/auth/refresh" && url !== "/auth/login") {
    console.log("Access hết hạn, thử refresh...");

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(async () => {
          return await fetch(url, { ...options, credentials: "include" });
        })
        .catch(() => {
          return res;
        });
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch("/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        console.log("Không có refresh token → chưa login");
        //xóa user ở local nếu refresh lỗi hoặc hết hạn
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        return res;
      }
      processQueue(null, true);

      // gọi lại request ban đầu trong trường hợp lần 1 fail
      res = await fetch(url, {
        ...options,
        credentials: "include",
      });
    } catch (err) {
      processQueue(err, null);
    } finally {
      isRefreshing = false;
    }
    return res;
  }
  return res;
}

// ═══════════════════════════════════════════
//  2. QUẢN LÝ USER (LOGIN, LOGOUT, CHECK AUTH)
// ═══════════════════════════════════════════

// Check login
async function checkAuth() {
  try {
    const res = await callAPI("/auth/me");
    if (!res.ok) return false;
    const user = await res.json();
    return user;
  } catch {
    return false;
  }
}

async function logout() {
  // Giữ logic của file 1: xóa sạch local trước khi gọi API logout
  localStorage.removeItem("pawmie_cart");
  localStorage.removeItem("user");

  await fetch("/user/logout", {
    method: "POST",
    credentials: "include",
  });
  window.location.href = "/";
}

function goHome() {
  window.location.href = "/";
}

// ═══════════════════════════════════════════
//  3. TOAST NOTIFICATION (Thay thế alert)
// ═══════════════════════════════════════════
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: { bg: "#28a745", icon: "✅" },
    error: { bg: "#dc3545", icon: "❌" },
    info: { bg: "#2B8ED8", icon: "ℹ️" },
    warning: { bg: "#F59E0B", icon: "⚠️" },
  };
  const { bg, icon } = colors[type] || colors.success;

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: ${bg};
    color: #fff;
    padding: 14px 20px;
    border-radius: 12px;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    box-shadow: 0 6px 20px rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 260px;
    max-width: 360px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  `;
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  // Tự động xóa sau 3 giây
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ═══════════════════════════════════════════
//  4. GIỎ HÀNG (CART) & MUA HÀNG
// ═══════════════════════════════════════════

// Lấy số lượng giỏ hàng
async function getCartCount() {
  let totalItems = 0;

  const user = await checkAuth();
  if (!user) {
    const localCart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];
    totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
  } else {
    try {
      const res = await callAPI("/user/cart/count");
      if (res.ok) {
        const data = await res.json();
        totalItems = data.count || 0;
      }
    } catch (err) {
      console.log("Lỗi đếm số lượng giỏ hàng:", err);
    }
  }

  const cartBadges = document.querySelectorAll(".cart-count");
  cartBadges.forEach((badge) => {
    badge.innerText = totalItems;
    badge.style.display = totalItems === 0 ? "none" : "inline-block";
  });
}

// Hàm thêm sản phẩm vào giỏ
async function addToCart(productId, btnElement) {
  const originalText = btnElement.innerHTML;
  btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
  btnElement.disabled = true;

  try {
    const user = await checkAuth();

    if (!user) {
      // Khách vãng lai: dùng localStorage
      let cart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];
      const existingItem = cart.find((item) => item.id == productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }

      localStorage.setItem("pawmie_cart", JSON.stringify(cart));
    } else {
      // User đã login: lưu vào Database
      const res = await callAPI("/cart/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Lỗi lưu vào DB");
    }

    await getCartCount();
    showToast("Đã thêm vào giỏ hàng 🐾", "success"); // Dùng toast của file 2
  } catch (err) {
    console.error("Lỗi addToCart:", err);
    showToast("Thêm vào giỏ thất bại!", "error");
  } finally {
    btnElement.innerHTML = originalText;
    btnElement.disabled = false;
  }
}

// Mua ngay (Thêm vào giỏ rồi chuyển đến checkout)
async function buyNow(productId) {
  if (!productId) return;

  try {
    const user = await checkAuth();

    if (!user) {
      // Khách vãng lai
      let cart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];
      const existing = cart.find((i) => i.id == productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }
      localStorage.setItem("pawmie_cart", JSON.stringify(cart));
    } else {
      // Đã login
      await callAPI("/cart/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId, quantity: 1 }),
      });
    }

    // Chuyển thẳng đến trang thanh toán
    window.location.href = "/order/checkout";
  } catch (err) {
    console.error("Lỗi buyNow:", err);
    showToast("Có lỗi xảy ra, thử lại nhé!", "error");
  }
}

// Đồng bộ giỏ hàng từ Local lên DB sau khi login thành công
async function syncCartAfterLogin() {
  const localCart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];

  if (localCart.length > 0) {
    try {
      for (const item of localCart) {
        await callAPI("/cart/api/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
        });
      }

      localStorage.removeItem("pawmie_cart");
      console.log("Đã đồng bộ giỏ hàng local lên server!");

      // Cập nhật lại số lượng hiển thị
      await getCartCount();
    } catch (err) {
      console.error("Lỗi đồng bộ giỏ hàng:", err);
    }
  }
}
