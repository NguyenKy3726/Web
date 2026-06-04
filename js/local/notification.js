// ============================================================
//  CUSTOM DROPDOWN — notification.js
// ============================================================
const NOTIF_DROPDOWN_ICONS = {
    ALL:      { icon: 'bx-list-ul',      color: '#64748b' },
    UNREAD:   { icon: 'bx-circle',       color: '#0ea5e9' },
    GD:       { icon: 'bx-transfer-alt', color: '#2563eb' },
    TO_CAO:   { icon: 'bx-error-circle', color: '#dc2626' },
    VI:       { icon: 'bx-wallet',       color: '#16a34a' },
    BAO_MAT:  { icon: 'bx-lock-alt',     color: '#d97706' },
    HE_THONG: { icon: 'bx-bell',         color: '#64748b' },
};

function toggleNotifDropdown() {
    const trigger = document.getElementById('notifDropdownTrigger');
    const menu    = document.getElementById('notifDropdownMenu');
    const isOpen  = menu.classList.contains('open');
    trigger.classList.toggle('open', !isOpen);
    menu.classList.toggle('open', !isOpen);
}

function selectNotifTab(key, label) {
    document.getElementById('notifDropdownMenu').classList.remove('open');
    document.getElementById('notifDropdownTrigger').classList.remove('open');
    document.getElementById('notifDropdownLabel').textContent = label;
    setTab(key);
}

document.addEventListener('click', e => {
    if (!e.target.closest('#notifDropdown')) {
        const menu    = document.getElementById('notifDropdownMenu');
        const trigger = document.getElementById('notifDropdownTrigger');
        if (menu)    menu.classList.remove('open');
        if (trigger) trigger.classList.remove('open');
    }
});

// ============================================================
//  notification.js — Trang Thông Báo
//  Tìm "TODO" để thay mock bằng API thật khi có backend Java
// ============================================================


// ============================================================
//  CẤU HÌNH LOẠI THÔNG BÁO
//  Backend mapping: ThongBao.LoaiThongBao
// ============================================================
const LOAI_MAP = {
    GD:       { icon: 'bx-transfer-alt', label: 'Giao dịch',  cls: 'icon-type--GD'       },
    TO_CAO:   { icon: 'bx-error-circle', label: 'Tố cáo',     cls: 'icon-type--TO_CAO'   },
    VI:       { icon: 'bx-wallet',       label: 'Ví',         cls: 'icon-type--VI'        },
    BAO_MAT:  { icon: 'bx-lock-alt',     label: 'Bảo mật',   cls: 'icon-type--BAO_MAT'  },
    HE_THONG: { icon: 'bx-bell',         label: 'Hệ thống',  cls: 'icon-type--HE_THONG' },
};

const TABS = [
    { key: 'ALL',      label: 'Tất cả'    },
    { key: 'UNREAD',   label: 'Chưa đọc'  },
    { key: 'GD',       label: 'Giao dịch' },
    { key: 'TO_CAO',   label: 'Tố cáo'    },
    { key: 'VI',       label: 'Ví'        },
    { key: 'BAO_MAT',  label: 'Bảo mật'  },
    { key: 'HE_THONG', label: 'Hệ thống' },
];

let currentTab = 'ALL';


// ============================================================
//  MOCK DATA — XÓA KHI KẾT NỐI BACKEND
// ============================================================

/**
 * TODO (Java): GET /api/notifications/me?page=0&size=30
 * Response mapping:
 *   id       → ThongBao.MaThongBao
 *   loai     → ThongBao.LoaiThongBao
 *   tieuDe   → ThongBao.TieuDe
 *   noiDung  → ThongBao.NoiDung
 *   thoiGian → ThongBao.ThoiGian
 *   daDoc    → ThongBao.DaDoc
 *   duongDan → ThongBao.DuongDanLienKet
 */
// Đọc thông báo từ Store
const _notifAuthUser = getAuthUser() || {};

function getNotifs() {
    return Store.getNotifications(_notifAuthUser.id).map(n => ({
        ...n,
        ngay: n.thoiGian ? n.thoiGian.split(',')[0] : '',
        duongDan: n.loai === 'GD' ? '/html/pages/p2p.html'
                : n.loai === 'VI' ? '/html/pages/wallet.html'
                : n.loai === 'TO_CAO' ? '/html/pages/report.html'
                : '#',
    }));
}

// Giữ lại để không lỗi các đoạn code cũ — sẽ không dùng
const _mockNotifs_unused = [
    {
        id: 'N001', loai: 'GD', daDoc: false,
        tieuDe: 'Giao dịch hoàn tất',
        noiDung: 'Giao dịch GD250531142210 đã hoàn thành. Tiền đã được giải ngân cho người bán.',
        thoiGian: '02/06/2026 · 09:15',
        ngay: 'Hôm nay',
        duongDan: '/html/pages/p2p.html',
    },
    {
        id: 'N002', loai: 'VI', daDoc: false,
        tieuDe: 'Nạp tiền thành công',
        noiDung: '+2.000.000đ đã được cộng vào ví của bạn từ tài khoản VCB.',
        thoiGian: '02/06/2026 · 09:00',
        ngay: 'Hôm nay',
        duongDan: '/html/pages/wallet.html',
    },
    {
        id: 'N003', loai: 'TO_CAO', daDoc: false,
        tieuDe: 'Tố cáo đã được giải quyết',
        noiDung: 'Admin đã xử lý tố cáo TC001. Kết quả: Hoàn tiền cho người mua, khóa tài khoản người bán 7 ngày.',
        thoiGian: '01/06/2026 · 14:00',
        ngay: 'Hôm qua',
        duongDan: '/html/pages/report.html',
    },
    {
        id: 'N004', loai: 'GD', daDoc: false,
        tieuDe: 'Có người tham gia giao dịch của bạn',
        noiDung: 'buyer_abc đã tham gia giao dịch GD250531101533. Tiền đã được giữ trong ví ký quỹ.',
        thoiGian: '01/06/2026 · 10:15',
        ngay: 'Hôm qua',
        duongDan: '/html/pages/p2p.html',
    },
    {
        id: 'N005', loai: 'BAO_MAT', daDoc: true,
        tieuDe: 'Đăng nhập từ thiết bị mới',
        noiDung: 'Phát hiện đăng nhập từ Safari · iPhone 14 lúc 01/06/2026 · 20:15. Nếu không phải bạn, hãy đổi mật khẩu ngay.',
        thoiGian: '01/06/2026 · 20:15',
        ngay: 'Hôm qua',
        duongDan: '/html/pages/settings.html',
    },
    {
        id: 'N006', loai: 'GD', daDoc: true,
        tieuDe: 'Giao dịch sắp hết hạn',
        noiDung: 'Giao dịch GD250530091122 còn 2 giờ trước khi hết hạn. Vui lòng xác nhận hoặc hủy.',
        thoiGian: '30/05/2026 · 22:00',
        ngay: '30/05/2026',
        duongDan: '/html/pages/p2p.html',
    },
    {
        id: 'N007', loai: 'VI', daDoc: true,
        tieuDe: 'Yêu cầu rút tiền đang xử lý',
        noiDung: 'Yêu cầu rút 500.000đ về Techcombank đang được xử lý. Thời gian dự kiến 1-2 ngày làm việc.',
        thoiGian: '30/05/2026 · 10:00',
        ngay: '30/05/2026',
        duongDan: '/html/pages/wallet.html',
    },
    {
        id: 'N008', loai: 'TO_CAO', daDoc: true,
        tieuDe: 'Bạn bị tố cáo',
        noiDung: 'user_abc123 đã gửi tố cáo liên quan đến giao dịch GD250529112005. Admin sẽ liên hệ bạn sớm.',
        thoiGian: '25/05/2026 · 09:30',
        ngay: '25/05/2026',
        duongDan: '/html/pages/report.html',
    },
    {
        id: 'N009', loai: 'HE_THONG', daDoc: true,
        tieuDe: 'Cập nhật chính sách phí dịch vụ',
        noiDung: 'ESCROW thông báo cập nhật chính sách phí giao dịch từ ngày 01/06/2026. Phí cố định 10.000đ/giao dịch.',
        thoiGian: '20/05/2026 · 08:00',
        ngay: '20/05/2026',
        duongDan: '#',
    },
    {
        id: 'N010', loai: 'BAO_MAT', daDoc: true,
        tieuDe: 'Đổi mật khẩu thành công',
        noiDung: 'Mật khẩu tài khoản của bạn đã được thay đổi thành công lúc 15/05/2026 · 13:00.',
        thoiGian: '15/05/2026 · 13:00',
        ngay: '15/05/2026',
        duongDan: '/html/pages/settings.html',
    },
]; // _mockNotifs_unused end


// ============================================================
//  RENDER CUSTOM DROPDOWN
// ============================================================
function renderTabs() {
    const menu = document.getElementById('notifDropdownMenu');
    if (!menu) return;

    menu.innerHTML = TABS.map(t => {
        let count = 0;
        const notifs = getNotifs();
        if (t.key === 'ALL')         count = notifs.length;
        else if (t.key === 'UNREAD') count = notifs.filter(n => !n.daDoc).length;
        else                         count = notifs.filter(n => n.loai === t.key).length;

        const info    = NOTIF_DROPDOWN_ICONS[t.key] || NOTIF_DROPDOWN_ICONS['ALL'];
        const isActive = t.key === currentTab;
        return `
        <div class="custom-dropdown__item ${isActive ? 'custom-dropdown__item--active' : ''}"
            onclick="selectNotifTab('${t.key}', '${t.label}')">
            <i class='bx ${info.icon}' style="color:${info.color}"></i>
            <span style="flex:1">${t.label}</span>
            ${count > 0 ? `<span class="custom-dropdown__badge">${count}</span>` : ''}
        </div>`;
    }).join('');
}

function setTab(key) {
    currentTab = key;
    const tab = TABS.find(t => t.key === key);
    if (tab && document.getElementById('notifDropdownLabel')) {
        document.getElementById('notifDropdownLabel').textContent = tab.label;
    }
    renderTabs();
    renderList();
}

// ============================================================
//  FILTER THEO NGÀY
//  TODO (Java): gửi query param ?from=&to= lên API thay vì filter client
// ============================================================
let dateFrom = null;
let dateTo   = null;

function filterByDate() {
    const fromVal = document.getElementById('dateFrom').value;
    const toVal   = document.getElementById('dateTo').value;
    dateFrom = fromVal ? new Date(fromVal) : null;
    dateTo   = toVal   ? new Date(toVal + 'T23:59:59') : null;
    renderList();
}

function clearDateFilter() {
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value   = '';
    dateFrom = null;
    dateTo   = null;
    renderList();
}

// Parse ngày từ format 'dd/MM/yyyy · HH:mm'
function parseNotifDate(str) {
    const parts = str.split(' · ')[0].split('/');
    if (parts.length < 3) return null;
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
}


// ============================================================
//  RENDER DANH SÁCH
//  Clone từ <template id="notifTemplate">
//  TODO (Java): fetch('/api/notifications/me?loai='+currentTab)
// ============================================================
function renderList() {
    const container = document.getElementById('notifList');
    const tpl       = document.getElementById('notifTemplate');
    container.innerHTML = '';

    // Lọc theo tab
    let filtered = getNotifs().filter(n => {
        if (currentTab === 'ALL')    return true;
        if (currentTab === 'UNREAD') return !n.daDoc;
        return n.loai === currentTab;
    });

    // Lọc thêm theo khoảng ngày
    if (dateFrom || dateTo) {
        filtered = filtered.filter(n => {
            const d = parseNotifDate(n.thoiGian);
            if (!d) return true;
            if (dateFrom && d < dateFrom) return false;
            if (dateTo   && d > dateTo)   return false;
            return true;
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="notif-empty">
                <i class='bx bx-bell-off'></i>
                <p>Không có thông báo nào.</p>
            </div>`;
        return;
    }

    // Nhóm theo ngày
    const groups = {};
    filtered.forEach(n => {
        if (!groups[n.ngay]) groups[n.ngay] = [];
        groups[n.ngay].push(n);
    });

    Object.entries(groups).forEach(([ngay, items]) => {
        // Separator ngày
        const sep = document.createElement('div');
        sep.className   = 'notif-date-separator';
        sep.textContent = ngay;
        container.appendChild(sep);

        items.forEach(notif => {
            const clone = tpl.content.cloneNode(true);
            const el    = clone.querySelector('.notif-item');
            el.dataset.id = notif.id;

            // Chưa đọc
            if (!notif.daDoc) el.classList.add('notif-item--unread');

            // Icon
            const loaiInfo = LOAI_MAP[notif.loai] || LOAI_MAP['HE_THONG'];
            const iconEl   = el.querySelector('.notif-item__icon');
            iconEl.classList.add(loaiInfo.cls);
            iconEl.innerHTML = `<i class='bx ${loaiInfo.icon}'></i>`;

            // Content
            el.querySelector('.notif-item__title').textContent = notif.tieuDe;
            el.querySelector('.notif-item__desc').textContent  = notif.noiDung;
            el.querySelector('.notif-item__time').innerHTML    =
                `<i class='bx bx-time-five'></i>${notif.thoiGian}`;

            // Click → đánh dấu đã đọc + navigate
            el.addEventListener('click', () => {
                markRead(notif.id);
                if (notif.duongDan && notif.duongDan !== '#') {
                    window.location.href = notif.duongDan;
                }
            });

            container.appendChild(clone);
        });
    });

    // Cập nhật unread count
    updateUnreadCount();
}


// ============================================================
//  ĐÁNH DẤU ĐÃ ĐỌC
//  TODO (Java): PUT /api/notifications/{id}/read
// ============================================================
function markRead(id) {
    Store.markNotificationRead(id);
    renderTabs();
    renderList();
}


// ============================================================
//  ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
// ============================================================
function markAllRead() {
    if (getNotifs().filter(n => !n.daDoc).length === 0) return;
    Store.markAllNotificationsRead(_notifAuthUser.id);
    renderTabs();
    renderList();
}


// ============================================================
//  CẬP NHẬT SỐ CHƯA ĐỌC
// ============================================================
function updateUnreadCount() {
    const count = getNotifs().filter(n => !n.daDoc).length;
    const el    = document.getElementById('unreadCount');
    if (el) el.textContent = count;
}


// ============================================================
//  KHỞI ĐỘNG
//  TODO (Java): fetch('/api/notifications/me')
//    .then(r => r.json())
//    .then(data => {
//      mockNotifs = data;
//      renderTabs();
//      renderList();
//    });
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (!isLoggedIn()) return showLoginGate(main);
    renderTabs();
    renderList();
});