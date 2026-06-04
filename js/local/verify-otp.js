// ==========================================
// LẤY EMAIL TỪ URL
// ==========================================
const params = new URLSearchParams(window.location.search);
const rawEmail = params.get('email') || 'email@example.com';

function maskEmail(email) {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    return user.charAt(0) + '***@' + domain;
}

document.getElementById('displayEmail').textContent = maskEmail(rawEmail);

// ==========================================
// OTP INPUTS LOGIC
// ==========================================
const inputs = document.querySelectorAll('.otp-inputs input');

inputs.forEach((input, index) => {
    // Chỉ cho nhập số
    input.addEventListener('keydown', (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && !e.ctrlKey) {
            e.preventDefault();
        }
    });

    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value) {
            input.classList.add('filled');
            clearError();
            if (index < inputs.length - 1) inputs[index + 1].focus();
        } else {
            input.classList.remove('filled');
        }
    });

    // Backspace về ô trước
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].value = '';
            inputs[index - 1].classList.remove('filled');
        }
    });

    // Paste OTP
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        pasted.split('').forEach((char, i) => {
            if (inputs[i]) {
                inputs[i].value = char;
                inputs[i].classList.add('filled');
            }
        });
        if (inputs[pasted.length - 1]) inputs[pasted.length - 1].focus();
    });
});

inputs[0].focus();

function getOTP() {
    return Array.from(inputs).map(i => i.value).join('');
}

function setInputError() {
    inputs.forEach(i => { i.classList.add('error'); i.classList.remove('filled'); });
    setTimeout(() => inputs.forEach(i => i.classList.remove('error')), 600);
}

// ==========================================
// TIMER 5 PHÚT
// ==========================================
let timeLeft = 5 * 60;
let expired = false;
let timerInterval = null;
const countdownEl = document.getElementById('countdown');

function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = formatTime(timeLeft);
        if (timeLeft <= 60) countdownEl.classList.add('warning');
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            expired = true;
            countdownEl.textContent = 'Mã đã hết hạn';
            countdownEl.classList.remove('warning');
            countdownEl.classList.add('expired');
            document.getElementById('verifyBtn').disabled = true;
        }
    }, 1000);
}

startTimer();

// ==========================================
// RESEND COUNTDOWN (60 giây)
// ==========================================
let resendLeft = 60;
let resendInterval = null;
const resendBtn = document.getElementById('resendBtn');

function startResendCountdown() {
    resendLeft = 60;
    resendBtn.disabled = true;
    resendBtn.innerHTML = 'Gửi lại (<span id="resendCountdown">60</span>s)';
    const numEl = document.getElementById('resendCountdown');

    resendInterval = setInterval(() => {
        resendLeft--;
        if (numEl) numEl.textContent = resendLeft;
        if (resendLeft <= 0) {
            clearInterval(resendInterval);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Gửi lại OTP';
        }
    }, 1000);
}

startResendCountdown();

resendBtn.addEventListener('click', () => {
    // TODO: gọi API gửi lại OTP
    // fetch('/api/auth/resend-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: rawEmail })
    // });

    // Reset timer OTP
    timeLeft = 5 * 60;
    expired = false;
    countdownEl.textContent = formatTime(timeLeft);
    countdownEl.classList.remove('expired', 'warning');
    document.getElementById('verifyBtn').disabled = false;
    startTimer();

    // Reset resend countdown
    startResendCountdown();
});

// ==========================================
// MESSAGES
// ==========================================
function showError(msg) {
    document.getElementById('errorText').textContent = msg;
    document.getElementById('errorMsg').classList.add('show');
}

function clearError() {
    document.getElementById('errorMsg').classList.remove('show');
}

// ==========================================
// VERIFY HANDLER
// (Sau này thay bằng fetch POST /api/auth/verify-otp)
// ==========================================
document.getElementById('verifyBtn').addEventListener('click', async () => {
    const otp = getOTP();

    if (otp.length < 6) {
        showError('Vui lòng nhập đủ 6 chữ số.');
        setInputError();
        return;
    }

    if (expired) {
        showError('Mã OTP đã hết hạn. Vui lòng gửi lại.');
        return;
    }

    clearError();
    const btn = document.getElementById('verifyBtn');
    btn.disabled = true;
    btn.textContent = 'Đang xác minh...';

    // TODO: Thay đoạn này bằng API call thực
    // try {
    //     const res = await fetch('/api/auth/verify-otp', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ email: rawEmail, otp })
    //     });
    //     const data = await res.json();
    //     if (!res.ok) {
    //         showError(data.message || 'Mã OTP không đúng.');
    //         setInputError();
    //         btn.disabled = false;
    //         btn.innerHTML = '<i class="bx bx-check-double"></i> Xác Nhận';
    //         return;
    //     }
    //     showSuccess();
    // } catch (err) {
    //     showError('Lỗi kết nối. Vui lòng thử lại.');
    //     btn.disabled = false;
    //     btn.innerHTML = '<i class="bx bx-check-double"></i> Xác Nhận';
    // }

    // DEMO: OTP đúng là "123456"
    setTimeout(() => {
        if (otp === '123456') {
            showSuccess();
        } else {
            showError('Mã OTP không đúng. (Demo: nhập 123456)');
            setInputError();
            btn.disabled = false;
            btn.innerHTML = '<i class="bx bx-check-double"></i> Xác Nhận';
        }
    }, 1000);
});

// ==========================================
// SUCCESS STATE
// ==========================================
function showSuccess() {
    clearInterval(timerInterval);
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('successState').classList.add('show');

    let sec = 3;
    const el = document.getElementById('redirectCountdown');
    const interval = setInterval(() => {
        sec--;
        el.textContent = sec;
        if (sec <= 0) {
            clearInterval(interval);
            window.location.href = '/Web/html/pages/login.html';
        }
    }, 1000);
}
