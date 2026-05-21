// ==========================================
// 1. TRẠNG THÁI (STATE) & BIẾN TOÀN CỤC
// ==========================================
const state = {
  categoryId: null,
  keyword: null,
  sort: null,
  page: 1,
  limit: 10,
  pet_type: null,
  isSale: null,
};

let isReviewsLoaded = false; // Cờ để chỉ load 1 lần khi chuyển tab
let editingReviewId = null; // Lưu ID đánh giá đang được sửa

// ==========================================
// 2. KHỞI TẠO (KHI TRANG TẢI XONG)
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkAuth();

  if (!user) {
    console.log("Chưa login hoặc hết hạn");
  }
  console.log("User:", user);

  // Lấy điều kiện category/keyword/sort trên URL
  const urlParams = new URLSearchParams(window.location.search);
  state.categoryId = urlParams.get("categoryId") || null;
  state.keyword = urlParams.get("keyword") || null;
  state.sort = urlParams.get("sort") || null;
  state.pet_type = urlParams.get("pet_type") || null;
  state.isSale = urlParams.get("sale") || urlParams.get("isSale") || null;
  state.page = parseInt(urlParams.get("page")) || 1;

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.value = state.sort; // Đồng bộ giá trị từ URL lên giao diện

    sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      state.page = 1; // Đổi kiểu sắp xếp thì phải quay về trang 1

      // Cập nhật lại URL cho chuyên nghiệp (không reload trang)
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("sort", state.sort);
      newUrl.searchParams.set("page", 1);
      window.history.pushState({}, "", newUrl);

      getListProduct(); // Gọi hàm lấy data
    });
  }
  getListProduct();
});

// ==========================================
// 3. DANH SÁCH SẢN PHẨM & PHÂN TRANG
// ==========================================
function selectCategory(id) {
  state.categoryId = id;
  state.page = 1;
  getListProduct();
}

function selectKeyWord(keyWord) {
  state.keyword = keyWord;
  state.page = 1;
  getListProduct();
}

async function getListProduct() {
  const params = new URLSearchParams();

  if (state.categoryId) params.append("categoryId", state.categoryId);
  if (state.keyword) params.append("keyword", state.keyword);
  if (state.sort) params.append("sort", state.sort);
  if (state.pet_type) params.append("pet_type", state.pet_type);
  if (state.isSale) {
    // Nếu sale=1 hoặc sale=true trên URL thì gửi 'true' về Backend
    params.append("isSale", "true");
  }
  params.append("page", state.page);
  params.append("limit", state.limit);

  const url = "/user/product?" + params.toString();

  try {
    const res = await fetch(url);
    const result = await res.json();
    console.log("Sản phẩm lấy được:", result.products);

    renderProducts(result.products);
    renderPagination(result.totalPages);
  } catch (error) {
    console.error("Lỗi khi tải danh sách sản phẩm:", error);
  }
}

function renderProducts(products) {
  const container = document.getElementById("productContainer");
  if (!container) return;

  container.innerHTML = products
    .map((p) => {
      // Kiểm tra xem sản phẩm có đang được sale không
      const hasSale = p.percent && p.percent > 0;

      //Nếu có sale thì lấy giá sale, không thì lấy giá gốc
      const currentPrice = hasSale ? parseInt(p.sale_price) : parseInt(p.price);

      const oldPriceHtml = hasSale
        ? `<span class="product-price-old">${parseInt(p.price).toLocaleString("vi-VN")}₫</span>`
        : "";

      const badgeHtml = hasSale
        ? `<span class="product-badge sale">Sale ${p.percent}%</span>`
        : "";

      return `
      <div class="product-card">
        <div class="product-img-wrap">
          ${badgeHtml}
          <button class="product-wish" onclick="toggleWishlist(this, '${p.id}')" aria-label="Yêu thích">
            <i class="far fa-heart"></i>
          </button>
          <a href="/products/detail/${p.id}">
            <img 
              src="/${p.image || p.img}" 
              alt="${p.name}" 
              loading="lazy" 
              onerror="this.src='/uploads/default.jpg'; this.onerror=null;"
            >
          </a>
        </div>
        
        <div class="product-body">
          <a href="/products/detail/${p.id}" class="product-name">${p.name}</a>
          
          <div class="product-price-row">
            <span class="product-price">${currentPrice.toLocaleString("vi-VN")}₫</span>
            ${oldPriceHtml}
          </div>
          
          <button class="btn-add-cart" onclick="addToCart('${p.id}', this)">
            <i class="fas fa-shopping-bag"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
      `;
    })
    .join("");
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button 
        style="margin: 0 5px; padding: 6px 12px; border: 1px solid #ff6b81; border-radius: 4px; cursor: pointer; 
               ${i === state.page ? "background-color: #ff6b81; color: white; font-weight: bold;" : "background-color: white; color: #ff6b81;"}"
        onclick="changePage(${i})"
      >
        ${i}
      </button>
    `;
  }
  pagination.innerHTML = html;
}

function changePage(page) {
  state.page = page;
  getListProduct();
}

// ==========================================
// 4. CHI TIẾT SẢN PHẨM (TABS)
// ==========================================
function switchTab(tabName, btnElement) {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => tab.classList.remove("active"));
  btnElement.classList.add("active");

  const panels = document.querySelectorAll(".tab-panel");
  panels.forEach((panel) => (panel.style.display = "none"));

  const activePanel = document.getElementById("tab-" + tabName);
  if (activePanel) {
    activePanel.style.display = "block";
  }
}

// ==========================================
// 5. HỆ THỐNG ĐÁNH GIÁ (REVIEWS)
// ==========================================
async function loadReviews(productId) {
  if (!productId || isReviewsLoaded) return;

  const container = document.getElementById("review-list-container");
  container.innerHTML =
    '<div class="text-center my-4"><i class="fas fa-spinner fa-spin"></i> Đang tải đánh giá...</div>';

  try {
    const currentUser = await checkAuth();
    const response = await fetch(
      `/reviews/getReviews/product/${productId}?limit=5`,
    );

    if (!response.ok) throw new Error("Lỗi mạng hoặc server");
    const data = await response.json();

    if (data.success && data.reviews && data.reviews.length > 0) {
      let html = "";

      data.reviews.forEach((r) => {
        const isOwner = currentUser && currentUser.id === r.user_id;
        const isAdminOrStaff =
          currentUser &&
          (currentUser.role === "admin" ||
            currentUser.role === "staff" ||
            currentUser.role === 1);

        const safeComment = encodeURIComponent(r.comment || "");
        let actionButtons = "";

        if (isAdminOrStaff) {
          actionButtons = `
            <div class="review-actions mt-2">
              ${isOwner ? `<button class="btn btn-sm btn-outline-secondary me-2" onclick="editReview('${r.id}', ${r.rating}, '${safeComment}')"><i class="fas fa-edit"></i> Sửa</button>` : ""}
              <button class="btn btn-sm btn-outline-danger" onclick="deleteReview('${r.id}', '${productId}')"><i class="fas fa-trash"></i> Xóa</button>
            </div>
          `;
        }

        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
          starsHtml += i <= r.rating ? "★" : "☆";
        }

        const dateStr = r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("vi-VN")
          : "";
        const initial = r.userName ? r.userName.charAt(0).toUpperCase() : "U";
        const name = r.userName || "Khách hàng ẩn danh";

        html += `
          <div class="review-card" style="padding: 15px; border-bottom: 1px solid #eee; margin-bottom: 15px;">
            <div class="d-flex justify-content-between align-items-start">
              <div class="reviewer-info d-flex align-items-center mb-2">
                <div class="reviewer-avatar me-2" style="width: 40px; height: 40px; background-color: var(--bg2, #f3f4f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary, #ff6b81);">
                  ${initial}
                </div>
                <div>
                  <div class="reviewer-name fw-bold">
                    ${name} 
                    ${isOwner ? '<span class="badge bg-secondary ms-1" style="font-size:0.6rem">Bạn</span>' : ""}
                  </div>
                  <div class="reviewer-date text-muted" style="font-size: 0.85rem;">${dateStr}</div>
                </div>
              </div>
              ${actionButtons}
            </div>
            <div class="review-stars text-warning mb-2" style="font-size: 1.1rem;">${starsHtml}</div>
            <p class="review-text mb-0">${r.comment || ""}</p>
          </div>
        `;
      });

      container.innerHTML = html;
      isReviewsLoaded = true;
    } else {
      container.innerHTML =
        '<div class="text-center my-4 text-muted">Chưa có đánh giá nào cho sản phẩm này.</div>';
    }
  } catch (error) {
    console.error("Lỗi khi fetch đánh giá:", error);
    container.innerHTML =
      '<div class="text-center my-4 text-danger">Có lỗi xảy ra khi tải đánh giá. Vui lòng thử lại sau.</div>';
  }
}

// Xử lý chọn số sao
const ratingTexts = [
  "Tệ",
  "Không hài lòng",
  "Bình thường",
  "Hài lòng",
  "Tuyệt vời",
];

function setRating(rating) {
  document.getElementById("ratingValue").value = rating;
  document.getElementById("ratingText").innerText = ratingTexts[rating - 1];

  const stars = document.querySelectorAll("#starInput .fa-star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("text-warning");
      star.classList.remove("text-muted", "text-secondary");
    } else {
      star.classList.remove("text-warning");
      star.classList.add("text-muted");
    }
  });
}

// Gửi đánh giá (Thêm mới hoặc Cập nhật)
async function submitReview(event, productId) {
  event.preventDefault();

  const user = await checkAuth();
  if (!user) {
    alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
    return;
  }

  const comment = document.getElementById("reviewComment").value.trim();
  const rating = document.getElementById("ratingValue").value;
  const btnSubmit = document.getElementById("btnSubmitReview");

  if (!comment) {
    alert("Thiếu nội dung đánh giá!");
    return;
  }

  const originalText = btnSubmit.innerHTML;
  btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
  btnSubmit.disabled = true;

  try {
    const isEditing = editingReviewId !== null;
    const apiUrl = isEditing
      ? `/reviews/update/${editingReviewId}`
      : "/reviews/add";
    const apiMethod = isEditing ? "PUT" : "POST";

    const response = await callAPI(apiUrl, {
      method: apiMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: productId,
        rating: parseInt(rating),
        comment: comment,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Đánh giá của bạn đã được ghi nhận! 🐾");

      document.getElementById("reviewComment").value = "";
      setRating(5);
      editingReviewId = null;

      // Reset style nút nếu vừa ở chế độ sửa
      btnSubmit.innerHTML =
        '<i class="fas fa-paper-plane me-1"></i> Gửi đánh giá';
      btnSubmit.classList.replace("btn-success", "btn-primary");

      isReviewsLoaded = false;
      loadReviews(productId);
    } else {
      alert(data.message || "Có lỗi xảy ra, thử lại sau nhé.");
    }
  } catch (error) {
    console.error("Lỗi submit review:", error);
    alert("Lỗi kết nối, không thể gửi đánh giá!");
  } finally {
    if (!editingReviewId) {
      btnSubmit.innerHTML = originalText;
    }
    btnSubmit.disabled = false;
  }
}

// Xóa đánh giá
async function deleteReview(reviewId, productId) {
  if (
    !confirm(
      "Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.",
    )
  ) {
    return;
  }

  try {
    const response = await callAPI(`/reviews/delete/${reviewId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Đã xóa đánh giá thành công!");
      isReviewsLoaded = false;
      loadReviews(productId);
    } else {
      alert(data.message || "Không thể xóa đánh giá này.");
    }
  } catch (error) {
    console.error("Lỗi xóa đánh giá:", error);
    alert("Lỗi kết nối server!");
  }
}

// Đưa dữ liệu lên form để sửa đánh giá
function editReview(reviewId, currentRating, encodedComment) {
  editingReviewId = reviewId;

  setRating(currentRating);
  document.getElementById("reviewComment").value =
    decodeURIComponent(encodedComment);

  const btnSubmit = document.getElementById("btnSubmitReview");
  btnSubmit.innerHTML = '<i class="fas fa-save me-1"></i> Cập nhật đánh giá';
  btnSubmit.classList.replace("btn-primary", "btn-success");

  document
    .getElementById("reviewForm")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}
