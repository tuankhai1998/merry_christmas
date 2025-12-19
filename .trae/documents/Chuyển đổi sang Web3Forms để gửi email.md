Việc chuyển sang Web3Forms sẽ giúp đơn giản hóa việc gửi email hơn vì không cần cài đặt SDK nặng nề. Dưới đây là kế hoạch thay thế:

## 1. Chuẩn bị (Bạn cần làm)
- Bạn cần truy cập [Web3Forms](https://web3forms.com/) để lấy **Access Key**. (Nhập email của bạn vào là họ gửi key về mail ngay, miễn phí và không cần đăng ký tài khoản phức tạp).

## 2. Cập nhật `index.html`
- Xóa thư viện EmailJS SDK đã thêm trước đó để trang web nhẹ hơn.

## 3. Cập nhật `script.js`
- Thay thế hoàn toàn hàm `sendEmail` cũ (dùng EmailJS) bằng hàm mới dùng `fetch` để gọi API của Web3Forms.
- Cấu trúc gửi dữ liệu của Web3Forms đơn giản là gửi một JSON object chứa:
  - `access_key`: Key của bạn.
  - `subject`: Tiêu đề email (Ví dụ: "Có người ấy đồng ý rồi!").
  - `message`: Nội dung chi tiết (Số lần hover, thời gian...).
- Giữ nguyên logic kiểm tra `hoverNoCount` để tránh spam.

Tôi sẽ thực hiện thay đổi code ngay bây giờ. Bạn hãy chuẩn bị sẵn Access Key nhé!