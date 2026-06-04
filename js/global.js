// ============================================================
//  global.js — Auth helpers + Store dùng chung toàn bộ trang
// ============================================================

// ============================================================
//  STORE — Kho dữ liệu trung tâm, lưu vào localStorage
//  Tất cả các trang đọc/ghi qua Store thay vì mock data cục bộ
// ============================================================
const STORE_KEY = 'escrow_store_v1';

const Store = (() => {
    const DEFAULT = {
        users: [
            {
                id: 1,
                tenDangNhap: 'owner',
                matKhau: 'owner123',
                hoTen: 'Nguyễn Văn Owner',
                email: 'owner@escrow.vn',
                soDienThoai: '0901234567',
                facebook: 'fb.com/owner',
                tiktok: '@owner',
                role: 'OWNER',
                kycStatus: 'APPROVED',
                emailVerified: true,
                trangThai: 'ACTIVE',
                ngayTao: '01/01/2026',
            }
        ],
        wallets: [
            { id: 1, userId: 1, soDuKhaDung: 1000000000, soDuKyQuy: 0 }
        ],
        walletHistory: [],
        walletRequests: [],
        p2pTransactions: [],
        reports: [],
        notifications: [],
        _nextId: { user: 2, wallet: 2, walletHistory: 1, walletRequest: 1, transaction: 1, report: 1, notification: 1 },
    };

    function load() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT));
        } catch {
            return JSON.parse(JSON.stringify(DEFAULT));
        }
    }

    function save(data) {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
    }

    function nextId(data, key) {
        const id = data._nextId[key]++;
        save(data);
        return id;
    }

    function now() {
        return new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return {
        // ── USERS ──────────────────────────────────────────────
        getUsers() {
            return load().users;
        },
        getUserById(id) {
            return load().users.find(u => u.id === Number(id));
        },
        getUserByLogin(input) {
            const q = input.toLowerCase();
            return load().users.find(u =>
                u.tenDangNhap.toLowerCase() === q || u.email.toLowerCase() === q
            );
        },
        createUser(fields) {
            const data = load();
            const id   = data._nextId.user++;
            const user = {
                id,
                trangThai: 'ACTIVE',
                kycStatus: 'NONE',
                emailVerified: false,
                ngayTao: now().split(',')[0].trim(),
                ...fields,
            };
            data.users.push(user);
            // Tạo ví trống cho user mới
            data.wallets.push({ id: data._nextId.wallet++, userId: id, soDuKhaDung: 0, soDuKyQuy: 0 });
            save(data);
            return user;
        },
        updateUser(id, fields) {
            const data = load();
            const idx  = data.users.findIndex(u => u.id === Number(id));
            if (idx === -1) return false;
            data.users[idx] = { ...data.users[idx], ...fields };
            save(data);
            return data.users[idx];
        },

        // ── WALLETS ────────────────────────────────────────────
        getWallet(userId) {
            return load().wallets.find(w => w.userId === Number(userId));
        },
        getAllWallets() {
            return load().wallets;
        },

        // ── WALLET HISTORY ─────────────────────────────────────
        getWalletHistory(userId) {
            return load().walletHistory.filter(h => h.userId === Number(userId));
        },
        getAllWalletHistory() {
            return load().walletHistory;
        },

        // Ghi nhận biến động ví (nội bộ)
        _recordWalletChange(data, { userId, performedBy, loai, soTien, soDuTruoc, soDuSau, ghiChu }) {
            data.walletHistory.push({
                id: data._nextId.walletHistory++,
                userId: Number(userId),
                performedBy: Number(performedBy),
                loai,        // DEPOSIT | WITHDRAW | FREEZE | RELEASE | REFUND
                soTien,
                soDuTruoc,
                soDuSau,
                ghiChu: ghiChu || '',
                thoiGian: now(),
            });
        },

        // ── WALLET REQUESTS ────────────────────────────────────
        getWalletRequests(userId) {
            return load().walletRequests.filter(r => r.userId === Number(userId));
        },
        getAllWalletRequests() {
            return load().walletRequests;
        },
        createWalletRequest({ userId, loai, soTien, nganHang }) {
            const data = load();
            const req  = {
                id: data._nextId.walletRequest++,
                userId: Number(userId),
                loai,    // DEPOSIT | WITHDRAW
                soTien,
                nganHang,
                trangThai: 'PENDING',
                adminId: null,
                thoiGian: now(),
            };
            data.walletRequests.push(req);
            save(data);
            return req;
        },
        approveWalletRequest(reqId, adminId) {
            const data = load();
            const req  = data.walletRequests.find(r => r.id === Number(reqId));
            if (!req || req.trangThai !== 'PENDING') return false;

            const userWallet  = data.wallets.find(w => w.userId === req.userId);
            if (!userWallet) return false;

            // Tiền luôn đến/từ ví Owner — bảo toàn tổng cung
            const ownerUser   = data.users.find(u => u.role === 'OWNER');
            const ownerWallet = ownerUser ? data.wallets.find(w => w.userId === ownerUser.id) : null;

            const userBefore = userWallet.soDuKhaDung;

            if (req.loai === 'DEPOSIT') {
                // Kiểm tra owner đủ tiền
                if (!ownerWallet || ownerWallet.soDuKhaDung < req.soTien)
                    return 'INSUFFICIENT_OWNER';

                // Trừ ví owner, cộng ví user
                const ownerBefore = ownerWallet.soDuKhaDung;
                ownerWallet.soDuKhaDung -= req.soTien;
                userWallet.soDuKhaDung  += req.soTien;

                this._recordWalletChange(data, {
                    userId: ownerUser.id, performedBy: adminId,
                    loai: 'WITHDRAW', soTien: req.soTien,
                    soDuTruoc: ownerBefore, soDuSau: ownerWallet.soDuKhaDung,
                    ghiChu: `Duyệt nạp tiền cho tài khoản #${req.userId}`,
                });
            } else {
                // WITHDRAW: trừ ví user, hoàn về ví owner
                if (userWallet.soDuKhaDung < req.soTien) return false;

                const ownerBefore = ownerWallet ? ownerWallet.soDuKhaDung : 0;
                userWallet.soDuKhaDung -= req.soTien;
                if (ownerWallet) {
                    ownerWallet.soDuKhaDung += req.soTien;
                    this._recordWalletChange(data, {
                        userId: ownerUser.id, performedBy: adminId,
                        loai: 'DEPOSIT', soTien: req.soTien,
                        soDuTruoc: ownerBefore, soDuSau: ownerWallet.soDuKhaDung,
                        ghiChu: `Nhận lại từ rút tiền tài khoản #${req.userId}`,
                    });
                }
            }

            req.trangThai = 'APPROVED';
            req.adminId   = Number(adminId);

            this._recordWalletChange(data, {
                userId: req.userId, performedBy: adminId,
                loai: req.loai, soTien: req.soTien,
                soDuTruoc: userBefore, soDuSau: userWallet.soDuKhaDung,
                ghiChu: req.loai === 'DEPOSIT' ? 'Nạp tiền được duyệt' : 'Rút tiền được duyệt',
            });
            save(data);
            return true;
        },
        rejectWalletRequest(reqId, adminId) {
            const data = load();
            const req  = data.walletRequests.find(r => r.id === Number(reqId));
            if (!req || req.trangThai !== 'PENDING') return false;
            req.trangThai = 'REJECTED';
            req.adminId   = Number(adminId);
            save(data);
            return true;
        },

        // Nạp tiền trực tiếp (Owner → User) — trừ ví owner, cộng ví user
        directDeposit({ toUserId, amount, performedBy, ghiChu }) {
            const data        = load();
            const toWallet    = data.wallets.find(w => w.userId === Number(toUserId));
            if (!toWallet) return false;

            const ownerUser   = data.users.find(u => u.role === 'OWNER');
            const ownerWallet = ownerUser ? data.wallets.find(w => w.userId === ownerUser.id) : null;

            if (!ownerWallet || ownerWallet.soDuKhaDung < amount) return 'INSUFFICIENT_OWNER';

            const ownerBefore = ownerWallet.soDuKhaDung;
            const toBefore    = toWallet.soDuKhaDung;

            ownerWallet.soDuKhaDung -= amount;
            toWallet.soDuKhaDung    += amount;

            // Ghi lịch sử trừ ví owner
            this._recordWalletChange(data, {
                userId: ownerUser.id, performedBy,
                loai: 'WITHDRAW', soTien: amount,
                soDuTruoc: ownerBefore, soDuSau: ownerWallet.soDuKhaDung,
                ghiChu: ghiChu || `Chuyển trực tiếp cho tài khoản #${toUserId}`,
            });
            // Ghi lịch sử cộng ví user
            this._recordWalletChange(data, {
                userId: toUserId, performedBy,
                loai: 'DEPOSIT', soTien: amount,
                soDuTruoc: toBefore, soDuSau: toWallet.soDuKhaDung,
                ghiChu: ghiChu || 'Nạp tiền trực tiếp từ Owner',
            });
            save(data);
            return true;
        },

        // ── P2P TRANSACTIONS ───────────────────────────────────
        getMyTransactions(userId) {
            return load().p2pTransactions.filter(t =>
                t.nguoiTaoId === Number(userId) || t.nguoiThamGiaId === Number(userId)
            );
        },
        getAllTransactions() {
            return load().p2pTransactions;
        },
        createTransaction(fields) {
            const data = load();
            const t    = { id: data._nextId.transaction++, trangThai: 'PENDING', thoiGianTao: now(), ...fields };
            data.p2pTransactions.push(t);
            save(data);
            return t;
        },

        // ── REPORTS ────────────────────────────────────────────
        getMyReports(userId) {
            return load().reports.filter(r => r.userId === Number(userId));
        },
        getAllReports() {
            return load().reports;
        },
        createReport(fields) {
            const data = load();
            const r    = { id: data._nextId.report++, trangThai: 'PENDING', thoiGianTao: now(), ...fields };
            data.reports.push(r);
            save(data);
            return r;
        },

        // ── NOTIFICATIONS ──────────────────────────────────────
        getNotifications(userId) {
            return load().notifications.filter(n => n.userId === Number(userId)).reverse();
        },
        markNotificationRead(notifId) {
            const data = load();
            const n = data.notifications.find(n => n.id === Number(notifId));
            if (n) { n.daDoc = true; save(data); }
        },
        markAllNotificationsRead(userId) {
            const data = load();
            data.notifications.filter(n => n.userId === Number(userId)).forEach(n => n.daDoc = true);
            save(data);
        },
        addNotification({ userId, tieuDe, noiDung, loai }) {
            const data = load();
            data.notifications.push({
                id: data._nextId.notification++,
                userId: Number(userId),
                tieuDe, noiDung, loai: loai || 'HE_THONG',
                daDoc: false, thoiGian: now(),
            });
            save(data);
        },

        // ── BANK ACCOUNTS (stored in user object) ─────────────
        getBankAccounts(userId) {
            const u = this.getUserById(userId);
            return (u && u.bankAccounts) ? u.bankAccounts : [];
        },
        addBankAccount(userId, { tenNganHang, soTaiKhoan, tenChuTK }) {
            const data = load();
            const idx  = data.users.findIndex(u => u.id === Number(userId));
            if (idx === -1) return false;
            if (!data.users[idx].bankAccounts) data.users[idx].bankAccounts = [];
            const isFirst = data.users[idx].bankAccounts.length === 0;
            data.users[idx].bankAccounts.push({
                id: Date.now(), tenNganHang, soTaiKhoan, tenChuTK, laMacDinh: isFirst,
            });
            save(data);
            return true;
        },
        removeBankAccount(userId, accountId) {
            const data = load();
            const idx  = data.users.findIndex(u => u.id === Number(userId));
            if (idx === -1) return false;
            const banks = data.users[idx].bankAccounts || [];
            data.users[idx].bankAccounts = banks.filter(b => b.id !== accountId);
            save(data);
            return true;
        },
        hasBankAccount(userId) {
            return this.getBankAccounts(userId).length > 0;
        },

        // ── KYC ────────────────────────────────────────────────
        approveKYC(userId, approverId, approved, rejectReason) {
            const data      = load();
            const userIdx   = data.users.findIndex(u => u.id === Number(userId));
            const approver  = data.users.find(u => u.id === Number(approverId));
            if (userIdx === -1) return false;

            data.users[userIdx].kycStatus      = approved ? 'APPROVED' : 'REJECTED';
            data.users[userIdx].kycNguoiDuyet  = approver ? approver.hoTen : 'Admin';
            data.users[userIdx].kycThoiGianDuyet = new Date().toLocaleString('vi-VN');
            if (!approved) data.users[userIdx].kycRejectReason = rejectReason || 'Hồ sơ không hợp lệ.';

            // Thông báo cho user
            data.notifications.push({
                id: data._nextId.notification++,
                userId: Number(userId),
                tieuDe: approved ? 'KYC được duyệt ✓' : 'KYC bị từ chối',
                noiDung: approved
                    ? `Hồ sơ KYC của bạn đã được duyệt bởi ${data.users[userIdx].kycNguoiDuyet}.`
                    : `Hồ sơ KYC bị từ chối. Lý do: ${data.users[userIdx].kycRejectReason}`,
                loai: 'HE_THONG', daDoc: false,
                thoiGian: new Date().toLocaleString('vi-VN'),
            });

            save(data);
            return true;
        },

        // ── RESET ──────────────────────────────────────────────
        reset() {
            localStorage.removeItem(STORE_KEY);
            location.reload();
        },
    };
})();

// ============================================================
//  AUTH STATE
//  localStorage keys:
//    'escrow_token' — JWT token (string)
//    'escrow_user'  — JSON user object
// ============================================================

/**
 * Trả về user object từ localStorage, hoặc null nếu chưa đăng nhập.
 * kycStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED'
 */
function getAuthUser() {
    try {
        const raw = localStorage.getItem('escrow_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function getAuthToken() {
    return localStorage.getItem('escrow_token');
}

function isLoggedIn() {
    return !!getAuthToken() && !!getAuthUser();
}

function logout() {
    localStorage.removeItem('escrow_token');
    localStorage.removeItem('escrow_user');
    window.location.href = '/html/index.html';
}

// ============================================================
//  HEADER AUTH — cập nhật Đăng Ký / Đăng Nhập theo trạng thái
// ============================================================
function renderHeaderAuth() {
    const registerLink = document.querySelector('a[href*="register.html"]');
    const loginLink    = document.querySelector('a[href*="login.html"]');
    if (!registerLink || !loginLink) return;

    const user = getAuthUser();
    if (!user) return; // chưa đăng nhập → giữ nguyên

    const parent = registerLink.parentElement;

    // Xóa: link Đăng Ký, dấu | giữa, link Đăng Nhập
    const sep = loginLink.previousElementSibling;
    registerLink.remove();
    if (sep && sep.tagName === 'SPAN') sep.remove();
    loginLink.remove();

    // Xây dựng các link mới
    const dashUrl = user.role === 'OWNER'
        ? '/html/pages/admin/owner-dashboard.html'
        : user.role === 'ADMIN'
        ? '/html/pages/admin/admin-dashboard.html'
        : null;

    const html = [
        `<a href="/html/pages/profile.html" class="header-top__link">
            <i class="bx bx-user-circle"></i> ${user.hoTen}
        </a>`,
        dashUrl
            ? `<span>|</span>
               <a href="${dashUrl}" class="header-top__link">
                   <i class="bx bx-layout"></i> Dashboard
               </a>`
            : '',
        `<span>|</span>
         <a href="#" class="header-top__link" id="logoutBtn">
             <i class="bx bx-log-out"></i> Đăng Xuất
         </a>`,
    ].join('');

    parent.insertAdjacentHTML('beforeend', html);
    document.getElementById('logoutBtn')
        .addEventListener('click', e => { e.preventDefault(); logout(); });
}

// ============================================================
//  HEADER SEARCH — tra cứu tài khoản người dùng
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderHeaderAuth();

    const searchInput = document.querySelector('.header-mid__search input');
    const searchBtn   = document.querySelector('.header-mid__search button');
    if (searchInput && searchBtn) {
        const doSearch = () => {
            const q = searchInput.value.trim();
            if (!q) return;
            window.location.href = `/html/pages/profile.html?q=${encodeURIComponent(q)}`;
        };
        searchBtn.addEventListener('click', doSearch);
        searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

        const currentQ = new URLSearchParams(window.location.search).get('q');
        if (currentQ) searchInput.value = currentQ;
    }
});

// ============================================================
//  AUTH GATE — hiện thông báo thay vì nội dung trang
// ============================================================

/**
 * Thay toàn bộ nội dung <main> bằng gate "Đăng nhập để tiếp tục".
 * @param {HTMLElement} mainEl - phần tử <main> của trang
 */
function showLoginGate(mainEl) {
    mainEl.innerHTML = `
        <div class="auth-gate">
            <div class="auth-gate__card">
                <i class="bx bx-lock-alt auth-gate__icon"></i>
                <h2 class="auth-gate__title">Bạn chưa đăng nhập</h2>
                <p class="auth-gate__desc">
                    Vui lòng đăng nhập để sử dụng tính năng này.
                </p>
                <div class="auth-gate__actions">
                    <a href="/html/pages/login.html" class="auth-gate__btn auth-gate__btn--primary">
                        <i class="bx bx-log-in-circle"></i> Đăng Nhập
                    </a>
                    <a href="/html/pages/register.html" class="auth-gate__btn auth-gate__btn--secondary">
                        Tạo tài khoản mới
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Thay toàn bộ nội dung <main> bằng gate "Xác minh KYC".
 * @param {HTMLElement} mainEl
 */
function showKYCGate(mainEl) {
    const user = getAuthUser();
    const isPending = user && user.kycStatus === 'PENDING';

    mainEl.innerHTML = `
        <div class="auth-gate">
            <div class="auth-gate__card">
                <i class="bx bx-shield-quarter auth-gate__icon auth-gate__icon--kyc"></i>
                <h2 class="auth-gate__title">Xác minh danh tính (KYC)</h2>
                <p class="auth-gate__desc">
                    ${isPending
                        ? 'Hồ sơ KYC của bạn đang được xét duyệt. Vui lòng chờ xác nhận.'
                        : 'Bạn cần hoàn tất xác minh danh tính (KYC) để sử dụng tính năng giao dịch P2P.'}
                </p>
                ${!isPending ? `
                <div class="auth-gate__actions">
                    <a href="/html/pages/settings.html?section=kyc" class="auth-gate__btn auth-gate__btn--primary">
                        <i class="bx bx-id-card"></i> Xác Minh Ngay
                    </a>
                </div>` : ''}
                <p class="auth-gate__hint">
                    Sau khi được duyệt, bạn có thể làm mới trang để tiếp tục.
                </p>
            </div>
        </div>
    `;
}
