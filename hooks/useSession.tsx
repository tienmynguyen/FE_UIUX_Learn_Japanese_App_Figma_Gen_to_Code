import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SessionState = {
  userId: string;
  username: string;
  email: string;
  token: string;
  planId: string;
};

type SessionContextValue = {
  session: SessionState | null;
  setSession: (next: SessionState | null) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionState | null>(null);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      setSession: (next) => setSessionState(next),
      clearSession: () => setSessionState(null),
    }),
    [session]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return context;
}
