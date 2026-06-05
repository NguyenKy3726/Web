const dataToImport = {

&#x20; "escrow\_store\_v1": "{\\"users\\":\[{\\"id\\":1,\\"tenDangNhap\\":\\"owner\\",\\"matKhau\\":\\"owner123\\",\\"hoTen\\":\\"Nguyễn Văn Owner\\",\\"email\\":\\"owner@escrow.vn\\",\\"soDienThoai\\":\\"0901234567\\",\\"facebook\\":\\"fb.com/owner\\",\\"tiktok\\":\\"@owner\\",\\"role\\":\\"OWNER\\",\\"kycStatus\\":\\"APPROVED\\",\\"emailVerified\\":true,\\"trangThai\\":\\"ACTIVE\\",\\"ngayTao\\":\\"01/01/2026\\"},{\\"id\\":2,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"14:27 04/06/2026\\",\\"tenDangNhap\\":\\"user01\\",\\"matKhau\\":\\"user12345\\",\\"hoTen\\":\\"Nguyễn Văn An\\",\\"email\\":\\"NguyenVanAn001@gmail.com\\",\\"soDienThoai\\":\\"0905135001\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Nguyễn Văn An\\",\\"kycCCCD\\":\\"056206009001\\",\\"kycNgaySinh\\":\\"1989-02-21\\"},{\\"id\\":3,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"14:42 04/06/2026\\",\\"tenDangNhap\\":\\"user12345\\",\\"matKhau\\":\\"user12345\\",\\"hoTen\\":\\"Trần Minh Anh\\",\\"email\\":\\"TrầnMinhAnh002@gmail.com\\",\\"soDienThoai\\":\\"0905135002\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Trần Minh Anh\\",\\"kycCCCD\\":\\"056206009002\\",\\"kycNgaySinh\\":\\"1996-05-24\\"},{\\"id\\":4,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"14:44 04/06/2026\\",\\"tenDangNhap\\":\\"user123456\\",\\"matKhau\\":\\"user12345\\",\\"hoTen\\":\\"Lê Quốc Bảo\\",\\"email\\":\\"LêQuốcBảo003@gmail.com\\",\\"soDienThoai\\":\\"0905135003\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Lê Quốc Bảo\\",\\"kycCCCD\\":\\"056206009003\\",\\"kycNgaySinh\\":\\"1992-03-08\\"},{\\"id\\":5,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"14:50 04/06/2026\\",\\"tenDangNhap\\":\\"user04\\",\\"matKhau\\":\\"user123457\\",\\"hoTen\\":\\"Phạm Gia Bảo\\",\\"email\\":\\"PhạmGiaBảo004@gmail.com\\",\\"soDienThoai\\":\\"0905135004\\",\\"role\\":\\"USER\\"},{\\"id\\":6,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:04 04/06/2026\\",\\"tenDangNhap\\":\\"user05\\",\\"matKhau\\":\\"user123458\\",\\"hoTen\\":\\"Hoàng Minh Châu\\",\\"email\\":\\"HoàngMinhChâu005@gmail.com\\",\\"soDienThoai\\":\\"0905135005\\",\\"role\\":\\"USER\\"},{\\"id\\":7,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:04 04/06/2026\\",\\"tenDangNhap\\":\\"user06\\",\\"matKhau\\":\\"user123459\\",\\"hoTen\\":\\"Võ Thanh Danh\\",\\"email\\":\\"VõThanhDanh006@gmail.com\\",\\"soDienThoai\\":\\"0905135006\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Võ Thanh Danh\\",\\"kycCCCD\\":\\"056206009006\\",\\"kycNgaySinh\\":\\"1991-02-01\\"},{\\"id\\":8,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:06 04/06/2026\\",\\"tenDangNhap\\":\\"056206009007\\",\\"matKhau\\":\\"user123452\\",\\"hoTen\\":\\"Đặng Quốc Duy\\",\\"email\\":\\"ĐặngQuốcDuy007@gmail.com\\",\\"soDienThoai\\":\\"0905135007\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Đặng Quốc Duy\\",\\"kycCCCD\\":\\"056206009007\\",\\"kycNgaySinh\\":\\"2005-04-07\\"},{\\"id\\":9,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:08 04/06/2026\\",\\"tenDangNhap\\":\\"user08\\",\\"matKhau\\":\\"user123452\\",\\"hoTen\\":\\"Bùi Thành Đạt\\",\\"email\\":\\"BùiThànhĐạt008@gmail.com\\",\\"soDienThoai\\":\\"0905135008\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Bùi Thành Đạt\\",\\"kycCCCD\\":\\"056206009008\\",\\"kycNgaySinh\\":\\"2006-01-20\\"},{\\"id\\":10,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:09 04/06/2026\\",\\"tenDangNhap\\":\\"user09\\",\\"matKhau\\":\\"user123453\\",\\"hoTen\\":\\"Đỗ Minh Đức\\",\\"email\\":\\"ĐỗMinhĐức009@gmail.com\\",\\"soDienThoai\\":\\"0905135009\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Đỗ Minh Đức\\",\\"kycCCCD\\":\\"056206009009\\",\\"kycNgaySinh\\":\\"2006-12-07\\"},{\\"id\\":11,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:11 04/06/2026\\",\\"tenDangNhap\\":\\"user10\\",\\"matKhau\\":\\"user123454\\",\\"hoTen\\":\\"Nguyễn Hải Đăng\\",\\"email\\":\\"NguyễnHảiĐăng010@gmail.com\\",\\"soDienThoai\\":\\"0905135010\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Nguyễn Hải Đăng\\",\\"kycCCCD\\":\\"056206009010\\",\\"kycNgaySinh\\":\\"2003-04-14\\"},{\\"id\\":12,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:12 04/06/2026\\",\\"tenDangNhap\\":\\"user11\\",\\"matKhau\\":\\"user123455\\",\\"hoTen\\":\\"Trần Quốc Hưng\\",\\"email\\":\\"TrầnQuốcHưng011@gmail.com\\",\\"soDienThoai\\":\\"0905135011\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Trần Quốc Hưng\\",\\"kycCCCD\\":\\"056206009011\\",\\"kycNgaySinh\\":\\"1989-05-19\\"},{\\"id\\":13,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:14 04/06/2026\\",\\"tenDangNhap\\":\\"user12\\",\\"matKhau\\":\\"user123450\\",\\"hoTen\\":\\"Lê Minh Khang\\",\\"email\\":\\"LêMinhKhang012@gmail.com\\",\\"soDienThoai\\":\\"0905135012\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Lê Minh Khang\\",\\"kycCCCD\\":\\"056206009012\\",\\"kycNgaySinh\\":\\"2002-03-25\\"},{\\"id\\":14,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:16 04/06/2026\\",\\"tenDangNhap\\":\\"user13\\",\\"matKhau\\":\\"user12344\\",\\"hoTen\\":\\"Phạm Gia Khánh\\",\\"email\\":\\"PhạmGiaKhánh013@gmail.com\\",\\"soDienThoai\\":\\"0905135013\\",\\"role\\":\\"USER\\"},{\\"id\\":15,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:17 04/06/2026\\",\\"tenDangNhap\\":\\"user14\\",\\"matKhau\\":\\"user12345\\",\\"hoTen\\":\\"Hoàng Bảo Long\\",\\"email\\":\\"HoàngBảoLong014@gmail.com\\",\\"soDienThoai\\":\\"0905135014\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Hoàng Bảo Long\\",\\"kycCCCD\\":\\"056206009014\\",\\"kycNgaySinh\\":\\"1992-06-07\\"},{\\"id\\":16,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:18 04/06/2026\\",\\"tenDangNhap\\":\\"user15\\",\\"matKhau\\":\\"user12346\\",\\"hoTen\\":\\"Võ Quốc Nam\\",\\"email\\":\\"VõQuốcNam015@gmail.com\\",\\"soDienThoai\\":\\"0905135015\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Võ Quốc Nam\\",\\"kycCCCD\\":\\"056206009015\\",\\"kycNgaySinh\\":\\"1992-07-03\\"},{\\"id\\":17,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:28 04/06/2026\\",\\"tenDangNhap\\":\\"user16\\",\\"matKhau\\":\\"user12347\\",\\"hoTen\\":\\"Đặng Minh Nhật\\",\\"email\\":\\"ĐặngMinhNhật016@gmail.com\\",\\"soDienThoai\\":\\"0905135016\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Đặng Minh Nhật\\",\\"kycCCCD\\":\\"056206009016\\",\\"kycNgaySinh\\":\\"1997-06-12\\"},{\\"id\\":18,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:29 04/06/2026\\",\\"tenDangNhap\\":\\"user17\\",\\"matKhau\\":\\"user12348\\",\\"hoTen\\":\\"Bùi Anh Phúc\\",\\"email\\":\\"BùiAnhPhúc017@gmail.com\\",\\"soDienThoai\\":\\"0905135017\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Bùi Anh Phúc\\",\\"kycCCCD\\":\\"056206009017\\",\\"kycNgaySinh\\":\\"2003-12-06\\"},{\\"id\\":19,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:30 04/06/2026\\",\\"tenDangNhap\\":\\"user18\\",\\"matKhau\\":\\"user12349\\",\\"hoTen\\":\\"Đỗ Gia Phúc\\",\\"email\\":\\"ĐỗGiaPhúc018@gmail.com\\",\\"soDienThoai\\":\\"0905135018\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Đỗ Gia Phúc\\",\\"kycCCCD\\":\\"056206009018\\",\\"kycNgaySinh\\":\\"2001-02-18\\"},{\\"id\\":20,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:32 04/06/2026\\",\\"tenDangNhap\\":\\"user19\\",\\"matKhau\\":\\"user12355\\",\\"hoTen\\":\\"Nguyễn Thành Quân\\",\\"email\\":\\"NguyễnThànhQuân019@gmail.com\\",\\"soDienThoai\\":\\"0905135019\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Nguyễn Thành Quân\\",\\"kycCCCD\\":\\"056206009019\\",\\"kycNgaySinh\\":\\"1998-09-03\\"},{\\"id\\":21,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:33 04/06/2026\\",\\"tenDangNhap\\":\\"user20\\",\\"matKhau\\":\\"user12343\\",\\"hoTen\\":\\"Trần Minh Quân\\",\\"email\\":\\"TrầnMinhQuân020@gmail.com\\",\\"soDienThoai\\":\\"0905135020\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Trần Minh Quân\\",\\"kycCCCD\\":\\"056206009020\\",\\"kycNgaySinh\\":\\"2000-11-27\\"},{\\"id\\":22,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:34 04/06/2026\\",\\"tenDangNhap\\":\\"user21\\",\\"matKhau\\":\\"user12323\\",\\"hoTen\\":\\"Lê Đức Tài\\",\\"email\\":\\"LêĐứcTài021@gmail.com\\",\\"soDienThoai\\":\\"0905135021\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Lê Đức Tài\\",\\"kycCCCD\\":\\"056206009021\\",\\"kycNgaySinh\\":\\"1991-04-19\\"},{\\"id\\":23,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"PENDING\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:35 04/06/2026\\",\\"tenDangNhap\\":\\"user22\\",\\"matKhau\\":\\"user12324\\",\\"hoTen\\":\\"Phạm Minh Tâm\\",\\"email\\":\\"PhạmMinhTâm022@gmail.com\\",\\"soDienThoai\\":\\"0905135022\\",\\"role\\":\\"USER\\",\\"kycHoTen\\":\\"Phạm Minh Tâm\\",\\"kycCCCD\\":\\"056206009022\\",\\"kycNgaySinh\\":\\"1996-02-11\\"},{\\"id\\":24,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:38 04/06/2026\\",\\"tenDangNhap\\":\\"admin01\\",\\"matKhau\\":\\"admin12345\\",\\"hoTen\\":\\"Nguyễn Quang Admin\\",\\"email\\":\\"NguyenQuangAdmin101@gmail.com\\",\\"soDienThoai\\":\\"0905135101\\",\\"role\\":\\"USER\\"},{\\"id\\":25,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:38 04/06/2026\\",\\"tenDangNhap\\":\\"admin02\\",\\"matKhau\\":\\"admin12345\\",\\"hoTen\\":\\"Trần Minh Admin\\",\\"email\\":\\"TranMinhAdmin102@gmail.com\\",\\"soDienThoai\\":\\"0905135102\\",\\"role\\":\\"USER\\"},{\\"id\\":26,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:39 04/06/2026\\",\\"tenDangNhap\\":\\"admin03\\",\\"matKhau\\":\\"admin12345\\",\\"hoTen\\":\\"Lê Quốc Admin\\",\\"email\\":\\"LeQuocAdmin103@gmail.com\\",\\"soDienThoai\\":\\"0905135103\\",\\"role\\":\\"USER\\"},{\\"id\\":27,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:39 04/06/2026\\",\\"tenDangNhap\\":\\"admin04\\",\\"matKhau\\":\\"admin12345\\",\\"hoTen\\":\\"Phạm Gia Admin\\",\\"email\\":\\"PhamGiaAdmin104@gmail.com\\",\\"soDienThoai\\":\\"0905135104\\",\\"role\\":\\"USER\\"},{\\"id\\":28,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:40 04/06/2026\\",\\"tenDangNhap\\":\\"admin05\\",\\"matKhau\\":\\"admin12345\\",\\"hoTen\\":\\"Hoàng Đức Admin\\",\\"email\\":\\"HoangDucAdmin105@gmail.com\\",\\"soDienThoai\\":\\"0905135105\\",\\"role\\":\\"USER\\"}],\\"wallets\\":\[{\\"id\\":1,\\"userId\\":1,\\"soDuKhaDung\\":1000000000,\\"soDuKyQuy\\":0},{\\"id\\":2,\\"userId\\":2,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":3,\\"userId\\":3,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":4,\\"userId\\":4,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":5,\\"userId\\":5,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":6,\\"userId\\":6,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":7,\\"userId\\":7,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":8,\\"userId\\":8,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":9,\\"userId\\":9,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":10,\\"userId\\":10,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":11,\\"userId\\":11,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":12,\\"userId\\":12,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":13,\\"userId\\":13,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":14,\\"userId\\":14,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":15,\\"userId\\":15,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":16,\\"userId\\":16,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":17,\\"userId\\":17,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":18,\\"userId\\":18,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":19,\\"userId\\":19,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":20,\\"userId\\":20,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":21,\\"userId\\":21,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":22,\\"userId\\":22,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":23,\\"userId\\":23,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":24,\\"userId\\":24,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":25,\\"userId\\":25,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":26,\\"userId\\":26,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":27,\\"userId\\":27,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0},{\\"id\\":28,\\"userId\\":28,\\"soDuKhaDung\\":0,\\"soDuKyQuy\\":0}],\\"walletHistory\\":\[],\\"walletRequests\\":\[],\\"p2pTransactions\\":\[],\\"reports\\":\[],\\"notifications\\":\[],\\"\_nextId\\":{\\"user\\":29,\\"wallet\\":29,\\"walletHistory\\":1,\\"walletRequest\\":1,\\"transaction\\":1,\\"report\\":1,\\"notification\\":1}}",

&#x20; "escrow\_token": "token-28-1780569608037",

&#x20; "escrow\_user": "{\\"id\\":28,\\"trangThai\\":\\"ACTIVE\\",\\"kycStatus\\":\\"NONE\\",\\"emailVerified\\":true,\\"ngayTao\\":\\"17:40 04/06/2026\\",\\"tenDangNhap\\":\\"admin05\\",\\"hoTen\\":\\"Hoàng Đức Admin\\",\\"email\\":\\"HoangDucAdmin105@gmail.com\\",\\"soDienThoai\\":\\"0905135105\\",\\"role\\":\\"USER\\"}"

};



// Vòng lặp để set từng key vào localStorage

Object.keys(dataToImport).forEach(key => {

&#x20; localStorage.setItem(key, dataToImport\[key]);

});



console.log("✅ Đã import dữ liệu thành công vào Local Storage!");





// Bước 1: Cấp quyền ADMIN cho admin01 → admin05 (id 24-28)

const raw = localStorage.getItem('escrow\_store\_v1');

const store = JSON.parse(raw);



const adminIds = \[24, 25, 26, 27, 28];

store.users.forEach(u => {

&#x20; if (adminIds.includes(u.id)) {

&#x20;   u.role = 'ADMIN';

&#x20; }

});



localStorage.setItem('escrow\_store\_v1', JSON.stringify(store));

console.log('✅ Đã cấp quyền ADMIN:', store.users.filter(u => u.role === 'ADMIN').map(u => u.tenDangNhap));





// Bước 3: Owner chuyển tiền cho 5 Admin

const raw = localStorage.getItem('escrow\_store\_v1');

const store = JSON.parse(raw);



function nowStr() {

&#x20; return new Date().toLocaleString('vi-VN', {

&#x20;   day: '2-digit', month: '2-digit', year: 'numeric',

&#x20;   hour: '2-digit', minute: '2-digit'

&#x20; });

}



const deposits = \[

&#x20; { adminId: 24, amount: 250\_000\_000 },

&#x20; { adminId: 25, amount: 200\_000\_000 },

&#x20; { adminId: 26, amount: 220\_000\_000 },

&#x20; { adminId: 27, amount: 180\_000\_000 },

&#x20; { adminId: 28, amount: 150\_000\_000 },

];



const ownerWallet = store.wallets.find(w => w.userId === 1);



deposits.forEach(({ adminId, amount }) => {

&#x20; const adminWallet = store.wallets.find(w => w.userId === adminId);

&#x20; const ownerBefore = ownerWallet.soDuKhaDung;

&#x20; const adminBefore = adminWallet.soDuKhaDung;



&#x20; ownerWallet.soDuKhaDung -= amount;

&#x20; adminWallet.soDuKhaDung  += amount;



&#x20; store.walletHistory.push({

&#x20;   id: store.\_nextId.walletHistory++,

&#x20;   userId: 1, performedBy: 1,

&#x20;   loai: 'WITHDRAW', soTien: amount,

&#x20;   soDuTruoc: ownerBefore, soDuSau: ownerWallet.soDuKhaDung,

&#x20;   ghiChu: `Nạp tiền cho Admin #${adminId}`,

&#x20;   thoiGian: nowStr(),

&#x20; });



&#x20; store.walletHistory.push({

&#x20;   id: store.\_nextId.walletHistory++,

&#x20;   userId: adminId, performedBy: 1,

&#x20;   loai: 'DEPOSIT', soTien: amount,

&#x20;   soDuTruoc: adminBefore, soDuSau: adminWallet.soDuKhaDung,

&#x20;   ghiChu: 'Nhận nạp tiền từ Owner',

&#x20;   thoiGian: nowStr(),

&#x20; });

});



localStorage.setItem('escrow\_store\_v1', JSON.stringify(store));



console.log('✅ Xong! Số dư sau:');

console.log('  owner:', ownerWallet.soDuKhaDung.toLocaleString('vi-VN') + 'đ');

deposits.forEach(({ adminId }) => {

&#x20; const w = store.wallets.find(w => w.userId === adminId);

&#x20; const u = store.users.find(u => u.id === adminId);

&#x20; console.log(`  ${u.tenDangNhap}: ${w.soDuKhaDung.toLocaleString('vi-VN')}đ`);

});





// Bước 2: Thêm bank accounts cho users + admins

const raw = localStorage.getItem('escrow\_store\_v1');

const store = JSON.parse(raw);



const banks = \['Vietcombank','Techcombank','BIDV','MB Bank','VietinBank',

&#x20;              'Agribank','ACB','Sacombank','TPBank','VPBank'];



const bankData = \[

&#x20; // \[userId, tenNganHang, soTaiKhoan, tenChuTK]

&#x20; \[2,  'Vietcombank',  '0101000001', 'NGUYEN VAN AN'],

&#x20; \[3,  'Techcombank',  '1902000002', 'TRAN MINH ANH'],

&#x20; \[4,  'BIDV',         '3102000003', 'LE QUOC BAO'],

&#x20; \[5,  'MB Bank',      '0903000004', 'PHAM GIA BAO'],

&#x20; \[6,  'VietinBank',   '1020000005', 'HOANG MINH CHAU'],

&#x20; \[7,  'Agribank',     '9704000006', 'VO THANH DANH'],

&#x20; \[8,  'ACB',          '1870000007', 'DANG QUOC DUY'],

&#x20; \[9,  'Vietcombank',  '0101000008', 'BUI THANH DAT'],

&#x20; \[10, 'Techcombank',  '1902000009', 'DO MINH DUC'],

&#x20; \[11, 'BIDV',         '3102000010', 'NGUYEN HAI DANG'],

&#x20; \[12, 'MB Bank',      '0903000011', 'TRAN QUOC HUNG'],

&#x20; \[13, 'TPBank',       '0604000012', 'LE MINH KHANG'],

&#x20; \[14, 'VPBank',       '9908000013', 'PHAM GIA KHANH'],

&#x20; \[15, 'Sacombank',    '0605000014', 'HOANG BAO LONG'],

&#x20; \[16, 'Vietcombank',  '0101000015', 'VO QUOC NAM'],

&#x20; \[17, 'Techcombank',  '1902000016', 'DANG MINH NHAT'],

&#x20; \[18, 'ACB',          '1870000017', 'BUI ANH PHUC'],

&#x20; \[19, 'BIDV',         '3102000018', 'DO GIA PHUC'],

&#x20; \[20, 'MB Bank',      '0903000019', 'NGUYEN THANH QUAN'],

&#x20; \[21, 'VietinBank',   '1020000020', 'TRAN MINH QUAN'],

&#x20; \[22, 'Agribank',     '9704000021', 'LE DUC TAI'],

&#x20; \[23, 'TPBank',       '0604000022', 'PHAM MINH TAM'],

&#x20; // admins

&#x20; \[24, 'Vietcombank',  '0101000101', 'NGUYEN QUANG ADMIN'],

&#x20; \[25, 'Techcombank',  '1902000102', 'TRAN MINH ADMIN'],

&#x20; \[26, 'BIDV',         '3102000103', 'LE QUOC ADMIN'],

&#x20; \[27, 'MB Bank',      '0903000104', 'PHAM GIA ADMIN'],

&#x20; \[28, 'VietinBank',   '1020000105', 'HOANG DUC ADMIN'],

];



bankData.forEach((\[userId, tenNganHang, soTaiKhoan, tenChuTK]) => {

&#x20; const user = store.users.find(u => u.id === userId);

&#x20; if (!user) return;

&#x20; if (!user.bankAccounts) user.bankAccounts = \[];

&#x20; user.bankAccounts.push({

&#x20;   id: Date.now() + userId,

&#x20;   tenNganHang,

&#x20;   soTaiKhoan,

&#x20;   tenChuTK,

&#x20;   laMacDinh: true,

&#x20; });

});



localStorage.setItem('escrow\_store\_v1', JSON.stringify(store));



const count = store.users.filter(u => u.bankAccounts \&\& u.bankAccounts.length > 0).length;

console.log(`✅ Đã thêm bank account cho ${count} tài khoản`);

# 

// Bước 4: Admin nạp/rút cho users

const raw = localStorage.getItem('escrow\_store\_v1');

const store = JSON.parse(raw);



function nowStr() {

&#x20; return new Date().toLocaleString('vi-VN', {

&#x20;   day:'2-digit', month:'2-digit', year:'numeric',

&#x20;   hour:'2-digit', minute:'2-digit'

&#x20; });

}



function dep(adminId, userId, amount) {

&#x20; const aw = store.wallets.find(w => w.userId === adminId);

&#x20; const uw = store.wallets.find(w => w.userId === userId);

&#x20; const ab = aw.soDuKhaDung, ub = uw.soDuKhaDung;

&#x20; aw.soDuKhaDung -= amount;

&#x20; uw.soDuKhaDung += amount;

&#x20; store.walletHistory.push({ id: store.\_nextId.walletHistory++, userId: adminId, performedBy: adminId, loai:'WITHDRAW', soTien: amount, soDuTruoc: ab, soDuSau: aw.soDuKhaDung, ghiChu: `Nạp tiền cho user #${userId}`, thoiGian: nowStr() });

&#x20; store.walletHistory.push({ id: store.\_nextId.walletHistory++, userId: userId,  performedBy: adminId, loai:'DEPOSIT',  soTien: amount, soDuTruoc: ub, soDuSau: uw.soDuKhaDung, ghiChu: `Được admin #${adminId} nạp tiền`,  thoiGian: nowStr() });

}



function wit(adminId, userId, amount) {

&#x20; const aw = store.wallets.find(w => w.userId === adminId);

&#x20; const uw = store.wallets.find(w => w.userId === userId);

&#x20; const ab = aw.soDuKhaDung, ub = uw.soDuKhaDung;

&#x20; uw.soDuKhaDung -= amount;

&#x20; aw.soDuKhaDung += amount;

&#x20; store.walletHistory.push({ id: store.\_nextId.walletHistory++, userId: userId,  performedBy: adminId, loai:'WITHDRAW', soTien: amount, soDuTruoc: ub, soDuSau: uw.soDuKhaDung, ghiChu: `Rút tiền xử lý bởi admin #${adminId}`, thoiGian: nowStr() });

&#x20; store.walletHistory.push({ id: store.\_nextId.walletHistory++, userId: adminId, performedBy: adminId, loai:'DEPOSIT',  soTien: amount, soDuTruoc: ab, soDuSau: aw.soDuKhaDung, ghiChu: `Nhận rút tiền từ user #${userId}`,   thoiGian: nowStr() });

}



// admin01 (id 24, 250M) → users 2–6

dep(24, 2, 30\_000\_000);                                             // user2: 1 nạp

dep(24, 3, 20\_000\_000); dep(24, 3, 15\_000\_000); dep(24, 3, 10\_000\_000); wit(24, 3, 5\_000\_000); // user3: 3 nạp 1 rút

dep(24, 4, 25\_000\_000);                                             // user4: 1 nạp

dep(24, 5, 12\_000\_000); dep(24, 5, 10\_000\_000); dep(24, 5, 8\_000\_000);  wit(24, 5, 5\_000\_000); // user5: 3 nạp 1 rút

dep(24, 6, 20\_000\_000);                                             // user6: 1 nạp



// admin02 (id 25, 200M) → users 7–11

dep(25, 7,  30\_000\_000);                                            // user7: 1 nạp

dep(25, 8,  15\_000\_000); dep(25, 8, 20\_000\_000); dep(25, 8, 10\_000\_000); wit(25, 8, 8\_000\_000); // user8: 3 nạp 1 rút

dep(25, 9,  25\_000\_000);                                            // user9: 1 nạp

dep(25, 10, 20\_000\_000);                                            // user10: 1 nạp

dep(25, 11, 18\_000\_000);                                            // user11: 1 nạp



// admin03 (id 26, 220M) → users 12–16

dep(26, 12, 35\_000\_000);                                            // user12: 1 nạp

dep(26, 13, 15\_000\_000); dep(26, 13, 20\_000\_000); dep(26, 13, 10\_000\_000); wit(26, 13, 10\_000\_000); // user13: 3 nạp 1 rút

dep(26, 14, 22\_000\_000);                                            // user14: 1 nạp

dep(26, 15, 28\_000\_000);                                            // user15: 1 nạp

dep(26, 16, 20\_000\_000);                                            // user16: 1 nạp



// admin04 (id 27, 180M) → users 17–20

dep(27, 17, 40\_000\_000);                                            // user17: 1 nạp

dep(27, 18, 25\_000\_000); dep(27, 18, 15\_000\_000); dep(27, 18, 10\_000\_000); wit(27, 18, 5\_000\_000); // user18: 3 nạp 1 rút

dep(27, 19, 30\_000\_000);                                            // user19: 1 nạp

dep(27, 20, 35\_000\_000);                                            // user20: 1 nạp



// admin05 (id 28, 150M) → users 21–23

dep(28, 21, 30\_000\_000); dep(28, 21, 20\_000\_000); dep(28, 21, 15\_000\_000); wit(28, 21, 10\_000\_000); // user21: 3 nạp 1 rút

dep(28, 22, 25\_000\_000);                                            // user22: 1 nạp

dep(28, 23, 40\_000\_000);                                            // user23: 1 nạp



localStorage.setItem('escrow\_store\_v1', JSON.stringify(store));



console.log('✅ Số dư users sau nạp/rút:');

for (let uid = 2; uid <= 23; uid++) {

&#x20; const w = store.wallets.find(w => w.userId === uid);

&#x20; const u = store.users.find(u => u.id === uid);

&#x20; console.log(`  ${u.tenDangNhap}: ${w.soDuKhaDung.toLocaleString('vi-VN')}đ`);

}





// Bước 5: Duyệt KYC + Tạo giao dịch P2P

const raw = localStorage.getItem('escrow\_store\_v1');

const store = JSON.parse(raw);



function nowStr(offsetMin = 0) {

&#x20; const d = new Date(Date.now() - offsetMin \* 60 \* 1000);

&#x20; return d.toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });

}



// 1. Duyệt KYC

\[2,3,4,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23].forEach(id => {

&#x20; const u = store.users.find(u => u.id === id);

&#x20; if (u \&\& u.kycStatus === 'PENDING') {

&#x20;   u.kycStatus = 'APPROVED';

&#x20;   u.kycNguoiDuyet = 'Nguyễn Quang Admin';

&#x20;   u.kycThoiGianDuyet = nowStr(60);

&#x20; }

});



// 2. Helpers

const gw = uid => store.wallets.find(w => w.userId === uid);



function hist(userId, performedBy, loai, soTien, soDuTruoc, soDuSau, ghiChu, off) {

&#x20; store.walletHistory.push({ id: store.\_nextId.walletHistory++, userId, performedBy, loai, soTien, soDuTruoc, soDuSau, ghiChu, thoiGian: nowStr(off) });

}



function completeTx(buyerId, sellerId, amt, off) {

&#x20; const bw = gw(buyerId), sw = gw(sellerId);

&#x20; const bb = bw.soDuKhaDung, sb = sw.soDuKhaDung;

&#x20; bw.soDuKhaDung -= amt; sw.soDuKhaDung += amt;

&#x20; hist(buyerId, buyerId, 'WITHDRAW', amt, bb, bw.soDuKhaDung, 'Thanh toán giao dịch P2P', off);

&#x20; hist(sellerId, buyerId, 'DEPOSIT',  amt, sb, sw.soDuKhaDung, 'Nhận tiền từ giao dịch P2P', off);

}



function freezeTx(buyerId, amt, off) {

&#x20; const bw = gw(buyerId);

&#x20; const bb = bw.soDuKhaDung;

&#x20; bw.soDuKhaDung -= amt; bw.soDuKyQuy += amt;

&#x20; hist(buyerId, buyerId, 'FREEZE', amt, bb, bw.soDuKhaDung, 'Đóng băng ký quỹ P2P', off);

}



function tx(id, mua, ban, sp, tien, dk, dl, tt, extra = {}) {

&#x20; store.p2pTransactions.push({ id, nguoiMuaId: mua, nguoiBanId: ban, sanPham: sp, soTien: tien, phi: 10000, dieuKhoan: dk, deadline: dl, trangThai: tt, thoiGianTao: nowStr(500 - id \* 20), ...extra });

}



// 3. Giao dịch COMPLETED (T1–T14)

tx(1, 2, 3, 'iPhone 14 Pro 128GB', 15\_000\_000, 'Máy mới 100%, còn seal.', '24 giờ', 'COMPLETED');

completeTx(2, 3, 15\_000\_000, 480);



tx(2, 4, 2, 'MacBook Air M2 256GB', 20\_000\_000, 'Máy 99%, còn BH 8 tháng.', '24 giờ', 'COMPLETED');

completeTx(4, 2, 20\_000\_000, 460);



tx(3, 8, 7, 'Samsung Galaxy S23 Ultra', 8\_000\_000, 'Máy 98%, hộp phụ kiện đủ.', '24 giờ', 'COMPLETED');

completeTx(8, 7, 8\_000\_000, 440);



tx(4, 9, 7, 'AirPods Pro Gen 2', 4\_000\_000, 'Còn seal nguyên hộp.', '24 giờ', 'COMPLETED');

completeTx(9, 7, 4\_000\_000, 420);



tx(5, 11, 10, 'iPad Air 5 64GB WiFi', 7\_000\_000, 'Máy đẹp, không trầy xước.', '24 giờ', 'COMPLETED');

completeTx(11, 10, 7\_000\_000, 400);



tx(6, 12, 10, 'Apple Watch Series 8', 6\_000\_000, 'Dây zin, màn hình đẹp.', '24 giờ', 'COMPLETED');

completeTx(12, 10, 6\_000\_000, 380);



tx(7, 15, 13, 'OPPO Find X6 Pro', 12\_000\_000, 'Máy mới 100%, còn BH.', '24 giờ', 'COMPLETED');

completeTx(15, 13, 12\_000\_000, 360);



tx(8, 13, 16, 'Xiaomi 13 Pro 256GB', 5\_000\_000, 'Máy 99%, đủ hộp phụ kiện.', '48 giờ', 'COMPLETED');

completeTx(13, 16, 5\_000\_000, 340);



tx(9, 17, 18, 'ASUS ROG Phone 7 Ultimate', 15\_000\_000, 'Máy mới, chưa kích hoạt.', '24 giờ', 'COMPLETED');

completeTx(17, 18, 15\_000\_000, 320);



tx(10, 17, 19, 'DJI Mini 4 Pro Combo', 8\_000\_000, 'Còn BH DJI 4 tháng.', '24 giờ', 'COMPLETED');

completeTx(17, 19, 8\_000\_000, 300);



tx(11, 20, 19, 'Sony WH-1000XM5', 5\_000\_000, 'Tai nghe mới 100%, nguyên hộp.', '24 giờ', 'COMPLETED');

completeTx(20, 19, 5\_000\_000, 280);



tx(12, 21, 20, 'PlayStation 5 Disc Edition', 10\_000\_000, 'Máy ít dùng, 2 tay cầm.', '48 giờ', 'COMPLETED');

completeTx(21, 20, 10\_000\_000, 260);



tx(13, 22, 21, 'Nintendo Switch OLED', 6\_000\_000, 'Máy đẹp, tặng 5 game.', '24 giờ', 'COMPLETED');

completeTx(22, 21, 6\_000\_000, 240);



tx(14, 23, 22, 'Xbox Series X 1TB', 8\_000\_000, 'Máy mới mua 3 tháng.', '48 giờ', 'COMPLETED');

completeTx(23, 22, 8\_000\_000, 220);



// Giao dịch đang tiến hành

tx(15, 3, 4, 'Lenovo ThinkPad X1 Carbon Gen 10', 18\_000\_000, 'Laptop i7 Gen12, RAM 16GB, SSD 512GB.', '48 giờ', 'IN\_PROGRESS');

freezeTx(3, 18\_000\_000, 200);



tx(16, 8, 9, 'Beats Studio Buds+', 3\_000\_000, 'Tai nghe mới 100%, còn seal.', '24 giờ', 'CONFIRMED');

freezeTx(8, 3\_000\_000, 180);



// 3 giao dịch tranh chấp (2 chưa giải quyết, 1 đã giải quyết)

tx(17, 11, 12, 'Canon EOS R50 Kit 18-45mm', 9\_000\_000, 'Máy ảnh mirrorless mới 100%.', '48 giờ', 'DISPUTED');

freezeTx(11, 9\_000\_000, 160);



tx(18, 15, 16, 'GoPro Hero 12 Black', 5\_000\_000, 'Action cam mới, còn seal.', '24 giờ', 'DISPUTED');

freezeTx(15, 5\_000\_000, 140);



// Tranh chấp đã giải quyết — người mua thắng, hoàn tiền

tx(19, 18, 23, 'Bàn phím cơ Keychron K2 v2', 3\_000\_000, 'Bàn phím mới, switch red, có đèn.', '24 giờ', 'COMPLETED', {

&#x20; disputeResolved: true,

&#x20; disputeKetQua: 'Tranh chấp đã giải quyết: người mua thắng kiện, tiền đã hoàn trả.',

&#x20; disputeNguoiGiaiQuyet: 'Nguyễn Quang Admin',

});

// Tiền đóng băng rồi hoàn trả → ví không thay đổi



store.\_nextId.transaction = 20;

localStorage.setItem('escrow\_store\_v1', JSON.stringify(store));



console.log('✅ Đã tạo', store.p2pTransactions.length, 'giao dịch P2P');

console.log('  COMPLETED:', store.p2pTransactions.filter(t => t.trangThai==='COMPLETED').length, '(trong đó 1 có tranh chấp đã giải quyết)');

console.log('  IN\_PROGRESS:', store.p2pTransactions.filter(t => t.trangThai==='IN\_PROGRESS').length);

console.log('  CONFIRMED:', store.p2pTransactions.filter(t => t.trangThai==='CONFIRMED').length);

console.log('  DISPUTED:', store.p2pTransactions.filter(t => t.trangThai==='DISPUTED').length);





// Bước 6: Tạo reports (tố cáo)

const raw = localStorage.getItem('escrow\_store\_v1');

const store = JSON.parse(raw);



store.reports.push(

&#x20; {

&#x20;   id: 1,

&#x20;   userId: 11,

&#x20;   tenNguoiBiToCao: "Trần Quốc Hưng",

&#x20;   soDienThoai: "0905135011",

&#x20;   lyDo: "Người bán giao hàng không đúng mô tả. Máy ảnh có vết trầy xước nhiều, không phải mới 100% như quảng cáo.",

&#x20;   hinhThuc: "Giao dịch P2P",

&#x20;   maGiaoDich: "GD000017",

&#x20;   trangThai: "PENDING",

&#x20;   thoiGianTao: "05/06/2026, 13:10",

&#x20; },

&#x20; {

&#x20;   id: 2,

&#x20;   userId: 15,

&#x20;   tenNguoiBiToCao: "Võ Quốc Nam",

&#x20;   soDienThoai: "0905135015",

&#x20;   lyDo: "Người bán không giao hàng sau 2 ngày xác nhận giao dịch. Không phản hồi tin nhắn.",

&#x20;   hinhThuc: "Giao dịch P2P",

&#x20;   maGiaoDich: "GD000018",

&#x20;   trangThai: "PENDING",

&#x20;   thoiGianTao: "05/06/2026, 13:45",

&#x20; },

&#x20; {

&#x20;   id: 3,

&#x20;   userId: 18,

&#x20;   tenNguoiBiToCao: "Phạm Minh Tâm",

&#x20;   soDienThoai: "0905135022",

&#x20;   lyDo: "Người bán giao bàn phím sai màu, không đúng với thỏa thuận ban đầu trong giao dịch.",

&#x20;   hinhThuc: "Giao dịch P2P",

&#x20;   maGiaoDich: "GD000019",

&#x20;   trangThai: "RESOLVED",

&#x20;   thoiGianTao: "05/06/2026, 14:35",

&#x20;   ketQua: "Đã xác minh khiếu nại hợp lệ. Người mua đúng, tiền ký quỹ đã được hoàn trả đầy đủ.",

&#x20;   nguoiGiaiQuyet: "Nguyễn Quang Admin",

&#x20;   thoiGianGiaiQuyet: "05/06/2026, 16:00",

&#x20; }

);



store.\_nextId.report = 4;

localStorage.setItem('escrow\_store\_v1', JSON.stringify(store));



console.log('✅ Đã tạo', store.reports.length, 'báo cáo tố cáo');

store.reports.forEach(r => {

&#x20; console.log(`  #${r.id} | Tố cáo: ${r.tenNguoiBiToCao} | Trạng thái: ${r.trangThai}`);

});



