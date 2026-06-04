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
// Validate từ Store — dữ liệu thật, persist qua localStorage
// TODO: Thay bằng fetch POST /api/auth/login khi có backend
// ==========================================
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    hideError();
    if (!username) return showError('Vui lòng nhập tên đăng nhập hoặc email.');
    if (!password) return showError('Vui lòng nhập mật khẩu.');

    loginBtn.textContent = 'Đang đăng nhập...';
    loginBtn.disabled = true;

    setTimeout(() => {
        loginBtn.innerHTML = '<i class="bx bx-log-in-circle"></i> Đăng Nhập';
        loginBtn.disabled = false;

        const found = Store.getUserByLogin(username);

        if (!found || found.matKhau !== password)
            return showError('Sai tên đăng nhập hoặc mật khẩu.');

        if (found.trangThai === 'LOCKED')
            return showError('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.');

        if (found.trangThai === 'SUSPENDED')
            return showError('Tài khoản đã bị đình chỉ.');

        // Lưu session — không lưu mật khẩu
        const { matKhau, ...userToStore } = found;
        localStorage.setItem('escrow_token', 'token-' + found.id + '-' + Date.now());
        localStorage.setItem('escrow_user', JSON.stringify(userToStore));

        window.location.href = '../index.html';
    }, 600);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') loginBtn.click();
});
