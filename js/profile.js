const recentMoviesContainer = document.getElementById("recent-movies");
const currentUsernameElement = document.getElementById("current-username");
const recentCountElement = document.getElementById("recent-count");

// ==========================================
// LẤY USER HIỆN TẠI
// ==========================================
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// ==========================================
// HIỂN THỊ USERNAME
// ==========================================
function loadUsername() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "../index.html";
    return;
  }

  if (currentUsernameElement) {
    currentUsernameElement.textContent = currentUser.username;
  }
}

// ==========================================
// HIỂN THỊ PHIM ĐÃ XEM
// ==========================================
function loadRecentMovies() {
  const recentMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];

  if (recentCountElement) {
    recentCountElement.textContent = `${recentMovies.length} phim`;
  }

  if (!recentMoviesContainer) return;

  if (recentMovies.length === 0) {
    recentMoviesContainer.innerHTML = `
      <p class="empty-message">
        Bạn chưa xem bộ phim nào.
      </p>
    `;
    return;
  }

  recentMoviesContainer.replaceChildren(
    ...recentMovies.map((movie) => {
      const card = document.createElement("article");
      card.className = "movie-card";

      card.innerHTML = `
        <img
          class="movie-poster"
          src="${movie.poster}"
          alt="${movie.title}"
        >
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = movie.url;
      });

      return card;
    })
  );
}

// ==========================================
// ĐỔI TÊN ĐĂNG NHẬP
// ==========================================
function changeUsername() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const newUsername = prompt("Nhập tên đăng nhập mới:");
  if (!newUsername) return;

  const username = newUsername.trim();

  // Kiểm tra độ dài
  if (username.length < 3) {
    alert("Tên đăng nhập phải có ít nhất 3 ký tự.");
    return;
  }

  // Không cho đổi thành tên hiện tại
  if (username.toLowerCase() === currentUser.username.toLowerCase()) {
    alert("Đây đang là tên hiện tại của bạn.");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  // Kiểm tra tên đã tồn tại ở tài khoản khác (không phân biệt hoa thường)
  const isExist = accounts.some(
    (account) => account.username.toLowerCase() === username.toLowerCase()
  );

  if (isExist) {
    alert("Tên đăng nhập này đã được sử dụng bởi tài khoản khác.");
    return;
  }

  // Tìm tài khoản hiện tại
  const account = accounts.find(
    (acc) => acc.username === currentUser.username
  );

  if (!account) {
    alert("Không tìm thấy tài khoản.");
    return;
  }

  // Cập nhật tên
  account.username = username;

  // Lưu lại danh sách tài khoản
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Cập nhật user đang đăng nhập
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ username: username })
  );

  loadUsername();
  alert("Đổi tên đăng nhập thành công!");
}

// ==========================================
// ĐỔI MẬT KHẨU
// ==========================================
function changePassword() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const oldPassword = prompt("Nhập mật khẩu hiện tại:");
  if (oldPassword === null) return;

  const newPassword = prompt("Nhập mật khẩu mới:");
  if (newPassword === null) return;

  if (newPassword.length < 6) {
    alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  const account = accounts.find(
    (acc) => acc.username === currentUser.username
  );

  if (!account) {
    alert("Không tìm thấy tài khoản.");
    return;
  }

  // Kiểm tra mật khẩu cũ
  if (account.password !== oldPassword) {
    alert("Mật khẩu hiện tại không đúng.");
    return;
  }

  // Đổi mật khẩu
  account.password = newPassword;
  localStorage.setItem("accounts", JSON.stringify(accounts));

  alert("Đổi mật khẩu thành công!");
}

// ==========================================
// XÓA LỊCH SỬ XEM
// ==========================================
function clearHistory() {
  const recentMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];

  if (recentMovies.length === 0) {
    alert("Lịch sử xem đang trống.");
    return;
  }

  const confirmDelete = confirm("Bạn có chắc muốn xóa toàn bộ lịch sử xem?");
  if (!confirmDelete) return;

  localStorage.removeItem("recentMovies");
  loadRecentMovies();
  alert("Đã xóa lịch sử xem.");
}

// ==========================================
// ĐĂNG XUẤT
// ==========================================
function logout() {
  const confirmLogout = confirm("Bạn có chắc muốn đăng xuất?");
  if (!confirmLogout) return;

  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
}

// ==========================================
// GẮN SỰ KIỆN
// ==========================================
document
  .getElementById("change-username-btn")
  ?.addEventListener("click", changeUsername);

document
  .getElementById("change-password-btn")
  ?.addEventListener("click", changePassword);

document
  .getElementById("clear-history-btn")
  ?.addEventListener("click", clearHistory);

document
  .getElementById("logout-btn")
  ?.addEventListener("click", logout);

// ==========================================
// KHỞI CHẠY
// ==========================================
loadUsername();
loadRecentMovies();


// ==========================================
// NÚT XEM LỊCH SỬ
// ==========================================
document
  .getElementById("recent-movies-btn")
  ?.addEventListener("click", () => {
    if (!recentMoviesContainer) return;

    // Bật/tắt danh sách
    if (recentMoviesContainer.style.display === "none" || recentMoviesContainer.style.display === "") {
      recentMoviesContainer.style.display = "grid";
      loadRecentMovies(); // load lại cho chắc
    } else {
      recentMoviesContainer.style.display = "none";
    }
  });