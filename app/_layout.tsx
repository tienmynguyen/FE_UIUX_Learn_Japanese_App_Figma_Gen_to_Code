import { useThemeMode, ThemeModeProvider } from "@/hooks/useThemeMode";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import "../global.css";

function RootNavigator() {
  const { isLightMode } = useThemeMode();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="premium" />
        <Stack.Screen name="flashcards-you-can-do" />
        <Stack.Screen name="flashcards" />
        <Stack.Screen name="flashcards-practice" />
        <Stack.Screen name="flashcards-quiz" />
        <Stack.Screen name="flashcards-quiz-result" />
        <Stack.Screen name="bilingual-books" />
        <Stack.Screen name="bilingual-reader" />
        <Stack.Screen name="shadowing" />
        <Stack.Screen name="shadowing-work" />
        <Stack.Screen name="shadowing-session" />
        <Stack.Screen name="settings" />
      </Stack>
      <StatusBar style={isLightMode ? "dark" : "light"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeModeProvider>
        <RootNavigator />
      </ThemeModeProvider>
    </SafeAreaProvider>
  );
}
