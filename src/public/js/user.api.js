// ✅ FIX: "async ()" thay vì "(async)" — lỗi cú pháp cũ khiến callback không phải async
document.addEventListener("DOMContentLoaded", async () => {
  loadCartData();
});

async function loadCartData() {
  const container = document.getElementById("cartItemsContainer");

  // Hiện loading spinner trong khi chờ dữ liệu
  container.innerHTML = `
    <div class="text-center py-5">
      <i class="fas fa-spinner fa-spin fa-2x" style="color: #E85D28;"></i>
      <p class="mt-3" style="color: #888;">Đang tải giỏ hàng...</p>
    </div>`;

  try {
    const user = await checkAuth();
    let items = [];

    if (!user) {
      // Chưa đăng nhập: lấy giỏ từ localStorage
      const localCart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];

      if (localCart.length > 0) {
        const res = await fetch("/cart/api/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: localCart }),
        });

        if (res.ok) {
          items = await res.json();
        }
      }
    } else {
      // Đã đăng nhập: lấy từ database
      const res = await callAPI("/user/api/cart");
      if (!res.ok) throw new Error("Không lấy được giỏ hàng");
      items = await res.json();
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x mb-3" style="color: #ddd;"></i>
          <p style="color: #888; font-weight: 600;">Giỏ hàng trống!</p>
          <a href="/products" class="btn-primary-custom" style="display:inline-flex;margin-top:12px;">
            <i class="fas fa-shopping-bag me-2"></i> Đến xem sản phẩm
          </a>
        </div>`;
      updateSummary(0);
      return;
    }

    // Render danh sách sản phẩm
    let html = items
      .map((item) => {
        const hasSale = item.percent && item.percent > 0;
        const currentPrice = hasSale
          ? parseInt(item.sale_price)
          : parseInt(item.price);

        item.currentPrice = currentPrice;

        return `
      <div class="cart-item-card" data-id="${item.id}">
        <img
          src="/${item.img || "uploads/default.jpg"}"
          alt="${item.name}"
          class="cart-item-img"
          onerror="this.src='/uploads/default.jpg'"
        >
        <div class="cart-item-info">
          <div class="cart-item-category">Sản phẩm</div>
          <a href="/products/detail/${item.id}" class="cart-item-name">${item.name}</a>
          <div class="cart-item-price">${currentPrice.toLocaleString("vi-VN")}₫</div>
        </div>
        <div style="display: flex; align-items: center;">
          <div class="qty-group">
            <button class="qty-btn" onclick="changeQtyUI('${item.id}', -1)">
              <i class="fas fa-minus"></i>
            </button>
            <input
              type="text"
              class="qty-input"
              id="qty-${item.id}"
              value="${item.quantity}"
              data-original="${item.quantity}"
              data-stock="${item.stock || 999}" readonly
            >
            <button class="qty-btn" onclick="changeQtyUI('${item.id}', 1)">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <button
            class="btn-confirm-qty"
            id="confirm-${item.id}"
            onclick="saveQuantity('${item.id}')"
            title="Lưu số lượng"
          >
            <i class="fas fa-check"></i>
          </button>
        </div>
        <button class="btn-remove" onclick="removeFromCart('${item.id}')" title="Xóa sản phẩm">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
      })
      .join("");

    html += `
      <div class="mt-4">
        <a href="/products" style="text-decoration: none; color: #555; font-weight: 600;">
          <i class="fas fa-arrow-left me-2"></i> Tiếp tục mua sắm
        </a>
      </div>`;

    container.innerHTML = html;
    updateSummary(items);
  } catch (error) {
    console.error("Lỗi:", error);
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-exclamation-triangle fa-2x mb-3" style="color: #dc3545;"></i>
        <p style="color: #888;">Đã có lỗi xảy ra khi tải giỏ hàng. Vui lòng thử lại.</p>
      </div>`;
  }
}

function updateSummary(items) {
  const subtotal =
    items === 0
      ? 0
      : items.reduce((sum, item) => {
          const priceToCalc = item.currentPrice || item.price;
          return sum + priceToCalc * item.quantity;
        }, 0);
  const count =
    items === 0 ? 0 : items.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelector(".summary-row span:first-child").innerText =
    `Tạm tính (${count} sản phẩm)`;
  document.querySelector(".summary-row span:last-child").innerText =
    subtotal.toLocaleString("vi-VN") + "₫";
  document.querySelector(".total-price").innerText =
    subtotal.toLocaleString("vi-VN") + "₫";

  const checkoutBtn = document.querySelector(".btn-checkout");
  if (checkoutBtn) {
    if (items === 0 || items.length === 0) {
      // Vô hiệu hóa nút khi giỏ hàng trống
      checkoutBtn.disabled = true;
      checkoutBtn.style.background = "#ccc"; // Đổi màu xám
      checkoutBtn.style.cursor = "not-allowed"; // Đổi icon chuột thành dấu cấm
      checkoutBtn.style.boxShadow = "none";
      checkoutBtn.style.transform = "none";

      checkoutBtn.onclick = (e) => {
        e.preventDefault();
        return false;
      };
    } else {
      // Mở lại nút khi có hàng
      checkoutBtn.disabled = false;
      checkoutBtn.style.background = "#E85D28";
      checkoutBtn.style.cursor = "pointer";

      // Trả lại sự kiện chuyển trang
      checkoutBtn.onclick = () => (location.href = "/order/checkout");
    }
  }
}

// Nút tăng/giảm số lượng (chỉ thay đổi UI, chưa lưu)
function changeQtyUI(productId, delta) {
  const input = document.getElementById(`qty-${productId}`);
  const confirmBtn = document.getElementById(`confirm-${productId}`);

  let newQty = parseInt(input.value) + delta;
  const maxStock = parseInt(input.getAttribute("data-stock")) || 999;
  if (newQty < 1) return;
  if (newQty > maxStock) {
    if (typeof showToast === "function") {
      showToast(`Chỉ còn ${maxStock} sản phẩm còn hàng!`, "warning");
    } else {
      alert(`Chỉ còn ${maxStock} sản phẩm còn hàng!`);
    }
    return; // Dừng ngay ở đây, không cho gán newQty vào input nữa
  }

  input.value = newQty;

  const originalQty = parseInt(input.getAttribute("data-original"));
  if (newQty !== originalQty) {
    confirmBtn.style.display = "flex";
  } else {
    confirmBtn.style.display = "none";
  }
}

// Lưu số lượng mới lên server hoặc localStorage
async function saveQuantity(productId) {
  const input = document.getElementById(`qty-${productId}`);
  const newQty = parseInt(input.value);
  const confirmBtn = document.getElementById(`confirm-${productId}`);

  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  try {
    const user = await checkAuth();

    if (!user) {
      // Lưu trong localStorage
      let cart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];
      const item = cart.find((i) => i.id == productId);
      if (item) {
        item.quantity = newQty;
        localStorage.setItem("pawmie_cart", JSON.stringify(cart));
      }
    } else {
      // Lưu lên database
      const res = await callAPI("/cart/api/update-qty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId, quantity: newQty }),
      });

      if (!res.ok) throw new Error("Lỗi cập nhật Database");
    }

    input.setAttribute("data-original", newQty);
    confirmBtn.style.display = "none";
    confirmBtn.innerHTML = '<i class="fas fa-check"></i>';

    // Tính lại tổng tiền
    loadCartData();
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    showToast("Không lưu được số lượng, thử lại!", "error");
    confirmBtn.innerHTML = '<i class="fas fa-check"></i>';
  }
}

// Xóa sản phẩm khỏi giỏ hàng
async function removeFromCart(productId) {
  if (!confirm("Quý khách chắc chắn muốn xóa món này khỏi giỏ hàng chứ? 🐾")) {
    return;
  }

  try {
    const user = await checkAuth();

    if (!user) {
      let cart = JSON.parse(localStorage.getItem("pawmie_cart")) || [];
      cart = cart.filter((item) => item.id != productId);
      localStorage.setItem("pawmie_cart", JSON.stringify(cart));
    } else {
      const res = await callAPI("/cart/api/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId }),
      });

      if (!res.ok) throw new Error("Lỗi xóa trên Database");
    }

    showToast("Đã xóa sản phẩm khỏi giỏ 🗑️", "info");
    loadCartData();

    if (typeof getCartCount === "function") {
      getCartCount();
    }
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
    showToast("Xóa thất bại, thử lại nhé!", "error");
  }
}
