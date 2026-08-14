document.addEventListener("DOMContentLoaded", () => {
  const accountName = document.getElementById("accountName");

  if (accountName) {
    const currentUser = localStorage.getItem("softrollCurrentUser");
    accountName.textContent = currentUser || "Sign in";
    accountName.href = currentUser ? "#account" : "dangnhap.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const signupButton = document.getElementById("signupBtn");

  if (!signupButton) return;

  signupButton.addEventListener("click", () => {
    window.location.href = "dangky.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginBtn");

  if (!loginButton) return;

  loginButton.addEventListener("click", () => {
    window.location.href = "dangnhap.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const ss2 = document.getElementById("ss2");
  if (!ss2) return;

  ss2.addEventListener("click", () => {
    window.location.href = "tqq/ss2-tqq.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const movie = document.getElementById("movie");
  if (!movie) return;

  movie.addEventListener("click", () => {
    window.location.href = "tqq/movie-tqq.html";
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const ss1 = document.getElementById("ss1");
  if (!ss1) return;

  ss1.addEventListener("click", () => {
    window.location.href = "watch-tqq.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const special = document.getElementById("special");
  if (!special) return;

  special.addEventListener("click", () => {
    window.location.href = "tqq/spc-tqq.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const special2 = document.getElementById("special2");
  if (!special2) return;

  special2.addEventListener("click", () => {
    window.location.href = "tqq/spc2-tqq.html";
  });
});