// ==========================================
// TOGGLE PASSWORD
// ==========================================
const togglePw = document.getElementById('togglePw');
const passwordInput = document.getElementById('password');

togglePw.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePw.className = isHidden ? 'bx bx-show toggle-pw' : 'bx bx-hide toggle-pw';
});

// ==========================================
// HELPERS
// ==========================================
const errorBox = document.getElementById('errorBox');
const errorMsg = document.getElementById('errorMsg');

function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.classList.add('show');
}

function hideError() {
    errorBox.classList.remove('show');
}

// ==========================================
// LOGIN HANDLER
// (Sau này thay bằng fetch POST /api/auth/login)
// ==========================================
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    hideError();

    if (!username) return showError('Vui lòng nhập tên đăng nhập hoặc email.');
    if (!password) return showError('Vui lòng nhập mật khẩu.');

    // TODO: Thay đoạn này bằng API call thực
    // try {
    //     loginBtn.disabled = true;
    //     loginBtn.textContent = 'Đang đăng nhập...';
    //     const res = await fetch('/api/auth/login', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ tenDangNhap: username, matKhau: password })
    //     });
    //     const data = await res.json();
    //     if (!res.ok) return showError(data.message || 'Đăng nhập thất bại.');
    //     localStorage.setItem('token', data.token);
    //     window.location.href = '/html/pages/dashboard.html';
    // } catch (err) {
    //     showError('Lỗi kết nối. Vui lòng thử lại.');
    // } finally {
    //     loginBtn.disabled = false;
    //     loginBtn.innerHTML = '<i class="bx bx-log-in-circle"></i> Đăng Nhập';
    // }

    // DEMO: giả lập đăng nhập
    loginBtn.textContent = 'Đang đăng nhập...';
    loginBtn.disabled = true;
    setTimeout(() => {
        loginBtn.innerHTML = '<i class="bx bx-log-in-circle"></i> Đăng Nhập';
        loginBtn.disabled = false;
        showError('Chức năng chưa kết nối backend. (Demo)');
    }, 1200);
});

// Enter để submit
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});
