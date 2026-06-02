// ============================================================
//  global.js — Chạy trên MỌI trang
//  Thêm <script src="/js/global.js"></script> vào cuối body
//  của tất cả các trang HTML
// ============================================================


// ============================================================
//  TỰ ĐỘNG ACTIVE NAV LINK
//
//  Nguyên lý: so sánh pathname URL hiện tại với data-page
//  của từng link → gán class "active" đúng link.
//
//  Cách dùng: thêm attribute data-page vào mỗi nav link:
//    <a href="..." data-page="home">Trang Chủ</a>
//    <a href="..." data-page="p2p">P2P</a>
//    <a href="..." data-page="wallet">Ví</a>
//    <a href="..." data-page="report">Tố Cáo</a>
//
//  Mapping trang → data-page active:
//    /html/index.html            → "home"
//    /html/pages/dashboard.html  → "p2p"   (sau này)
//    /html/pages/wallet.html     → "wallet" (sau này)
//    /html/pages/report.html     → "report" (sau này)
//    /html/pages/profile.html    → avatar icon sáng
//
//  TODO (Java/Backend): nếu dùng server-side rendering,
//  có thể bỏ hàm này và gán class "active" từ template.
// ============================================================

// Map: tên file → data-page tương ứng
const PAGE_MAP = {
    'index.html':     'home',
    'p2p.html': 'p2p',
    'wallet.html':    'wallet',
    'report.html':    'report',
};

function setActiveNav() {
    const path     = window.location.pathname;
    const fileName = path.split('/').pop() || 'index.html';
    const curPage  = PAGE_MAP[fileName] || '';

    // --- Header top links: chỉ active khi data-page khớp ---
    document.querySelectorAll('.header-top__link[data-page]').forEach(link => {
        const page = link.dataset.page;
        link.classList.toggle('active', page === curPage);
    });

    // --- Avatar icon: sáng khi đang ở trang profile ---
    const profileIcon = document.querySelector('.header-mid__profile');
    if (profileIcon) {
        profileIcon.classList.toggle('active', fileName === 'profile.html');
    }
}

document.addEventListener('DOMContentLoaded', setActiveNav);