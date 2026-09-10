# Thiệp tốt nghiệp Khánh Linh — phiên bản Google Sheets

Phiên bản này bỏ hoàn toàn ảnh cá nhân và bỏ Node.js/Supabase. RSVP và lời chúc được lưu trực tiếp vào Google Sheets thông qua Google Apps Script.

## Cấu trúc
- `public/index.html`: giao diện thiệp
- `public/style.css`: giao diện boarding pass
- `public/script.js`: countdown + gửi/đọc dữ liệu Google Sheets
- `google-apps-script-Code.gs`: mã backend chạy trên Google Apps Script

## 1. Tạo Google Sheet
Tạo một Google Sheet mới, ví dụ: `Thiệp tốt nghiệp Khánh Linh`.

Mở **Extensions → Apps Script**.

Xóa code mẫu và dán toàn bộ nội dung file `google-apps-script-Code.gs` vào `Code.gs`.

Nếu mở Apps Script trực tiếp từ Google Sheet thì giữ:
```js
const SPREADSHEET_ID = '';
```

Sau đó chọn hàm `setupSheets` → **Run** một lần → cấp quyền.
Google Sheet sẽ có 2 tab:
- `RSVP`: danh sách người xác nhận
- `Lời chúc`: sổ lưu bút

## 2. Deploy Apps Script
Trong Apps Script:
- **Deploy → New deployment**
- Chọn loại **Web app**
- **Execute as:** Me
- **Who has access:** Anyone
- Deploy
- Copy **Web app URL** có dạng `https://script.google.com/macros/s/.../exec`

Không gửi URL này cho người khác nếu bạn không muốn họ biết endpoint; đây là endpoint nhận dữ liệu của thiệp.

## 3. Gắn URL vào website
Mở `public/script.js` và thay:
```js
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

bằng Web app URL của bạn.

## 4. Đưa website lên mạng
Vì website không còn Node.js, có thể dùng GitHub Pages để host miễn phí.

- Tạo GitHub repository mới.
- Upload thư mục `public` (hoặc nội dung bên trong `public`) lên repository.
- Vào **Settings → Pages**.
- Chọn **Deploy from a branch**, branch `main`, folder `/ (root)` nếu `index.html` nằm ở root.
- GitHub sẽ cấp link website.

## Lưu ý
- Không cần Supabase.
- Không cần Render.
- Không cần cài Node.js để chạy website online.
- Google Sheet của bạn là nơi xem RSVP và lời chúc.
- Nếu sửa code Apps Script, có thể cần tạo version/deployment mới tùy thay đổi.
- URL Web App chỉ cần đặt trong `script.js`; không đặt mật khẩu Google vào website.
