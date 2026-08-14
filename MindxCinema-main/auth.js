document.addEventListener("DOMContentLoaded", function () {
  const registerButton = document.getElementById("registerButton");
  const loginButton = document.getElementById("loginButton");
  const registerRemember = document.getElementById("registerRemember");
  const rememberMe = document.getElementById("rememberMe");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  function loadAccount() {
    const stored = localStorage.getItem("softrollAccount");
    return stored ? JSON.parse(stored) : null;
  }

  function saveAccount(account) {
    localStorage.setItem("softrollAccount", JSON.stringify(account));
  }

  function loadRemembered() {
    const stored = localStorage.getItem("softrollRemember");
    return stored ? JSON.parse(stored) : null;
  }

  function saveRemembered(account) {
    if (account) {
      localStorage.setItem("softrollRemember", JSON.stringify(account));
    } else {
      localStorage.removeItem("softrollRemember");
    }
  }

  if (registerButton) {
    registerButton.addEventListener("click", function () {
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      if (!username || !password) {
        alert("Please enter username and password.");
        return;
      }

      saveAccount({ username, password });
      if (registerRemember && registerRemember.checked) {
        saveRemembered({ username, password });
      }

      alert("Registration successful. Please go to the Log In page.");
      window.location.href = "dangnhap.html";
    });
  }

  if (loginButton) {
    const remembered = loadRemembered();
    if (remembered) {
      usernameInput.value = remembered.username || "";
      passwordInput.value = remembered.password || "";
      if (rememberMe) {
        rememberMe.checked = true;
      }
    }

    loginButton.addEventListener("click", function () {
      const account = loadAccount();
      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (!account) {
        alert("No account found. Please sign up first.");
        return;
      }

      if (account.username !== username || account.password !== password) {
        alert("Username or password is incorrect.");
        return;
      }

      if (rememberMe && rememberMe.checked) {
        saveRemembered({ username, password });
      } else {
        saveRemembered(null);
      }

      alert("Login successful!");
      localStorage.setItem("softrollCurrentUser", username);
      // Redirect to home or another page after login.
      window.location.href = "index.html";
    });
  }
});
