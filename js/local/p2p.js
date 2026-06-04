// ============================================================
//  p2p.js — Toàn bộ logic trang P2P
//  Tìm "TODO" để thay mock bằng API thật khi có backend Java
// ============================================================

const FEE = 10000; // Phí cố định 10.000đ

// ============================================================
//  CÁC BƯỚC PROGRESS
//  TODO (Java): map với TrangThaiGiaoDich.MaCode trong DB
// ============================================================
const STEPS = [
    { key: 'PENDING',     label: 'Tạo Đơn' },
    { key: 'CONFIRMED',   label: 'Xác Nhận' },
    { key: 'IN_PROGRESS', label: 'Đang Giao Dịch' },
    { key: 'COMPLETED',   label: 'Hoàn Tất' },
];

// ============================================================
//  MOCK DATA — XÓA KHI KẾT NỐI BACKEND
// ============================================================

/**
 * TODO (Java): GET /api/users/me/transactions?status=active
 * Danh sách giao dịch đang tham gia
 */
// Đọc giao dịch từ Store
const _p2pAuthUser = getAuthUser() || {};
const DONE_STATUSES = ['COMPLETED', 'CANCELLED', 'EXPIRED'];

function getStoreActive() {
    return Store.getMyTransactions(_p2pAuthUser.id)
        .filter(t => !DONE_STATUSES.includes(t.trangThai))
        .map(t => {
            const isBuyer  = t.nguoiMuaId === Number(_p2pAuthUser.id);
            const partnerId = isBuyer ? t.nguoiBanId : t.nguoiMuaId;
            const partner   = Store.getUserById(partnerId);
            return {
                id:      'GD' + String(t.id).padStart(6, '0'),
                _storeId: t.id,
                type:    isBuyer ? 'BUY' : 'SELL',
                product: t.sanPham,
                status:  t.trangThai,
                partner: partner ? partner.hoTen : '—',
            };
        });
}

function getStoreHistory() {
    return Store.getMyTransactions(_p2pAuthUser.id)
        .filter(t => DONE_STATUSES.includes(t.trangThai))
        .slice(-5)
        .map(t => {
            const isBuyer  = t.nguoiMuaId === Number(_p2pAuthUser.id);
            const partnerId = isBuyer ? t.nguoiBanId : t.nguoiMuaId;
            const partner   = Store.getUserById(partnerId);
            return {
                id:      'GD' + String(t.id).padStart(6, '0'),
                _storeId: t.id,
                type:    isBuyer ? 'BUY' : 'SELL',
                product: t.sanPham,
                status:  t.trangThai,
                partner: partner ? partner.hoTen : '—',
            };
        });
}

/**
 * TODO (Java): GET /api/transactions/{code}
 */
const mockLookup = {
    'GD250531999999': {
        product: 'Samsung Galaxy S24 Ultra',
        creator: 'seller_demo',
        amount:  12000000,
        deadline: '24 giờ',
        terms: 'Máy mới 100%, full box. Không hoàn trả sau khi xác nhận.',
        status: 'PENDING',
    },
};

// Detail mock cho màn hình chi tiết
const mockDetail = {
    maGiaoDich: 'GD250531142210',
    type: 'BUY', product: 'iPhone 13 Pro Max 256GB Gold',
    amount: 5000000, deadline: '24 giờ',
    terms: 'Hàng mới 100%, còn seal. Người mua chịu phí ship.',
    status: 'IN_PROGRESS', creator: 'seller_xyz', partner: 'buyer_abc',
};

const mockMessages = [
    { sender: 'seller_xyz', text: 'Chào bạn, hàng mình còn nguyên seal nhé!', time: '14:22', isMe: false },
    { sender: 'Bạn', text: 'Ok bạn, mình đã xác nhận tham gia rồi.', time: '14:25', isMe: true },
    { sender: 'SYSTEM', text: 'Giao dịch đã chuyển sang: Đang Giao Dịch', time: '14:31', isMe: null },
];


// ============================================================
//  SWITCH ENTRY TAB (Tạo mới / Tham gia)
// ============================================================
function switchEntryTab(tab) {
    // Bỏ focus sau khi click để tránh :focus state giữ màu lạ
    document.activeElement.blur();
    const isCreate = tab === 'create';

    document.getElementById('tabCreate').classList.toggle('p2p-toggle__btn--active', isCreate);
    document.getElementById('tabJoin').classList.toggle('p2p-toggle__btn--active', !isCreate);
    document.getElementById('panelCreate').style.display = isCreate ? 'block' : 'none';
    document.getElementById('panelJoin').style.display   = isCreate ? 'none'  : 'block';
}


// ============================================================
//  FORMAT TIỀN
// ============================================================
function formatAmount(input) {
    let val = input.value.replace(/\D/g, '');
    if (!val) { input.value = ''; updateFee(); return; }
    input.value = parseInt(val).toLocaleString('vi-VN');
    updateFee();
}

function parseAmount(str) {
    return parseInt(str.replace(/\D/g, '')) || 0;
}

function formatVND(num) {
    return num.toLocaleString('vi-VN') + 'đ';
}

function updateFee() {
    const amount = parseAmount(document.getElementById('amount').value);
    const total  = amount + FEE;
    document.getElementById('feeAmount').textContent = amount ? formatVND(amount) : '—';
    document.getElementById('feeTotal').textContent  = amount ? formatVND(total)  : '—';
}


// ============================================================
//  VALIDATE TẠO GD
// ============================================================
function validateCreate() {
    let ok = true;
    const product = document.getElementById('productName').value.trim();
    const amount  = parseAmount(document.getElementById('amount').value);
    const ep = document.getElementById('err-productName');
    const ea = document.getElementById('err-amount');

    ep.textContent = ''; ep.classList.remove('show');
    ea.textContent = ''; ea.classList.remove('show');

    if (!product) {
        ep.textContent = 'Vui lòng nhập tên/mô tả sản phẩm.';
        ep.classList.add('show');
        document.getElementById('productName').classList.add('error');
        ok = false;
    } else {
        document.getElementById('productName').classList.remove('error');
    }

    if (!amount || amount < 10000) {
        ea.textContent = 'Số tiền tối thiểu là 10.000đ.';
        ea.classList.add('show');
        document.getElementById('amount').classList.add('error');
        ok = false;
    } else {
        document.getElementById('amount').classList.remove('error');
    }

    return ok;
}


// ============================================================
//  TẠO GIAO DỊCH
//  TODO (Java): POST /api/transactions
//  Body: { loaiGiaoDich, moTaSanPham, soTien, dieuKhoan, thoiHan }
//  Response: { maGiaoDich, trangThai, ... }
// ============================================================
function createTransaction() {
    if (!Store.hasBankAccount(_p2pAuthUser.id)) {
        alert('Bạn cần thêm tài khoản ngân hàng trước khi tạo giao dịch P2P.\nVui lòng vào trang Ví để thêm tài khoản.');
        return;
    }
    if (!validateCreate()) return;

    const role    = document.querySelector('input[name="role"]:checked').value;
    const product = document.getElementById('productName').value.trim();
    const amount  = parseAmount(document.getElementById('amount').value);
    const terms   = document.getElementById('terms').value.trim();
    const deadline = document.querySelector('input[name="deadline"]:checked').value;

    showConfirmModal(
        'Xác nhận tạo giao dịch',
        `Tạo giao dịch <strong>${product}</strong><br>
         Số tiền: <strong>${formatVND(amount)}</strong><br>
         Phí dịch vụ: <strong>${formatVND(FEE)}</strong><br>
         Thời hạn: <strong>${deadline} giờ</strong>`,
        () => {
            // Lưu vào Store
            const isBuyer = role === 'BUY';
            const stored  = Store.createTransaction({
                nguoiMuaId: isBuyer ? _p2pAuthUser.id : null,
                nguoiBanId: isBuyer ? null : _p2pAuthUser.id,
                sanPham:    product,
                soTien:     amount,
                phi:        FEE,
                dieuKhoan:  terms || 'Không có điều khoản đặc biệt.',
                deadline:   deadline + ' giờ',
                trangThai:  'PENDING',
            });
            closeModal();
            const tx = {
                maGiaoDich: 'GD' + String(stored.id).padStart(6, '0'),
                _storeId: stored.id,
                type: role, product, amount, deadline: deadline + ' giờ',
                terms: terms || 'Không có điều khoản đặc biệt.',
                status: 'PENDING', creator: _p2pAuthUser.hoTen, partner: null,
            };
            renderSidebar(getStoreActive(), getStoreHistory());
            showDetail(tx, [
                { sender: 'SYSTEM', text: 'Giao dịch đã được tạo. Đang chờ đối tác tham gia...', time: now(), isMe: null }
            ]);
        }
    );
}


// ============================================================
//  TRA CỨU GD
//  TODO (Java): GET /api/transactions/{code}
// ============================================================
function lookupTransaction() {
    const code = document.getElementById('joinCode').value.trim().toUpperCase();
    const err  = document.getElementById('err-joinCode');

    err.textContent = ''; err.classList.remove('show');
    document.getElementById('joinPreview').style.display = 'none';
    document.getElementById('joinBtn').style.display = 'none';

    if (!code) {
        err.textContent = 'Vui lòng nhập mã giao dịch.';
        err.classList.add('show');
        return;
    }

    // Parse id từ mã: GD000001 → 1
    const storeId = parseInt(code.replace(/^GD0*/, '') || '0', 10);
    const stored  = Store.getAllTransactions().find(t => t.id === storeId);

    if (!stored || stored.trangThai !== 'PENDING') {
        err.textContent = stored
            ? 'Giao dịch này không còn ở trạng thái chờ đối tác.'
            : 'Không tìm thấy giao dịch. Kiểm tra lại mã.';
        err.classList.add('show');
        return;
    }

    // Không cho tham gia giao dịch của chính mình
    const myId = Number(_p2pAuthUser.id);
    if (stored.nguoiMuaId === myId || stored.nguoiBanId === myId) {
        err.textContent = 'Bạn không thể tham gia giao dịch do chính mình tạo.';
        err.classList.add('show');
        return;
    }

    const creatorId = stored.nguoiMuaId || stored.nguoiBanId;
    const creator   = Store.getUserById(creatorId);

    document.getElementById('previewProduct').textContent  = stored.sanPham;
    document.getElementById('previewCreator').textContent  = creator ? creator.hoTen : '—';
    document.getElementById('previewAmount').textContent   = formatVND(stored.soTien);
    document.getElementById('previewDeadline').textContent = stored.deadline;
    document.getElementById('previewTerms').textContent    = stored.dieuKhoan;
    document.getElementById('joinPreview').style.display   = 'block';
    document.getElementById('joinBtn').style.display       = 'flex';
    document.getElementById('joinBtn').dataset.code        = code;
    document.getElementById('joinBtn').dataset.storeId     = storeId;
}


// ============================================================
//  THAM GIA GD
//  TODO (Java): POST /api/transactions/{code}/join
// ============================================================
function joinTransaction() {
    if (!document.getElementById('agreeTerms').checked) {
        alert('Vui lòng đồng ý với điều khoản giao dịch trước khi tham gia.');
        return;
    }

    // Yêu cầu có tài khoản ngân hàng để tham gia
    if (!Store.hasBankAccount(_p2pAuthUser.id)) {
        alert('Bạn cần liên kết tài khoản ngân hàng trước khi tham gia giao dịch P2P.\nVui lòng vào trang Ví để thêm tài khoản.');
        return;
    }

    const code    = document.getElementById('joinBtn').dataset.code;
    const storeId = parseInt(document.getElementById('joinBtn').dataset.storeId, 10);
    const stored  = Store.getAllTransactions().find(t => t.id === storeId);
    if (!stored) { alert('Giao dịch không còn tồn tại.'); return; }

    const creatorId = stored.nguoiMuaId || stored.nguoiBanId;
    const creator   = Store.getUserById(creatorId);

    // Xác định vai trò: creator là seller → joiner là buyer (và ngược lại)
    const isBuyer = stored.nguoiBanId !== null;
    const buyerId = isBuyer ? Number(_p2pAuthUser.id) : stored.nguoiMuaId;

    // Kiểm tra số dư người mua trước khi hiện modal
    const buyerWallet = Store.getWallet(buyerId);
    if (!buyerWallet || buyerWallet.soDuKhaDung < stored.soTien) {
        const err = document.getElementById('err-joinCode');
        err.textContent = isBuyer
            ? `Số dư của bạn không đủ. Cần ${formatVND(stored.soTien)}.`
            : 'Người tạo giao dịch chưa có đủ số dư để ký quỹ.';
        err.classList.add('show');
        return;
    }

    // Thông tin tài khoản ngân hàng của đối phương
    const partnerBanks  = Store.getBankAccounts(creatorId);
    const defaultBank   = partnerBanks.find(b => b.laMacDinh) || partnerBanks[0];
    const bankInfoHtml  = defaultBank
        ? `<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px;margin:10px 0">
               <div style="font-size:12px;font-weight:600;color:#0369a1;margin-bottom:6px">
                   <i class="bx bx-bank"></i> Tài khoản ngân hàng đối phương
               </div>
               <div style="font-size:13px;color:#1e293b">
                   <strong>${defaultBank.tenNganHang}</strong><br>
                   STK: <strong>${defaultBank.soTaiKhoan}</strong><br>
                   Chủ TK: ${defaultBank.tenChuTK}
               </div>
           </div>`
        : `<div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:10px;margin:10px 0;font-size:13px;color:#854d0e">
               <i class="bx bx-error-circle"></i> Đối phương chưa liên kết tài khoản ngân hàng.
           </div>`;

    showConfirmModal(
        'Xác nhận tham gia giao dịch',
        `Sản phẩm: <strong>${stored.sanPham}</strong><br>
         Số tiền: <strong>${formatVND(stored.soTien)}</strong><br>
         Phí dịch vụ: <strong>${formatVND(FEE)}</strong>
         ${bankInfoHtml}
         Sau khi xác nhận, <strong>${formatVND(stored.soTien)}</strong> của người mua sẽ bị đóng băng vào ký quỹ.`,
        () => {
            Store.updateTransaction(storeId, {
                ...(isBuyer ? { nguoiMuaId: Number(_p2pAuthUser.id) } : { nguoiBanId: Number(_p2pAuthUser.id) }),
                trangThai: 'CONFIRMED',
            });
            Store.freezeAmount(buyerId, stored.soTien);

            closeModal();
            const tx = {
                maGiaoDich: code,
                _storeId:   storeId,
                type:       isBuyer ? 'BUY' : 'SELL',
                product:    stored.sanPham,
                amount:     stored.soTien,
                deadline:   stored.deadline,
                terms:      stored.dieuKhoan,
                status:     'CONFIRMED',
                creator:    creator ? creator.hoTen : '—',
                partner:    _p2pAuthUser.hoTen,
            };
            renderSidebar(getStoreActive(), getStoreHistory());
            showDetail(tx, [
                { sender: 'SYSTEM', text: `Bạn đã tham gia giao dịch. ${formatVND(stored.soTien)} đã được đóng băng vào ký quỹ.`, time: now(), isMe: null },
            ]);
        }
    );
}


// ============================================================
//  HIỆN / ẨN PHẦN CHI TIẾT
// ============================================================
function showDetail(tx, messages) {
    window._currentTx = tx; // lưu để các action function đọc
    document.getElementById('p2pEntry').style.display  = 'none';
    document.getElementById('p2pDetail').style.display = 'block';
    renderProgress(tx.status);
    renderInfo(tx);
    renderMessages(messages);
    renderActions(tx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Lấy bản ghi giao dịch từ Store theo _currentTx
function _getStoredTx() {
    const tx = window._currentTx;
    if (!tx || !tx._storeId) return null;
    return Store.getAllTransactions().find(t => t.id === tx._storeId) || null;
}

function backToEntry() {
    document.getElementById('p2pDetail').style.display = 'none';
    document.getElementById('p2pEntry').style.display  = 'block';
    clearInterval(window._countdownTimer);
}


// ============================================================
//  RENDER SIDEBAR
//  TODO (Java): gọi cùng lúc khi load trang
//    fetch('/api/users/me/transactions?status=active')
//    fetch('/api/users/me/transactions?status=done&size=5')
// ============================================================
function renderSidebar(active, history) {
    // Cập nhật count badge
    document.getElementById('activeCount').textContent = active.length;

    renderSidebarList('activeList', active, true);
    renderSidebarList('historyList', history, false);
}

function renderSidebarList(containerId, list, isActive) {
    const container = document.getElementById(containerId);
    const tpl       = document.getElementById('sidebarItemTemplate');
    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="p2p-sidebar__empty">
                <i class='bx ${isActive ? "bx-transfer-alt" : "bx-history"}'></i>
                ${isActive ? 'Không có giao dịch đang thực hiện.' : 'Chưa có lịch sử giao dịch.'}
            </div>`;
        return;
    }

    list.forEach(item => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.p2p-sidebar__item');

        const isBuy = item.type === 'BUY';
        const badge = el.querySelector('.p2p-sidebar__item-badge');
        badge.textContent = isBuy ? 'B' : 'S';
        badge.classList.add(isBuy ? 'p2p-sidebar__item-badge--buy' : 'p2p-sidebar__item-badge--sell');

        el.querySelector('.p2p-sidebar__item-product').textContent = item.product;
        el.querySelector('.p2p-sidebar__item-code').textContent    = item.id;

        const statusEl  = el.querySelector('.p2p-sidebar__item-status');
        const statusMap = {
            IN_PROGRESS: { label: 'Đang GD',    cls: 'status--active'  },
            PENDING:     { label: 'Chờ đối tác', cls: 'status--pending' },
            CONFIRMED:   { label: 'Đã xác nhận', cls: 'status--active'  },
            COMPLETED:   { label: 'Hoàn tất',    cls: 'status--success' },
            CANCELLED:   { label: 'Đã hủy',      cls: 'status--fail'    },
        };
        const info = statusMap[item.status] || { label: item.status, cls: '' };
        statusEl.textContent = info.label;
        statusEl.classList.add(info.cls);

        // Nhấn Xem → mở chi tiết từ Store
        el.querySelector('.p2p-btn-sm').addEventListener('click', () => {
            const stored = Store.getAllTransactions().find(t => t.id === item._storeId);
            if (!stored) return;
            const isBuyer   = item.type === 'BUY';
            const partnerId = isBuyer ? stored.nguoiBanId : stored.nguoiMuaId;
            const partner   = partnerId ? Store.getUserById(partnerId) : null;
            const tx = {
                maGiaoDich: item.id,
                _storeId:   item._storeId,
                type:       item.type,
                product:    stored.sanPham,
                amount:     stored.soTien,
                deadline:   stored.deadline,
                terms:      stored.dieuKhoan,
                status:     stored.trangThai,
                creator:    isBuyer ? (partner ? partner.hoTen : 'Chờ đối tác...') : _p2pAuthUser.hoTen,
                partner:    isBuyer ? _p2pAuthUser.hoTen : (partner ? partner.hoTen : 'Chờ đối tác...'),
            };
            showDetail(tx, [
                { sender: 'SYSTEM', text: 'Xem chi tiết giao dịch #' + item.id, time: now(), isMe: null },
            ]);
        });

        container.appendChild(clone);
    });
}


// ============================================================
//  RENDER PROGRESS BAR
// ============================================================
function renderProgress(status) {
    const container = document.getElementById('progressBar');
    const tpl       = document.getElementById('progressTemplate');
    container.innerHTML = '';

    if (['DISPUTED', 'CANCELLED'].includes(status)) {
        const color = status === 'DISPUTED' ? '#ef4444' : '#94a3b8';
        const label = status === 'DISPUTED' ? 'Tranh Chấp' : 'Đã Hủy';
        container.innerHTML = `
            <div style="text-align:center; width:100%; font-size:15px; font-weight:700; color:${color}">
                <i class='bx bx-error-circle'></i> Trạng thái: ${label}
            </div>`;
        return;
    }

    const currentIdx = STEPS.findIndex(s => s.key === status);
    STEPS.forEach((step, idx) => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.progress-step');
        el.querySelector('.progress-step__num').textContent   = idx + 1;
        el.querySelector('.progress-step__label').textContent = step.label;
        if (idx < currentIdx)        el.classList.add('done');
        else if (idx === currentIdx) el.classList.add('active');
        if (idx === STEPS.length - 1) el.querySelector('.progress-step__line').style.display = 'none';
        container.appendChild(clone);
    });
}


// ============================================================
//  RENDER THÔNG TIN GD
// ============================================================
function renderInfo(tx) {
    document.getElementById('detailCode').textContent = tx.maGiaoDich;
    const isBuy      = tx.type === 'BUY';
    const statusInfo = getStatusInfo(tx.status);

    document.getElementById('detailInfoBody').innerHTML = `
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">Loại giao dịch</span>
            <span class="p2p-info-row__value" style="color:${isBuy ? '#16a34a' : '#dc2626'}">
                ${isBuy ? '● Mua (Buy)' : '● Bán (Sell)'}
            </span>
        </div>
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">Sản phẩm</span>
            <span class="p2p-info-row__value">${tx.product}</span>
        </div>
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">${isBuy ? 'Người bán' : 'Người mua'}</span>
            <span class="p2p-info-row__value" style="color:#0ea5e9">${tx.partner || 'Chờ đối tác...'}</span>
        </div>
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">Số tiền</span>
            <span class="p2p-info-row__value">${formatVND(tx.amount)}</span>
        </div>
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">Phí dịch vụ</span>
            <span class="p2p-info-row__value">${formatVND(FEE)}</span>
        </div>
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">Thời hạn</span>
            <span class="p2p-info-row__value">${tx.deadline}</span>
        </div>
        <div class="p2p-info-row">
            <span class="p2p-info-row__label">Trạng thái</span>
            <span class="p2p-info-row__value" style="color:${statusInfo.color}">${statusInfo.label}</span>
        </div>
        ${tx.terms ? `
        <div class="p2p-info-row" style="flex-direction:column; align-items:flex-start; gap:6px">
            <span class="p2p-info-row__label">Điều khoản</span>
            <span style="font-size:13px; color:#374151; line-height:1.5">${tx.terms}</span>
        </div>` : ''}
        <div class="p2p-countdown">
            <i class='bx bx-time-five'></i>
            <span id="countdownDisplay">Đang tính...</span>
        </div>`;

    startCountdown();
}


// ============================================================
//  ĐẾM NGƯỢC
// ============================================================
function startCountdown() {
    let remaining = 24 * 60 * 60;
    const el = document.getElementById('countdownDisplay');
    if (!el) return;
    clearInterval(window._countdownTimer);
    window._countdownTimer = setInterval(() => {
        if (remaining <= 0) {
            clearInterval(window._countdownTimer);
            el.textContent = 'Giao dịch đã hết hạn!';
            return;
        }
        const h = String(Math.floor(remaining / 3600)).padStart(2,'0');
        const m = String(Math.floor((remaining % 3600) / 60)).padStart(2,'0');
        const s = String(remaining % 60).padStart(2,'0');
        el.textContent = `Còn lại: ${h}:${m}:${s}`;
        remaining--;
    }, 1000);
}


// ============================================================
//  RENDER NÚT HÀNH ĐỘNG
//  TODO (Java): kiểm tra isOwner, vai trò để hiện đúng nút
// ============================================================
function renderActions(tx) {
    const container = document.getElementById('detailActions');
    const isBuyer   = tx.type === 'BUY';

    const waitMsg = (msg) => `
        <div style="text-align:center; padding:16px; color:#f59e0b; font-size:14px">
            <i class='bx bx-time-five' style="font-size:28px; display:block; margin-bottom:6px"></i>
            ${msg}
        </div>`;

    const map = {
        PENDING: `
            <button class="p2p-btn p2p-btn--danger" onclick="cancelTransaction()">
                <i class='bx bx-x-circle'></i> Hủy Giao Dịch
            </button>`,

        // CONFIRMED: tiền đã đóng băng — người bán xác nhận giao hàng trước
        CONFIRMED: !isBuyer ? `
            <button class="p2p-btn p2p-btn--primary" onclick="confirmShipped()">
                <i class='bx bx-package'></i> Xác Nhận Đã Giao Hàng
            </button>
            <button class="p2p-btn p2p-btn--warning" onclick="reportDispute()">
                <i class='bx bx-error'></i> Tố Cáo / Tranh Chấp
            </button>
            <button class="p2p-btn p2p-btn--danger" onclick="cancelTransaction()">
                <i class='bx bx-x-circle'></i> Hủy Giao Dịch
            </button>` : `
            ${waitMsg('Tiền đã được đóng băng. Đang chờ người bán xác nhận đã giao hàng.')}
            <button class="p2p-btn p2p-btn--danger" onclick="cancelTransaction()">
                <i class='bx bx-x-circle'></i> Hủy Giao Dịch
            </button>`,

        // IN_PROGRESS: hàng đã giao — người mua xác nhận đã nhận
        IN_PROGRESS: isBuyer ? `
            <button class="p2p-btn p2p-btn--primary" onclick="confirmComplete()">
                <i class='bx bx-check-double'></i> Xác Nhận Đã Nhận Hàng
            </button>
            <button class="p2p-btn p2p-btn--warning" onclick="reportDispute()">
                <i class='bx bx-error'></i> Tố Cáo / Tranh Chấp
            </button>` : `
            ${waitMsg('Đã xác nhận giao hàng. Đang chờ người mua xác nhận đã nhận.')}
            <button class="p2p-btn p2p-btn--warning" onclick="reportDispute()">
                <i class='bx bx-error'></i> Tố Cáo / Tranh Chấp
            </button>`,

        COMPLETED: `
            <div style="text-align:center; padding:16px; color:#16a34a; font-weight:700; font-size:15px">
                <i class='bx bx-check-circle' style="font-size:32px; display:block; margin-bottom:6px"></i>
                Giao dịch đã hoàn tất!
            </div>`,
        DISPUTED: `
            <div style="text-align:center; padding:16px; color:#ef4444; font-size:14px">
                <i class='bx bx-error-circle' style="font-size:32px; display:block; margin-bottom:6px"></i>
                Đang xử lý tranh chấp. Vui lòng chờ admin.
            </div>`,
        CANCELLED: `
            <div style="text-align:center; padding:16px; color:#94a3b8; font-size:14px">
                Giao dịch đã bị hủy.
            </div>`,
    };
    container.innerHTML = map[tx.status] || '';
}


// ============================================================
//  HÀNH ĐỘNG
// ============================================================

// Người bán xác nhận đã giao hàng → CONFIRMED → IN_PROGRESS
function confirmShipped() {
    showConfirmModal(
        'Xác nhận đã giao hàng',
        'Bạn xác nhận đã giao hàng/dịch vụ cho người mua?<br><br>Người mua sẽ được yêu cầu xác nhận đã nhận để giải ngân.',
        () => {
            const stored = _getStoredTx();
            if (!stored) { closeModal(); return; }
            Store.updateTransaction(stored.id, { trangThai: 'IN_PROGRESS' });
            closeModal();
            addSystemMessage('Người bán đã xác nhận giao hàng. Đang chờ người mua xác nhận đã nhận.');
            const updated = { ...window._currentTx, status: 'IN_PROGRESS' };
            window._currentTx = updated;
            renderProgress('IN_PROGRESS');
            renderActions(updated);
        }
    );
}

// Người mua xác nhận đã nhận hàng → IN_PROGRESS → COMPLETED + giải ngân
function confirmComplete() {
    showConfirmModal(
        'Xác nhận đã nhận hàng',
        'Bạn xác nhận đã nhận được hàng/dịch vụ đúng thỏa thuận?<br><br>Tiền ký quỹ sẽ được giải ngân cho người bán. Hành động này <strong>không thể hoàn tác</strong>.',
        () => {
            const stored = _getStoredTx();
            if (!stored) { closeModal(); return; }
            const ok = Store.releaseEscrow(stored.nguoiMuaId, stored.nguoiBanId, stored.soTien);
            if (!ok) {
                alert('Lỗi giải ngân. Vui lòng liên hệ admin.');
                closeModal();
                return;
            }
            Store.updateTransaction(stored.id, { trangThai: 'COMPLETED' });
            closeModal();
            addSystemMessage('Giao dịch hoàn tất! Tiền đã được giải ngân cho người bán.');
            const updated = { ...window._currentTx, status: 'COMPLETED' };
            window._currentTx = updated;
            renderProgress('COMPLETED');
            renderActions(updated);
            renderSidebar(getStoreActive(), getStoreHistory());
        }
    );
}

function cancelTransaction() {
    showConfirmModal(
        'Xác nhận hủy giao dịch',
        'Bạn có chắc muốn hủy giao dịch này?<br>Tiền ký quỹ (nếu đã đóng băng) sẽ được hoàn trả ngay.',
        () => {
            const stored = _getStoredTx();
            if (!stored) { closeModal(); return; }
            // Hoàn tiền nếu đã đóng băng (CONFIRMED hoặc IN_PROGRESS)
            if (['CONFIRMED', 'IN_PROGRESS'].includes(stored.trangThai) && stored.nguoiMuaId) {
                Store.refundEscrow(stored.nguoiMuaId, stored.soTien);
            }
            Store.updateTransaction(stored.id, { trangThai: 'CANCELLED' });
            closeModal();
            addSystemMessage('Giao dịch đã bị hủy. Tiền ký quỹ đã được hoàn trả.');
            const updated = { ...window._currentTx, status: 'CANCELLED' };
            window._currentTx = updated;
            renderProgress('CANCELLED');
            renderActions(updated);
            renderSidebar(getStoreActive(), getStoreHistory());
        }
    );
}

function reportDispute() {
    showConfirmModal(
        'Tố cáo / Tranh chấp',
        'Gửi yêu cầu tranh chấp đến admin?<br><br>Admin sẽ xem xét trong 24 giờ và yêu cầu cả 2 bên cung cấp bằng chứng.',
        () => {
            const stored = _getStoredTx();
            if (!stored) { closeModal(); return; }
            Store.updateTransaction(stored.id, { trangThai: 'DISPUTED' });
            closeModal();
            addSystemMessage('Yêu cầu tranh chấp đã được gửi. Admin sẽ liên hệ sớm.');
            const updated = { ...window._currentTx, status: 'DISPUTED' };
            window._currentTx = updated;
            renderProgress('DISPUTED');
            renderActions(updated);
        }
    );
}


// ============================================================
//  CHAT
// ============================================================
function renderMessages(messages) {
    document.getElementById('chatMessages').innerHTML = '';
    messages.forEach(appendMessage);
}

function appendMessage(msg) {
    const container = document.getElementById('chatMessages');
    const el        = document.createElement('div');

    if (msg.isMe === null) {
        el.className    = 'chat-msg--system';
        el.textContent  = msg.text;
    } else {
        el.className = `chat-msg ${msg.isMe ? 'chat-msg--me' : 'chat-msg--other'}`;
        el.innerHTML = `
            ${!msg.isMe ? `<span class="chat-msg__sender">${msg.sender}</span>` : ''}
            <div class="chat-msg__bubble">${msg.text}</div>
            <span class="chat-msg__time">${msg.time}</span>`;
    }

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text) {
    appendMessage({ sender: 'SYSTEM', text, time: now(), isMe: null });
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text  = input.value.trim();
    if (!text) return;
    // TODO: POST /api/transactions/{id}/messages { noiDung: text }
    appendMessage({ sender: 'Bạn', text, time: now(), isMe: true });
    input.value = '';
}

function handleChatKey(e) { if (e.key === 'Enter') sendMessage(); }


// ============================================================
//  UPLOAD BẰNG CHỨNG
//  TODO (Java): POST /api/transactions/{id}/evidences (multipart/form-data)
// ============================================================
function handleEvidenceUpload(input) {
    const list  = document.getElementById('evidenceList');
    const empty = list.querySelector('.p2p-evidence-card__empty');
    if (empty) empty.remove();

    Array.from(input.files).forEach(file => {
        const reader  = new FileReader();
        reader.onload = e => {
            const img     = document.createElement('img');
            img.className = 'p2p-evidence-thumb';
            img.src       = e.target.result;
            img.title     = file.name;
            list.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    addSystemMessage(`Đã upload ${input.files.length} bằng chứng.`);
}


// ============================================================
//  MODAL HELPERS
// ============================================================
function showConfirmModal(title, body, onConfirm) {
    document.getElementById('modalTitle').textContent  = title;
    document.getElementById('modalBody').innerHTML     = body;
    document.getElementById('modalConfirmBtn').onclick = onConfirm;
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modalConfirm').classList.add('show');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('modalConfirm').classList.remove('show');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ============================================================
//  HELPERS
// ============================================================
function getStatusInfo(status) {
    const map = {
        PENDING:     { label: 'Chờ đối tác',    color: '#f59e0b' },
        CONFIRMED:   { label: 'Đã xác nhận',     color: '#0ea5e9' },
        IN_PROGRESS: { label: 'Đang giao dịch',  color: '#8b5cf6' },
        COMPLETED:   { label: 'Hoàn tất',        color: '#16a34a' },
        DISPUTED:    { label: 'Tranh chấp',      color: '#ef4444' },
        CANCELLED:   { label: 'Đã hủy',          color: '#94a3b8' },
    };
    return map[status] || { label: status, color: '#64748b' };
}

function now() {
    return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}


// ============================================================
//  KHỞI ĐỘNG
//  TODO (Java): Thay mock bằng:
//    Promise.all([
//      fetch('/api/users/me/transactions?status=active').then(r=>r.json()),
//      fetch('/api/users/me/transactions?status=done&size=5').then(r=>r.json()),
//    ]).then(([active, history]) => renderSidebar(active, history));
// ============================================================
// AUTH GUARD — kiểm tra trước khi render
const __main = document.querySelector('main');
if (!isLoggedIn()) {
    showLoginGate(__main);
} else if (getAuthUser().kycStatus !== 'APPROVED') {
    showKYCGate(__main);
} else {
    renderSidebar(getStoreActive(), getStoreHistory());
}