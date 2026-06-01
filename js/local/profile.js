// ============================================================
//  profile.js
//  Mọi data đều được fill từ đây vào HTML.
//  Khi có backend Java, chỉ cần:
//    1. Xóa phần MOCK DATA
//    2. Bỏ comment phần TODO: fetch(...)
//    3. Giữ nguyên các hàm render / helper
// ============================================================


// ============================================================
//  MOCK DATA — XÓA KHI KẾT NỐI BACKEND
// ============================================================

/**
 * TODO (Java): GET /api/users/me
 * Response mapping:
 *   hoTen         → NguoiDung.HoTen
 *   soDienThoai   → NguoiDung.SoDienThoai
 *   email         → NguoiDung.Email
 *   facebook      → (bảng mở rộng hoặc thêm cột vào NguoiDung)
 *   tiktok        → (tương tự)
 *   thoiGianTao   → NguoiDung.ThoiGianTao
 *   soGDThanhCong → COUNT từ GiaoDichP2P WHERE TrangThai = COMPLETED
 *   tongGD        → COUNT từ GiaoDichP2P
 *   diemDanhGia   → AVG từ DanhGia.SoSao
 *   soTooCao      → COUNT từ TranhChap WHERE MaNguoiKhieuNai = userId
 */
const mockUser = {
    hoTen:         'Nguyễn Văn A',
    soDienThoai:   '0123 456 789',
    email:         'nguyenvana@gmail.com',
    facebook:      'fb.com/nguyenvana',
    tiktok:        '@nguyenvana',
    thoiGianTao:   '15/03/2023',
    trangThai:     'Tài khoản đang hoạt động',
    soGDThanhCong: 142,
    tongGD:        156,
    diemDanhGia:   4.8,
    soToCao:       2,
};

/**
 * TODO (Java): GET /api/users/me/transactions?page=0&size=20
 * Response mapping (mỗi item):
 *   id        → GiaoDichP2P.MaGiaoDich
 *   type      → 'BUY' nếu MaNguoiMua = currentUser, 'SELL' nếu MaNguoiBan = currentUser
 *   partner   → NguoiDung.HoTen (người còn lại trong giao dịch)
 *   date      → GiaoDichP2P.ThoiGianTao (format dd/MM/yyyy · HH:mm)
 *   amount    → GiaoDichP2P.SoTien (âm nếu BUY, dương nếu SELL)
 *   status    → TrangThaiGiaoDich.MaCode ('SUCCESS' | 'FAIL' | ...)
 *   rating    → DanhGia.SoSao (null nếu chưa có)
 *   comment   → DanhGia.NhanXet (null nếu chưa có)
 *   product   → GiaoDichP2P.MoTaSanPham
 */
const mockTransactions = [
    {
        id: 'GD250531142210', type: 'BUY',  partner: 'seller_xyz',
        date: '31/05/2025 · 14:22', amount: '-1.250.000đ',
        status: 'SUCCESS', rating: 5,
        comment: 'Giao dịch nhanh, uy tín! Rất hài lòng.',
        product: 'iPhone 13 Pro Max 256GB',
    },
    {
        id: 'GD250531101533', type: 'SELL', partner: 'buyer_abc',
        date: '31/05/2025 · 10:15', amount: '+2.500.000đ',
        status: 'SUCCESS', rating: 4,
        comment: 'Hàng đúng mô tả, người bán nhiệt tình.',
        product: 'MacBook Air M1',
    },
    {
        id: 'GD250529112005', type: 'BUY',  partner: 'seller_999',
        date: '29/05/2025 · 11:20', amount: '-2.000.000đ',
        status: 'FAIL', rating: null, comment: null,
        product: 'Samsung Galaxy S24',
    },
    {
        id: 'GD250522192211', type: 'SELL', partner: 'buyer_kkk',
        date: '22/05/2025 · 19:22', amount: '+3.200.000đ',
        status: 'SUCCESS', rating: 5,
        comment: 'Rất hài lòng, sẽ giao dịch lại lần sau!',
        product: 'AirPods Pro 2',
    },
    {
        id: 'GD250521101500', type: 'SELL', partner: 'buyer_new1',
        date: '21/05/2025 · 10:15', amount: '-750.000đ',
        status: 'FAIL', rating: null, comment: null,
        product: 'Chuột Logitech MX Master 3',
    },
];

/**
 * TODO (Java): GET /api/users/me/reports?page=0&size=20
 * Response mapping (mỗi item):
 *   id           → TranhChap.MaTranhChap
 *   maGiaoDich   → TranhChap.MaGiaoDich
 *   type         → GiaoDichP2P.type (BUY/SELL — để hiện badge)
 *   partner      → NguoiDung.HoTen (người tố cáo = TranhChap.MaNguoiKhieuNai)
 *   date         → TranhChap.ThoiGianTao
 *   content      → TranhChap.LyDoKhieuNai
 *   status       → TranhChap.TrangThai ('RESOLVED' | 'PENDING' | 'IN_PROGRESS')
 *   adminXuLy    → NguoiDung.HoTen (TranhChap.MaAdminXuLy, null nếu chưa xử lý)
 *   thoiGianXuLy → TranhChap.ThoiGianXuLy (null nếu chưa xử lý)
 *   ketQua       → TranhChap.KetLuan
 */
const mockReports = [
    {
        id: 'TC001',
        maGiaoDich:   'GD250529112005',
        type:         'BUY',
        partner:      'user_abc123',
        date:         '25/05/2025 · 09:30',
        content:      'Không giao hàng đúng cam kết, sản phẩm không đúng mô tả.',
        status:       'RESOLVED',
        adminXuLy:    'admin_nguyen',
        thoiGianXuLy: '26/05/2025 · 10:00',
        ketQua:       'Hoàn tiền cho người mua.',
    },
    {
        id: 'TC002',
        maGiaoDich:   'GD250521101500',
        type:         'SELL',
        partner:      'user_xyz789',
        date:         '10/04/2025 · 14:00',
        content:      'Giao dịch chậm trễ, không phản hồi tin nhắn trong 2 giờ.',
        status:       'PENDING',
        adminXuLy:    null,
        thoiGianXuLy: null,
        ketQua:       null,
    },
];


// ============================================================
//  LOAD PROFILE CARD
//  TODO: thay mockUser bằng fetch('/api/users/me')
// ============================================================
function loadUserProfile(user) {
    // Avatar: lấy chữ cái đầu của từ cuối trong tên (tên riêng tiếng Việt)
    const parts = user.hoTen.trim().split(' ');
    document.getElementById('userAvatar').textContent =
        parts[parts.length - 1].charAt(0).toUpperCase();

    document.getElementById('userName').textContent    = user.hoTen;
    document.getElementById('userStatus').textContent  = user.trangThai;

    // Thông tin cá nhân — mặc định ẩn, dùng setupPrivacyToggle
    document.getElementById('phoneValue').textContent  = user.soDienThoai;
    document.getElementById('emailValue').textContent  = user.email;
    document.getElementById('fbValue').textContent     = user.facebook;
    document.getElementById('tiktokValue').textContent = user.tiktok;
    document.getElementById('joinDate').textContent    = user.thoiGianTao;

    // Thống kê
    const rate = Math.round((user.soGDThanhCong / user.tongGD) * 100);
    document.getElementById('successCount').textContent = user.soGDThanhCong;
    document.getElementById('totalCount').textContent   = user.tongGD;
    document.getElementById('rateFill').style.width     = rate + '%';
    document.getElementById('rateText').textContent     = rate + '%';

    // Uy tín
    document.getElementById('avgRating').textContent  = user.diemDanhGia;
    document.getElementById('repStars').innerHTML     = renderStars(user.diemDanhGia);
    document.getElementById('reportCount').textContent = user.soToCao;
}


// ============================================================
//  TOGGLE ẨN/HIỆN THÔNG TIN CÁ NHÂN
// ============================================================
function setupPrivacyToggle(toggleId, valueId, hiddenId, iconId) {
    const btn    = document.getElementById(toggleId);
    const value  = document.getElementById(valueId);
    const hidden = document.getElementById(hiddenId);
    const icon   = document.getElementById(iconId);
    if (!btn) return;

    // Mặc định ẩn
    value.style.display  = 'none';
    hidden.style.display = 'inline';

    let isHidden = true;
    btn.addEventListener('click', () => {
        isHidden = !isHidden;
        value.style.display  = isHidden ? 'none'   : 'inline';
        hidden.style.display = isHidden ? 'inline' : 'none';
        icon.className       = isHidden ? 'bx bx-show' : 'bx bx-hide';
    });
}


// ============================================================
//  RENDER SAO
// ============================================================
function renderStars(rating) {
    if (!rating) return '<span class="gd-item__no-rating">Chưa có đánh giá</span>';
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating))  html += `<i class='bx bxs-star'></i>`;
        else if (i - rating < 1)      html += `<i class='bx bxs-star-half'></i>`;
        else                          html += `<i class='bx bx-star'></i>`;
    }
    return html;
}


// ============================================================
//  RENDER DANH SÁCH GIAO DỊCH
//  Clone từ <template id="gdTemplate">, JS chỉ điền data
//  TODO: thay mockTransactions bằng fetch('/api/users/me/transactions')
// ============================================================
function renderTransactions(list) {
    const container = document.getElementById('gdList');
    const tpl       = document.getElementById('gdTemplate');
    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = `<div class="gd-empty"><i class='bx bx-transfer-alt'></i>Chưa có giao dịch nào.</div>`;
        return;
    }

    list.forEach(item => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.gd-item');
        el.dataset.id = item.id;

        // Badge B/S
        const isBuy = item.type === 'BUY';
        const badge = el.querySelector('.gd-item__badge');
        badge.textContent = isBuy ? 'B' : 'S';
        badge.classList.add(isBuy ? 'gd-item__badge--buy' : 'gd-item__badge--sell');

        // Info
        el.querySelector('.gd-item__partner').innerHTML =
            `${isBuy ? 'Người bán' : 'Người mua'}: <strong>${item.partner}</strong>`;
        el.querySelector('.gd-item__code').textContent = item.id;
        el.querySelector('.gd-item__date').textContent = item.date;

        // Sao (dòng 1)
        el.querySelector('.gd-item__stars').innerHTML = renderStars(item.rating);

        // Bình luận + Trạng thái (dòng 2)
        const comment = el.querySelector('.gd-item__comment');
        comment.textContent = item.comment ? `"${item.comment}"` : 'Không có bình luận';
        if (!item.comment) comment.classList.add('gd-item__comment--empty');

        const isSuccess = item.status === 'SUCCESS';
        const status    = el.querySelector('.gd-item__status');
        status.textContent = isSuccess ? 'Thành công' : 'Thất bại';
        status.classList.add(isSuccess ? 'gd-item__status--success' : 'gd-item__status--fail');

        // Số tiền (dòng 3) — mặc định ẩn
        el.querySelector('.gd-item__amount').dataset.amount = item.amount;
        el.querySelector('.gd-item__eye')
            .addEventListener('click', function () { toggleAmount(this); });

        // Nút xem chi tiết
        el.querySelector('.gd-item__detail-btn')
            .addEventListener('click', () => openTransactionDetail(item.id));

        container.appendChild(clone);
    });
}


// ============================================================
//  RENDER DANH SÁCH TỐ CÁO
//  Clone từ <template id="tcTemplate">, JS chỉ điền data
//  TODO: thay mockReports bằng fetch('/api/users/me/reports')
// ============================================================
function renderReports(list) {
    const container = document.getElementById('tcList');
    const tpl       = document.getElementById('tcTemplate');
    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = `<div class="gd-empty"><i class='bx bx-shield-alt-2'></i>Không có lịch sử tố cáo.</div>`;
        return;
    }

    list.forEach(item => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.gd-item');
        el.dataset.id = item.id;

        // Badge B/S — lấy từ giao dịch liên quan
        const isBuy = item.type === 'BUY';
        const badge = el.querySelector('.gd-item__badge');
        badge.textContent = isBuy ? 'B' : 'S';
        badge.classList.add(isBuy ? 'gd-item__badge--buy' : 'gd-item__badge--sell');

        // Info
        el.querySelector('.gd-item__partner').innerHTML =
            `Người tố cáo: <strong>${item.partner}</strong>`;
        el.querySelector('.tc-item__code').textContent  = item.maGiaoDich;
        el.querySelector('.gd-item__date').textContent  = item.date;

        // Nội dung tố cáo
        el.querySelector('.tc-item__content').textContent = item.content;

        // Admin xử lý + Trạng thái (dòng 2)
        const adminEl = el.querySelector('.tc-item__admin');
        adminEl.innerHTML = item.adminXuLy
            ? `<i class='bx bx-user-check'></i> ${item.adminXuLy}`
            : `<i class='bx bx-time'></i> Chờ admin xử lý`;
        adminEl.style.color = item.adminXuLy ? '#0ea5e9' : '#94a3b8';
        adminEl.style.fontSize = '12px';

        const isResolved = item.status === 'RESOLVED';
        const status     = el.querySelector('.gd-item__status');
        status.textContent = isResolved ? 'Đã xử lý' : 'Đang xử lý';
        status.classList.add(isResolved ? 'gd-item__status--success' : 'gd-item__status--fail');

        // Thời gian xử lý (dòng 3)
        const resolvedAt = el.querySelector('.tc-item__resolved-at');
        resolvedAt.style.fontSize = '12px';
        resolvedAt.style.color    = '#94a3b8';
        resolvedAt.innerHTML = item.thoiGianXuLy
            ? `<i class='bx bx-check-circle' style="color:#16a34a"></i> Xử lý: ${item.thoiGianXuLy}`
            : `<i class='bx bx-minus-circle'></i> Chưa xử lý`;

        // Nút xem chi tiết
        el.querySelector('.gd-item__detail-btn')
            .addEventListener('click', () => openReportDetail(item.id));

        container.appendChild(clone);
    });
}



// ============================================================
//  DATE PICKER — LỌC THEO NGÀY
//  Logic hoạt động trên mock data (client-side).
//  TODO: khi có backend, gửi query param thay vì filter client:
//    fetch(`/api/users/me/transactions?from=${dateFrom}&to=${dateTo}`)
//      .then(r => r.json()).then(renderTransactions)
// ============================================================

function toggleDatePicker() {
    const picker = document.getElementById('datePicker');
    const btn    = document.getElementById('calendarBtn');
    const isOpen = picker.classList.contains('date-picker--open');
    picker.classList.toggle('date-picker--open', !isOpen);
    btn.classList.toggle('calendar-btn--active', !isOpen);
}

document.addEventListener('click', e => {
    const picker = document.getElementById('datePicker');
    const btn    = document.getElementById('calendarBtn');
    if (picker && btn && !picker.contains(e.target) && !btn.contains(e.target)) {
        picker.classList.remove('date-picker--open');
        btn.classList.remove('calendar-btn--active');
    }
});

function parseDateFromItem(dateStr) {
    const parts = dateStr.split(' · ')[0].split('/');
    if (parts.length < 3) return null;
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
}

function filterByDate() {
    const fromVal  = document.getElementById('dateFrom').value;
    const toVal    = document.getElementById('dateTo').value;
    const fromDate = fromVal ? new Date(fromVal) : null;
    const toDate   = toVal   ? new Date(toVal + 'T23:59:59') : null;

    const isGD   = document.getElementById('panelGD').style.display !== 'none';
    const items  = isGD ? mockTransactions : mockReports;
    const listId = isGD ? 'gdList' : 'tcList';

    document.querySelectorAll(`#${listId} .gd-item`).forEach(el => {
        const item = items.find(i => i.id === el.dataset.id);
        if (!item) return;
        const itemDate = parseDateFromItem(item.date);
        let visible = true;
        if (fromDate && itemDate < fromDate) visible = false;
        if (toDate   && itemDate > toDate)   visible = false;
        el.style.display = visible ? 'grid' : 'none';
    });

    const hasFilter = fromVal || toVal;
    document.getElementById('calendarBtn').classList.toggle('calendar-btn--active', !!hasFilter);
}

function clearDateFilter() {
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value   = '';
    document.querySelectorAll('.gd-item').forEach(el => el.style.display = 'grid');
    document.getElementById('calendarBtn').classList.remove('calendar-btn--active');
}

// ============================================================
//  SWITCH TAB
// ============================================================
function switchTab(tab) {
    document.getElementById('tabGD').classList.toggle('history-tab--active', tab === 'GD');
    document.getElementById('tabTC').classList.toggle('history-tab--active', tab === 'TC');
    document.getElementById('panelGD').style.display = tab === 'GD' ? 'block' : 'none';
    document.getElementById('panelTC').style.display = tab === 'TC' ? 'block' : 'none';
    document.getElementById('searchInput').value = '';
    filterList();
}


// ============================================================
//  TÌM KIẾM
// ============================================================
function filterList() {
    const kw = document.getElementById('searchInput').value.trim().toLowerCase();
    document.querySelectorAll('.gd-item').forEach(el => {
        el.style.display = el.dataset.id.toLowerCase().includes(kw) ? 'grid' : 'none';
    });
}


// ============================================================
//  TOGGLE SỐ TIỀN (trong danh sách)
// ============================================================
function toggleAmount(btn) {
    const amount   = btn.closest('.gd-item__amount-wrap').querySelector('.gd-item__amount');
    const icon     = btn.querySelector('i');
    const isHidden = amount.textContent === '***';
    amount.textContent = isHidden ? amount.dataset.amount : '***';
    amount.classList.toggle('revealed', isHidden);
    icon.className = isHidden ? 'bx bx-hide' : 'bx bx-show';
}


// ============================================================
//  MODAL CHI TIẾT GIAO DỊCH
//  TODO: fetch('/api/transactions/' + id).then(r=>r.json()).then(showTransactionModal)
// ============================================================
function openTransactionDetail(id) {
    const item = mockTransactions.find(t => t.id === id);
    if (!item) return;

    const isSuccess   = item.status === 'SUCCESS';
    const statusColor = isSuccess ? '#16a34a' : '#dc2626';
    const statusLabel = isSuccess ? 'Thành công' : 'Thất bại';
    const starsText   = item.rating
        ? '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)
        : null;

    document.getElementById('modalTitle').textContent = `Chi tiết · ${item.id}`;
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-row">
            <span class="modal-row__label">Loại giao dịch</span>
            <span class="modal-row__value">${item.type === 'BUY' ? 'Mua (Buy)' : 'Bán (Sell)'}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Đối tác</span>
            <span class="modal-row__value" style="color:#0ea5e9">${item.partner}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Sản phẩm</span>
            <span class="modal-row__value">${item.product}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Thời gian</span>
            <span class="modal-row__value">${item.date}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Số tiền</span>
            <div class="modal-row__value">
                <span class="modal-amount" id="modalAmount">***</span>
                <button class="modal-amount-eye" onclick="toggleModalAmount()">
                    <i class='bx bx-show' id="modalAmountIcon"></i>
                </button>
            </div>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Trạng thái</span>
            <span class="modal-row__value" style="color:${statusColor}">${statusLabel}</span>
        </div>
        ${item.rating
            ? `<div class="modal-rating">
                <div class="modal-rating__title">Đánh giá từ đối tác</div>
                <div class="modal-rating__stars">${starsText}</div>
                <div class="modal-rating__comment">"${item.comment}"</div>
               </div>`
            : `<div class="modal-rating" style="background:#f8fafc">
                <div class="modal-rating__title" style="color:#94a3b8">Chưa có đánh giá</div>
                <div class="modal-rating__comment" style="color:#94a3b8">Giao dịch này chưa có đánh giá từ đối tác.</div>
               </div>`
        }`;

    // Lưu amount để toggle
    document.getElementById('modalAmount').dataset.amount = item.amount;
    showModal();
}

function toggleModalAmount() {
    const el       = document.getElementById('modalAmount');
    const icon     = document.getElementById('modalAmountIcon');
    const isHidden = el.textContent === '***';
    el.textContent = isHidden ? el.dataset.amount : '***';
    icon.className = isHidden ? 'bx bx-hide' : 'bx bx-show';
}


// ============================================================
//  MODAL CHI TIẾT TỐ CÁO
//  TODO: fetch('/api/reports/' + id).then(r=>r.json()).then(showReportModal)
// ============================================================
function openReportDetail(id) {
    const item = mockReports.find(r => r.id === id);
    if (!item) return;

    const isResolved  = item.status === 'RESOLVED';
    const statusColor = isResolved ? '#16a34a' : '#f59e0b';
    const statusLabel = isResolved ? 'Đã xử lý' : 'Đang xử lý';

    document.getElementById('modalTitle').textContent = `Chi tiết tố cáo · ${item.id}`;
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-row">
            <span class="modal-row__label">Mã giao dịch</span>
            <span class="modal-row__value" style="color:#0ea5e9">${item.maGiaoDich}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Người tố cáo</span>
            <span class="modal-row__value">${item.partner}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Ngày tố cáo</span>
            <span class="modal-row__value">${item.date}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Trạng thái</span>
            <span class="modal-row__value" style="color:${statusColor}">${statusLabel}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Admin xử lý</span>
            <span class="modal-row__value">${item.adminXuLy || '—'}</span>
        </div>
        <div class="modal-row">
            <span class="modal-row__label">Thời gian xử lý</span>
            <span class="modal-row__value">${item.thoiGianXuLy || '—'}</span>
        </div>
        <div class="modal-rating" style="background:#fef9ec">
            <div class="modal-rating__title" style="color:#92400e">Nội dung tố cáo</div>
            <div class="modal-rating__comment" style="color:#374151">${item.content}</div>
        </div>
        <div class="modal-rating" style="background:#f0fdf4; margin-top:10px">
            <div class="modal-rating__title" style="color:#166534">Kết quả xử lý</div>
            <div class="modal-rating__comment" style="color:#374151">${item.ketQua || 'Chưa có kết quả.'}</div>
        </div>`;
    showModal();
}


// ============================================================
//  MODAL HELPERS
// ============================================================
function showModal() {
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modalDetail').classList.add('show');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('modalDetail').classList.remove('show');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ============================================================
//  KHỞI ĐỘNG
//  TODO: Thay bằng fetch API khi có backend
//    Promise.all([
//      fetch('/api/users/me').then(r => r.json()),
//      fetch('/api/users/me/transactions').then(r => r.json()),
//      fetch('/api/users/me/reports').then(r => r.json()),
//    ]).then(([user, transactions, reports]) => {
//      loadUserProfile(user);
//      renderTransactions(transactions);
//      renderReports(reports);
//    });
// ============================================================
loadUserProfile(mockUser);

setupPrivacyToggle('phoneToggle',  'phoneValue',  'phoneHidden',  'phoneIcon');
setupPrivacyToggle('emailToggle',  'emailValue',  'emailHidden',  'emailIcon');
setupPrivacyToggle('fbToggle',     'fbValue',     'fbHidden',     'fbIcon');
setupPrivacyToggle('tiktokToggle', 'tiktokValue', 'tiktokHidden', 'tiktokIcon');

renderTransactions(mockTransactions);
renderReports(mockReports);