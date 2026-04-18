# AppGen Backend — Hono + Cloudflare Workers

API cho app Expo: auth, dashboard, flashcards, shadowing, sách song ngữ, cài đặt, premium. Dữ liệu **in-memory** (seed trong `src/index.ts`); restart dev là mất thay đổi (trừ khi deploy có persistence riêng).

## Chạy local

```bash
cd backend
npm install
npm run dev
```

Mặc định: **`http://0.0.0.0:8789`** (Wrangler `--ip 0.0.0.0 --port 8789`) để thiết bị trong LAN gọi được.

## Deploy

```bash
npm run deploy
```

Cần [Wrangler](https://developers.cloudflare.com/workers/wrangler/) đã login và `wrangler.toml` hợp lệ.

## Tài khoản demo

| Trường   | Giá trị              |
|----------|----------------------|
| Email    | `testuser@gmail.com` |
| Password | `123456`             |
| userId   | `u-demo-001`         |

## API (rút gọn)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/logout`

### Dashboard
- `GET /api/dashboard?userId=...&q=...`

### Flashcards
- `GET /api/flashcards/decks?userId=...` — danh sách bộ, sắp xếp bộ mới trước
- `POST /api/flashcards/decks?userId=...` — tạo bộ
- `PUT /api/flashcards/decks/:deckId?userId=...`
- `DELETE /api/flashcards/decks/:deckId?userId=...`
- `POST /api/flashcards/decks/:deckId/cards?userId=...`
- `PUT /api/flashcards/decks/:deckId/cards/:cardId?userId=...`
- `DELETE /api/flashcards/decks/:deckId/cards/:cardId?userId=...`
- `POST /api/flashcards/decks/:deckId/share?userId=...`
- `POST /api/flashcards/quiz/submit`

### Shadowing
- `GET /api/shadowing/topics`
- `GET /api/shadowing/topics/:topicId/session`
- `POST /api/shadowing/topics/:topicId/score`

### Books
- `GET /api/books`
- `GET /api/books/:bookId`

### Settings
- `GET /api/settings/profile?userId=...`
- `PUT /api/settings/account?userId=...`
- `PUT /api/settings/profile?userId=...`
- `PUT /api/settings/preferences?userId=...`
- `POST /api/settings/password?userId=...`
- `POST /api/settings/social-link?userId=...`

### Premium
- `GET /api/premium/plans`
- `POST /api/premium/subscribe?userId=...`

Hướng dẫn chạy full stack (Expo + env + firewall) nằm ở [`../README.md`](../README.md).
