// 1. Lấy các phần tử (elements) từ giao diện để thao tác
    const registerForm = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // 2. Lắng nghe sự kiện "submit" khi người dùng nhấn nút Đăng ký
    registerForm.addEventListener('submit', function (e) {
        // Ngăn chặn trình duyệt load lại trang (hành động mặc định của form)
        e.preventDefault();

        // 3. Thu thập giá trị người dùng nhập vào và xóa khoảng trắng thừa (trim)
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // --- BƯỚC VALIDATE (KIỂM TRA DỮ LIỆU) ---
        
        // Kiểm tra xem có ô nào bị bỏ trống không
        if (username === "" || password === "") {
            alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return; // Dừng hàm lại, không chạy tiếp các bước bên dưới
        }

        // Kiểm tra độ dài mật khẩu (ví dụ: tối thiểu 6 ký tự)
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        // --- BƯỚC XỬ LÝ LOCALSTORAGE ---

        // Lấy danh sách tài khoản đã có từ localStorage (nếu chưa có thì tạo mảng rỗng [])
        // Dữ liệu trong localStorage là chuỗi (string), nên cần dùng JSON.parse để chuyển về mảng (array)
        const listAccounts = JSON.parse(localStorage.getItem('accounts')) || [];

        // Kiểm tra xem username đã tồn tại trong mảng chưa (tính duy nhất)
        const isUserExist = listAccounts.some(account => account.username === username);

        if (isUserExist) {
            alert("Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác!");
        } else {
            // Nếu chưa tồn tại, tạo đối tượng người dùng mới
            const newUser = {
                username: username,
                password: password
            };

            // Thêm người dùng mới vào danh sách
            listAccounts.push(newUser);

            // Lưu mảng mới ngược lại vào localStorage (phải dùng JSON.stringify để chuyển về chuỗi)
            localStorage.setItem('accounts', JSON.stringify(listAccounts));

            // Thông báo thành công
            alert("Đăng ký tài khoản thành công!");

            // --- BƯỚC SAU KHI THÀNH CÔNG ---
            
            // 1. Xóa sạch dữ liệu trên form
            registerForm.reset();

            // 2. Chuyển hướng sang trang đăng nhập (Thay 'login.html' bằng file thực tế của bạn)
            // Lưu ý: Nếu bạn chưa có file login.html, trình duyệt sẽ báo lỗi 404
            window.location.href = 'login.html';
        }
    });