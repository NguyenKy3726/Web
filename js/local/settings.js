// ============================================================
//  settings.js — Trang Cài Đặt
//  Tìm "TODO" để thay mock bằng API thật khi có backend Java
// ============================================================


// ============================================================
//  MOCK DATA — XÓA KHI KẾT NỐI BACKEND
// ============================================================

/**
 * TODO (Java): GET /api/users/me/settings
 * Response mapping:
 *   hoTen        → NguoiDung.HoTen
 *   email        → NguoiDung.Email
 *   soDienThoai  → NguoiDung.SoDienThoai
 *   facebook     → NguoiDung.Facebook
 *   tiktok       → NguoiDung.TikTok
 */
const mockUser = {
    hoTen:       'Nguyễn Văn A',
    email:       'nguyenvana@gmail.com',
    soDienThoai: '0123 456 789',
    facebook:    'fb.com/nguyenvana',
    tiktok:      '@nguyenvana',
};

/**
 * TODO (Java): GET /api/users/me/login-history
 * Response mapping:
 *   thiết bị     → LichSuDangNhap.ThietBi
 *   ip           → LichSuDangNhap.DiaChiIP
 *   thoiGian     → LichSuDangNhap.ThoiGian
 *   laMienHienTai→ (phiên đang dùng)
 */
const mockLoginHistory = [
    { device: 'Chrome · Windows 11', ip: '113.161.xx.xx', thoiGian: '02/06/2026 · 08:00', isCurrent: true  },
    { device: 'Safari · iPhone 14',  ip: '113.161.xx.xx', thoiGian: '01/06/2026 · 20:15', isCurrent: false },
    { device: 'Chrome · MacBook',    ip: '27.72.xx.xx',   thoiGian: '30/05/2026 · 14:00', isCurrent: false },
];

/**
 * TODO (Java): GET /api/users/me/privacy-settings
 * Response mapping:
 *   hienThiSdt      → CaiDatRiengTu.HienThiSoDienThoai
 *   hienThiEmail    → CaiDatRiengTu.HienThiEmail
 *   hienThiFacebook → CaiDatRiengTu.HienThiFacebook
 *   hienThiTiktok   → CaiDatRiengTu.HienThiTikTok
 *   hienThiLichSu   → CaiDatRiengTu.HienThiLichSuGD
 */
const mockPrivacy = {
    hienThiSdt:      false,
    hienThiEmail:    false,
    hienThiFacebook: true,
    hienThiTiktok:   true,
    hienThiLichSu:   true,
};

/**
 * TODO (Java): GET /api/users/me/notification-settings
 */
const mockNotification = {
    gdMoi:      true,
    gdTrangThai: true,
    toCao:      true,
    vi:         true,
    tinTuc:     false,
};


// ============================================================
//  SWITCH SECTION
// ============================================================
function switchSection(name) {
    // Ẩn tất cả section
    document.querySelectorAll('.settings-section').forEach(s => s.style.display = 'none');

    // Bỏ active tất cả nav item
    document.querySelectorAll('.settings-nav__item').forEach(n => {
        n.classList.remove('settings-nav__item--active');
    });

    // Hiện section + active nav item
    document.getElementById('section-' + name).style.display = 'block';
    document.getElementById('nav-' + name).classList.add('settings-nav__item--active');
}


// ============================================================
//  AVATAR CHANGE
//  TODO (Java): POST /api/users/me/avatar (multipart/form-data)
// ============================================================
function handleAvatarChange(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Ảnh quá lớn. Tối đa 2MB.'); return; }

    const reader = new FileReader();
    reader.onload = e => {
        // Hiện ảnh ở avatar card + sidebar
        const avatars = [
            document.getElementById('profileAvatar'),
            document.getElementById('sidebarAvatar'),
        ];
        avatars.forEach(a => {
            a.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
        });
    };
    reader.readAsDataURL(file);
}


// ============================================================
//  LƯU THÔNG TIN CÁ NHÂN
//  TODO (Java): PUT /api/users/me
//  Body: { hoTen, facebook, tiktok }
// ============================================================
function saveProfile() {
    const hoTen    = document.getElementById('hoTen').value.trim();
    const facebook = document.getElementById('facebook').value.trim();
    const tiktok   = document.getElementById('tiktok').value.trim();

    if (!hoTen) { alert('Vui lòng nhập họ tên.'); return; }

    // TODO: fetch('/api/users/me', { method:'PUT', body: JSON.stringify({ hoTen, facebook, tiktok }) })

    // Cập nhật sidebar
    document.getElementById('sidebarName').textContent = hoTen;
    showToast('Đã lưu thông tin cá nhân!', 'success');
}


// ============================================================
//  GỬI OTP ĐỔI SĐT
//  TODO (Java): POST /api/users/me/change-phone/request
//  Body: { soDienThoaiMoi }
// ============================================================
function requestPhoneOtp() {
    const phone = document.getElementById('newPhone').value.trim();
    if (!phone) { alert('Vui lòng nhập số điện thoại mới.'); return; }
    if (!/^(0|\+84)[3-9]\d{8}$/.test(phone)) { alert('Số điện thoại không hợp lệ.'); return; }
    // TODO: fetch('/api/users/me/change-phone/request', { method:'POST', body: JSON.stringify({ soDienThoaiMoi: phone }) })
    showToast('Mã OTP đã được gửi về số mới!', 'success');
}


// ============================================================
//  GỬI OTP ĐỔI EMAIL
//  TODO (Java): POST /api/users/me/change-email/request
//  Body: { emailMoi }
// ============================================================
function requestEmailOtp() {
    const email = document.getElementById('newEmail').value.trim();
    if (!email) { alert('Vui lòng nhập email mới.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Email không hợp lệ.'); return; }
    // TODO: fetch('/api/users/me/change-email/request', { method:'POST', body: JSON.stringify({ emailMoi: email }) })
    showToast('Mã xác minh đã gửi về email mới!', 'success');
}


// ============================================================
//  ĐỔI MẬT KHẨU
//  TODO (Java): PUT /api/users/me/password
//  Body: { matKhauHienTai, matKhauMoi }
// ============================================================
function changePassword() {
    const current = document.getElementById('currentPw').value;
    const newPw   = document.getElementById('newPw').value;
    const confirm = document.getElementById('confirmPw').value;

    if (!current) { alert('Vui lòng nhập mật khẩu hiện tại.'); return; }
    if (newPw.length < 8) { alert('Mật khẩu mới phải có ít nhất 8 ký tự.'); return; }
    if (newPw !== confirm) { alert('Mật khẩu xác nhận không khớp.'); return; }

    // TODO: fetch('/api/users/me/password', { method:'PUT', body: JSON.stringify({ matKhauHienTai: current, matKhauMoi: newPw }) })
    document.getElementById('currentPw').value = '';
    document.getElementById('newPw').value     = '';
    document.getElementById('confirmPw').value = '';
    document.getElementById('pwStrength').style.display = 'none';
    showToast('Đổi mật khẩu thành công!', 'success');
}


// ============================================================
//  TOGGLE PASSWORD
// ============================================================
function togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon  = btn.querySelector('i');
    const isHidden = input.type === 'password';
    input.type     = isHidden ? 'text'     : 'password';
    icon.className = isHidden ? 'bx bx-show' : 'bx bx-hide';
}


// ============================================================
//  ĐO ĐỘ MẠNH MẬT KHẨU
// ============================================================
function checkPwStrength(input) {
    const pw  = input.value;
    const bar = document.getElementById('pwStrength');
    const fill = document.getElementById('pwFill');
    const text = document.getElementById('pwStrengthText');

    if (!pw) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';

    let score = 0;
    if (pw.length >= 8)            score++;
    if (/[A-Z]/.test(pw))          score++;
    if (/[0-9]/.test(pw))          score++;
    if (/[^A-Za-z0-9]/.test(pw))   score++;

    const levels = [
        { pct:'25%',  color:'#ef4444', label:'Yếu'       },
        { pct:'25%',  color:'#ef4444', label:'Yếu'       },
        { pct:'50%',  color:'#f59e0b', label:'Trung bình' },
        { pct:'75%',  color:'#0ea5e9', label:'Khá mạnh'  },
        { pct:'100%', color:'#16a34a', label:'Mạnh'       },
    ];
    const lvl = levels[score];
    fill.style.width      = lvl.pct;
    fill.style.background = lvl.color;
    text.textContent      = lvl.label;
    text.style.color      = lvl.color;
}


// ============================================================
//  LỊCH SỬ ĐĂNG NHẬP
// ============================================================
function renderLoginHistory(list) {
    const container = document.getElementById('loginHistoryList');
    container.innerHTML = list.map(item => `
        <div class="settings-login-item">
            <div class="settings-login-item__icon">
                <i class='bx ${item.device.includes('iPhone') || item.device.includes('Android') ? 'bx-mobile' : 'bx-desktop'}'></i>
            </div>
            <div class="settings-login-item__info">
                <div class="settings-login-item__device">${item.device}</div>
                <div class="settings-login-item__meta">${item.ip} · ${item.thoiGian}</div>
            </div>
            ${item.isCurrent
                ? '<span class="settings-login-item__current">Thiết bị này</span>'
                : ''
            }
        </div>
    `).join('');
}


// ============================================================
//  ĐĂNG XUẤT TẤT CẢ THIẾT BỊ
//  TODO (Java): POST /api/auth/logout-all
// ============================================================
function logoutAllDevices() {
    if (!confirm('Đăng xuất tất cả thiết bị? Bạn sẽ cần đăng nhập lại.')) return;
    // TODO: fetch('/api/auth/logout-all', { method:'POST' })
    showToast('Đã đăng xuất tất cả thiết bị!', 'success');
}


// ============================================================
//  LƯU CÀI ĐẶT THÔNG BÁO
//  TODO (Java): PUT /api/users/me/notification-settings
// ============================================================
function saveNotification() {
    const settings = {
        gdMoi:       document.getElementById('notif-new-tx').checked,
        gdTrangThai: document.getElementById('notif-tx-status').checked,
        toCao:       document.getElementById('notif-report').checked,
        vi:          document.getElementById('notif-wallet').checked,
        tinTuc:      document.getElementById('notif-news').checked,
    };
    // TODO: fetch('/api/users/me/notification-settings', { method:'PUT', body: JSON.stringify(settings) })
    showToast('Đã lưu cài đặt thông báo!', 'success');
}


// ============================================================
//  LƯU CÀI ĐẶT QUYỀN RIÊNG TƯ
//  TODO (Java): PUT /api/users/me/privacy-settings
// ============================================================
function savePrivacy() {
    const settings = {
        hienThiSdt:      document.getElementById('privacy-phone').checked,
        hienThiEmail:    document.getElementById('privacy-email').checked,
        hienThiFacebook: document.getElementById('privacy-fb').checked,
        hienThiTiktok:   document.getElementById('privacy-tiktok').checked,
        hienThiLichSu:   document.getElementById('privacy-history').checked,
    };
    // TODO: fetch('/api/users/me/privacy-settings', { method:'PUT', body: JSON.stringify(settings) })
    showToast('Đã lưu cài đặt quyền riêng tư!', 'success');
}



// ============================================================
//  TOAST NOTIFICATION
// ============================================================
function showToast(message, type = 'success') {
    // Xóa toast cũ nếu có
    const old = document.getElementById('settingsToast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'settingsToast';
    toast.style.cssText = `
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        background: ${type === 'success' ? '#1e293b' : '#ef4444'};
        color: white; padding: 12px 20px; border-radius: 12px;
        font-size: 14px; font-weight: 600;
        display: flex; align-items: center; gap: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        animation: slideUp 0.25s ease;
    `;
    toast.innerHTML = `
        <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'
           style="font-size:18px; color:${type === 'success' ? '#38bdf8' : 'white'}"></i>
        ${message}`;

    // Thêm CSS animation
    if (!document.getElementById('toastStyle')) {
        const style = document.createElement('style');
        style.id = 'toastStyle';
        style.textContent = '@keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }';
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}


// ============================================================
//  KHỞI ĐỘNG
//  TODO (Java): Thay mock bằng:
//    Promise.all([
//      fetch('/api/users/me/settings').then(r=>r.json()),
//      fetch('/api/users/me/login-history').then(r=>r.json()),
//      fetch('/api/users/me/privacy-settings').then(r=>r.json()),
//      fetch('/api/users/me/notification-settings').then(r=>r.json()),
//    ]).then(([user, loginHistory, privacy, notification]) => init(...))
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Fill thông tin user
    document.getElementById('hoTen').value    = mockUser.hoTen;
    document.getElementById('facebook').value = mockUser.facebook;
    document.getElementById('tiktok').value   = mockUser.tiktok;
    document.getElementById('sidebarName').textContent  = mockUser.hoTen;
    document.getElementById('sidebarEmail').textContent = mockUser.email;

    // Lấy chữ cái đầu làm avatar
    const parts = mockUser.hoTen.trim().split(' ');
    const initial = parts[parts.length - 1].charAt(0).toUpperCase();
    document.getElementById('profileAvatar').textContent = initial;
    document.getElementById('sidebarAvatar').textContent = initial;

    // Render lịch sử đăng nhập
    renderLoginHistory(mockLoginHistory);

    // Fill privacy toggles
    document.getElementById('privacy-phone').checked   = mockPrivacy.hienThiSdt;
    document.getElementById('privacy-email').checked   = mockPrivacy.hienThiEmail;
    document.getElementById('privacy-fb').checked      = mockPrivacy.hienThiFacebook;
    document.getElementById('privacy-tiktok').checked  = mockPrivacy.hienThiTiktok;
    document.getElementById('privacy-history').checked = mockPrivacy.hienThiLichSu;

    // Fill notification toggles
    document.getElementById('notif-new-tx').checked    = mockNotification.gdMoi;
    document.getElementById('notif-tx-status').checked = mockNotification.gdTrangThai;
    document.getElementById('notif-report').checked    = mockNotification.toCao;
    document.getElementById('notif-wallet').checked    = mockNotification.vi;
    document.getElementById('notif-news').checked      = mockNotification.tinTuc;
});

document.addEventListener('keydown', e => {

});