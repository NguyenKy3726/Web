// ============================================================
//  admin.js — Logic trang Admin/Owner Panel
//  Tìm "TODO" để thay mock bằng API thật khi có backend Java
// ============================================================


// ============================================================
//  MOCK: ROLE HIỆN TẠI
//  TODO (Java): Lấy từ JWT token hoặc GET /api/auth/me
//  role: 'ADMIN' | 'OWNER'
// ============================================================
const currentAdmin = {
    role:   'OWNER',   // Đổi thành 'ADMIN' để test giao diện admin thuần
    hoTen:  'Nguyễn Văn Owner',
    email:  'owner@escrow.vn',
};


// ============================================================
//  MOCK DATA — XÓA KHI KẾT NỐI BACKEND
// ============================================================

/**
 * TODO (Java): GET /api/admin/users?page=0&size=50
 */
const mockUsers = [
    { id: 'U001', hoTen: 'Trần Minh Quân',  email: 'quan@gmail.com',   sdt: '0901234567', kyc: 'APPROVED', role: 'USER',  trangThai: 'ACTIVE',      ngayTao: '15/01/2026' },
    { id: 'U002', hoTen: 'Nguyễn Thu Hà',   email: 'ha@gmail.com',     sdt: '0912345678', kyc: 'PENDING',  role: 'USER',  trangThai: 'ACTIVE',      ngayTao: '20/01/2026' },
    { id: 'U003', hoTen: 'Lê Đức Anh',      email: 'anh@gmail.com',    sdt: '0923456789', kyc: 'NONE',     role: 'USER',  trangThai: 'LOCKED',      ngayTao: '05/02/2026' },
    { id: 'U004', hoTen: 'Phạm Lan Phương', email: 'phuong@gmail.com', sdt: '0934567890', kyc: 'APPROVED', role: 'ADMIN', trangThai: 'ACTIVE',      ngayTao: '10/02/2026' },
    { id: 'U005', hoTen: 'Hoàng Nam',       email: 'nam@gmail.com',    sdt: '0945678901', kyc: 'APPROVED', role: 'USER',  trangThai: 'ACTIVE',      ngayTao: '14/03/2026' },
    { id: 'U006', hoTen: 'Bảo Trân',        email: 'tran@gmail.com',   sdt: '0956789012', kyc: 'NONE',     role: 'USER',  trangThai: 'PENDING_KYC', ngayTao: '01/04/2026' },
    { id: 'U007', hoTen: 'Gia Huy',         email: 'huy@gmail.com',    sdt: '0967890123', kyc: 'APPROVED', role: 'USER',  trangThai: 'ACTIVE',      ngayTao: '18/04/2026' },
    { id: 'U008', hoTen: 'Khánh Vy',        email: 'vy@gmail.com',     sdt: '0978901234', kyc: 'PENDING',  role: 'USER',  trangThai: 'ACTIVE',      ngayTao: '22/05/2026' },
];

/**
 * TODO (Java): GET /api/admin/transactions?page=0&size=50
 */
const mockTransactions = [
    { id: 'GD250529112005', nguoiMua: 'Trần Minh Quân',  nguoiBan: 'Nguyễn Thu Hà',   sanPham: 'iPhone 13 Pro Max', soTien: 8500000,  trangThai: 'COMPLETED',   ngayTao: '29/05/2026' },
    { id: 'GD250528091233', nguoiMua: 'Hoàng Nam',       nguoiBan: 'Lê Đức Anh',      sanPham: 'MacBook Air M2',    soTien: 25000000, trangThai: 'DISPUTED',    ngayTao: '28/05/2026' },
    { id: 'GD250527153344', nguoiMua: 'Bảo Trân',        nguoiBan: 'Gia Huy',         sanPham: 'AirPods Pro',       soTien: 2200000,  trangThai: 'IN_PROGRESS', ngayTao: '27/05/2026' },
    { id: 'GD250526080011', nguoiMua: 'Khánh Vy',        nguoiBan: 'Trần Minh Quân',  sanPham: 'iPad Air 5',        soTien: 13000000, trangThai: 'PENDING',     ngayTao: '26/05/2026' },
    { id: 'GD250521101500', nguoiMua: 'Lê Đức Anh',      nguoiBan: 'Phạm Lan Phương', sanPham: 'Samsung Galaxy S24',soTien: 6800000,  trangThai: 'CANCELLED',   ngayTao: '21/05/2026' },
    { id: 'GD250510141200', nguoiMua: 'Nguyễn Thu Hà',   nguoiBan: 'Hoàng Nam',       sanPham: 'Apple Watch S9',    soTien: 9500000,  trangThai: 'COMPLETED',   ngayTao: '10/05/2026' },
];

/**
 * TODO (Java): GET /api/admin/reports?page=0&size=50
 */
const mockAdminReports = [
    { id: 'TC001', nguoiToCao: 'Trần Minh Quân',  maGD: 'GD250529112005', lyDo: 'Không giao hàng',      trangThai: 'RESOLVED',    ngayTao: '25/05/2026' },
    { id: 'TC002', nguoiToCao: 'Lê Đức Anh',      maGD: 'GD250521101500', lyDo: 'Gian lận, lừa đảo',   trangThai: 'IN_PROGRESS', ngayTao: '22/05/2026' },
    { id: 'TC003', nguoiToCao: 'Nguyễn Thu Hà',   maGD: 'GD250510141200', lyDo: 'Hàng không đúng mô tả',trangThai: 'PENDING',     ngayTao: '12/05/2026' },
    { id: 'TC004', nguoiToCao: 'Khánh Vy',         maGD: 'GD250526080011', lyDo: 'Không phản hồi',      trangThai: 'PENDING',     ngayTao: '30/04/2026' },
    { id: 'TC005', nguoiToCao: 'Hoàng Nam',        maGD: 'GD250528091233', lyDo: 'Gian lận, lừa đảo',   trangThai: 'IN_PROGRESS', ngayTao: '01/06/2026' },
];

/**
 * TODO (Java): GET /api/admin/wallet-requests?page=0&size=50
 */
const mockWalletRequests = [
    { id: 'W001', nguoiDung: 'Trần Minh Quân',  loai: 'DEPOSIT',  soTien: 5000000,  nganHang: 'Vietcombank - 1234567890', trangThai: 'PENDING',  thoiGian: '03/06/2026 · 09:15' },
    { id: 'W002', nguoiDung: 'Nguyễn Thu Hà',   loai: 'WITHDRAW', soTien: 2000000,  nganHang: 'Techcombank - 9876543210', trangThai: 'PENDING',  thoiGian: '03/06/2026 · 10:30' },
    { id: 'W003', nguoiDung: 'Hoàng Nam',        loai: 'DEPOSIT',  soTien: 10000000, nganHang: 'BIDV - 1122334455',        trangThai: 'APPROVED', thoiGian: '02/06/2026 · 14:00' },
    { id: 'W004', nguoiDung: 'Bảo Trân',         loai: 'WITHDRAW', soTien: 3500000,  nganHang: 'MB Bank - 5544332211',     trangThai: 'PENDING',  thoiGian: '03/06/2026 · 08:45' },
    { id: 'W005', nguoiDung: 'Gia Huy',          loai: 'DEPOSIT',  soTien: 1000000,  nganHang: 'ACB - 6677889900',         trangThai: 'REJECTED', thoiGian: '01/06/2026 · 16:20' },
    { id: 'W006', nguoiDung: 'Khánh Vy',         loai: 'WITHDRAW', soTien: 7000000,  nganHang: 'Vietinbank - 0011223344',  trangThai: 'PENDING',  thoiGian: '03/06/2026 · 11:05' },
];

/**
 * TODO (Java): GET /api/admin/admins
 */
let mockAdmins = [
    { id: 'A001', hoTen: 'Phạm Lan Phương', email: 'phuong@escrow.vn', trangThai: 'ACTIVE', ngayTao: '10/02/2026' },
    { id: 'A002', hoTen: 'Lê Admin Hai',    email: 'hai@escrow.vn',    trangThai: 'ACTIVE', ngayTao: '15/03/2026' },
    { id: 'A003', hoTen: 'Trần Admin Ba',   email: 'ba@escrow.vn',     trangThai: 'LOCKED', ngayTao: '01/04/2026' },
];

// Hoạt động gần đây (overview)
const mockActivity = [
    { thoiGian: '03/06/2026 · 11:05', loai: 'Tố cáo',     moTa: 'TC005 mới được tạo bởi Hoàng Nam',         trangThai: 'PENDING' },
    { thoiGian: '03/06/2026 · 10:30', loai: 'Rút tiền',   moTa: 'Nguyễn Thu Hà yêu cầu rút 2.000.000đ',     trangThai: 'PENDING' },
    { thoiGian: '03/06/2026 · 09:15', loai: 'Nạp tiền',   moTa: 'Trần Minh Quân yêu cầu nạp 5.000.000đ',   trangThai: 'PENDING' },
    { thoiGian: '02/06/2026 · 14:00', loai: 'Giao dịch',  moTa: 'GD250527153344 chuyển sang Đang giao dịch', trangThai: 'IN_PROGRESS' },
    { thoiGian: '01/06/2026 · 16:20', loai: 'Nạp tiền',   moTa: 'Yêu cầu nạp tiền của Gia Huy bị từ chối',  trangThai: 'REJECTED' },
];


// ============================================================
//  KHỞI TẠO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initRole();
    renderSidebar();

    // Admin mặc định vào trang users, Owner vào overview
    if (currentAdmin.role === 'OWNER') {
        switchSection('overview', document.querySelector('.admin-nav__item--active'));
    } else {
        switchSection('users', document.querySelector('.admin-nav__item'));
    }
});

function initRole() {
    const isOwner = currentAdmin.role === 'OWNER';

    // Thêm class is-owner vào body để CSS hiện owner-only
    if (isOwner) document.body.classList.add('is-owner');

    // Badge role
    const badge = document.getElementById('roleBadge');
    badge.textContent = isOwner ? 'OWNER' : 'ADMIN';
    if (isOwner) badge.classList.add('owner');

    // Sidebar avatar & name
    const avatar = document.getElementById('sidebarAvatar');
    avatar.textContent = currentAdmin.hoTen.charAt(0).toUpperCase();
    if (isOwner) avatar.classList.add('owner');
    document.getElementById('sidebarName').textContent = currentAdmin.hoTen;
    document.getElementById('sidebarRole').textContent = isOwner ? 'Chủ sở hữu' : 'Quản trị viên';
}

function renderSidebar() {
    // Cập nhật badge số lượng
    const pendingReports  = mockAdminReports.filter(r => r.trangThai === 'PENDING' || r.trangThai === 'IN_PROGRESS').length;
    const pendingWallet   = mockWalletRequests.filter(w => w.trangThai === 'PENDING').length;
    document.getElementById('badgeReports').textContent = pendingReports;
    document.getElementById('badgeWallet').textContent  = pendingWallet;
    if (!pendingReports) document.getElementById('badgeReports').style.display = 'none';
    if (!pendingWallet)  document.getElementById('badgeWallet').style.display  = 'none';
}


// ============================================================
//  CHUYỂN SECTION
// ============================================================
const PAGE_INFO = {
    overview:     { title: 'Thống kê hệ thống',     sub: 'Tổng quan hoạt động toàn hệ thống' },
    users:        { title: 'Quản lý người dùng',    sub: 'Xem, khóa/mở khóa tài khoản người dùng' },
    transactions: { title: 'Giao dịch P2P',         sub: 'Theo dõi và quản lý các giao dịch P2P' },
    reports:      { title: 'Tố cáo',                sub: 'Tiếp nhận và xử lý tố cáo từ người dùng' },
    wallet:       { title: 'Nạp / Rút tiền',        sub: 'Duyệt yêu cầu nạp và rút tiền' },
    roles:        { title: 'Phân quyền',            sub: 'Thay đổi vai trò người dùng trong hệ thống' },
    admins:       { title: 'Quản lý Admin',         sub: 'Tạo và quản lý tài khoản Admin' },
};

let currentSection = '';

function switchSection(name, el) {
    // Ẩn section cũ
    if (currentSection) {
        const old = document.getElementById('section-' + currentSection);
        if (old) { old.style.display = 'none'; }
    }

    // Hiện section mới — dùng important để override owner-only CSS
    currentSection = name;
    const sec = document.getElementById('section-' + name);
    if (sec) { sec.style.setProperty('display', 'flex', 'important'); }

    // Active nav
    document.querySelectorAll('.admin-nav__item').forEach(item => item.classList.remove('admin-nav__item--active'));
    if (el) el.classList.add('admin-nav__item--active');

    // Topbar
    const info = PAGE_INFO[name] || {};
    document.getElementById('pageTitle').textContent = info.title || name;
    document.getElementById('pageSub').textContent   = info.sub   || '';

    // Render nội dung
    const renders = {
        overview:     renderOverview,
        users:        renderUsers,
        transactions: renderTransactions,
        reports:      renderAdminReports,
        wallet:       renderWalletRequests,
        roles:        renderRoles,
        admins:       renderAdmins,
    };
    if (renders[name]) renders[name]();

    return false;
}


// ============================================================
//  SECTION: THỐNG KÊ
// ============================================================
function renderOverview() {
    const tbody = document.getElementById('overviewActivityBody');
    tbody.innerHTML = mockActivity.map(a => `
        <tr>
            <td style="color:#94a3b8; white-space:nowrap;">${a.thoiGian}</td>
            <td><span class="badge badge--role-admin">${a.loai}</span></td>
            <td>${a.moTa}</td>
            <td>${statusBadge(a.trangThai)}</td>
        </tr>
    `).join('');
}


// ============================================================
//  SECTION: NGƯỜI DÙNG
// ============================================================
function renderUsers(list) {
    list = list || mockUsers;
    const tbody = document.getElementById('userTableBody');
    document.getElementById('userCount').textContent = list.length + ' người dùng';

    if (!list.length) { tbody.innerHTML = emptyRow(7); return; }

    tbody.innerHTML = list.map(u => `
        <tr>
            <td>
                <div class="admin-user-cell">
                    <div class="admin-user-cell__avatar" style="background:${avatarColor(u.hoTen)}">
                        ${u.hoTen.charAt(0)}
                    </div>
                    <div>
                        <div class="admin-user-cell__name">${u.hoTen}</div>
                        <div class="admin-user-cell__sub">${u.id}</div>
                    </div>
                </div>
            </td>
            <td>
                <div>${u.email}</div>
                <div style="font-size:11px; color:#94a3b8;">${u.sdt}</div>
            </td>
            <td>${kycBadge(u.kyc)}</td>
            <td>${roleBadge(u.role)}</td>
            <td>${userStatusBadge(u.trangThai)}</td>
            <td style="color:#94a3b8; white-space:nowrap;">${u.ngayTao}</td>
            <td>
                <div class="admin-action-btns">
                    <button class="admin-action-btn admin-action-btn--view" title="Xem chi tiết" onclick="openUserDetail('${u.id}')">
                        <i class='bx bx-show'></i>
                    </button>
                    ${u.trangThai === 'LOCKED'
                        ? `<button class="admin-action-btn admin-action-btn--unlock" title="Mở khóa" onclick="toggleLock('${u.id}')"><i class='bx bx-lock-open'></i></button>`
                        : `<button class="admin-action-btn admin-action-btn--lock"   title="Khóa tài khoản" onclick="toggleLock('${u.id}')"><i class='bx bx-lock'></i></button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers() {
    const kw       = document.getElementById('userSearch').value.toLowerCase();
    const status   = document.getElementById('userStatusFilter').value;
    const role     = document.getElementById('userRoleFilter').value;
    const filtered = mockUsers.filter(u => {
        const matchKw     = !kw || u.hoTen.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || u.sdt.includes(kw);
        const matchStatus = status === 'ALL' || u.trangThai === status;
        const matchRole   = role   === 'ALL' || u.role     === role;
        return matchKw && matchStatus && matchRole;
    });
    renderUsers(filtered);
}

function openUserDetail(id) {
    const u = mockUsers.find(x => x.id === id);
    if (!u) return;

    document.getElementById('userDetailTitle').textContent = 'Chi tiết · ' + u.hoTen;
    document.getElementById('userDetailBody').innerHTML = `
        <div style="display:flex; align-items:center; gap:14px; padding-bottom:16px; border-bottom:1px solid #f1f5f9;">
            <div class="admin-user-cell__avatar" style="width:52px;height:52px;font-size:20px;border-radius:14px;background:${avatarColor(u.hoTen)}">${u.hoTen.charAt(0)}</div>
            <div>
                <div style="font-size:16px;font-weight:700;color:#1e293b;">${u.hoTen}</div>
                <div style="font-size:12px;color:#94a3b8;">${u.id}</div>
            </div>
        </div>
        <div class="detail-row"><span class="detail-row__label">Email</span><span class="detail-row__value">${u.email}</span></div>
        <div class="detail-row"><span class="detail-row__label">Số điện thoại</span><span class="detail-row__value">${u.sdt}</span></div>
        <div class="detail-row"><span class="detail-row__label">KYC</span><span class="detail-row__value">${kycBadge(u.kyc)}</span></div>
        <div class="detail-row"><span class="detail-row__label">Vai trò</span><span class="detail-row__value">${roleBadge(u.role)}</span></div>
        <div class="detail-row"><span class="detail-row__label">Trạng thái</span><span class="detail-row__value">${userStatusBadge(u.trangThai)}</span></div>
        <div class="detail-row"><span class="detail-row__label">Ngày tạo</span><span class="detail-row__value">${u.ngayTao}</span></div>
    `;
    document.getElementById('userDetailFooter').innerHTML = `
        <button class="admin-btn admin-btn--ghost" onclick="closeModal('userDetail')">Đóng</button>
        ${u.trangThai === 'LOCKED'
            ? `<button class="admin-btn admin-btn--success" onclick="toggleLock('${u.id}'); closeModal('userDetail')"><i class='bx bx-lock-open'></i> Mở khóa</button>`
            : `<button class="admin-btn admin-btn--danger"  onclick="toggleLock('${u.id}'); closeModal('userDetail')"><i class='bx bx-lock'></i> Khóa tài khoản</button>`
        }
    `;
    openModal('userDetail');
}

function toggleLock(id) {
    // TODO (Java): PUT /api/admin/users/{id}/lock hoặc /unlock
    const u = mockUsers.find(x => x.id === id);
    if (!u) return;
    u.trangThai = u.trangThai === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    filterUsers();
    showToast(u.trangThai === 'LOCKED' ? 'Đã khóa tài khoản ' + u.hoTen : 'Đã mở khóa ' + u.hoTen, u.trangThai === 'LOCKED' ? 'error' : 'success');
}


// ============================================================
//  SECTION: GIAO DỊCH P2P
// ============================================================
function renderTransactions(list) {
    list = list || mockTransactions;
    const tbody = document.getElementById('txTableBody');
    document.getElementById('txCount').textContent = list.length + ' giao dịch';

    if (!list.length) { tbody.innerHTML = emptyRow(8); return; }

    tbody.innerHTML = list.map(t => `
        <tr>
            <td style="font-family:monospace; color:#0ea5e9; font-size:12px;">${t.id}</td>
            <td>${t.nguoiMua}</td>
            <td>${t.nguoiBan}</td>
            <td>${t.sanPham}</td>
            <td style="font-weight:700; color:#1e293b;">${formatVND(t.soTien)}</td>
            <td>${statusBadge(t.trangThai)}</td>
            <td style="color:#94a3b8; white-space:nowrap;">${t.ngayTao}</td>
            <td>
                <div class="admin-action-btns">
                    <button class="admin-action-btn admin-action-btn--view" title="Xem chi tiết" onclick="alert('TODO: Xem chi tiết GD ${t.id}')">
                        <i class='bx bx-show'></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterTransactions() {
    const kw     = document.getElementById('txSearch').value.toLowerCase();
    const status = document.getElementById('txStatusFilter').value;
    renderTransactions(mockTransactions.filter(t => {
        const matchKw = !kw || t.id.toLowerCase().includes(kw) || t.nguoiMua.toLowerCase().includes(kw) || t.nguoiBan.toLowerCase().includes(kw);
        return matchKw && (status === 'ALL' || t.trangThai === status);
    }));
}


// ============================================================
//  SECTION: TỐ CÁO
// ============================================================
function renderAdminReports(list) {
    list = list || mockAdminReports;
    const tbody = document.getElementById('reportTableBody');
    document.getElementById('reportCount').textContent = list.length + ' tố cáo';

    if (!list.length) { tbody.innerHTML = emptyRow(7); return; }

    tbody.innerHTML = list.map(r => `
        <tr>
            <td style="font-family:monospace; color:#0ea5e9; font-size:12px;">${r.id}</td>
            <td>${r.nguoiToCao}</td>
            <td style="font-family:monospace; font-size:11px; color:#64748b;">${r.maGD}</td>
            <td>${r.lyDo}</td>
            <td>${statusBadge(r.trangThai)}</td>
            <td style="color:#94a3b8; white-space:nowrap;">${r.ngayTao}</td>
            <td>
                <div class="admin-action-btns">
                    <button class="admin-action-btn admin-action-btn--view" title="Xem & xử lý" onclick="openReportAction('${r.id}')">
                        <i class='bx bx-show'></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterAdminReports() {
    const kw     = document.getElementById('reportSearch').value.toLowerCase();
    const status = document.getElementById('reportStatusFilter').value;
    renderAdminReports(mockAdminReports.filter(r => {
        const matchKw = !kw || r.id.toLowerCase().includes(kw) || r.maGD.toLowerCase().includes(kw) || r.nguoiToCao.toLowerCase().includes(kw);
        return matchKw && (status === 'ALL' || r.trangThai === status);
    }));
}

function openReportAction(id) {
    const r = mockAdminReports.find(x => x.id === id);
    if (!r) return;

    document.getElementById('reportActionTitle').textContent = 'Xử lý tố cáo · ' + r.id;
    document.getElementById('reportActionBody').innerHTML = `
        <div class="detail-row"><span class="detail-row__label">Mã tố cáo</span><span class="detail-row__value">${r.id}</span></div>
        <div class="detail-row"><span class="detail-row__label">Người tố cáo</span><span class="detail-row__value">${r.nguoiToCao}</span></div>
        <div class="detail-row"><span class="detail-row__label">Mã giao dịch</span><span class="detail-row__value" style="color:#0ea5e9">${r.maGD}</span></div>
        <div class="detail-row"><span class="detail-row__label">Lý do</span><span class="detail-row__value">${r.lyDo}</span></div>
        <div class="detail-row"><span class="detail-row__label">Trạng thái</span><span class="detail-row__value">${statusBadge(r.trangThai)}</span></div>
        <div class="admin-form-group" style="margin-top:8px;">
            <label>Kết luận xử lý</label>
            <textarea class="admin-textarea" id="reportConclusion" placeholder="Nhập kết luận hoặc lý do từ chối..."></textarea>
        </div>
    `;
    document.getElementById('reportActionFooter').innerHTML = `
        <button class="admin-btn admin-btn--ghost" onclick="closeModal('reportAction')">Đóng</button>
        ${r.trangThai !== 'RESOLVED' && r.trangThai !== 'REJECTED' ? `
            <button class="admin-btn admin-btn--danger" onclick="resolveReport('${r.id}', 'REJECTED')">
                <i class='bx bx-x-circle'></i> Từ chối
            </button>
            <button class="admin-btn admin-btn--success" onclick="resolveReport('${r.id}', 'RESOLVED')">
                <i class='bx bx-check-circle'></i> Giải quyết
            </button>
        ` : ''}
    `;
    openModal('reportAction');
}

function resolveReport(id, trangThai) {
    // TODO (Java): PUT /api/admin/reports/{id}/resolve  body: { ketLuan, trangThai }
    const r = mockAdminReports.find(x => x.id === id);
    if (!r) return;
    r.trangThai = trangThai;
    closeModal('reportAction');
    renderAdminReports();
    renderSidebar();
    showToast(trangThai === 'RESOLVED' ? 'Đã giải quyết tố cáo ' + id : 'Đã từ chối tố cáo ' + id,
              trangThai === 'RESOLVED' ? 'success' : 'error');
}


// ============================================================
//  SECTION: NẠP / RÚT TIỀN
// ============================================================
function renderWalletRequests(list) {
    list = list || mockWalletRequests;
    const tbody = document.getElementById('walletTableBody');
    document.getElementById('walletCount').textContent = list.length + ' yêu cầu';

    if (!list.length) { tbody.innerHTML = emptyRow(7); return; }

    tbody.innerHTML = list.map(w => `
        <tr>
            <td>
                <div class="admin-user-cell">
                    <div class="admin-user-cell__avatar" style="background:${avatarColor(w.nguoiDung)}">${w.nguoiDung.charAt(0)}</div>
                    <span style="font-weight:600;">${w.nguoiDung}</span>
                </div>
            </td>
            <td>${w.loai === 'DEPOSIT'
                ? '<span class="badge badge--deposit">Nạp tiền</span>'
                : '<span class="badge badge--withdraw">Rút tiền</span>'}</td>
            <td style="font-weight:700; color:#1e293b;">${formatVND(w.soTien)}</td>
            <td style="font-size:12px; color:#64748b;">${w.nganHang}</td>
            <td>${walletStatusBadge(w.trangThai)}</td>
            <td style="color:#94a3b8; font-size:12px; white-space:nowrap;">${w.thoiGian}</td>
            <td>
                ${w.trangThai === 'PENDING' ? `
                <div class="admin-action-btns">
                    <button class="admin-action-btn admin-action-btn--approve" title="Duyệt" onclick="approveWallet('${w.id}', 'APPROVED')">
                        <i class='bx bx-check'></i>
                    </button>
                    <button class="admin-action-btn admin-action-btn--reject" title="Từ chối" onclick="approveWallet('${w.id}', 'REJECTED')">
                        <i class='bx bx-x'></i>
                    </button>
                </div>` : '<span style="font-size:12px;color:#94a3b8;">—</span>'}
            </td>
        </tr>
    `).join('');
}

function filterWalletRequests() {
    const kw     = document.getElementById('walletSearch').value.toLowerCase();
    const type   = document.getElementById('walletTypeFilter').value;
    const status = document.getElementById('walletStatusFilter').value;
    renderWalletRequests(mockWalletRequests.filter(w => {
        const matchKw = !kw || w.nguoiDung.toLowerCase().includes(kw) || w.nganHang.toLowerCase().includes(kw);
        return matchKw && (type === 'ALL' || w.loai === type) && (status === 'ALL' || w.trangThai === status);
    }));
}

function approveWallet(id, trangThai) {
    // TODO (Java): PUT /api/admin/wallet-requests/{id}/approve hoặc /reject
    const w = mockWalletRequests.find(x => x.id === id);
    if (!w) return;
    w.trangThai = trangThai;
    filterWalletRequests();
    renderSidebar();
    showToast(trangThai === 'APPROVED' ? 'Đã duyệt yêu cầu của ' + w.nguoiDung : 'Đã từ chối yêu cầu của ' + w.nguoiDung,
              trangThai === 'APPROVED' ? 'success' : 'error');
}


// ============================================================
//  SECTION: PHÂN QUYỀN (Owner)
// ============================================================
function renderRoles(list) {
    list = list || mockUsers;
    const tbody = document.getElementById('roleTableBody');

    if (!list.length) { tbody.innerHTML = emptyRow(5); return; }

    tbody.innerHTML = list.map(u => `
        <tr>
            <td>
                <div class="admin-user-cell">
                    <div class="admin-user-cell__avatar" style="background:${avatarColor(u.hoTen)}">${u.hoTen.charAt(0)}</div>
                    <span style="font-weight:600;">${u.hoTen}</span>
                </div>
            </td>
            <td style="color:#64748b;">${u.email}</td>
            <td>${roleBadge(u.role)}</td>
            <td>
                <select class="role-select" id="roleSelect-${u.id}" onchange="previewRoleChange('${u.id}')">
                    <option value="USER"  ${u.role === 'USER'  ? 'selected' : ''}>User</option>
                    <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
                    <option value="OWNER" ${u.role === 'OWNER' ? 'selected' : ''}>Owner</option>
                </select>
            </td>
            <td>
                <button class="admin-btn admin-btn--primary" style="padding:6px 12px; font-size:12px;" onclick="saveRoleChange('${u.id}')">
                    <i class='bx bx-save'></i> Lưu
                </button>
            </td>
        </tr>
    `).join('');
}

function filterRoleUsers() {
    const kw = document.getElementById('roleSearch').value.toLowerCase();
    renderRoles(mockUsers.filter(u => !kw || u.hoTen.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)));
}

function previewRoleChange(id) { /* preview nếu cần */ }

function saveRoleChange(id) {
    // TODO (Java): PUT /api/admin/users/{id}/role  body: { role }
    const u       = mockUsers.find(x => x.id === id);
    const newRole = document.getElementById('roleSelect-' + id).value;
    if (!u || u.role === newRole) return;
    u.role = newRole;
    renderRoles();
    showToast('Đã cập nhật vai trò của ' + u.hoTen + ' thành ' + newRole, 'success');
}


// ============================================================
//  SECTION: QUẢN LÝ ADMIN (Owner)
// ============================================================
function renderAdmins(list) {
    list = list || mockAdmins;
    const tbody = document.getElementById('adminTableBody');
    document.getElementById('adminListCount').textContent = list.length + ' admin';

    if (!list.length) { tbody.innerHTML = emptyRow(5); return; }

    tbody.innerHTML = list.map(a => `
        <tr>
            <td>
                <div class="admin-user-cell">
                    <div class="admin-user-cell__avatar" style="background:${avatarColor(a.hoTen)}">${a.hoTen.charAt(0)}</div>
                    <div>
                        <div class="admin-user-cell__name">${a.hoTen}</div>
                        <div class="admin-user-cell__sub">${a.id}</div>
                    </div>
                </div>
            </td>
            <td style="color:#64748b;">${a.email}</td>
            <td>${userStatusBadge(a.trangThai)}</td>
            <td style="color:#94a3b8; white-space:nowrap;">${a.ngayTao}</td>
            <td>
                <div class="admin-action-btns">
                    ${a.trangThai === 'LOCKED'
                        ? `<button class="admin-action-btn admin-action-btn--unlock" title="Mở khóa" onclick="toggleAdminLock('${a.id}')"><i class='bx bx-lock-open'></i></button>`
                        : `<button class="admin-action-btn admin-action-btn--lock"   title="Khóa"    onclick="toggleAdminLock('${a.id}')"><i class='bx bx-lock'></i></button>`
                    }
                    <button class="admin-action-btn admin-action-btn--reject" title="Xóa tài khoản" onclick="deleteAdmin('${a.id}')">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterAdmins() {
    const kw = document.getElementById('adminSearch').value.toLowerCase();
    renderAdmins(mockAdmins.filter(a => !kw || a.hoTen.toLowerCase().includes(kw) || a.email.toLowerCase().includes(kw)));
}

function toggleAdminLock(id) {
    // TODO (Java): PUT /api/admin/admins/{id}/lock
    const a = mockAdmins.find(x => x.id === id);
    if (!a) return;
    a.trangThai = a.trangThai === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    renderAdmins();
    showToast(a.trangThai === 'LOCKED' ? 'Đã khóa admin ' + a.hoTen : 'Đã mở khóa admin ' + a.hoTen,
              a.trangThai === 'LOCKED' ? 'error' : 'success');
}

function deleteAdmin(id) {
    // TODO (Java): DELETE /api/admin/admins/{id}
    if (!confirm('Bạn có chắc muốn xóa tài khoản admin này?')) return;
    const idx = mockAdmins.findIndex(x => x.id === id);
    if (idx === -1) return;
    const name = mockAdmins[idx].hoTen;
    mockAdmins.splice(idx, 1);
    renderAdmins();
    showToast('Đã xóa tài khoản ' + name, 'error');
}

function openCreateAdminModal() {
    ['newAdminName','newAdminEmail','newAdminPassword'].forEach(id => document.getElementById(id).value = '');
    ['err-newAdminName','err-newAdminEmail','err-newAdminPassword'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = ''; el.classList.remove('show');
    });
    openModal('createAdmin');
}

function submitCreateAdmin() {
    const name  = document.getElementById('newAdminName').value.trim();
    const email = document.getElementById('newAdminEmail').value.trim();
    const pw    = document.getElementById('newAdminPassword').value;
    let valid   = true;

    const setErr = (id, msg) => {
        const el = document.getElementById(id);
        el.textContent = msg; el.classList.toggle('show', !!msg);
        if (msg) valid = false;
    };

    setErr('err-newAdminName',     !name  ? 'Vui lòng nhập họ tên.' : '');
    setErr('err-newAdminEmail',    !email ? 'Vui lòng nhập email.'   : '');
    setErr('err-newAdminPassword', pw.length < 8 ? 'Mật khẩu tối thiểu 8 ký tự.' : '');

    if (!valid) return;

    // TODO (Java): POST /api/admin/admins  body: { hoTen, email, matKhau }
    const newAdmin = {
        id: 'A' + Date.now().toString().slice(-3),
        hoTen: name, email, trangThai: 'ACTIVE',
        ngayTao: new Date().toLocaleDateString('vi-VN'),
    };
    mockAdmins.unshift(newAdmin);
    closeModal('createAdmin');
    renderAdmins();
    showToast('Đã tạo tài khoản admin ' + name, 'success');
}


// ============================================================
//  MODAL HELPERS
// ============================================================
function openModal(name) {
    document.getElementById(name + 'Overlay').classList.add('show');
    document.getElementById(name + 'Modal').classList.add('show');
}

function closeModal(name) {
    document.getElementById(name + 'Overlay').classList.remove('show');
    document.getElementById(name + 'Modal').classList.remove('show');
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        ['userDetail','reportAction','walletAction','createAdmin'].forEach(closeModal);
    }
});


// ============================================================
//  HELPERS
// ============================================================
function formatVND(num) {
    return num.toLocaleString('vi-VN') + 'đ';
}

function avatarColor(name) {
    const colors = ['#0ea5e9','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#06b6d4','#84cc16'];
    let hash = 0;
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function emptyRow(cols) {
    return `<tr><td colspan="${cols}"><div class="admin-empty"><i class='bx bx-inbox'></i><p>Không có dữ liệu.</p></div></td></tr>`;
}

function statusBadge(status) {
    const map = {
        PENDING:     'Chờ xử lý',
        IN_PROGRESS: 'Đang xử lý',
        COMPLETED:   'Hoàn tất',
        RESOLVED:    'Đã giải quyết',
        REJECTED:    'Đã từ chối',
        CANCELLED:   'Đã hủy',
        DISPUTED:    'Tranh chấp',
        APPROVED:    'Đã duyệt',
    };
    return `<span class="badge badge--${status.toLowerCase()}">${map[status] || status}</span>`;
}

function userStatusBadge(status) {
    const map = { ACTIVE: 'Hoạt động', LOCKED: 'Đã khóa', PENDING_KYC: 'Chờ KYC' };
    return `<span class="badge badge--${status.toLowerCase()}">${map[status] || status}</span>`;
}

function walletStatusBadge(status) {
    const map = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Đã từ chối' };
    return `<span class="badge badge--${status.toLowerCase()}">${map[status] || status}</span>`;
}

function roleBadge(role) {
    return `<span class="badge badge--role-${role.toLowerCase()}">${role}</span>`;
}

function kycBadge(kyc) {
    const map = { APPROVED: 'Đã xác minh', PENDING: 'Đang xét', NONE: 'Chưa KYC' };
    return `<span class="badge badge--kyc-${kyc.toLowerCase()}">${map[kyc] || kyc}</span>`;
}

function showToast(msg, type = 'info') {
    const toast = document.getElementById('adminToast');
    toast.textContent = msg;
    toast.className = `admin-toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}