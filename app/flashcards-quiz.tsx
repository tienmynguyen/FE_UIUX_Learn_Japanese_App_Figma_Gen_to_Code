import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUIZ_OPTIONS = ["Lặp lại", "Số hóa", "Quy trình phát triển\nphần mềm", "Giai đoạn chạy nước rút"];
const CORRECT_INDEX = 0;

export default function FlashcardsQuizScreen() {
  const { isLightMode } = useThemeMode();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const hasNavigatedRef = useRef(false);

  const score = useMemo(() => {
    if (selectedIndex === null) return 0;
    return selectedIndex === CORRECT_INDEX ? 20 : 0;
  }, [selectedIndex]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev === null ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (selectedIndex === null || countdown !== 0 || hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.push({
      pathname: "/flashcards-quiz-result",
      params: { result: selectedIndex === CORRECT_INDEX ? "success" : "fail" },
    });
  }, [countdown, selectedIndex]);

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className="px-5 pt-5">
        <View className="flex-row items-center justify-between">
          <AppText weight="bold" className={`text-[16px] ${isLightMode ? "text-black" : "text-[#F8FAFC]"}`}>
            Câu 1/5
          </AppText>
          <AppText weight="bold" className="text-[16px] text-[#60A5FA]">
            Thời gian: {countdown ?? 0}s
          </AppText>
        </View>
      </View>

      <View className={`mx-[42px] mt-12 rounded-[20px] px-7 pb-7 pt-9 ${isLightMode ? "bg-[#EEF0FF]" : "bg-[#141E37]"}`}>
        <AppText
          weight="bold"
          className={`text-center text-[48px] tracking-[1px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}
        >
          イテレーション
        </AppText>

        <View className="mt-8 gap-5">
          {QUIZ_OPTIONS.map((item, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectSelection = isSelected && index === CORRECT_INDEX;
            const isWrongSelection = isSelected && index !== CORRECT_INDEX;

            return (
            <Pressable
              key={item}
              onPress={() => {
                if (selectedIndex !== null) return;
                setSelectedIndex(index);
                setCountdown(5);
              }}
              className={`h-[82px] items-center justify-center rounded-[12px] border ${
                isCorrectSelection
                  ? "border-[#334155] bg-[#065F46]"
                  : isWrongSelection
                  ? isLightMode
                    ? "border-[#1E3A8A] bg-[#EF4444]"
                    : "border-[#334155] bg-[#9A3412]"
                  : isLightMode
                  ? "border-[#1E3A8A] bg-white"
                  : "border-[#334155] bg-[#1E293B]"
              }`}
            >
              <AppText
                weight="medium"
                className={`text-center text-[15px] leading-[20px] ${
                  isLightMode && !isCorrectSelection && !isWrongSelection ? "text-black" : "text-white"
                }`}
              >
                {item}
              </AppText>
            </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-auto items-center pb-6">
        <AppText weight="bold" className="text-[24px] text-[#60A5FA]">
          Điểm: {score}
        </AppText>
      </View>

      <Pressable className="absolute left-4 top-12 h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
      </Pressable>
    </SafeAreaView>
  );
}
