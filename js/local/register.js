// ==========================================
// TOGGLE PASSWORD
// ==========================================
function setupToggle(btnId, inputId) {
    document.getElementById(btnId).addEventListener('click', function () {
        const input = document.getElementById(inputId);
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        this.className = isHidden ? 'bx bx-show toggle-pw' : 'bx bx-hide toggle-pw';
    });
}

setupToggle('togglePw1', 'matKhau');
setupToggle('togglePw2', 'xacNhanMatKhau');

// ==========================================
// PASSWORD STRENGTH
// ==========================================
document.getElementById('matKhau').addEventListener('input', function () {
    const pw = this.value;
    const fill = document.getElementById('pwFill');
    const text = document.getElementById('pwText');

    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
        { pct: '0%',   color: '#e2e8f0', label: '' },
        { pct: '25%',  color: '#ef4444', label: 'Yếu' },
        { pct: '50%',  color: '#f59e0b', label: 'Trung bình' },
        { pct: '75%',  color: '#0ea5e9', label: 'Khá mạnh' },
        { pct: '100%', color: '#0a9422', label: 'Mạnh' },
    ];

    const lvl = pw.length === 0 ? levels[0] : levels[score];
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    text.textContent = lvl.label;
    text.style.color = lvl.color;
});

// ==========================================
// VALIDATION HELPERS
// ==========================================
function showFieldError(id, msg) {
    const el = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
    if (input) input.classList.add('error');
}

function clearFieldError(id) {
    const el = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('show'); }
    if (input) input.classList.remove('error');
}

function showError(msg) {
    document.getElementById('errorMsg').textContent = msg;
    document.getElementById('errorBox').classList.add('show');
}

function hideError() {
    document.getElementById('errorBox').classList.remove('show');
}

// Xóa lỗi khi user bắt đầu gõ
['hoTen', 'tenDangNhap', 'email', 'soDienThoai', 'matKhau', 'xacNhanMatKhau'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearFieldError(id));
});

// ==========================================
// REGISTER HANDLER
// (Sau này thay bằng fetch POST /api/auth/register)
// ==========================================
document.getElementById('registerBtn').addEventListener('click', async () => {
    hideError();

    const hoTen       = document.getElementById('hoTen').value.trim();
    const tenDangNhap = document.getElementById('tenDangNhap').value.trim();
    const email       = document.getElementById('email').value.trim();
    const soDienThoai = document.getElementById('soDienThoai').value.trim();
    const matKhau     = document.getElementById('matKhau').value;
    const xacNhanMK   = document.getElementById('xacNhanMatKhau').value;
    const agreeTerms  = document.getElementById('agreeTerms').checked;

    let hasError = false;

    if (!hoTen) {
        showFieldError('hoTen', 'Vui lòng nhập họ tên.'); hasError = true;
    }

    if (!tenDangNhap) {
        showFieldError('tenDangNhap', 'Vui lòng nhập tên đăng nhập.'); hasError = true;
    } else if (!/^[a-zA-Z0-9_]{4,50}$/.test(tenDangNhap)) {
        showFieldError('tenDangNhap', 'Tối thiểu 4 ký tự, chỉ gồm chữ, số, dấu gạch dưới.'); hasError = true;
    }

    if (!email) {
        showFieldError('email', 'Vui lòng nhập email.'); hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Email không hợp lệ.'); hasError = true;
    }

    if (!soDienThoai) {
        showFieldError('soDienThoai', 'Vui lòng nhập số điện thoại.'); hasError = true;
    } else if (!/^(0|\+84)[3-9]\d{8}$/.test(soDienThoai)) {
        showFieldError('soDienThoai', 'Số điện thoại Việt Nam không hợp lệ.'); hasError = true;
    }

    if (!matKhau) {
        showFieldError('matKhau', 'Vui lòng nhập mật khẩu.'); hasError = true;
    } else if (matKhau.length < 8) {
        showFieldError('matKhau', 'Mật khẩu phải có ít nhất 8 ký tự.'); hasError = true;
    }

    if (!xacNhanMK) {
        showFieldError('xacNhanMatKhau', 'Vui lòng xác nhận mật khẩu.'); hasError = true;
    } else if (matKhau !== xacNhanMK) {
        showFieldError('xacNhanMatKhau', 'Mật khẩu xác nhận không khớp.'); hasError = true;
    }

    if (!agreeTerms) {
        showError('Bạn cần đồng ý với điều khoản sử dụng để tiếp tục.'); hasError = true;
    }

    // Kiểm tra trùng tên đăng nhập hoặc email
    if (Store.getUserByLogin(tenDangNhap)) {
        showFieldError('tenDangNhap', 'Tên đăng nhập này đã được sử dụng.');
        hasError = true;
    }
    if (Store.getUserByLogin(email)) {
        showFieldError('email', 'Email này đã được đăng ký.');
        hasError = true;
    }

    if (hasError) return;

    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Đang tạo tài khoản...';

    // Lưu tài khoản mới vào Store
    // TODO: Thay bằng fetch POST /api/auth/register khi có backend
    setTimeout(() => {
        const newUser = Store.createUser({
            tenDangNhap,
            matKhau,
            hoTen,
            email,
            soDienThoai,
            role: 'USER',
            kycStatus: 'NONE',
            emailVerified: true,
        });

        // Tự đăng nhập luôn sau khi tạo tài khoản
        const { matKhau: _, ...userToStore } = newUser;
        localStorage.setItem('escrow_token', 'token-' + newUser.id + '-' + Date.now());
        localStorage.setItem('escrow_user', JSON.stringify(userToStore));

        window.location.href = '/html/index.html';
    }, 800);
});
