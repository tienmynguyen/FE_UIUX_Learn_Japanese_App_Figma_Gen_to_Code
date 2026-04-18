import Constants from "expo-constants";
import { Platform } from "react-native";

export type AuthResponse = {
  userId: string;
  username: string;
  email: string;
  token: string;
  planId: string;
};

export type Deck = {
  id: string;
  title: string;
  description: string;
  level: string;
  createdDate: string;
  shareEnabled: boolean;
  shareLink: string | null;
  cards: Card[];
};

export type Card = {
  id: string;
  vocabulary: string;
  phonetic: string;
  meaning: string;
  imageUrl: string | null;
};

export type DashboardResponse = {
  userId: string;
  username: string;
  email: string;
  planId: string;
  notifications: { id: string; title: string; time: string; unread: boolean }[];
  chatUsers: { name: string; email: string }[];
  searchResults: { kanji: string; hira: string; meaning: string }[];
  myDecks: Deck[];
};

export type UserProfile = {
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

export type Book = {
  id: string;
  title: string;
  author: string;
  level: string;
  chapters: number;
  coverUrl: string;
  content: string;
};

export type ShadowingTopic = {
  id: string;
  title: string;
  description: string;
  level: string;
  lessonCount: number;
};

export type PremiumPlan = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  cycle: string;
  features: string[];
};

const API_PORT = (() => {
  const raw = process.env.EXPO_PUBLIC_API_PORT ?? "8789";
  const digits = String(raw).replace(/\D/g, "");
  return digits || "8789";
})();

/** Sửa lỗi copy-paste: `http://1.2.3.4.8789` → `http://1.2.3.4:8789` (phải có `:` trước cổng). */
function normalizeMisplacedIpv4Port(url: string): string {
  return url.replace(
    /^(https?:\/\/)(\d{1,3}(?:\.\d{1,3}){3})\.(\d{2,5})(?=\/?|$)/i,
    "$1$2:$3"
  );
}

/**
 * Base URL gọi Workers. Trên Expo Go / native dev: ưu tiên IP của máy chạy Metro
 * (cùng Wi‑Fi với điện thoại) để tránh lỗi `localhost` trỏ vào chính điện thoại.
 * Web: dùng localhost hoặc EXPO_PUBLIC_API_BASE_URL.
 * Bật EXPO_PUBLIC_API_FORCE_ENV=1 để luôn dùng EXPO_PUBLIC_API_BASE_URL (debug).
 */
export function getApiBaseUrl(): string {
  const forceEnv = process.env.EXPO_PUBLIC_API_FORCE_ENV === "1" || process.env.EXPO_PUBLIC_API_FORCE_ENV === "true";
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "");

  let url: string;

  if (forceEnv && envUrl) {
    url = envUrl;
  } else if (Platform.OS === "web") {
    url = envUrl || "http://localhost:" + API_PORT;
  } else {
    const debuggerHost =
      Constants.expoGoConfig?.debuggerHost ??
      (Constants.manifest as { debuggerHost?: string } | null)?.debuggerHost;
    const lanHost = typeof debuggerHost === "string" ? debuggerHost.split(":")[0] : undefined;

    if (typeof __DEV__ !== "undefined" && __DEV__ && lanHost) {
      url = "http://" + lanHost + ":" + API_PORT;
    } else {
      url = envUrl || "http://127.0.0.1:" + API_PORT;
    }
  }

  return normalizeMisplacedIpv4Port(url).replace(/\/$/, "");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Không kết nối được API (${base}). Chạy backend (wrangler dev) và cùng Wi‑Fi. ${detail}`);
  }
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? `Request failed (${response.status})`);
  }
  return data as T;
}

export const api = {
  signIn: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signUp: (username: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  logout: () => request<{ message: string }>("/api/auth/logout", { method: "POST" }),

  getDashboard: (userId: string, q = "") =>
    request<DashboardResponse>(`/api/dashboard?userId=${encodeURIComponent(userId)}&q=${encodeURIComponent(q)}`),

  getDecks: (userId: string) => request<Deck[]>(`/api/flashcards/decks?userId=${encodeURIComponent(userId)}`),

  createDeck: (userId: string, payload: { title: string; description?: string; level?: string }) =>
    request<Deck>(`/api/flashcards/decks?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateDeck: (userId: string, deckId: string, payload: { title?: string; description?: string }) =>
    request<Deck>(`/api/flashcards/decks/${deckId}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteDeck: (userId: string, deckId: string) =>
    request<{ message: string }>(`/api/flashcards/decks/${deckId}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    }),

  createCard: (
    userId: string,
    deckId: string,
    payload: { vocabulary: string; phonetic?: string; meaning: string; imageUrl?: string | null }
  ) =>
    request<Card>(`/api/flashcards/decks/${deckId}/cards?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCard: (
    userId: string,
    deckId: string,
    cardId: string,
    payload: { vocabulary?: string; phonetic?: string; meaning?: string; imageUrl?: string | null }
  ) =>
    request<Card>(`/api/flashcards/decks/${deckId}/cards/${cardId}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  setDeckShare: (userId: string, deckId: string, enabled: boolean) =>
    request<{ deckId: string; shareEnabled: boolean; shareLink: string | null }>(
      `/api/flashcards/decks/${deckId}/share?userId=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        body: JSON.stringify({ enabled }),
      }
    ),

  submitQuiz: (selectedIndex: number) =>
    request<{ result: "success" | "fail"; percent: number; scoreLabel: string }>("/api/flashcards/quiz/submit", {
      method: "POST",
      body: JSON.stringify({ selectedIndex }),
    }),

  getShadowingTopics: () => request<ShadowingTopic[]>("/api/shadowing/topics"),

  getBooks: () => request<Book[]>("/api/books"),
  getBook: (bookId: string) => request<Book>(`/api/books/${bookId}`),

  getProfile: (userId: string) => request<UserProfile>(`/api/settings/profile?userId=${encodeURIComponent(userId)}`),

  updateAccount: (userId: string, username: string, email: string) =>
    request<UserProfile>(`/api/settings/account?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify({ username, email }),
    }),

  updateProfile: (userId: string, website: string, bio: string) =>
    request<UserProfile>(`/api/settings/profile?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify({ website, bio }),
    }),

  updatePreferences: (userId: string, language: string, timezone: string) =>
    request<UserProfile>(`/api/settings/preferences?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify({ language, timezone }),
    }),

  changePassword: (userId: string, currentPassword: string, newPassword: string, confirmPassword: string) =>
    request<{ message: string }>(`/api/settings/password?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    }),

  linkSocial: (userId: string, provider: "facebook" | "google", linked: boolean) =>
    request<UserProfile>(`/api/settings/social-link?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify({ provider, linked }),
    }),

  getPremiumPlans: () => request<PremiumPlan[]>("/api/premium/plans"),

  subscribe: (userId: string, planId: string, paymentMethod: "crypto" | "bank") =>
    request<{ planId: string; planName: string; paymentMethod: string; status: string }>(
      `/api/premium/subscribe?userId=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        body: JSON.stringify({ planId, paymentMethod }),
      }
    ),
};
