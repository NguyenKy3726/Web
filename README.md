# Web
## Quy tắc Git — ĐỌC KỸ TRƯỚC KHI LÀM
Bước 1: Pull code mới nhất về trước khi làm:
    Mở VS Code
    Bấm nút ↓ ở thanh dưới cùng VS Code
    Hoặc mở Terminal gõ: git pull
Bước 2: Bắt đầu code
Bước 3: Push code lên sau khi xong:
    Bấm icon nhánh cây bên trái VS Code
    Gõ mô tả vào ô Message (ghi rõ bạn làm gì ví dụ: Thêm cái gì, sửa cái gì, cập nhập cái gì, xóa cái gì phải ghi rõ ra)
    Bấm Commit & Push

## Cấu trúc thư mục
- pages/ — chứa các trang HTML
- css/global.css — CSS toàn cục
- css/local/ — CSS cục bộ từng trang
- js/global.js — JS toàn cục
- js/local/ — JS cục bộ từng trang

## Quy tắc đặt tên CSS (BEM)
- Block: viết thường (navbar, card)
- Element: 2 gạch dưới (navbar__logo)
- Modifier: 2 gạch ngang (button--primary)
- Luôn dùng tiếng Anh

## Quy tắc Git
- Commit message rõ ràng bằng tiếng Việt
- Pull trước khi Push
- Mỗi người làm trên branch riêng