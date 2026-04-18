import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ThemeMode = "dark" | "light";

type ThemeModeContextValue = {
  mode: ThemeMode;
  isLightMode: boolean;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      isLightMode: mode === "light",
      toggleMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }
  return context;
}
