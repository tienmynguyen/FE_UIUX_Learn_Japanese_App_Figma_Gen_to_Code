# AppGen — Ứng dụng học tiếng Nhật (Expo + Cloudflare Workers)

Ứng dụng React Native (Expo Router) kết nối API **Hono** chạy trên **Cloudflare Workers** (dev bằng Wrangler). Dữ liệu demo lưu **trong bộ nhớ** — khởi động lại worker sẽ reset.

## Yêu cầu

- **Node.js** LTS (khuyến nghị 20+)
- **npm**
- Tài khoản Cloudflare (chỉ khi `wrangler deploy` production)
- **Điện thoại + máy tính cùng Wi‑Fi** nếu chạy API trên máy và mở app bằng Expo Go

## Cài đặt nhanh

### 1. Frontend (Expo)

```bash
npm install
```

### 2. Backend (Workers local)

```bash
cd backend
npm install
```

## Cấu hình môi trường (`.env` ở thư mục gốc project)

Tạo file `.env` cạnh `package.json` (file này **không** commit lên Git):

```env
# Trùng với cổng trong `backend/package.json` → `wrangler dev --port 8789`
EXPO_PUBLIC_API_PORT=8789
```

Tùy chọn khi debug URL cố định:

```env
EXPO_PUBLIC_API_FORCE_ENV=1
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.x:8789
```

**Lưu ý URL:** luôn có dấu hai chấm `:` trước cổng — đúng: `http://192.168.1.10:8789`, sai: `http://192.168.1.10.8789`.

## Chạy dự án

### Bước A — Bật API (terminal 1)

```bash
cd backend
npm run dev
```

Mặc định lắng nghe **`0.0.0.0:8789`** để điện thoại trong LAN gọi được.

### Bước B — Bật app (terminal 2)

Ở thư mục gốc:

```bash
npm run start
```

Sau đó quét QR bằng **Expo Go** (Android/iOS) hoặc bấm `a` / `i` cho emulator.

### Windows: máy khác / điện thoại không vào được cổng 8789

Chạy PowerShell **với quyền Administrator** (vào đúng thư mục repo hoặc dùng đường dẫn đầy đủ tới script):

```powershell
cd E:\VKU\Figma\AppGen
.\scripts\open-firewall-8789.ps1
```

## Tài khoản demo

| Trường   | Giá trị              |
|----------|----------------------|
| Email    | `testuser@gmail.com` |
| Mật khẩu | `123456`             |

Đăng nhập xong vào **Dashboard**, **Flashcards**, **Cài đặt**, v.v.

## Hướng dẫn sử dụng app

### Đăng nhập / đăng ký

- Màn **Welcome**: chọn **Sign In** hoặc **Sign Up**, nhập email/mật khẩu (đăng ký có thêm tên).
- Sau khi thành công sẽ vào **Dashboard**.

### Dashboard

- Ô **tìm kiếm** từ tiếng Nhật (gợi ý từ API).
- **Tính năng nhanh**: Shadowing, Sách song ngữ.
- **Bộ flashcard của tôi**: chạm vào bộ để vào **luyện tập** đúng bộ đó; **Tạo mới** mở màn Flashcards với form tạo bộ.

### Flashcards

- **+ Bộ mới**: tạo bộ (tiêu đề bắt buộc, mô tả / cấp độ tùy chọn).
- Mỗi bộ: **Sửa** / **Xóa**, **Luyện thi** → màn luyện tập của bộ đó.

### Luyện tập thẻ

- Xem danh sách thẻ; **+** để **thêm thẻ** (từ vựng, phiên âm, nghĩa).
- Chạm thẻ để **sửa**.
- **Play (quiz)**: làm trắc nghiệm theo **từ trong bộ** — số câu bằng số thẻ, **tối đa 15 câu**; cần **ít nhất 1 thẻ** (khuyến nghị ≥ 2 thẻ để đủ phương án nhiễu).
- **Chia sẻ**: bật/tắt link chia sẻ (demo).

### Cài đặt

- Tab **Tài khoản**, **Hồ sơ**, **Mật khẩu**, **Liên kết** — lưu qua API (dữ liệu in-memory).

### Các màn khác

- **Shadowing**, **Sách song ngữ**, **Premium**: luồng demo gắn API tương ứng trong `backend/src/index.ts`.

## Cấu trúc thư mục (rút gọn)

| Thư mục / file        | Vai trò                                      |
|-----------------------|----------------------------------------------|
| `app/`                | Màn hình Expo Router                         |
| `services/api.ts`     | Client gọi API, `getApiBaseUrl()`            |
| `hooks/useSession.tsx`| Phiên đăng nhập                              |
| `backend/src/`        | Hono + route `/api/*`                        |
| `scripts/`            | Tiện ích (ví dụ mở firewall Windows)       |

## API & backend chi tiết

Xem thêm [`backend/README.md`](backend/README.md) (danh sách endpoint).

Deploy production:

```bash
cd backend
npm run deploy
```

Cần đăng nhập Wrangler (`npx wrangler login`) và cấu hình `wrangler.toml` phù hợp.

## Gỡ lỗi thường gặp

| Hiện tượng | Gợi ý |
|------------|--------|
| App báo không kết nối được API | Đang chạy `npm run dev` trong `backend/`; đúng cổng `8789`; cùng Wi‑Fi với máy chạy Metro. |
| Timeout trên điện thoại | Dùng `EXPO_PUBLIC_API_BASE_URL=http://IP_MÁY_TÍNH:8789` hoặc kiểm tra firewall Windows. |
| Sai URL có dạng `192.168.x.x.8789` | Phải là `192.168.x.x:8789` (có dấu `:`). |

## Tài liệu Expo

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## License

Private project.
