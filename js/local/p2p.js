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
const mockActive = [
    {
        id: 'GD250531142210', type: 'BUY',
        product: 'iPhone 13 Pro Max 256GB',
        status: 'IN_PROGRESS', partner: 'seller_xyz',
    },
    {
        id: 'GD250530091122', type: 'SELL',
        product: 'MacBook Air M1',
        status: 'PENDING', partner: 'buyer_abc',
    },
];

/**
 * TODO (Java): GET /api/users/me/transactions?status=done&page=0&size=5
 * Lịch sử giao dịch gần đây
 */
const mockHistory = [
    {
        id: 'GD250522192211', type: 'SELL',
        product: 'AirPods Pro 2',
        status: 'COMPLETED', partner: 'buyer_kkk',
    },
    {
        id: 'GD250521101500', type: 'BUY',
        product: 'Chuột Logitech MX3',
        status: 'CANCELLED', partner: 'seller_999',
    },
];

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
            // TODO: fetch('/api/transactions', { method:'POST', body: JSON.stringify({...}) })
            closeModal();
            const tx = {
                maGiaoDich: 'GD' + Date.now().toString().slice(-12),
                type: role, product, amount, deadline: deadline + ' giờ',
                terms: terms || 'Không có điều khoản đặc biệt.',
                status: 'PENDING', creator: 'Bạn', partner: null,
            };
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

    // TODO: fetch(`/api/transactions/${code}`).then(r=>r.json()).then(showPreview)
    const data = mockLookup[code];
    if (!data) {
        err.textContent = 'Không tìm thấy giao dịch. Kiểm tra lại mã.';
        err.classList.add('show');
        return;
    }

    document.getElementById('previewProduct').textContent  = data.product;
    document.getElementById('previewCreator').textContent  = data.creator;
    document.getElementById('previewAmount').textContent   = formatVND(data.amount);
    document.getElementById('previewDeadline').textContent = data.deadline;
    document.getElementById('previewTerms').textContent    = data.terms;
    document.getElementById('joinPreview').style.display   = 'block';
    document.getElementById('joinBtn').style.display       = 'flex';
    document.getElementById('joinBtn').dataset.code        = code;
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
    const code = document.getElementById('joinBtn').dataset.code;
    const data = mockLookup[code];

    showConfirmModal(
        'Xác nhận tham gia giao dịch',
        `Sản phẩm: <strong>${data.product}</strong><br>
         Số tiền: <strong>${formatVND(data.amount)}</strong><br>
         Phí dịch vụ: <strong>${formatVND(FEE)}</strong><br><br>
         Sau khi xác nhận, tiền sẽ được giữ trong ví ký quỹ.`,
        () => {
            // TODO: fetch(`/api/transactions/${code}/join`, { method:'POST' })
            closeModal();
            const tx = {
                maGiaoDich: code, type: 'BUY',
                product: data.product, amount: data.amount,
                deadline: data.deadline, terms: data.terms,
                status: 'CONFIRMED', creator: data.creator, partner: 'Bạn',
            };
            showDetail(tx, [
                { sender: 'SYSTEM', text: 'Bạn đã tham gia giao dịch thành công.', time: now(), isMe: null },
                { sender: data.creator, text: 'Chào bạn! Mình sẽ chuẩn bị hàng ngay.', time: now(), isMe: false },
            ]);
        }
    );
}


// ============================================================
//  HIỆN / ẨN PHẦN CHI TIẾT
// ============================================================
function showDetail(tx, messages) {
    document.getElementById('p2pEntry').style.display  = 'none';
    document.getElementById('p2pDetail').style.display = 'block';
    renderProgress(tx.status);
    renderInfo(tx);
    renderMessages(messages);
    renderActions(tx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        // Nhấn Xem → mở chi tiết
        el.querySelector('.p2p-btn-sm').addEventListener('click', () => {
            showDetail(mockDetail, mockMessages);
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
    const map = {
        PENDING: `
            <button class="p2p-btn p2p-btn--danger" onclick="cancelTransaction()">
                <i class='bx bx-x-circle'></i> Hủy Giao Dịch
            </button>`,
        CONFIRMED: `
            <button class="p2p-btn p2p-btn--primary" onclick="confirmComplete()">
                <i class='bx bx-check-double'></i> Xác Nhận Hoàn Thành
            </button>
            <button class="p2p-btn p2p-btn--warning" onclick="reportDispute()">
                <i class='bx bx-error'></i> Tố Cáo / Tranh Chấp
            </button>
            <button class="p2p-btn p2p-btn--danger" onclick="cancelTransaction()">
                <i class='bx bx-x-circle'></i> Hủy Giao Dịch
            </button>`,
        IN_PROGRESS: `
            <button class="p2p-btn p2p-btn--primary" onclick="confirmComplete()">
                <i class='bx bx-check-double'></i> Xác Nhận Hoàn Thành
            </button>
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
function confirmComplete() {
    showConfirmModal(
        'Xác nhận hoàn thành',
        'Bạn xác nhận đã nhận được hàng/dịch vụ đúng thỏa thuận?<br><br>Tiền sẽ được giải ngân cho người bán.',
        () => {
            // TODO: POST /api/transactions/{id}/complete
            closeModal();
            addSystemMessage('Giao dịch đã hoàn tất thành công!');
            renderProgress('COMPLETED');
            renderActions({ status: 'COMPLETED' });
        }
    );
}

function cancelTransaction() {
    showConfirmModal(
        'Xác nhận hủy giao dịch',
        'Bạn có chắc muốn hủy giao dịch này?<br>Tiền ký quỹ sẽ được hoàn trả.',
        () => {
            // TODO: POST /api/transactions/{id}/cancel
            closeModal();
            addSystemMessage('Giao dịch đã bị hủy.');
            renderProgress('CANCELLED');
            renderActions({ status: 'CANCELLED' });
        }
    );
}

function reportDispute() {
    showConfirmModal(
        'Tố cáo / Tranh chấp',
        'Gửi yêu cầu tranh chấp đến admin?<br><br>Admin sẽ xem xét trong 24 giờ và yêu cầu cả 2 bên cung cấp bằng chứng.',
        () => {
            // TODO: POST /api/disputes { maGiaoDich, lyDoKhieuNai }
            closeModal();
            addSystemMessage('Yêu cầu tranh chấp đã được gửi. Admin sẽ liên hệ sớm.');
            renderProgress('DISPUTED');
            renderActions({ status: 'DISPUTED' });
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
renderSidebar(mockActive, mockHistory);