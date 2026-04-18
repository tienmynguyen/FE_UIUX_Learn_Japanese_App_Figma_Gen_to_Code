export const Theme = {
  colors: {
    primary: "#00629B",
    secondary: "#0097D9",
    background: "#F4F5F7",
    text: "#0F172A",
    white: "#FFFFFF",
    muted: "#9CA3AF",
    border: "#E5E7EB",
  },
  fonts: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
} as const;

export type ThemeColor = keyof typeof Theme.colors;
export type ThemeFont = keyof typeof Theme.fonts;
