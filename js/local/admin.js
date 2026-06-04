// ============================================================
//  admin.js — Logic trang Admin Panel
//  Đọc/ghi dữ liệu qua Store (localStorage)
// ============================================================

const currentAdmin = getAuthUser() || { hoTen: 'Admin', email: 'admin@escrow.vn', role: 'ADMIN' };

// ============================================================
//  KHỞI TẠO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('sidebarAvatar');
    if (currentAdmin.hoTen) {
        avatar.textContent = currentAdmin.hoTen.charAt(0).toUpperCase();
        document.getElementById('sidebarName').textContent = currentAdmin.hoTen;
    }
    renderSidebar();
    switchSection('users', document.querySelector('.admin-nav__item--active'));
});

function renderSidebar() {
    const pendingReports = Store.getAllReports().filter(r => r.trangThai === 'PENDING').length;
    const pendingWallet  = Store.getAllWalletRequests().filter(w => w.trangThai === 'PENDING').length;
    const badgeR = document.getElementById('badgeReports');
    const badgeW = document.getElementById('badgeWallet');
    if (badgeR) { badgeR.textContent = pendingReports; badgeR.style.display = pendingReports ? '' : 'none'; }
    if (badgeW) { badgeW.textContent = pendingWallet;  badgeW.style.display = pendingWallet  ? '' : 'none'; }
}


// ============================================================
//  CHUYỂN SECTION
// ============================================================
const PAGE_INFO = {
    users:        { title: 'Quản lý người dùng',    sub: 'Xem, khóa/mở khóa tài khoản người dùng' },
    transactions: { title: 'Giao dịch P2P',         sub: 'Theo dõi và quản lý các giao dịch P2P' },
    reports:      { title: 'Tố cáo',                sub: 'Tiếp nhận và xử lý tố cáo từ người dùng' },
    wallet:       { title: 'Nạp / Rút tiền',        sub: 'Duyệt yêu cầu nạp và rút tiền' },
};

let currentSection = '';

function switchSection(name, el) {
    if (currentSection) {
        const old = document.getElementById('section-' + currentSection);
        if (old) old.style.display = 'none';
    }
    currentSection = name;
    const sec = document.getElementById('section-' + name);
    if (sec) sec.style.display = 'flex';

    document.querySelectorAll('.admin-nav__item').forEach(i => i.classList.remove('admin-nav__item--active'));
    if (el) el.classList.add('admin-nav__item--active');

    const info = PAGE_INFO[name] || {};
    document.getElementById('pageTitle').textContent = info.title || name;
    document.getElementById('pageSub').textContent   = info.sub   || '';

    const renders = {
        users: renderUsers, transactions: renderTransactions,
        reports: renderAdminReports, wallet: renderWalletRequests,
    };
    if (renders[name]) renders[name]();
    return false;
}


// ============================================================
//  SECTION: NGƯỜI DÙNG
// ============================================================
function renderUsers(list) {
    // Admin chỉ thấy USER (không thấy OWNER, ADMIN)
    list = list !== undefined ? list : Store.getUsers().filter(u => u.role === 'USER');
    const tbody = document.getElementById('userTableBody');
    document.getElementById('userCount').textContent = list.length + ' người dùng';
    if (!list.length) { tbody.innerHTML = emptyRow(7); return; }

    tbody.innerHTML = list.map(u => {
        const w = Store.getWallet(u.id);
        return `<tr>
            <td>
                <div class="admin-user-cell">
                    <div class="admin-user-cell__avatar" style="background:${avatarColor(u.hoTen)}">${u.hoTen.charAt(0)}</div>
                    <div>
                        <div class="admin-user-cell__name">${u.hoTen}</div>
                        <div class="admin-user-cell__sub">${u.tenDangNhap}</div>
                    </div>
                </div>
            </td>
            <td><div>${u.email}</div><div style="font-size:11px;color:#94a3b8;">${u.soDienThoai || '—'}</div></td>
            <td style="font-weight:700;color:#10b981;">${w ? formatVND(w.soDuKhaDung) : '0đ'}</td>
            <td>${kycBadge(u.kycStatus)}</td>
            <td>${roleBadge(u.role)}</td>
            <td>${userStatusBadge(u.trangThai)}</td>
            <td style="color:#94a3b8;white-space:nowrap;">${u.ngayTao}</td>
            <td>
                <div class="admin-action-btns">
                    <button class="admin-action-btn admin-action-btn--view" onclick="openUserDetail(${u.id})"><i class='bx bx-show'></i></button>
                    ${u.trangThai === 'LOCKED'
                        ? `<button class="admin-action-btn admin-action-btn--unlock" onclick="toggleLock(${u.id})"><i class='bx bx-lock-open'></i></button>`
                        : `<button class="admin-action-btn admin-action-btn--lock"   onclick="toggleLock(${u.id})"><i class='bx bx-lock'></i></button>`}
                </div>
            </td>
        </tr>`;
    }).join('');
}

function filterUsers() {
    const kw     = document.getElementById('userSearch').value.toLowerCase();
    const status = document.getElementById('userStatusFilter').value;
    // Admin chỉ lọc trong nhóm USER
    renderUsers(Store.getUsers().filter(u => {
        if (u.role !== 'USER') return false;
        const matchKw = !kw || u.hoTen.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || (u.soDienThoai || '').includes(kw);
        return matchKw && (status === 'ALL' || u.trangThai === status);
    }));
}

function openUserDetail(id) {
    const u = Store.getUserById(id);
    if (!u) return;
    const w = Store.getWallet(id);

    const kycBlock = u.kycStatus === 'PENDING' ? `
        <div style="margin-top:16px;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
            <div style="font-weight:700;color:#92400e;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <i class='bx bx-time' style="font-size:16px;"></i> Hồ sơ KYC đang chờ duyệt
            </div>
            <div class="detail-row"><span class="detail-row__label">Họ tên (giấy tờ)</span><span class="detail-row__value">${u.kycHoTen || '—'}</span></div>
            <div class="detail-row"><span class="detail-row__label">Số CCCD</span><span class="detail-row__value">${u.kycCCCD || '—'}</span></div>
            <div class="detail-row"><span class="detail-row__label">Ngày sinh</span><span class="detail-row__value">${u.kycNgaySinh || '—'}</span></div>
            <div style="display:flex;gap:8px;margin-top:12px;">
                <button class="admin-btn admin-btn--danger"  style="flex:1;" onclick="rejectKYC(${u.id})">
                    <i class='bx bx-x-circle'></i> Từ chối KYC
                </button>
                <button class="admin-btn admin-btn--success" style="flex:1;" onclick="approveKYC(${u.id})">
                    <i class='bx bx-check-shield'></i> Duyệt KYC
                </button>
            </div>
        </div>` : (u.kycStatus === 'APPROVED' ? `
        <div style="margin-top:16px;padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:13px;color:#166534;">
            <i class='bx bx-shield-check'></i> KYC đã được duyệt bởi <strong>${u.kycNguoiDuyet || '?'}</strong> lúc ${u.kycThoiGianDuyet || '?'}
        </div>` : '');

    document.getElementById('userDetailTitle').textContent = 'Chi tiết · ' + u.hoTen;
    document.getElementById('userDetailBody').innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;padding-bottom:16px;border-bottom:1px solid #f1f5f9;">
            <div class="admin-user-cell__avatar" style="width:52px;height:52px;font-size:20px;border-radius:14px;background:${avatarColor(u.hoTen)}">${u.hoTen.charAt(0)}</div>
            <div><div style="font-size:16px;font-weight:700;color:#1e293b;">${u.hoTen}</div><div style="font-size:12px;color:#94a3b8;">${u.tenDangNhap}</div></div>
        </div>
        <div class="detail-row"><span class="detail-row__label">Email</span><span class="detail-row__value">${u.email}</span></div>
        <div class="detail-row"><span class="detail-row__label">Số điện thoại</span><span class="detail-row__value">${u.soDienThoai || '—'}</span></div>
        <div class="detail-row"><span class="detail-row__label">Số dư ví</span><span class="detail-row__value" style="font-weight:700;color:#10b981;">${w ? formatVND(w.soDuKhaDung) : '—'}</span></div>
        <div class="detail-row"><span class="detail-row__label">KYC</span><span class="detail-row__value">${kycBadge(u.kycStatus)}</span></div>
        <div class="detail-row"><span class="detail-row__label">Vai trò</span><span class="detail-row__value">${roleBadge(u.role)}</span></div>
        <div class="detail-row"><span class="detail-row__label">Trạng thái</span><span class="detail-row__value">${userStatusBadge(u.trangThai)}</span></div>
        <div class="detail-row"><span class="detail-row__label">Ngày tạo</span><span class="detail-row__value">${u.ngayTao}</span></div>
        ${kycBlock}
    `;
    // Admin chỉ được khóa USER, không được khóa OWNER/ADMIN
    const canLock = u.role === 'USER';
    document.getElementById('userDetailFooter').innerHTML = `
        <button class="admin-btn admin-btn--ghost" onclick="closeModal('userDetail')">Đóng</button>
        ${canLock ? (u.trangThai === 'LOCKED'
            ? `<button class="admin-btn admin-btn--success" onclick="toggleLock(${u.id});closeModal('userDetail')"><i class='bx bx-lock-open'></i> Mở khóa</button>`
            : `<button class="admin-btn admin-btn--danger"  onclick="toggleLock(${u.id});closeModal('userDetail')"><i class='bx bx-lock'></i> Khóa tài khoản</button>`)
        : ''}
    `;
    openModal('userDetail');
}

function approveKYC(userId) {
    if (!confirm('Duyệt KYC cho người dùng này?')) return;
    Store.approveKYC(userId, currentAdmin.id, true);
    closeModal('userDetail');
    filterUsers();
    showToast('Đã duyệt KYC thành công!', 'success');
}

function rejectKYC(userId) {
    const reason = prompt('Lý do từ chối KYC:') || 'Hồ sơ không hợp lệ.';
    Store.approveKYC(userId, currentAdmin.id, false, reason);
    closeModal('userDetail');
    filterUsers();
    showToast('Đã từ chối KYC.', 'error');
}

function toggleLock(id) {
    const u = Store.getUserById(id);
    if (!u) return;
    if (u.role !== 'USER') { showToast('Không có quyền khóa tài khoản này.', 'error'); return; }
    const newStatus = u.trangThai === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    Store.updateUser(id, { trangThai: newStatus });
    filterUsers();
    showToast(newStatus === 'LOCKED' ? 'Đã khóa tài khoản ' + u.hoTen : 'Đã mở khóa ' + u.hoTen, newStatus === 'LOCKED' ? 'error' : 'success');
}


// ============================================================
//  SECTION: GIAO DỊCH P2P
// ============================================================
function renderTransactions(list) {
    list = list !== undefined ? list : Store.getAllTransactions();
    const tbody = document.getElementById('txTableBody');
    document.getElementById('txCount').textContent = list.length + ' giao dịch';
    if (!list.length) { tbody.innerHTML = emptyRow(8); return; }

    tbody.innerHTML = list.map(t => {
        const buyer  = Store.getUserById(t.nguoiMuaId);
        const seller = Store.getUserById(t.nguoiBanId);
        return `<tr>
            <td style="font-family:monospace;color:#0ea5e9;font-size:12px;">GD${String(t.id).padStart(6,'0')}</td>
            <td>${buyer  ? buyer.hoTen  : '—'}</td>
            <td>${seller ? seller.hoTen : '—'}</td>
            <td>${t.sanPham || '—'}</td>
            <td style="font-weight:700;color:#1e293b;">${formatVND(t.soTien)}</td>
            <td>${statusBadge(t.trangThai)}</td>
            <td style="color:#94a3b8;white-space:nowrap;">${t.thoiGianTao}</td>
            <td><div class="admin-action-btns"><button class="admin-action-btn admin-action-btn--view" onclick="alert('Chi tiết GD${t.id}')"><i class='bx bx-show'></i></button></div></td>
        </tr>`;
    }).join('');
}

function filterTransactions() {
    const kw     = document.getElementById('txSearch').value.toLowerCase();
    const status = document.getElementById('txStatusFilter').value;
    renderTransactions(Store.getAllTransactions().filter(t => {
        const matchKw = !kw || String(t.id).includes(kw);
        return matchKw && (status === 'ALL' || t.trangThai === status);
    }));
}


// ============================================================
//  SECTION: TỐ CÁO
// ============================================================
function renderAdminReports(list) {
    list = list !== undefined ? list : Store.getAllReports();
    const tbody = document.getElementById('reportTableBody');
    document.getElementById('reportCount').textContent = list.length + ' tố cáo';
    if (!list.length) { tbody.innerHTML = emptyRow(7); return; }

    tbody.innerHTML = list.map(r => {
        const user = Store.getUserById(r.userId);
        return `<tr>
            <td style="font-family:monospace;color:#0ea5e9;font-size:12px;">TC${String(r.id).padStart(3,'0')}</td>
            <td>${user ? user.hoTen : '—'}</td>
            <td style="font-family:monospace;font-size:11px;color:#64748b;">GD${r.maGiaoDichId || '—'}</td>
            <td>${r.lyDo || '—'}</td>
            <td>${statusBadge(r.trangThai)}</td>
            <td style="color:#94a3b8;white-space:nowrap;">${r.thoiGianTao}</td>
            <td><div class="admin-action-btns"><button class="admin-action-btn admin-action-btn--view" onclick="openReportAction(${r.id})"><i class='bx bx-show'></i></button></div></td>
        </tr>`;
    }).join('');
}

function filterAdminReports() {
    const kw     = document.getElementById('reportSearch').value.toLowerCase();
    const status = document.getElementById('reportStatusFilter').value;
    renderAdminReports(Store.getAllReports().filter(r => {
        const user = Store.getUserById(r.userId);
        const matchKw = !kw || (user && user.hoTen.toLowerCase().includes(kw));
        return matchKw && (status === 'ALL' || r.trangThai === status);
    }));
}

function openReportAction(id) {
    const reports = Store.getAllReports();
    const r = reports.find(x => x.id === id);
    if (!r) return;
    const user = Store.getUserById(r.userId);
    document.getElementById('reportActionTitle').textContent = 'Xử lý tố cáo · TC' + String(r.id).padStart(3,'0');
    document.getElementById('reportActionBody').innerHTML = `
        <div class="detail-row"><span class="detail-row__label">Người tố cáo</span><span class="detail-row__value">${user ? user.hoTen : '—'}</span></div>
        <div class="detail-row"><span class="detail-row__label">Lý do</span><span class="detail-row__value">${r.lyDo}</span></div>
        <div class="detail-row"><span class="detail-row__label">Mô tả</span><span class="detail-row__value">${r.moTa || '—'}</span></div>
        <div class="detail-row"><span class="detail-row__label">Trạng thái</span><span class="detail-row__value">${statusBadge(r.trangThai)}</span></div>
    `;
    document.getElementById('reportActionFooter').innerHTML = `
        <button class="admin-btn admin-btn--ghost" onclick="closeModal('reportAction')">Đóng</button>
        ${r.trangThai === 'PENDING' ? `
            <button class="admin-btn admin-btn--danger"  onclick="resolveReport(${r.id},'REJECTED')"><i class='bx bx-x-circle'></i> Từ chối</button>
            <button class="admin-btn admin-btn--success" onclick="resolveReport(${r.id},'RESOLVED')"><i class='bx bx-check-circle'></i> Giải quyết</button>
        ` : ''}
    `;
    openModal('reportAction');
}

function resolveReport(id, trangThai) {
    Store.updateReport(id, { trangThai, adminId: currentAdmin.id });
    closeModal('reportAction');
    renderAdminReports();
    renderSidebar();
    showToast(trangThai === 'RESOLVED' ? 'Đã giải quyết tố cáo' : 'Đã từ chối tố cáo', trangThai === 'RESOLVED' ? 'success' : 'error');
}


// ============================================================
//  SECTION: NẠP / RÚT TIỀN
// ============================================================
function renderWalletRequests(list) {
    list = list !== undefined ? list : Store.getAllWalletRequests();
    const tbody = document.getElementById('walletTableBody');
    document.getElementById('walletCount').textContent = list.length + ' yêu cầu';
    if (!list.length) { tbody.innerHTML = emptyRow(7); return; }

    tbody.innerHTML = list.map(w => {
        const user = Store.getUserById(w.userId);
        return `<tr>
            <td><div class="admin-user-cell"><div class="admin-user-cell__avatar" style="background:${avatarColor(user ? user.hoTen : '?')}">${user ? user.hoTen.charAt(0) : '?'}</div><span style="font-weight:600;">${user ? user.hoTen : '—'}</span></div></td>
            <td>${w.loai === 'DEPOSIT' ? '<span class="badge badge--deposit">Nạp tiền</span>' : '<span class="badge badge--withdraw">Rút tiền</span>'}</td>
            <td style="font-weight:700;color:#1e293b;">${formatVND(w.soTien)}</td>
            <td style="font-size:12px;color:#64748b;">${w.nganHang || '—'}</td>
            <td>${walletStatusBadge(w.trangThai)}</td>
            <td style="color:#94a3b8;font-size:12px;white-space:nowrap;">${w.thoiGian}</td>
            <td>${w.trangThai === 'PENDING' ? `
                <div class="admin-action-btns">
                    <button class="admin-action-btn admin-action-btn--approve" onclick="approveWallet(${w.id},'APPROVED')"><i class='bx bx-check'></i></button>
                    <button class="admin-action-btn admin-action-btn--reject"  onclick="approveWallet(${w.id},'REJECTED')"><i class='bx bx-x'></i></button>
                </div>` : '<span style="font-size:12px;color:#94a3b8;">—</span>'}</td>
        </tr>`;
    }).join('');
}

function filterWalletRequests() {
    const kw     = document.getElementById('walletSearch').value.toLowerCase();
    const type   = document.getElementById('walletTypeFilter').value;
    const status = document.getElementById('walletStatusFilter').value;
    renderWalletRequests(Store.getAllWalletRequests().filter(w => {
        const user = Store.getUserById(w.userId);
        const matchKw = !kw || (user && user.hoTen.toLowerCase().includes(kw));
        return matchKw && (type === 'ALL' || w.loai === type) && (status === 'ALL' || w.trangThai === status);
    }));
}

function approveWallet(id, trangThai) {
    const ok = trangThai === 'APPROVED'
        ? Store.approveWalletRequest(id, currentAdmin.id)
        : Store.rejectWalletRequest(id, currentAdmin.id);
    if (ok === 'INSUFFICIENT_OWNER') return showToast('Ví Owner không đủ tiền để duyệt yêu cầu này.', 'error');
    if (!ok) return showToast('Không thể thực hiện thao tác này.', 'error');
    filterWalletRequests();
    renderSidebar();
    showToast(trangThai === 'APPROVED' ? 'Đã duyệt yêu cầu' : 'Đã từ chối yêu cầu', trangThai === 'APPROVED' ? 'success' : 'error');
}


// ============================================================
//  MODAL & HELPERS
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
    if (e.key === 'Escape') ['userDetail','reportAction','walletAction'].forEach(closeModal);
});

function formatVND(num) { return Number(num).toLocaleString('vi-VN') + 'đ'; }
function avatarColor(name) {
    const colors = ['#0ea5e9','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#06b6d4','#84cc16'];
    let hash = 0;
    for (let c of (name || '?')) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}
function emptyRow(cols) { return `<tr><td colspan="${cols}"><div class="admin-empty"><i class='bx bx-inbox'></i><p>Chưa có dữ liệu.</p></div></td></tr>`; }
function statusBadge(s) {
    const map = { PENDING:'Chờ xử lý', IN_PROGRESS:'Đang xử lý', COMPLETED:'Hoàn tất', RESOLVED:'Đã giải quyết', REJECTED:'Đã từ chối', CANCELLED:'Đã hủy', DISPUTED:'Tranh chấp', APPROVED:'Đã duyệt' };
    return `<span class="badge badge--${(s||'').toLowerCase()}">${map[s]||s}</span>`;
}
function userStatusBadge(s) {
    const map = { ACTIVE:'Hoạt động', LOCKED:'Đã khóa', SUSPENDED:'Đình chỉ', PENDING:'Chờ duyệt' };
    return `<span class="badge badge--${(s||'').toLowerCase()}">${map[s]||s}</span>`;
}
function walletStatusBadge(s) {
    const map = { PENDING:'Chờ duyệt', APPROVED:'Đã duyệt', REJECTED:'Đã từ chối' };
    return `<span class="badge badge--${(s||'').toLowerCase()}">${map[s]||s}</span>`;
}
function roleBadge(role) { return `<span class="badge badge--role-${(role||'user').toLowerCase()}">${role}</span>`; }
function kycBadge(kyc) {
    const map = { APPROVED:'Đã xác minh', PENDING:'Đang xét', NONE:'Chưa KYC', REJECTED:'Bị từ chối' };
    return `<span class="badge badge--kyc-${(kyc||'none').toLowerCase()}">${map[kyc]||kyc}</span>`;
}
function showToast(msg, type = 'info') {
    const toast = document.getElementById('adminToast');
    toast.textContent = msg;
    toast.className = `admin-toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3500);
}
