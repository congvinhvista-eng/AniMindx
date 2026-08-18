const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const account = accounts.find(
    (item) => item.username === username && item.password === password,
  );

  if (!account) {
    alert("Tên đăng nhập hoặc mật khẩu không chính xác.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify({ username: account.username }));
  alert(`Đăng nhập thành công. Chào mừng ${account.username}!`);
  loginForm.reset();
  window.location.href = "../main.html";
});


const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const userElement = document.querySelector(".user-name");

if (currentUser && userElement) {
    userElement.textContent = currentUser.username;
}
