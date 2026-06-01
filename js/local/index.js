// ==========================================
// DEMO DATA
// (Sau này thay bằng dữ liệu từ API gọi sp_LayThongKe)
// ==========================================
const traders = [
    { name: "Minh Quân",  info: "1200 đơn",     score: "TOP 1",   rank: 1 },
    { name: "Thu Hà",     info: "Uy tín cao",   score: "99%",     rank: 2 },
    { name: "Đức Anh",    info: "VIP",          score: "98%",     rank: 3 },
    { name: "Lan Phương", info: "Đánh giá tốt", score: "5⭐",      rank: 4 },
    { name: "Hoàng Nam",  info: "Trader mạnh",  score: "1500 đơn",rank: 5 },
    { name: "Bảo Trân",   info: "Hài lòng cao", score: "4.9⭐",    rank: 6 },
    { name: "Gia Huy",    info: "Được đề xuất", score: "TOP",     rank: 7 },
    { name: "Mỹ Linh",    info: "Uy tín",       score: "97%",     rank: 8 },
    { name: "Tuấn Kiệt",  info: "VIP",          score: "860 đơn", rank: 9 },
    { name: "Khánh Vy",   info: "Mạnh nhất tháng", score: "#1",   rank: 10 }
];

// ==========================================
// AVATAR: sinh màu nền từ tên (luôn cố định cho cùng 1 tên)
// ==========================================
const avatarColors = [
    "#0ea5e9", "#7c3aed", "#0891b2", "#0a9422",
    "#d946ef", "#f59e0b", "#ef4444", "#14b8a6"
];

function getAvatarColor(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return avatarColors[sum % avatarColors.length];
}

function getInitial(name) {
    // Lấy chữ cái đầu của từ cuối (tên riêng trong tiếng Việt)
    const parts = name.trim().split(" ");
    return parts[parts.length - 1].charAt(0).toUpperCase();
}

// Huy hiệu theo thứ hạng
function getRankIcon(rank) {
    if (rank === 1) return "🏆";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "⭐";
}

// ==========================================
// ELEMENTS
// ==========================================
const sliderTrack = document.getElementById("sliderTrack");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// ==========================================
// RENDER CARD
// ==========================================
function renderCards() {
    sliderTrack.innerHTML = "";
    traders.forEach(trader => {
        const color = getAvatarColor(trader.name);
        const initial = getInitial(trader.name);
        sliderTrack.innerHTML += `
            <div class="section-top-trader__card">
                <div class="section-top-trader__icon">${getRankIcon(trader.rank)}</div>
                <div class="section-top-trader__avatar" style="background:${color}">${initial}</div>
                <h3 class="section-top-trader__name">${trader.name}</h3>
                <p class="section-top-trader__info">${trader.info}</p>
                <span class="section-top-trader__score">${trader.score}</span>
            </div>`;
    });
}
renderCards();

// ==========================================
// SLIDER LOGIC
// ==========================================
let currentIndex = 0;

function getCardWidth() {
    const card = document.querySelector(".section-top-trader__card");
    if (!card) return 0;
    const style = window.getComputedStyle(sliderTrack);
    const gap = parseInt(style.columnGap || style.gap) || 0;
    return card.offsetWidth + gap;
}

function getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
}

function updateSlider() {
    const cardWidth = getCardWidth();
    sliderTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// ==========================================
// EVENTS
// ==========================================
nextBtn.addEventListener("click", () => {
    const visibleCards = getVisibleCards();
    const maxScroll = traders.length - visibleCards;
    if (currentIndex < maxScroll) {
        currentIndex++;
        updateSlider();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

window.addEventListener("resize", () => {
    currentIndex = 0;
    updateSlider();
});