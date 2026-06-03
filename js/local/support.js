// ============================================================
//  support.js — Trang Hỗ Trợ
// ============================================================


// ============================================================
//  DỮ LIỆU FAQ
// ============================================================
const FAQ_DATA = [
    {
        group:  'Giao dịch P2P',
        icon:   'bx-transfer-alt',
        color:  '#2563eb',
        bg:     '#eff6ff',
        items: [
            {
                q: 'Làm thế nào để tạo giao dịch P2P?',
                a: 'Vào trang P2P, chọn tab "Tạo Giao Dịch Mới", điền đầy đủ thông tin sản phẩm, số tiền, điều khoản và thời hạn. Sau khi tạo, bạn sẽ nhận được mã giao dịch để gửi cho đối tác.',
            },
            {
                q: 'Tiền được giữ ở đâu trong quá trình giao dịch?',
                a: 'Tiền được giữ trong ví ký quỹ của ESCROW — một tài khoản độc lập, không ai có thể rút ra cho đến khi cả 2 bên xác nhận hoàn thành hoặc có quyết định từ admin khi có tranh chấp.',
            },
            {
                q: 'Giao dịch hết hạn thì sao?',
                a: 'Khi giao dịch hết thời hạn mà chưa được xác nhận hoàn thành, hệ thống sẽ tự động hủy và hoàn tiền về ví cho bên đã nạp. Bạn có thể tạo giao dịch mới nếu cần.',
            },
            {
                q: 'Tôi có thể hủy giao dịch đang trong quá trình không?',
                a: 'Có thể hủy khi trạng thái là "Chờ đối tác" hoặc "Đã xác nhận". Khi giao dịch đang ở trạng thái "Đang giao dịch", cả 2 bên cần đồng thuận hoặc phải tạo tố cáo nếu có vấn đề.',
            },
            {
                q: 'Phí giao dịch là bao nhiêu?',
                a: 'Phí dịch vụ cố định là 10.000đ mỗi giao dịch, không phân biệt giá trị giao dịch lớn hay nhỏ. Phí được trừ tự động khi giao dịch hoàn thành.',
            },
        ],
    },
    {
        group:  'Ví & Thanh toán',
        icon:   'bx-wallet',
        color:  '#16a34a',
        bg:     '#f0fdf4',
        items: [
            {
                q: 'Nạp tiền vào ví mất bao lâu?',
                a: 'Thông thường tiền được cộng vào ví trong vòng 5-15 phút sau khi giao dịch ngân hàng thành công. Nếu sau 30 phút chưa nhận được, hãy liên hệ hỗ trợ kèm biên lai giao dịch.',
            },
            {
                q: 'Rút tiền về ngân hàng mất bao lâu?',
                a: 'Yêu cầu rút tiền thường được xử lý trong 1-2 ngày làm việc. ESCROW xử lý các yêu cầu từ 8:00-17:00 các ngày trong tuần (trừ ngày lễ).',
            },
            {
                q: 'Số dư tối thiểu để nạp/rút là bao nhiêu?',
                a: 'Số tiền tối thiểu cho mỗi lần nạp hoặc rút là 10.000đ. Không có giới hạn tối đa, tuy nhiên các giao dịch lớn có thể cần xác minh thêm.',
            },
            {
                q: '"Đang ký quỹ" là gì?',
                a: 'Đây là số tiền đang được giữ trong các giao dịch P2P chưa hoàn thành. Số tiền này chưa thể sử dụng cho đến khi giao dịch được hoàn tất hoặc hủy.',
            },
        ],
    },
    {
        group:  'KYC & Tài khoản',
        icon:   'bx-shield-quarter',
        color:  '#d97706',
        bg:     '#fff7ed',
        items: [
            {
                q: 'KYC là gì? Tại sao cần KYC?',
                a: 'KYC (Know Your Customer) là quy trình xác minh danh tính người dùng. ESCROW yêu cầu KYC để đảm bảo an toàn cho tất cả người dùng, ngăn chặn gian lận và tuân thủ quy định pháp luật. Chưa KYC bạn sẽ không thể sử dụng ví hoặc giao dịch P2P.',
            },
            {
                q: 'KYC mất bao lâu để được duyệt?',
                a: 'Admin sẽ xem xét hồ sơ KYC trong vòng 1-2 ngày làm việc. Bạn sẽ nhận thông báo qua email khi hồ sơ được duyệt hoặc từ chối kèm lý do.',
            },
            {
                q: 'Hồ sơ KYC bị từ chối thì phải làm sao?',
                a: 'Vào trang Ví, xem lý do từ chối và gửi lại hồ sơ với thông tin đúng. Các lý do thường gặp: ảnh mờ, che khuất, giấy tờ hết hạn, hoặc selfie không rõ mặt.',
            },
            {
                q: 'Quên mật khẩu phải làm thế nào?',
                a: 'Nhấn "Quên mật khẩu?" ở trang đăng nhập, nhập email đã đăng ký, hệ thống sẽ gửi link đặt lại mật khẩu về email của bạn trong vòng vài phút.',
            },
            {
                q: 'Tôi có thể đổi email/số điện thoại không?',
                a: 'Có thể đổi trong phần Cài Đặt → Thông tin cá nhân. Bạn cần xác minh OTP gửi về số mới/email mới để hoàn tất thay đổi.',
            },
        ],
    },
    {
        group:  'Tố cáo & Tranh chấp',
        icon:   'bx-error-circle',
        color:  '#dc2626',
        bg:     '#fef2f2',
        items: [
            {
                q: 'Khi nào tôi nên tạo tố cáo?',
                a: 'Tạo tố cáo khi đối tác không thực hiện đúng cam kết: không giao hàng, hàng không đúng mô tả, không phản hồi, hoặc có dấu hiệu gian lận. Hãy chuẩn bị bằng chứng trước khi gửi tố cáo.',
            },
            {
                q: 'Tố cáo được xử lý trong bao lâu?',
                a: 'Admin sẽ xem xét tố cáo trong vòng 1-3 ngày làm việc. Trong thời gian này, tiền giao dịch được giữ nguyên trong ví ký quỹ. Bạn có thể bổ sung bằng chứng bất kỳ lúc nào.',
            },
            {
                q: 'Tôi có thể rút tố cáo không?',
                a: 'Có thể rút tố cáo khi trạng thái là "Chờ tiếp nhận" (admin chưa bắt đầu xem xét). Sau khi admin đã tiếp nhận thì không thể rút nữa.',
            },
            {
                q: 'Kết quả tố cáo có thể bao gồm những gì?',
                a: 'Tuỳ theo tình huống, admin có thể quyết định: hoàn tiền cho người mua, giải ngân cho người bán, cảnh cáo hoặc khóa tài khoản vi phạm. Quyết định của admin là quyết định cuối cùng.',
            },
        ],
    },
    {
        group:  'Bảo mật',
        icon:   'bx-lock-alt',
        color:  '#7c3aed',
        bg:     '#f5f3ff',
        items: [
            {
                q: 'Làm thế nào để tài khoản an toàn hơn?',
                a: 'Sử dụng mật khẩu mạnh (ít nhất 8 ký tự, kết hợp chữ hoa, số, ký tự đặc biệt). Không chia sẻ thông tin đăng nhập với ai. Kiểm tra lịch sử đăng nhập thường xuyên trong Cài Đặt → Bảo mật.',
            },
            {
                q: 'Tôi thấy đăng nhập lạ trên tài khoản phải làm gì?',
                a: 'Ngay lập tức: (1) Đổi mật khẩu trong Cài Đặt → Bảo mật, (2) Nhấn "Đăng xuất tất cả thiết bị", (3) Liên hệ support@escrow.vn để được hỗ trợ khóa tài khoản tạm thời nếu cần.',
            },
            {
                q: 'ESCROW có lưu thông tin thẻ ngân hàng không?',
                a: 'ESCROW không lưu số thẻ tín dụng/ghi nợ. Chúng tôi chỉ lưu số tài khoản ngân hàng (không phải số thẻ) để xử lý nạp/rút tiền. Thông tin này được mã hóa và bảo mật theo tiêu chuẩn ngành.',
            },
        ],
    },
];


// ============================================================
//  SWITCH SECTION
// ============================================================
function switchSection(name) {
    document.querySelectorAll('.support-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.support-nav__item').forEach(n => n.classList.remove('support-nav__item--active'));
    document.getElementById('section-' + name).style.display = 'block';
    document.getElementById('nav-' + name).classList.add('support-nav__item--active');
}


// ============================================================
//  RENDER FAQ
// ============================================================
function renderFaq() {
    const container = document.getElementById('faqGroups');
    container.innerHTML = FAQ_DATA.map((group, gi) => `
        <div class="faq-group" data-group="${gi}">
            <div class="faq-group__header">
                <div class="faq-group__icon" style="background:${group.bg}; color:${group.color}">
                    <i class='bx ${group.icon}'></i>
                </div>
                <span class="faq-group__title">${group.group}</span>
            </div>
            ${group.items.map((item, ii) => `
                <div class="faq-item" data-gi="${gi}" data-ii="${ii}">
                    <div class="faq-item__question" onclick="toggleFaq(this)">
                        <span>${item.q}</span>
                        <i class='bx bx-chevron-down faq-item__arrow'></i>
                    </div>
                    <div class="faq-item__answer">
                        <p style="padding-top:12px">${item.a}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function toggleFaq(trigger) {
    const answer  = trigger.nextElementSibling;
    const isOpen  = answer.classList.contains('open');

    // Đóng tất cả câu hỏi đang mở
    document.querySelectorAll('.faq-item__answer.open').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-item__question.open').forEach(q => q.classList.remove('open'));

    // Mở câu hỏi này nếu chưa mở
    if (!isOpen) {
        trigger.classList.add('open');
        answer.classList.add('open');
    }
}


// ============================================================
//  TÌM KIẾM FAQ
// ============================================================
function searchFaq() {
    const keyword    = document.getElementById('faqSearchInput').value.trim().toLowerCase();
    const clearBtn   = document.getElementById('faqClearBtn');
    const resultWrap = document.getElementById('faqSearchResult');
    const groupsWrap = document.getElementById('faqGroups');

    clearBtn.style.display = keyword ? 'flex' : 'none';

    if (!keyword) {
        resultWrap.style.display = 'none';
        groupsWrap.style.display = 'block';
        return;
    }

    resultWrap.style.display = 'block';
    groupsWrap.style.display = 'none';

    // Tìm kiếm trong tất cả câu hỏi
    const results = [];
    FAQ_DATA.forEach(group => {
        group.items.forEach(item => {
            if (item.q.toLowerCase().includes(keyword) || item.a.toLowerCase().includes(keyword)) {
                results.push({ group: group.group, icon: group.icon, color: group.color, bg: group.bg, ...item });
            }
        });
    });

    // Render header
    document.getElementById('faqResultHeader').innerHTML =
        results.length > 0
            ? `Tìm thấy <strong>${results.length}</strong> kết quả cho "<strong>${keyword}</strong>"`
            : '';

    // Render kết quả
    if (results.length === 0) {
        document.getElementById('faqResultList').innerHTML = `
            <div class="faq-not-found">
                <i class='bx bx-search-alt'></i>
                <p>Không tìm thấy câu hỏi nào phù hợp.<br>
                   Hãy thử từ khóa khác hoặc <a href="#" onclick="switchSection('contact'); return false;" style="color:#0ea5e9">liên hệ hỗ trợ</a>.</p>
            </div>`;
        return;
    }

    // Highlight từ khóa trong kết quả
    function highlight(text) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="faq-highlight">$1</span>');
    }

    document.getElementById('faqResultList').innerHTML = results.map(item => `
        <div class="faq-group" style="margin-bottom:10px">
            <div class="faq-group__header" style="padding:10px 20px">
                <div class="faq-group__icon" style="background:${item.bg}; color:${item.color}; width:28px; height:28px; font-size:14px">
                    <i class='bx ${item.icon}'></i>
                </div>
                <span style="font-size:12px; color:#94a3b8">${item.group}</span>
            </div>
            <div class="faq-item">
                <div class="faq-item__question open" onclick="toggleFaq(this)">
                    <span>${highlight(item.q)}</span>
                    <i class='bx bx-chevron-down faq-item__arrow' style="transform:rotate(180deg); color:#0ea5e9"></i>
                </div>
                <div class="faq-item__answer open">
                    <p style="padding-top:12px">${highlight(item.a)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function clearFaqSearch() {
    document.getElementById('faqSearchInput').value = '';
    searchFaq();
}


// ============================================================
//  FORM LIÊN HỆ
//  TODO (Java): POST /api/support/contact
//  Body: { chuDe, moTa, files[] }
// ============================================================
function handleContactFile(input) {
    const list = document.getElementById('contactPreviewList');
    list.innerHTML = '';
    Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.className = 'contact-preview-thumb';
            img.src       = e.target.result;
            img.title     = file.name;
            list.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function submitContact() {
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();
    let hasError  = false;

    const errSubject = document.getElementById('err-subject');
    const errMessage = document.getElementById('err-message');
    errSubject.textContent = ''; errSubject.classList.remove('show');
    errMessage.textContent = ''; errMessage.classList.remove('show');

    if (!subject) {
        errSubject.textContent = 'Vui lòng chọn chủ đề.';
        errSubject.classList.add('show');
        hasError = true;
    }

    if (!message) {
        errMessage.textContent = 'Vui lòng mô tả vấn đề của bạn.';
        errMessage.classList.add('show');
        hasError = true;
    } else if (message.length < 20) {
        errMessage.textContent = 'Mô tả cần ít nhất 20 ký tự.';
        errMessage.classList.add('show');
        hasError = true;
    }

    if (hasError) return;

    // TODO: fetch('/api/support/contact', { method:'POST', body: formData })

    // DEMO
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';
    document.getElementById('contactPreviewList').innerHTML = '';

    showSupportToast('Yêu cầu hỗ trợ đã được gửi! Chúng tôi sẽ phản hồi trong 24 giờ.');
}


// ============================================================
//  TOAST
// ============================================================
function showSupportToast(message) {
    const old = document.getElementById('supportToast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'supportToast';
    toast.style.cssText = `
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        background: #1e293b; color: white;
        padding: 14px 20px; border-radius: 12px;
        font-size: 14px; font-weight: 600;
        display: flex; align-items: center; gap: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        max-width: 360px; line-height: 1.4;
        animation: toastIn 0.25s ease;
    `;
    toast.innerHTML = `
        <i class='bx bx-check-circle' style="font-size:20px; color:#38bdf8; flex-shrink:0"></i>
        ${message}`;

    if (!document.getElementById('toastAnimStyle')) {
        const s = document.createElement('style');
        s.id = 'toastAnimStyle';
        s.textContent = '@keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }';
        document.head.appendChild(s);
    }

    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
}


// ============================================================
//  KHỞI ĐỘNG
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderFaq();
});