document.addEventListener("DOMContentLoaded", async () => {
  const user = await checkAuth();

  if (!user) {
    console.log("Khách vãng lai chưa login");
  } else {
    console.log("User:", user);
  }

  loadCategories();
  setUpDropdownEvent();

  // Bắt sự kiện Gõ Enter tìm kiếm
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });

    // Bắt sự kiện tự động gọi debounce khi gõ phím
    searchInput.addEventListener(
      "input",
      debounce(async (e) => {
        const keyword = e.target.value.trim();
        const resultBox = document.getElementById("searchResult");

        if (!keyword) {
          resultBox.style.display = "none";
          resultBox.innerHTML = "";
          return;
        }

        const products = await searchProducts(keyword);
        renderSearchResult(products);
      }, 300),
    );
  }


  //hàm lấy số lượng giỏ hàng
  getCartCount();
});

let allCategories = [];
let isCategoryExpanded = false;

async function loadCategories() {
  const res = await fetch("/user/getCategories");
  allCategories = await res.json(); //lấy dữ liệu loại sp từ db

  console.log("Danh mục từ API:", allCategories);

  // Render menu dropdown
  const menu = document.getElementById("categoryMenu");
  if (menu) {
    menu.innerHTML = allCategories
      .map(
        (c) => `
      <li>
        <a class="dropdown-item" href="#" onclick="handleCategoryClick('${c.id}'); return false;" style="font-weight: 600; padding: 8px 20px;">
          ${c.name}
        </a>
      </li>
    `,
      )
      .join("");
  }

  renderCategoryGrid();
}

function renderCategoryGrid() {
  const grid = document.getElementById("categoryGrid");
  if (!grid) return;

  //quyết định hiển thị bao nhiêu danh mục, nếu < 4 hoặc trạng thái mở rộng có thì hiển thị hết
  if (allCategories.length <= 4 || isCategoryExpanded) {
    let html = allCategories
      //render
      .map(
        (c) => `
      <a href="#" onclick="handleCategoryClick('${c.id}'); return false;" class="category-card">
        <span class="category-icon">🐾</span>
        <div class="category-name">${c.name}</div>
        <div class="category-count">Xem sản phẩm</div>
      </a>
    `,
      )
      .join("");

    //render nút xem thêm nếu có hơn 4 loại sp
    if (allCategories.length > 4) {
      html += `
        <a href="#" onclick="toggleCategoryGrid(); return false;" class="category-card" style="background-color: #f8f9fa;">
          <span class="category-icon">⬆️</span>
          <div class="category-name">Thu gọn</div>
          <div class="category-count">Ẩn bớt đi</div>
        </a>
      `;
    }
    grid.innerHTML = html;
  } else {
    const firstFour = allCategories.slice(0, 4);
    let html = firstFour
      .map(
        (c) => `
      <a href="#" onclick="handleCategoryClick('${c.id}'); return false;" class="category-card">
        <span class="category-icon">🐾</span>
        <div class="category-name">${c.name}</div>
        <div class="category-count">Xem sản phẩm</div>
      </a>
    `,
      )
      .join("");

    html += `
      <a href="#" onclick="toggleCategoryGrid(); return false;" class="category-card" style="background-color: #f9fafb; border: 1px dashed #ccc;">
        <span class="category-icon">💬</span>
        <div class="category-name">Xem thêm...</div>
        <div class="category-count">Còn nữa nè</div>
      </a>
    `;
    grid.innerHTML = html;
  }
}

function toggleCategoryGrid() {
  isCategoryExpanded = !isCategoryExpanded;//đảo trạng thái thu nhỏ->mở rộng và ngc lại
  renderCategoryGrid();
}

function handleCategoryClick(categoryId) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("categoryId", categoryId);
  urlParams.set("page", 1);
  window.location.href = `/user/products?${urlParams.toString()}`;
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

async function searchProducts(keyword) {
  const res = await fetch(`/user/search?keyword=${keyword}&limit=5`);
  const data = await res.json();
  return data.products;
}

function renderSearchResult(products) {
  const box = document.getElementById("searchResult");
  if (!box) return;

  if (!products || !products.length) {
    box.style.display = "none";
    box.innerHTML = "";
    return;
  }

  box.style.display = "block";
  box.innerHTML = products
    .map(
      (p) => `
    <div class="search-item" onclick="goToProduct('${p.id}')" onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='transparent'" style="display: flex; align-items: center; gap: 12px; padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #f1f1f1; transition: background 0.2s;">
      <img src="/${p.img}" alt="${p.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; flex-shrink: 0; border: 1px solid #eee;" />
      <span style="font-size: 0.9rem; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</span>
    </div>
  `,
    )
    .join("");
}

function toggleSearch(e) {
  e.preventDefault();
  const input = document.getElementById("searchInput");

  if (!input) return;

  if (input.style.width === "0px" || input.style.width === "") {
    // Mở thanh search ra
    input.style.visibility = "visible";
    input.style.width = "220px";
    input.style.opacity = "1";
    input.style.padding = "0 15px";
    input.focus();
  } else {
    // Đang mở -> Có chữ thì search, không chữ thì đóng
    if (input.value.trim() !== "") {
      handleSearch();
    } else {
      input.style.width = "0px";
      input.style.opacity = "0";
      input.style.padding = "0";
      setTimeout(() => (input.style.visibility = "hidden"), 300);
    }
  }
}

function handleSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  const keyword = input.value;
  const urlParams = new URLSearchParams(window.location.search);

  urlParams.set("keyword", keyword);
  urlParams.set("page", 1);

  window.location.href = `/user/products?${urlParams.toString()}`;
}

function goToProduct(id) {
  window.location.href = `/products/detail/${id}`;
}

document.addEventListener("click", (e) => {
  const menu = document.getElementById("categoryMenu");
  if (menu && !e.target.closest(".dropdown")) {
    menu.classList.remove("show");
  }

  // Tự động đóng khung kết quả tìm kiếm nếu click ra chỗ khác
  const searchBox = document.getElementById("searchResult");
  if (searchBox && !e.target.closest(".nav-actions")) {
    searchBox.style.display = "none";
  }
});

// Đảm bảo dropdown và scroll chạy mượt
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
});

async function setUpDropdownEvent() {
  const productDropdown = document.getElementById("productDropdown");
  const categoriesMenu = document.getElementById("categoryMenu");

  if (productDropdown && categoriesMenu) {
    productDropdown.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.innerWidth < 992) {
        categoriesMenu.style.display =
          categoriesMenu.style.display === "block" ? "none" : "block";
      }
    });
  }
}
