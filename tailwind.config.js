/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00629B",
        secondary: "#0097D9",
        background: "#F4F5F7",
        text: "#0F172A",
        muted: "#9CA3AF",
        border: "#E5E7EB",
      },
      fontFamily: {
        regular: ["System"],
        medium: ["System"],
        semibold: ["System"],
        bold: ["System"],
      },
    },
  },
  plugins: [],
};
