# AppGen Backend - Hono + Cloudflare Workers

Backend moi da thay the toan bo Spring Boot backend cu.

## Run local

```bash
cd backend
npm install
npm run dev
```

Mac dinh `wrangler dev` chay o `http://localhost:8787`.

## Demo account

- `email`: `testuser@gmail.com`
- `password`: `123456`
- `userId`: `u-demo-001`

## API map theo frontend

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/logout`

### Dashboard
- `GET /api/dashboard?userId=...&q=...`

### Flashcards
- `GET /api/flashcards/decks?userId=...`
- `POST /api/flashcards/decks?userId=...`
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

## Luu y

- Du lieu dang in-memory (seed tu `src/index.ts`), restart worker se reset data.
- CORS da mo cho frontend goi API truc tiep.
# AppGen Backend (Spring Boot)

Backend don gian cho frontend hien tai (auth, dashboard, flashcards, shadowing, bilingual books, settings, premium).

## Chay backend

```bash
cd backend
mvn spring-boot:run
```

Mac dinh server chay tai `http://localhost:8080`.

## Tai khoan demo

- Email: `testuser@gmail.com`
- Password: `123456`
- UserId: `u-demo-001`

## API chinh

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/logout`

### Dashboard
- `GET /api/dashboard?userId=...&q=...`

### Flashcards
- `GET /api/flashcards/decks?userId=...`
- `POST /api/flashcards/decks?userId=...`
- `PUT /api/flashcards/decks/{deckId}?userId=...`
- `DELETE /api/flashcards/decks/{deckId}?userId=...`
- `POST /api/flashcards/decks/{deckId}/cards?userId=...`
- `PUT /api/flashcards/decks/{deckId}/cards/{cardId}?userId=...`
- `DELETE /api/flashcards/decks/{deckId}/cards/{cardId}?userId=...`
- `POST /api/flashcards/decks/{deckId}/share?userId=...`
- `POST /api/flashcards/quiz/submit`

### Shadowing
- `GET /api/shadowing/topics`
- `GET /api/shadowing/topics/{topicId}/session`
- `POST /api/shadowing/topics/{topicId}/score`

### Books
- `GET /api/books`
- `GET /api/books/{bookId}`

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

## Ghi chu
- Backend dung in-memory data, restart server se reset du lieu.
- CORS mo cho `/api/**` de frontend mobile/web test nhanh.
