import { Hono } from "hono";
import { cors } from "hono/cors";

type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  website: string;
  bio: string;
  language: string;
  timezone: string;
  planId: string;
  linkedFacebook: boolean;
  linkedGoogle: boolean;
};

type Card = {
  id: string;
  vocabulary: string;
  phonetic: string;
  meaning: string;
  imageUrl: string | null;
};

type Deck = {
  id: string;
  title: string;
  description: string;
  level: string;
  createdDate: string;
  shareEnabled: boolean;
  shareLink: string | null;
  cards: Card[];
};

type Notice = {
  id: string;
  title: string;
  time: string;
  unread: boolean;
};

type ChatUser = {
  name: string;
  email: string;
};

type VocabularyEntry = {
  kanji: string;
  hira: string;
  meaning: string;
};

type ShadowingTopic = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessonCount: number;
};

type Book = {
  id: string;
  title: string;
  author: string;
  level: string;
  chapters: number;
  coverUrl: string;
  content: string;
};

type PremiumPlan = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  cycle: string;
  features: string[];
};

const app = new Hono();
app.use("/api/*", cors());

const state = createSeedState();

app.get("/", (c) => c.json({ name: "appgen-backend-worker", status: "ok" }));
app.get("/api/health", (c) => c.json({ status: "ok" }));

app.post("/api/auth/signup", async (c) => {
  const body = await c.req.json().catch(() => null) as { username?: string; email?: string; password?: string } | null;
  if (!body?.username || !body?.email || !body?.password) {
    return c.json({ message: "username, email, password are required" }, 400);
  }
  const email = normalizeEmail(body.email);
  if (state.userIdByEmail.has(email)) {
    return c.json({ message: "Email already exists" }, 400);
  }
  if (body.password.length < 6) {
    return c.json({ message: "Password must have at least 6 chars" }, 400);
  }
  const user: User = {
    id: genId("u"),
    username: body.username,
    email,
    password: body.password,
    website: "",
    bio: "",
    language: "Tieng Viet",
    timezone: "UTC+7 (Viet Nam)",
    planId: "free",
    linkedFacebook: false,
    linkedGoogle: false
  };
  state.usersById.set(user.id, user);
  state.userIdByEmail.set(email, user.id);
  state.decksByUser.set(user.id, buildDefaultDecks());
  return c.json(authPayload(user), 201);
});

app.post("/api/auth/signin", async (c) => {
  const body = await c.req.json().catch(() => null) as { email?: string; password?: string } | null;
  if (!body?.email || !body?.password) {
    return c.json({ message: "email and password are required" }, 400);
  }
  const userId = state.userIdByEmail.get(normalizeEmail(body.email));
  if (!userId) {
    return c.json({ message: "Invalid credentials" }, 400);
  }
  const user = state.usersById.get(userId)!;
  if (user.password !== body.password) {
    return c.json({ message: "Invalid credentials" }, 400);
  }
  return c.json(authPayload(user));
});

app.post("/api/auth/logout", (c) => c.json({ message: "Logout success" }));

app.get("/api/dashboard", (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const q = (c.req.query("q") ?? "").trim().toLowerCase();
  const searchResults = q
    ? state.vocabulary.filter((item) => `${item.kanji} ${item.hira} ${item.meaning}`.toLowerCase().includes(q))
    : state.vocabulary;
  const deckList = state.decksByUser.get(user.id) ?? [];
  return c.json({
    userId: user.id,
    username: user.username,
    email: user.email,
    planId: user.planId,
    notifications: state.notices,
    chatUsers: state.chatUsers,
    searchResults,
    myDecks: [...deckList].sort((a, b) => b.createdDate.localeCompare(a.createdDate))
  });
});

app.get("/api/flashcards/decks", (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const list = state.decksByUser.get(user.id) ?? [];
  return c.json([...list].sort((a, b) => b.createdDate.localeCompare(a.createdDate)));
});

app.post("/api/flashcards/decks", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as { title?: string; description?: string; level?: string } | null;
  if (!body?.title) return c.json({ message: "title is required" }, 400);
  const deck: Deck = {
    id: genId("d"),
    title: body.title,
    description: body.description ?? "",
    level: body.level ?? "N5",
    createdDate: today(),
    shareEnabled: false,
    shareLink: null,
    cards: []
  };
  const decks = state.decksByUser.get(user.id) ?? [];
  decks.push(deck);
  state.decksByUser.set(user.id, decks);
  return c.json(deck, 201);
});

app.put("/api/flashcards/decks/:deckId", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const deck = requireDeck(user.id, c.req.param("deckId"));
  const body = await c.req.json().catch(() => null) as { title?: string; description?: string } | null;
  if (body?.title !== undefined) deck.title = body.title;
  if (body?.description !== undefined) deck.description = body.description;
  return c.json(deck);
});

app.delete("/api/flashcards/decks/:deckId", (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const deckId = c.req.param("deckId");
  const decks = state.decksByUser.get(user.id) ?? [];
  const next = decks.filter((d) => d.id !== deckId);
  if (next.length === decks.length) return c.json({ message: "Deck not found" }, 404);
  state.decksByUser.set(user.id, next);
  return c.json({ message: "Deck deleted" });
});

app.post("/api/flashcards/decks/:deckId/cards", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const deck = requireDeck(user.id, c.req.param("deckId"));
  const body = await c.req.json().catch(() => null) as {
    vocabulary?: string;
    phonetic?: string;
    meaning?: string;
    imageUrl?: string | null;
  } | null;
  if (!body?.vocabulary || !body?.meaning) {
    return c.json({ message: "vocabulary and meaning are required" }, 400);
  }
  const card: Card = {
    id: genId("c"),
    vocabulary: body.vocabulary,
    phonetic: body.phonetic ?? "",
    meaning: body.meaning,
    imageUrl: body.imageUrl ?? null
  };
  deck.cards.push(card);
  return c.json(card, 201);
});

app.put("/api/flashcards/decks/:deckId/cards/:cardId", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const deck = requireDeck(user.id, c.req.param("deckId"));
  const card = deck.cards.find((item) => item.id === c.req.param("cardId"));
  if (!card) return c.json({ message: "Card not found" }, 404);
  const body = await c.req.json().catch(() => null) as {
    vocabulary?: string;
    phonetic?: string;
    meaning?: string;
    imageUrl?: string | null;
  } | null;
  if (body?.vocabulary !== undefined) card.vocabulary = body.vocabulary;
  if (body?.phonetic !== undefined) card.phonetic = body.phonetic;
  if (body?.meaning !== undefined) card.meaning = body.meaning;
  if (body?.imageUrl !== undefined) card.imageUrl = body.imageUrl;
  return c.json(card);
});

app.delete("/api/flashcards/decks/:deckId/cards/:cardId", (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const deck = requireDeck(user.id, c.req.param("deckId"));
  const next = deck.cards.filter((item) => item.id !== c.req.param("cardId"));
  if (next.length === deck.cards.length) return c.json({ message: "Card not found" }, 404);
  deck.cards = next;
  return c.json({ message: "Card deleted" });
});

app.post("/api/flashcards/decks/:deckId/share", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const deck = requireDeck(user.id, c.req.param("deckId"));
  const body = await c.req.json().catch(() => null) as { enabled?: boolean } | null;
  if (typeof body?.enabled !== "boolean") return c.json({ message: "enabled is required" }, 400);
  deck.shareEnabled = body.enabled;
  deck.shareLink = body.enabled ? `https://app.local/share/${deck.id}` : null;
  return c.json({ deckId: deck.id, shareEnabled: deck.shareEnabled, shareLink: deck.shareLink });
});

app.post("/api/flashcards/quiz/submit", async (c) => {
  const body = await c.req.json().catch(() => null) as { selectedIndex?: number } | null;
  const selectedIndex = body?.selectedIndex ?? -1;
  const success = selectedIndex === 0;
  return c.json({
    result: success ? "success" : "fail",
    percent: success ? 100 : 60,
    scoreLabel: success ? "5/5" : "3/5"
  });
});

app.get("/api/shadowing/topics", (c) => c.json(state.shadowingTopics));

app.get("/api/shadowing/topics/:topicId/session", (c) => {
  const topic = state.shadowingTopics.find((item) => item.id === c.req.param("topicId"));
  if (!topic) return c.json({ message: "Topic not found" }, 404);
  return c.json({
    topic,
    items: [
      { id: "s1", japanese: "お疲れ様です", vietnamese: "Chao ban, cam on da no luc.", charCount: 7 },
      { id: "s2", japanese: "よろしくお願いします", vietnamese: "Rat mong duoc giup do.", charCount: 10 }
    ]
  });
});

app.post("/api/shadowing/topics/:topicId/score", async (c) => {
  const body = await c.req.json().catch(() => null) as { score?: number; round?: number } | null;
  const score = body?.score ?? 0;
  const round = body?.round ?? 1;
  return c.json({
    topicId: c.req.param("topicId"),
    round,
    score,
    note: score >= 70 ? "Good" : "Need more practice"
  });
});

app.get("/api/books", (c) => c.json(state.books));

app.get("/api/books/:bookId", (c) => {
  const book = state.books.find((item) => item.id === c.req.param("bookId"));
  if (!book) return c.json({ message: "Book not found" }, 404);
  return c.json(book);
});

app.get("/api/settings/profile", (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  return c.json(user);
});

app.put("/api/settings/account", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as { username?: string; email?: string } | null;
  if (!body?.username || !body?.email) return c.json({ message: "username and email are required" }, 400);
  const normalized = normalizeEmail(body.email);
  const existingUserId = state.userIdByEmail.get(normalized);
  if (existingUserId && existingUserId !== user.id) {
    return c.json({ message: "Email already exists" }, 400);
  }
  state.userIdByEmail.delete(user.email);
  user.username = body.username;
  user.email = normalized;
  state.userIdByEmail.set(user.email, user.id);
  return c.json(user);
});

app.put("/api/settings/profile", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as { website?: string; bio?: string } | null;
  user.website = body?.website ?? "";
  user.bio = body?.bio ?? "";
  return c.json(user);
});

app.put("/api/settings/preferences", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as { language?: string; timezone?: string } | null;
  if (body?.language) user.language = body.language;
  if (body?.timezone) user.timezone = body.timezone;
  return c.json(user);
});

app.post("/api/settings/password", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  } | null;
  if (!body?.currentPassword || !body?.newPassword || !body?.confirmPassword) {
    return c.json({ message: "currentPassword, newPassword, confirmPassword are required" }, 400);
  }
  if (body.currentPassword !== user.password) {
    return c.json({ message: "Current password is incorrect" }, 400);
  }
  if (body.newPassword.length < 6) {
    return c.json({ message: "New password must have at least 6 chars" }, 400);
  }
  if (body.newPassword !== body.confirmPassword) {
    return c.json({ message: "Confirm password mismatch" }, 400);
  }
  user.password = body.newPassword;
  return c.json({ message: "Password changed" });
});

app.post("/api/settings/social-link", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as { provider?: string; linked?: boolean } | null;
  if (!body?.provider || typeof body.linked !== "boolean") {
    return c.json({ message: "provider and linked are required" }, 400);
  }
  if (body.provider.toLowerCase() === "facebook") user.linkedFacebook = body.linked;
  else if (body.provider.toLowerCase() === "google") user.linkedGoogle = body.linked;
  else return c.json({ message: "Invalid provider" }, 400);
  return c.json(user);
});

app.get("/api/premium/plans", (c) => c.json(state.premiumPlans));

app.post("/api/premium/subscribe", async (c) => {
  const user = requireUserFromQuery(c.req.query("userId"));
  const body = await c.req.json().catch(() => null) as { planId?: string; paymentMethod?: string } | null;
  if (!body?.planId || !body?.paymentMethod) {
    return c.json({ message: "planId and paymentMethod are required" }, 400);
  }
  const plan = state.premiumPlans.find((item) => item.id === body.planId);
  if (!plan) return c.json({ message: "Plan not found" }, 404);
  user.planId = plan.id;
  return c.json({
    planId: plan.id,
    planName: plan.name,
    paymentMethod: body.paymentMethod,
    status: "active"
  });
});

app.notFound((c) => c.json({ message: "Not found" }, 404));

export default app;

function requireUserFromQuery(userId: string | undefined): User {
  if (!userId) {
    throw new HttpError(400, "userId query is required");
  }
  const user = state.usersById.get(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return user;
}

function requireDeck(userId: string, deckId: string): Deck {
  const decks = state.decksByUser.get(userId) ?? [];
  const deck = decks.find((item) => item.id === deckId);
  if (!deck) {
    throw new HttpError(404, "Deck not found");
  }
  return deck;
}

function authPayload(user: User) {
  return {
    userId: user.id,
    username: user.username,
    email: user.email,
    token: `demo-token-${user.id.slice(0, 8)}`,
    planId: user.planId
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function genId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildDefaultDecks(): Deck[] {
  return [
    {
      id: "d-2903",
      title: "29/03",
      description: "Khong co mo ta",
      level: "N5",
      createdDate: "2026-03-29",
      shareEnabled: false,
      shareLink: null,
      cards: [
        { id: "c1", vocabulary: "手法", phonetic: "しゅほう", meaning: "Phuong phap", imageUrl: null },
        { id: "c2", vocabulary: "階層的な", phonetic: "かいそうてきな", meaning: "Phan cap", imageUrl: null },
        { id: "c3", vocabulary: "オブジェクト指向", phonetic: "", meaning: "Lap trinh huong doi tuong", imageUrl: null }
      ]
    }
  ];
}

function createSeedState() {
  const usersById = new Map<string, User>();
  const userIdByEmail = new Map<string, string>();
  const decksByUser = new Map<string, Deck[]>();

  const demoUser: User = {
    id: "u-demo-001",
    username: "test user",
    email: "testuser@gmail.com",
    password: "123456",
    website: "https://yourwebsite.com",
    bio: "",
    language: "Tieng Viet",
    timezone: "UTC+7 (Viet Nam)",
    planId: "free",
    linkedFacebook: false,
    linkedGoogle: false
  };
  usersById.set(demoUser.id, demoUser);
  userIdByEmail.set(demoUser.email, demoUser.id);
  decksByUser.set(demoUser.id, buildDefaultDecks());

  const notices: Notice[] = [
    { id: "n1", title: "Dang nhap moi tu may tinh Windows Postman", time: "10 phut truoc", unread: true },
    { id: "n2", title: "Ban vua dat streak 7 ngay hoc lien tiep", time: "30 phut truoc", unread: true },
    { id: "n3", title: "Co 2 bo flashcard moi phu hop voi ban", time: "1 gio truoc", unread: false }
  ];

  const chatUsers: ChatUser[] = [
    { name: "Bich Ngoc", email: "ngocngocngocngoc@gmail.com" },
    { name: "Minh Huyen", email: "huyen@gmail.com" },
    { name: "Nguyen Ton Minh Huyen", email: "huyenmt.2it@vku.udn.vn" },
    { name: "Pham Hoang Bao", email: "27baokpham27@gmail.com" }
  ];

  const vocabulary: VocabularyEntry[] = [
    { kanji: "開発", hira: "【かいはつ】", meaning: "development, cultivation, application" },
    { kanji: "開発途上国", hira: "【かいはつとじょうこく】", meaning: "developing country" },
    { kanji: "開発者", hira: "【かいはつしゃ】", meaning: "developer" },
    { kanji: "開発元", hira: "【かいはつもと】", meaning: "developer (software)" },
    { kanji: "開発部", hira: "【かいはつぶ】", meaning: "development department" }
  ];

  const shadowingTopics: ShadowingTopic[] = [
    { id: "t-work", title: "Cong viec", description: "Cac cau giao tiep co ban trong cong so", level: "N5", lessonCount: 10 },
    { id: "t-travel", title: "Du lich", description: "Cac cau giao tiep khi du lich tai Nhat", level: "N4", lessonCount: 12 }
  ];

  const books: Book[] = [
    {
      id: "book-yumi",
      title: "Mot ngay cua Yumi",
      author: "B.B",
      level: "N5",
      chapters: 3,
      coverUrl: "https://www.figma.com/api/mcp/asset/f45447a4-5216-4be6-96d0-0be7ded04fc6",
      content: "Noi dung sach song ngu mau..."
    }
  ];

  const premiumPlans: PremiumPlan[] = [
    { id: "free", name: "Goi Mien phi", subtitle: "Nen tang co ban", price: "$0", cycle: "vinh vien", features: ["Nen tang N5", "Flashcard co ban"] },
    { id: "pro", name: "Goi Pro", subtitle: "Nang trinh len N3", price: "$9.99", cycle: "/thang", features: ["+30 chu de Shadowing", "Luyen thi JLPT N3"] },
    { id: "premium", name: "Goi Premium", subtitle: "Nang trinh len N2", price: "$99.99", cycle: "/thang", features: ["+50 chu de Shadowing", "Luyen thi JLPT N2"] },
    { id: "master", name: "Goi Master", subtitle: "Chinh phuc N1", price: "$219.99", cycle: "/thang", features: ["+100 chu de Shadowing", "Luyen thi JLPT N1"] }
  ];

  return {
    usersById,
    userIdByEmail,
    decksByUser,
    notices,
    chatUsers,
    vocabulary,
    shadowingTopics,
    books,
    premiumPlans
  };
}

type AppStatus = 400 | 404;

class HttpError extends Error {
  status: AppStatus;

  constructor(status: AppStatus, message: string) {
    super(message);
    this.status = status;
  }
}

app.onError((err, c) => {
  if (err instanceof HttpError) {
    return c.json({ message: err.message }, { status: err.status });
  }
  return c.json({ message: "Internal server error" }, 500);
});
