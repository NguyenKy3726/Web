// ============================================================
//  CUSTOM DROPDOWN — report.js
// ============================================================
const REPORT_DROPDOWN_ICONS = {
    ALL:         { icon: 'bx-list-ul',      color: '#64748b' },
    PENDING:     { icon: 'bx-time',         color: '#d97706' },
    IN_PROGRESS: { icon: 'bx-loader-alt',   color: '#2563eb' },
    RESOLVED:    { icon: 'bx-check-circle', color: '#16a34a' },
    REJECTED:    { icon: 'bx-x-circle',     color: '#dc2626' },
    WITHDRAWN:   { icon: 'bx-undo',         color: '#64748b' },
};

function toggleReportDropdown() {
    const trigger = document.getElementById('reportDropdownTrigger');
    const menu    = document.getElementById('reportDropdownMenu');
    const isOpen  = menu.classList.contains('open');
    trigger.classList.toggle('open', !isOpen);
    menu.classList.toggle('open', !isOpen);
}

function renderDropdown() {
    const menu = document.getElementById('reportDropdownMenu');
    if (!menu) return;
    menu.innerHTML = TABS.map(t => {
        const iconInfo = REPORT_DROPDOWN_ICONS[t.key] || { icon: 'bx-circle', color: '#64748b' };
        const count = t.key === 'ALL'
            ? getMyReports().length
            : getMyReports().filter(r => r.trangThai === t.key).length;
        return `
        <div class="custom-dropdown__item ${t.key === currentTab ? 'custom-dropdown__item--active' : ''}"
            onclick="selectReportTab('${t.key}', '${t.label}')">
            <i class='bx ${iconInfo.icon}' style="color:${iconInfo.color}"></i>
            <span>${t.label}</span>
            <span class="custom-dropdown__badge">${count}</span>
        </div>`;
    }).join('');
}

function selectReportTab(key, label) {
    document.getElementById('reportDropdownMenu').classList.remove('open');
    document.getElementById('reportDropdownTrigger').classList.remove('open');
    document.getElementById('reportDropdownLabel').textContent = label;
    setTab(key);
}

// Đóng khi click ra ngoài
document.addEventListener('click', e => {
    if (!e.target.closest('#reportDropdown')) {
        const menu    = document.getElementById('reportDropdownMenu');
        const trigger = document.getElementById('reportDropdownTrigger');
        if (menu)    menu.classList.remove('open');
        if (trigger) trigger.classList.remove('open');
    }
});


// ============================================================
//  report.js — Trang Tố Cáo
//  Tìm "TODO" để thay mock bằng API thật khi có backend Java
// ============================================================


// ============================================================
//  MOCK DATA — XÓA KHI KẾT NỐI BACKEND
// ============================================================

/**
 * TODO (Java): GET /api/reports/me?page=0&size=20
 * Response mapping:
 *   id           → TranhChap.MaTranhChap
 *   maGiaoDich   → TranhChap.MaGiaoDich
 *   lyDo         → TranhChap.LyDoKhieuNai
 *   moTa         → TranhChap.MoTa
 *   thoiGianTao  → TranhChap.ThoiGianTao
 *   trangThai    → TranhChap.TrangThai (PENDING/IN_PROGRESS/RESOLVED/REJECTED/WITHDRAWN)
 *   adminXuLy    → NguoiDung.HoTen (TranhChap.MaAdminXuLy)
 *   thoiGianXuLy → TranhChap.ThoiGianXuLy
 *   ketQua       → TranhChap.KetLuan (admin nhập — mảng string)
 *   lyDoTuChoi   → TranhChap.LyDoTuChoi (nếu REJECTED)
 *   bangChung    → BangChung[] WHERE MaTranhChap = id
 */
// Đọc reports từ Store
const _reportAuthUser = getAuthUser() || {};

function getMyReports() {
    return Store.getMyReports(_reportAuthUser.id).map(r => {
        const admin = r.adminId ? Store.getUserById(r.adminId) : null;
        return {
            id:           'TC' + String(r.id).padStart(3, '0'),
            _storeId:     r.id,
            maGiaoDich:   r.maGiaoDichId ? 'GD' + String(r.maGiaoDichId).padStart(6, '0') : '—',
            lyDo:         r.lyDo || '—',
            moTa:         r.moTa || '',
            thoiGianTao:  r.thoiGianTao,
            trangThai:    r.trangThai,
            adminXuLy:    admin ? admin.hoTen : null,
            thoiGianXuLy: r.thoiGianXuLy || null,
            ketQua:       r.ketQua ? [r.ketQua] : null,
            lyDoTuChoi:   r.lyDoTuChoi || null,
            bangChung:    [],
        };
    }).reverse();
}


// ID tố cáo đang mở chi tiết/rút
let currentReportId = null;

// Filter hiện tại
let currentTab = 'ALL';

// Filter ngày
let reportDateFrom = null;
let reportDateTo   = null;

document.addEventListener('DOMContentLoaded', () => {
    const fromInput = document.getElementById('reportDateFrom');
    const toInput   = document.getElementById('reportDateTo');
    if (fromInput) fromInput.addEventListener('change', () => {
        reportDateFrom = fromInput.value ? new Date(fromInput.value) : null;
        renderList();
    });
    if (toInput) toInput.addEventListener('change', () => {
        reportDateTo = toInput.value ? new Date(toInput.value + 'T23:59:59') : null;
        renderList();
    });
});

function parseReportDate(str) {
    // Format: "25/05/2026 · 09:30"
    if (!str) return null;
    const match = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!match) return null;
    return new Date(`${match[3]}-${match[2]}-${match[1]}`);
}


// ============================================================
//  TABS FILTER
// ============================================================
const TABS = [
    { key: 'ALL',         label: 'Tất cả'        },
    { key: 'PENDING',     label: 'Chờ tiếp nhận' },
    { key: 'IN_PROGRESS', label: 'Đang xử lý'    },
    { key: 'RESOLVED',    label: 'Đã giải quyết' },
    { key: 'REJECTED',    label: 'Bị từ chối'    },
    { key: 'WITHDRAWN',   label: 'Đã rút'        },
];


function setTab(key) {
    currentTab = key;
    renderDropdown();
    renderList();
}


// ============================================================
//  SEARCH
// ============================================================
function filterReports() {
    renderList();
}


// ============================================================
//  RENDER DANH SÁCH
//  Clone từ <template id="reportItemTemplate">
//  TODO (Java): fetch('/api/reports/me?trangThai='+currentTab)
// ============================================================
function renderList() {
    const keyword   = document.getElementById('searchInput').value.trim().toLowerCase();
    const container = document.getElementById('reportList');
    const tpl       = document.getElementById('reportItemTemplate');
    container.innerHTML = '';

    let filtered = getMyReports().filter(r => {
        const matchTab    = currentTab === 'ALL' || r.trangThai === currentTab;
        const matchSearch = r.maGiaoDich.toLowerCase().includes(keyword) || keyword === '';
        return matchTab && matchSearch;
    });

    // Filter theo ngày
    if (reportDateFrom || reportDateTo) {
        filtered = filtered.filter(r => {
            const d = parseReportDate(r.thoiGianTao);
            if (!d) return true;
            if (reportDateFrom && d < reportDateFrom) return false;
            if (reportDateTo   && d > reportDateTo)   return false;
            return true;
        });
    }

    // Cập nhật title và count
    const tabInfo = TABS.find(t => t.key === currentTab);
    const titleEl = document.getElementById('listTitle');
    const countEl = document.getElementById('listCount');
    if (titleEl) titleEl.textContent = tabInfo ? tabInfo.label : 'Tất cả tố cáo';
    if (countEl) countEl.textContent = filtered.length + ' tố cáo';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="report-empty">
                <i class='bx bx-file-find'></i>
                <p>Không có tố cáo nào.</p>
                <button class="report-btn report-btn--primary" onclick="openCreateModal()">
                    <i class='bx bx-plus'></i> Tạo tố cáo mới
                </button>
            </div>`;
        return;
    }

    filtered.forEach(report => {
        const clone = tpl.content.cloneNode(true);
        const el    = clone.querySelector('.report-item');
        el.dataset.id = report.id;

        // Status dot
        const dot = el.querySelector('.report-item__status-dot');
        dot.classList.add(`dot--${report.trangThai.toLowerCase()}`);

        // GD code + badge
        el.querySelector('.report-item__gd-code').textContent = report.maGiaoDich;
        const badge = el.querySelector('.report-item__status-badge');
        const statusInfo = getStatusInfo(report.trangThai);
        badge.textContent = statusInfo.label;
        badge.classList.add(`badge--${report.trangThai.toLowerCase()}`);

        // Reason + desc
        el.querySelector('.report-item__reason').textContent = report.lyDo;
        el.querySelector('.report-item__desc').textContent   = report.moTa;

        // Meta
        const meta = el.querySelector('.report-item__meta');
        meta.innerHTML = `
            <span><i class='bx bx-calendar'></i>${report.thoiGianTao}</span>
            ${report.adminXuLy
                ? `<span class="report-item__admin"><i class='bx bx-user-check'></i>${report.adminXuLy}</span>`
                : '<span>Chưa có admin xử lý</span>'
            }`;

        // Nút chi tiết
        el.querySelector('.report-item__detail-btn')
            .addEventListener('click', () => openDetail(report.id));

        container.appendChild(clone);
    });
}


// ============================================================
//  LOOKUP GD KHI TẠO TỐ CÁO
//  TODO (Java): GET /api/transactions/{code}
// ============================================================
function lookupGdForReport() {
    const code    = document.getElementById('createGdCode').value.trim().toUpperCase();
    const preview = document.getElementById('gdPreview');

    if (code.length < 10) { preview.style.display = 'none'; return; }

    const gd = mockGdLookup[code];
    if (!gd) { preview.style.display = 'none'; return; }

    preview.style.display = 'block';
    preview.innerHTML = `
        <div class="rmodal__gd-preview-row">
            <span>Sản phẩm</span><strong>${gd.product}</strong>
        </div>
        <div class="rmodal__gd-preview-row">
            <span>Đối tác</span><strong style="color:#0ea5e9">${gd.partner}</strong>
        </div>
        <div class="rmodal__gd-preview-row">
            <span>Số tiền</span><strong>${formatVND(gd.amount)}</strong>
        </div>`;
}


// ============================================================
//  TẠO TỐ CÁO
//  TODO (Java): POST /api/reports
//  Body: multipart/form-data { maGiaoDich, lyDo, moTa, bangChung[] }
// ============================================================
function submitReport() {
    const code   = document.getElementById('createGdCode').value.trim().toUpperCase();
    const reason = document.querySelector('input[name="reason"]:checked');
    const desc   = document.getElementById('createDesc').value.trim();
    let hasError = false;

    // Validate
    const errGd     = document.getElementById('err-gdCode');
    const errReason = document.getElementById('err-reason');
    const errDesc   = document.getElementById('err-desc');

    [errGd, errReason, errDesc].forEach(e => { e.textContent = ''; e.classList.remove('show'); });

    if (!code) {
        errGd.textContent = 'Vui lòng nhập mã giao dịch.';
        errGd.classList.add('show'); hasError = true;
    }

    if (!reason) {
        errReason.textContent = 'Vui lòng chọn lý do tố cáo.';
        errReason.classList.add('show'); hasError = true;
    }

    if (!desc) {
        errDesc.textContent = 'Vui lòng mô tả chi tiết sự việc.';
        errDesc.classList.add('show'); hasError = true;
    }

    if (hasError) return;

    // Lưu vào Store
    Store.createReport({
        userId:       _reportAuthUser.id,
        maGiaoDichId: code,
        lyDo:         reason.value,
        moTa:         desc,
    });

    closeModal('create');
    renderDropdown();
    renderList();
}


// ============================================================
//  UPLOAD BẰNG CHỨNG (tạo mới)
// ============================================================
function handleCreateEvidence(input) {
    const list = document.getElementById('createPreviewList');
    Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.className = 'rmodal__preview-thumb';
            img.src       = e.target.result;
            img.title     = file.name;
            list.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function handleExtraEvidence(input) {
    const list = document.getElementById('extraPreviewList');
    list.innerHTML = '';
    Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.className = 'rmodal__preview-thumb';
            img.src       = e.target.result;
            list.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}


// ============================================================
//  CHI TIẾT TỐ CÁO
//  TODO (Java): GET /api/reports/{id}
// ============================================================
function openDetail(id) {
    const report = getMyReports().find(r => r.id === id);
    if (!report) return;
    currentReportId = id;

    const statusInfo = getStatusInfo(report.trangThai);

    document.getElementById('detailModalTitle').textContent = `Chi tiết · ${report.id}`;

    // Render body
    document.getElementById('detailModalBody').innerHTML = `
        <!-- THÔNG TIN CHUNG -->
        <div class="detail-section">
            <div class="detail-section__title"><i class='bx bx-info-circle'></i> Thông tin tố cáo</div>
            <div class="detail-row">
                <span class="detail-row__label">Mã tố cáo</span>
                <span class="detail-row__value">${report.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label">Mã giao dịch</span>
                <span class="detail-row__value" style="color:#0ea5e9">${report.maGiaoDich}</span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label">Lý do</span>
                <span class="detail-row__value">${report.lyDo}</span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label">Ngày tạo</span>
                <span class="detail-row__value">${report.thoiGianTao}</span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label">Trạng thái</span>
                <span class="detail-row__value" style="color:${statusInfo.color}">${statusInfo.label}</span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label">Admin xử lý</span>
                <span class="detail-row__value">${report.adminXuLy || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-row__label">Thời gian xử lý</span>
                <span class="detail-row__value">${report.thoiGianXuLy || '—'}</span>
            </div>
        </div>

        <!-- MÔ TẢ -->
        <div class="detail-section">
            <div class="detail-section__title"><i class='bx bx-message-detail'></i> Mô tả chi tiết</div>
            <p style="font-size:14px; color:#374151; line-height:1.6; background:#f8fafc; padding:12px 14px; border-radius:10px;">
                ${report.moTa}
            </p>
        </div>

        <!-- BẰNG CHỨNG -->
        <div class="detail-section">
            <div class="detail-section__title"><i class='bx bx-image'></i> Bằng chứng</div>
            ${report.bangChung && report.bangChung.length > 0
                ? `<div class="detail-evidence-grid">
                    ${report.bangChung.map(f => `
                        <img class="detail-evidence-thumb"
                            src="https://placehold.co/80x80/e2e8f0/94a3b8?text=📷"
                            title="${f}" alt="${f}">
                    `).join('')}
                   </div>`
                : '<p class="detail-no-evidence">Chưa có bằng chứng nào.</p>'
            }
        </div>

        <!-- KẾT QUẢ XỬ LÝ -->
        ${report.trangThai === 'RESOLVED' && report.ketQua ? `
        <div class="detail-section">
            <div class="detail-result">
                <div class="detail-result__title">✓ Kết quả xử lý từ admin</div>
                <div class="detail-result__items">
                    ${report.ketQua.map(item => `
                        <div class="detail-result__item">
                            <i class='bx bx-check-circle'></i>
                            <span>${item}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>` : ''}

        <!-- LÝ DO TỪ CHỐI -->
        ${report.trangThai === 'REJECTED' ? `
        <div class="detail-section">
            <div style="background:#fef2f2; border:1.5px solid #fecaca; border-radius:12px; padding:14px 16px;">
                <div style="font-size:12px; font-weight:700; color:#991b1b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">
                    Lý do từ chối
                </div>
                <p style="font-size:13px; color:#dc2626; line-height:1.5">${report.lyDoTuChoi}</p>
            </div>
        </div>` : ''}

        <!-- ĐÃ RÚT -->
        ${report.trangThai === 'WITHDRAWN' ? `
        <div class="detail-section">
            <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px 16px; text-align:center; color:#64748b; font-size:13px;">
                <i class='bx bx-undo' style="font-size:24px; display:block; margin-bottom:6px"></i>
                Tố cáo này đã được rút.
            </div>
        </div>` : ''}
    `;

    // Render footer actions theo trạng thái
    renderDetailFooter(report);

    openModal('detail');
}

function renderDetailFooter(report) {
    const footer = document.getElementById('detailModalFooter');

    let actions = `<button class="report-btn report-btn--ghost" onclick="closeModal('detail')">Đóng</button>`;

    // Bổ sung bằng chứng: PENDING hoặc IN_PROGRESS
    if (['PENDING', 'IN_PROGRESS'].includes(report.trangThai)) {
        actions += `
            <button class="report-btn report-btn--outline" onclick="openEvidenceModal()">
                <i class='bx bx-image-add'></i> Bổ Sung Bằng Chứng
            </button>`;
    }

    // Rút tố cáo: CHỈ khi PENDING (admin chưa tiếp nhận)
    if (report.trangThai === 'PENDING') {
        actions += `
            <button class="report-btn report-btn--danger" onclick="openWithdrawModal()">
                <i class='bx bx-undo'></i> Rút Tố Cáo
            </button>`;
    }

    footer.innerHTML = actions;
}


// ============================================================
//  BỔ SUNG BẰNG CHỨNG
//  TODO (Java): POST /api/reports/{id}/evidences (multipart)
// ============================================================
function openEvidenceModal() {
    document.getElementById('evidenceNote').value = '';
    document.getElementById('extraPreviewList').innerHTML = '';
    document.getElementById('extraEvidenceInput').value  = '';
    closeModal('detail');
    openModal('evidence');
}

function submitExtraEvidence() {
    const note  = document.getElementById('evidenceNote').value.trim();
    const input = document.getElementById('extraEvidenceInput');

    if (input.files.length === 0) {
        alert('Vui lòng chọn ít nhất 1 ảnh/video để bổ sung.');
        return;
    }

    // TODO: POST /api/reports/{currentReportId}/evidences (multipart/form-data)
    closeModal('evidence');
    alert(`Demo: Đã bổ sung ${input.files.length} bằng chứng cho tố cáo ${currentReportId}.`);
}


// ============================================================
//  RÚT TỐ CÁO
//  TODO (Java): POST /api/reports/{id}/withdraw
//  Body: { lyDo }
// ============================================================
function openWithdrawModal() {
    document.getElementById('withdrawReason').value = '';
    closeModal('detail');
    openModal('withdraw');
}

function confirmWithdrawReport() {
    // TODO: fetch(`/api/reports/${currentReportId}/withdraw`, { method:'POST', body: JSON.stringify({ lyDo: reason }) })

    // DEMO: cập nhật mock
    const report = getMyReports().find(r => r.id === currentReportId);
    if (report) report.trangThai = 'WITHDRAWN';

    closeModal('withdraw');
    renderDropdown();
    renderList();
    alert(`Tố cáo ${currentReportId} đã được rút thành công.`);
}


// ============================================================
//  MODAL HELPERS
// ============================================================
function openCreateModal() {
    document.getElementById('createGdCode').value    = '';
    document.getElementById('createDesc').value      = '';
    document.getElementById('gdPreview').style.display = 'none';
    document.getElementById('createPreviewList').innerHTML = '';
    document.querySelectorAll('input[name="reason"]').forEach(r => r.checked = false);
    ['err-gdCode','err-reason','err-desc'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = ''; el.classList.remove('show');
    });
    openModal('create');
}

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
        ['create', 'detail', 'evidence', 'withdraw'].forEach(closeModal);
    }
});


// ============================================================
//  HELPERS
// ============================================================
function getStatusInfo(status) {
    const map = {
        PENDING:     { label: 'Chờ tiếp nhận', color: '#d97706' },
        IN_PROGRESS: { label: 'Đang xử lý',    color: '#2563eb' },
        RESOLVED:    { label: 'Đã giải quyết', color: '#16a34a' },
        REJECTED:    { label: 'Bị từ chối',    color: '#dc2626' },
        WITHDRAWN:   { label: 'Đã rút',        color: '#64748b' },
    };
    return map[status] || { label: status, color: '#64748b' };
}

function formatVND(num) {
    return num.toLocaleString('vi-VN') + 'đ';
}


// ============================================================
//  KHỞI ĐỘNG
//  TODO (Java): fetch('/api/reports/me').then(r=>r.json()).then(data => {
//    mockReports = data;
//    renderDropdown();
//    renderList();
//  });
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (!isLoggedIn()) return showLoginGate(main);
    renderDropdown();
    renderList();
});