// ============================================================
//  wallet.js — Toàn bộ logic trang Ví
//  Tìm "TODO" để thay mock bằng API thật khi có backend Java
// ============================================================


// ============================================================
//  ĐỌC DỮ LIỆU TỪ STORE
// ============================================================
const _walletAuthUser = getAuthUser() || {};

// Chuyển format Store → format wallet.js
const LOAI_MAP = { DEPOSIT:'NAP', WITHDRAW:'RUT', FREEZE:'KY_QUY', RELEASE:'GIAI_NGAN', REFUND:'HOAN_TIEN' };

function storeHistoryToWallet() {
    const history  = Store.getWalletHistory(_walletAuthUser.id);
    const requests = Store.getWalletRequests(_walletAuthUser.id);

    // Từ wallet history (đã duyệt)
    const fromHistory = history.map(h => ({
        id: h.id, loai: LOAI_MAP[h.loai] || 'NAP',
        soTien: h.soTien, moTa: h.ghiChu || h.loai,
        thoiGian: h.thoiGian, trangThai: 'SUCCESS',
    }));

    // Từ wallet requests (PENDING/REJECTED)
    const fromRequests = requests
        .filter(r => r.trangThai !== 'APPROVED')
        .map(r => ({
            id: 'req-' + r.id, loai: r.loai === 'DEPOSIT' ? 'NAP' : 'RUT',
            soTien: r.soTien, moTa: (r.loai === 'DEPOSIT' ? 'Nạp tiền' : 'Rút tiền') + ' — ' + (r.nganHang || ''),
            thoiGian: r.thoiGian,
            trangThai: r.trangThai === 'PENDING' ? 'PENDING' : 'FAIL',
        }));

    return [...fromRequests, ...fromHistory].sort((a, b) =>
        String(b.id).localeCompare(String(a.id))
    );
}

// ============================================================
//  KHỞI ĐỘNG — đọc từ Store thay mock
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (!isLoggedIn()) return showLoginGate(main);

    const user   = Store.getUserById(_walletAuthUser.id) || _walletAuthUser;
    const wallet = Store.getWallet(_walletAuthUser.id)   || { soDuKhaDung: 0, soDuKyQuy: 0 };
    const banks  = Store.getBankAccounts(_walletAuthUser.id);
    const history = storeHistoryToWallet();
    const kyc    = { trangThai: user.kycStatus || 'NONE', thoiGianGui: user.kycNgaySinh || null, lyDoTuChoi: user.kycRejectReason || null };

    const userForInit = {
        ...user,
        hasBankAccount: banks.length > 0,
    };

    init(userForInit, wallet, banks, history, kyc);
});

function init(user, wallet, banks, history, kyc) {
    // Kiểm tra KYC — nếu chưa approved thì khóa toàn bộ
    if (user.kycStatus !== 'APPROVED') {
        document.getElementById('walletLocked').style.display  = 'flex';
        document.getElementById('walletContent').style.display = 'none';
        return;
    }

    document.getElementById('walletLocked').style.display  = 'none';
    document.getElementById('walletContent').style.display = 'block';

    renderBalance(wallet);
    renderBankList(banks);
    renderKycStatus(kyc);
    renderFilterButtons();
    renderHistory(history, 'ALL');
    populateBankSelects(banks);
}





// ============================================================
//  SỐ DƯ
// ============================================================
let balanceVisible = false;
let escrowVisible  = false;

function renderBalance(wallet) {
    const balEl = document.getElementById('balanceAmount');
    const escEl = document.getElementById('escrowAmount');
    balEl.dataset.value = formatVND(wallet.soDuKhaDung);
    escEl.dataset.value = formatVND(wallet.soDuKyQuy);

    // Hiện số tiền ngay, người dùng tự ẩn nếu muốn
    balEl.textContent = balEl.dataset.value;
    escEl.textContent = escEl.dataset.value;
    balanceVisible = true;
    escrowVisible  = true;
    document.getElementById('balanceIcon').className = 'bx bx-hide';
    document.getElementById('escrowIcon').className  = 'bx bx-hide';
}

function toggleBalance() {
    balanceVisible = !balanceVisible;
    const el   = document.getElementById('balanceAmount');
    const icon = document.getElementById('balanceIcon');
    el.textContent = balanceVisible ? el.dataset.value : '***';
    icon.className = balanceVisible ? 'bx bx-hide' : 'bx bx-show';
}

function toggleEscrow() {
    escrowVisible = !escrowVisible;
    const el   = document.getElementById('escrowAmount');
    const icon = document.getElementById('escrowIcon');
    el.textContent = escrowVisible ? el.dataset.value : '***';
    icon.className = escrowVisible ? 'bx bx-hide' : 'bx bx-show';
}


// ============================================================
//  DANH SÁCH NGÂN HÀNG
// ============================================================
function renderBankList(banks) {
    const container = document.getElementById('bankList');
    const tpl       = document.getElementById('bankItemTemplate');
    container.innerHTML = '';

    if (!banks || banks.length === 0) {
        container.innerHTML = `
            <div class="bank-empty">
                <i class='bx bx-buildings'></i>
                Chưa có tài khoản ngân hàng nào.
            </div>`;
        return;
    }

    banks.forEach(bank => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.bank-item');

        el.querySelector('.bank-item__logo').textContent   = bank.tenNganHang;
        el.querySelector('.bank-item__name').textContent   = bank.tenNganHang;
        el.querySelector('.bank-item__number').textContent = maskBankNumber(bank.soTaiKhoan);
        el.querySelector('.bank-item__owner').textContent  = bank.tenChuTK;

        if (bank.laMacDinh) {
            el.querySelector('.bank-item__default-badge').style.display = 'inline-flex';
        }

        container.appendChild(clone);
    });
}

function maskBankNumber(num) {
    return '****' + num.slice(-4);
}

function populateBankSelects(banks) {
    ['depositBank', 'withdrawBank'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = banks.map(b =>
            `<option value="${b.id}">${b.tenNganHang} - ${maskBankNumber(b.soTaiKhoan)}</option>`
        ).join('');
    });
}


// ============================================================
//  KYC STATUS
// ============================================================
function renderKycStatus(kyc) {
    const container = document.getElementById('kycStatus');

    const statusMap = {
        NONE: {
            badge:  'kyc-badge--none',
            icon:   'bx-x-circle',
            label:  'Chưa xác minh',
            html: `
                <div class="kyc-status-block kyc-status-block--none">
                    <span class="kyc-badge kyc-badge--none"><i class='bx bx-x-circle'></i> Chưa xác minh</span>
                    <p>Xác minh danh tính để sử dụng đầy đủ tính năng và tăng hạn mức giao dịch.</p>
                    <button class="wallet-btn wallet-btn--primary" style="width:100%" onclick="openKycModal()">
                        <i class='bx bx-shield-quarter'></i> Xác Minh Ngay
                    </button>
                </div>`,
        },
        PENDING: {
            html: `
                <div class="kyc-status-block kyc-status-block--none">
                    <span class="kyc-badge kyc-badge--pending"><i class='bx bx-time'></i> Đang xem xét</span>
                    <p>Hồ sơ của bạn đang được admin xem xét. Thường mất 1-2 ngày làm việc.</p>
                    <small style="color:#94a3b8">Gửi lúc: ${kyc.thoiGianGui}</small>
                </div>`,
        },
        APPROVED: {
            html: `
                <div class="kyc-status-block" style="display:flex; align-items:center; gap:12px; padding:16px 18px">
                    <span class="kyc-badge kyc-badge--approved"><i class='bx bx-check-circle'></i> Đã xác minh</span>
                    <span style="font-size:13px; color:#64748b; flex:1">Tài khoản đã được xác minh đầy đủ.</span>
                </div>`,
        },
        REJECTED: {
            html: `
                <div class="kyc-status-block kyc-status-block--none">
                    <span class="kyc-badge kyc-badge--rejected"><i class='bx bx-error-circle'></i> Bị từ chối</span>
                    <p>Lý do: <strong>${kyc.lyDoTuChoi || 'Thông tin không hợp lệ'}</strong></p>
                    <button class="wallet-btn wallet-btn--primary" style="width:100%" onclick="openKycModal()">
                        <i class='bx bx-refresh'></i> Gửi Lại Hồ Sơ
                    </button>
                </div>`,
        },
    };

    container.innerHTML = (statusMap[kyc.trangThai] || statusMap['NONE']).html;
}


// ============================================================
//  LỊCH SỬ VÍ
// ============================================================
const FILTER_TYPES = [
    { key: 'ALL',       label: 'Tất cả'    },
    { key: 'NAP',       label: 'Nạp tiền'  },
    { key: 'RUT',       label: 'Rút tiền'  },
    { key: 'KY_QUY',   label: 'Ký quỹ'    },
    { key: 'GIAI_NGAN', label: 'Giải ngân' },
    { key: 'HOAN_TIEN', label: 'Hoàn tiền' },
];

let currentFilter = 'ALL';

function renderFilterButtons() {
    const container = document.getElementById('walletFilter');
    container.innerHTML = FILTER_TYPES.map(f => `
        <button class="wallet-filter__btn ${f.key === currentFilter ? 'wallet-filter__btn--active' : ''}"
            onclick="setFilter('${f.key}')">${f.label}</button>
    `).join('');
}

function setFilter(type) {
    currentFilter = type;
    renderFilterButtons();
    // TODO: fetch(`/api/wallet/history?loai=${type}`).then(r=>r.json()).then(data => renderHistory(data, type))
    const all      = storeHistoryToWallet();
    const filtered = type === 'ALL' ? all : all.filter(h => h.loai === type);
    renderHistory(filtered, type);
}

function renderHistory(list, filter) {
    const container = document.getElementById('historyList');
    const tpl       = document.getElementById('historyItemTemplate');
    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <i class='bx bx-wallet'></i>
                Không có giao dịch nào.
            </div>`;
        return;
    }

    const iconMap = {
        NAP:       { cls: 'icon--deposit',  icon: 'bx-download',    sign: '+', amtCls: 'amount--plus'  },
        RUT:       { cls: 'icon--withdraw', icon: 'bx-upload',      sign: '-', amtCls: 'amount--minus' },
        KY_QUY:   { cls: 'icon--escrow',   icon: 'bx-lock',        sign: '-', amtCls: 'amount--hold'  },
        GIAI_NGAN: { cls: 'icon--release',  icon: 'bx-lock-open',   sign: '+', amtCls: 'amount--plus'  },
        HOAN_TIEN: { cls: 'icon--refund',   icon: 'bx-refresh',     sign: '+', amtCls: 'amount--plus'  },
    };

    const statusMap = {
        SUCCESS: { cls: 'hstatus--success', label: 'Thành công' },
        PENDING: { cls: 'hstatus--pending', label: 'Đang xử lý' },
        FAIL:    { cls: 'hstatus--fail',    label: 'Thất bại'   },
    };

    list.forEach(item => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.wallet-history-item');
        const info  = iconMap[item.loai]   || iconMap['NAP'];
        const st    = statusMap[item.trangThai] || statusMap['PENDING'];

        const iconEl = el.querySelector('.wallet-history-item__icon');
        iconEl.classList.add(info.cls);
        iconEl.innerHTML = `<i class='bx ${info.icon}'></i>`;

        el.querySelector('.wallet-history-item__desc').textContent  = item.moTa;
        el.querySelector('.wallet-history-item__time').textContent  = item.thoiGian;

        const amtEl = el.querySelector('.wallet-history-item__amount');
        amtEl.textContent = `${info.sign}${formatVND(item.soTien)}`;
        amtEl.classList.add(info.amtCls);

        const stEl = el.querySelector('.wallet-history-item__status');
        stEl.textContent = st.label;
        stEl.classList.add(st.cls);

        container.appendChild(clone);
    });
}


// ============================================================
//  MODAL NẠP TIỀN
//  TODO (Java): POST /api/wallet/deposit
//  Body: { soTien, maTaiKhoanNH }
// ============================================================
function openDepositModal() {
    if (!Store.hasBankAccount(_walletAuthUser.id)) {
        alert('Bạn cần thêm tài khoản ngân hàng trước khi nạp tiền.\nVui lòng thêm tài khoản ngân hàng ở phần bên trái.');
        return;
    }
    document.getElementById('depositAmount').value = '';
    openModal('deposit');
}

function confirmDeposit() {
    const amount  = parseAmount(document.getElementById('depositAmount').value);
    const bankSel = document.getElementById('depositBank');
    const nganHang = bankSel ? bankSel.options[bankSel.selectedIndex]?.text : '—';
    if (!amount || amount < 10000) { alert('Số tiền tối thiểu là 10.000đ.'); return; }
    Store.createWalletRequest({ userId: _walletAuthUser.id, loai: 'DEPOSIT', soTien: amount, nganHang });
    closeModal('deposit');
    // Reload lại trang để hiển thị request mới
    document.getElementById('depositAmount').value = '';
    setFilter(currentFilter);
    alert(`Yêu cầu nạp ${formatVND(amount)} đã được gửi! Chờ admin duyệt.`);
}


// ============================================================
//  MODAL RÚT TIỀN
//  TODO (Java): POST /api/wallet/withdraw
//  Body: { soTien, maTaiKhoanNH }
// ============================================================
function openWithdrawModal() {
    if (!Store.hasBankAccount(_walletAuthUser.id)) {
        alert('Bạn cần thêm tài khoản ngân hàng trước khi rút tiền.\nVui lòng thêm tài khoản ngân hàng ở phần bên trái.');
        return;
    }
    document.getElementById('withdrawAmount').value = '';
    openModal('withdraw');
}

function confirmWithdraw() {
    const amount   = parseAmount(document.getElementById('withdrawAmount').value);
    const bankSel  = document.getElementById('withdrawBank');
    const nganHang = bankSel ? bankSel.options[bankSel.selectedIndex]?.text : '—';
    if (!amount || amount < 10000) { alert('Số tiền tối thiểu là 10.000đ.'); return; }
    const wallet = Store.getWallet(_walletAuthUser.id);
    if (!wallet || wallet.soDuKhaDung < amount) { alert('Số dư không đủ.'); return; }
    Store.createWalletRequest({ userId: _walletAuthUser.id, loai: 'WITHDRAW', soTien: amount, nganHang });
    closeModal('withdraw');
    document.getElementById('withdrawAmount').value = '';
    setFilter(currentFilter);
    alert(`Yêu cầu rút ${formatVND(amount)} đã được gửi! Chờ admin duyệt.`);
}


// ============================================================
//  MODAL THÊM NGÂN HÀNG
//  TODO (Java): POST /api/bank-accounts
//  Body: { tenNganHang, soTaiKhoan, tenChuTaiKhoan }
// ============================================================
function openAddBankModal() {
    document.getElementById('bankName').value  = '';
    document.getElementById('bankNumber').value = '';
    document.getElementById('bankOwner').value  = '';
    document.getElementById('bankError').style.display = 'none';
    openModal('bank');
}

function confirmAddBank() {
    const name   = document.getElementById('bankName').value;
    const number = document.getElementById('bankNumber').value.trim();
    const owner  = document.getElementById('bankOwner').value.trim().toUpperCase();
    const errEl  = document.getElementById('bankError');

    errEl.style.display = 'none';

    if (!name || !number || !owner) {
        errEl.textContent    = 'Vui lòng điền đầy đủ thông tin.';
        errEl.style.display  = 'block';
        return;
    }

    if (!/^\d{6,20}$/.test(number)) {
        errEl.textContent   = 'Số tài khoản không hợp lệ (chỉ gồm 6-20 chữ số).';
        errEl.style.display = 'block';
        return;
    }

    Store.addBankAccount(_walletAuthUser.id, { tenNganHang: name, soTaiKhoan: number, tenChuTK: owner });
    const updatedBanks = Store.getBankAccounts(_walletAuthUser.id);
    renderBankList(updatedBanks);
    populateBankSelects(updatedBanks);
    closeModal('bank');
}


// ============================================================
//  KYC MODAL — 4 BƯỚC
// ============================================================
const KYC_STEPS = [
    { label: 'Loại giấy tờ' },
    { label: 'Mặt trước/sau' },
    { label: 'Ảnh selfie' },
    { label: 'Xác nhận' },
];

let kycStep = 0;
const kycData = { idType: 'CCCD', frontFile: null, backFile: null, selfieFile: null };

function openKycModal() {
    kycStep = 0;
    renderKycStepsBar();
    renderKycBody();
    openModal('kyc');
}

function renderKycStepsBar() {
    const container = document.getElementById('kycStepsBar');
    container.innerHTML = KYC_STEPS.map((s, idx) => `
        <div class="kyc-step ${idx < kycStep ? 'done' : idx === kycStep ? 'active' : ''}">
            <div class="kyc-step__dot">${idx < kycStep ? '<i class="bx bx-check"></i>' : idx + 1}</div>
            <span class="kyc-step__label">${s.label}</span>
        </div>`
    ).join('');
}

function renderKycBody() {
    const body    = document.getElementById('kycBody');
    const prevBtn = document.getElementById('kycPrevBtn');
    const nextBtn = document.getElementById('kycNextBtn');

    prevBtn.style.display = kycStep > 0 ? 'flex' : 'none';
    nextBtn.innerHTML     = kycStep < KYC_STEPS.length - 1
        ? 'Tiếp theo <i class="bx bx-right-arrow-alt"></i>'
        : '<i class="bx bx-send"></i> Gửi Hồ Sơ';

    const steps = [
        // Bước 1: Chọn loại giấy tờ
        `<p class="kyc-section-title">Chọn loại giấy tờ</p>
         <p class="kyc-section-desc">Chọn loại giấy tờ tùy thân bạn sẽ dùng để xác minh.</p>
         <div class="kyc-id-types">
             <label class="kyc-id-type">
                 <input type="radio" name="idType" value="CCCD" ${kycData.idType === 'CCCD' ? 'checked' : ''}>
                 <i class='bx bx-id-card'></i>
                 <span>CCCD / CMND</span>
             </label>
             <label class="kyc-id-type">
                 <input type="radio" name="idType" value="PASSPORT" ${kycData.idType === 'PASSPORT' ? 'checked' : ''}>
                 <i class='bx bx-book'></i>
                 <span>Hộ chiếu</span>
             </label>
         </div>
         <div class="wmodal__info-box">
             <i class='bx bx-info-circle'></i>
             <span>Giấy tờ phải còn hiệu lực. Ảnh chụp phải rõ nét, đủ ánh sáng, không bị che khuất.</span>
         </div>`,

        // Bước 2: Upload ảnh mặt trước/sau
        `<p class="kyc-section-title">Chụp ảnh giấy tờ</p>
         <p class="kyc-section-desc">Upload ảnh chụp rõ nét cả 2 mặt của giấy tờ.</p>
         <div class="kyc-upload-grid">
             <div class="kyc-upload-area ${kycData.frontFile ? 'has-file' : ''}" id="frontArea">
                 <input type="file" accept="image/*" onchange="handleKycFile('front', this)">
                 ${kycData.frontFile
                     ? `<img class="kyc-preview" src="${kycData.frontPreview}" alt="Mặt trước">`
                     : `<i class='bx bx-image-add'></i><strong>Mặt trước</strong><p>Nhấn để chọn ảnh</p>`
                 }
             </div>
             <div class="kyc-upload-area ${kycData.backFile ? 'has-file' : ''}" id="backArea">
                 <input type="file" accept="image/*" onchange="handleKycFile('back', this)">
                 ${kycData.backFile
                     ? `<img class="kyc-preview" src="${kycData.backPreview}" alt="Mặt sau">`
                     : `<i class='bx bx-image-add'></i><strong>Mặt sau</strong><p>Nhấn để chọn ảnh</p>`
                 }
             </div>
         </div>
         <div class="wmodal__info-box">
             <i class='bx bx-info-circle'></i>
             <span>Định dạng: JPG, PNG. Tối đa 5MB mỗi ảnh.</span>
         </div>`,

        // Bước 3: Selfie
        `<p class="kyc-section-title">Ảnh selfie cầm giấy tờ</p>
         <p class="kyc-section-desc">Chụp ảnh bản thân đang cầm giấy tờ và tờ giấy ghi ngày hôm nay.</p>
         <div class="kyc-upload-area ${kycData.selfieFile ? 'has-file' : ''}" style="max-width:300px; margin:0 auto 16px" id="selfieArea">
             <input type="file" accept="image/*" onchange="handleKycFile('selfie', this)">
             ${kycData.selfieFile
                 ? `<img class="kyc-preview" src="${kycData.selfiePreview}" alt="Selfie" style="height:120px">`
                 : `<i class='bx bx-camera'></i><strong>Ảnh selfie</strong><p>Nhấn để chọn ảnh</p>`
             }
         </div>
         <div class="wmodal__info-box wmodal__info-box--warn">
             <i class='bx bx-error'></i>
             <span>Khuôn mặt phải rõ nét, không đeo kính hoặc đội mũ. Giấy tờ phải đọc được số.</span>
         </div>`,

        // Bước 4: Xác nhận
        `<p class="kyc-section-title">Xác nhận và gửi hồ sơ</p>
         <p class="kyc-section-desc">Kiểm tra lại thông tin trước khi gửi. Hồ sơ sẽ được xét duyệt trong 1-2 ngày làm việc.</p>
         <div class="kyc-confirm-list">
             <div class="kyc-confirm-item">
                 <i class='bx ${kycData.frontFile ? "bx-check-circle" : "bx-x-circle"}'
                    style="color:${kycData.frontFile ? '#16a34a' : '#ef4444'}"></i>
                 <span>Ảnh mặt trước giấy tờ</span>
             </div>
             <div class="kyc-confirm-item">
                 <i class='bx ${kycData.backFile ? "bx-check-circle" : "bx-x-circle"}'
                    style="color:${kycData.backFile ? '#16a34a' : '#ef4444'}"></i>
                 <span>Ảnh mặt sau giấy tờ</span>
             </div>
             <div class="kyc-confirm-item">
                 <i class='bx ${kycData.selfieFile ? "bx-check-circle" : "bx-x-circle"}'
                    style="color:${kycData.selfieFile ? '#16a34a' : '#ef4444'}"></i>
                 <span>Ảnh selfie cầm giấy tờ</span>
             </div>
         </div>
         <div class="wmodal__info-box" style="margin-top:16px">
             <i class='bx bx-shield-quarter'></i>
             <span>Thông tin và hình ảnh của bạn được bảo mật hoàn toàn, chỉ dùng để xác minh danh tính.</span>
         </div>`,
    ];

    body.innerHTML = steps[kycStep];
}

function handleKycFile(type, input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        if (type === 'front')  { kycData.frontFile  = file; kycData.frontPreview  = e.target.result; }
        if (type === 'back')   { kycData.backFile   = file; kycData.backPreview   = e.target.result; }
        if (type === 'selfie') { kycData.selfieFile = file; kycData.selfiePreview = e.target.result; }
        renderKycBody();
    };
    reader.readAsDataURL(file);
}

function kycNext() {
    // Lưu lựa chọn loại giấy tờ
    if (kycStep === 0) {
        const checked = document.querySelector('input[name="idType"]:checked');
        if (checked) kycData.idType = checked.value;
    }

    // Validate bước 2
    if (kycStep === 1 && (!kycData.frontFile || !kycData.backFile)) {
        alert('Vui lòng upload đủ ảnh mặt trước và mặt sau.'); return;
    }

    // Validate bước 3
    if (kycStep === 2 && !kycData.selfieFile) {
        alert('Vui lòng upload ảnh selfie.'); return;
    }

    // Bước cuối: gửi hồ sơ
    if (kycStep === KYC_STEPS.length - 1) {
        submitKyc(); return;
    }

    kycStep++;
    renderKycStepsBar();
    renderKycBody();
}

function kycPrev() {
    if (kycStep > 0) {
        kycStep--;
        renderKycStepsBar();
        renderKycBody();
    }
}

function submitKyc() {
    // TODO (Java): POST /api/kyc (multipart/form-data)
    //   FormData: { loaiGiayTo, anhMatTruoc, anhMatSau, anhSelfie }
    //   Response: { trangThai: 'PENDING', thoiGianGui: '...' }

    // DEMO
    closeModal('kyc');
    renderKycStatus({ trangThai: 'PENDING', thoiGianGui: new Date().toLocaleDateString('vi-VN') });
    alert('Hồ sơ KYC đã được gửi! Admin sẽ xem xét trong 1-2 ngày làm việc.');
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
        ['deposit', 'withdraw', 'bank', 'kyc'].forEach(closeModal);
    }
});


// ============================================================
//  FORMAT HELPERS
// ============================================================
function formatVND(num) {
    return num.toLocaleString('vi-VN') + 'đ';
}

function parseAmount(str) {
    return parseInt((str || '').replace(/\D/g, '')) || 0;
}

function formatWalletAmount(input) {
    let val = input.value.replace(/\D/g, '');
    if (!val) { input.value = ''; return; }
    input.value = parseInt(val).toLocaleString('vi-VN');
}

function setQuickAmount(inputId, amount) {
    document.getElementById(inputId).value = amount.toLocaleString('vi-VN');
}
/* =========================
   MOBILE MENU
========================= */

document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.querySelector('.header-mid__profile');
    const menuLeft = document.querySelector('.header-top__left');
    const menuRight = document.querySelector('.header-top__right');

    if (!menuBtn || !menuLeft || !menuRight) return;

    menuBtn.addEventListener('click', function(e){

        e.preventDefault();

        menuLeft.classList.toggle('mobile-open');
        menuRight.classList.toggle('mobile-open');

    });

}); 