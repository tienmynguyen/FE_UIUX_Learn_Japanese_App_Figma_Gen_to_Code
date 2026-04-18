import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FlashcardsQuizResultScreen() {
  const { isLightMode } = useThemeMode();
  const params = useLocalSearchParams<{ result?: string }>();
  const isSuccess = params.result === "success";

  const title = isSuccess ? "Hoàn hảo!" : "Cố lên!";
  const badge = isSuccess ? "SS" : "C";
  const subtitle = isSuccess ? "Bạn là thiên tài! 🌟" : "Cố gắng lần sau nhé! 📚";
  const percent = isSuccess ? "100%" : "60%";
  const scoreLabel = isSuccess ? "5/5" : "3/5";
  const rankLabel = isSuccess ? "SS" : "C";
  const timeLabel = isSuccess ? "0:30" : "0:21";
  const progressBarClass = isSuccess ? "w-full bg-[#FBBF24]" : "w-[60%] bg-[#F87171]";

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <Pressable className="ml-3 mt-2 h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "white"} />
      </Pressable>

      <View className={`mx-[22px] mt-1 rounded-[20px] p-5 ${isLightMode ? "bg-transparent" : "bg-[#1E293B]"}`}>
        <View className={`rounded-[20px] px-4 py-6 ${isSuccess ? "bg-[#F0A40A]" : "bg-[#F43F5E]"}`}>
          <View className="items-center">
            <Ionicons name="trophy" size={42} color="white" />
            <View className="mt-3 rounded-[12px] bg-[rgba(255,255,255,0.3)] px-4 py-1">
              <AppText weight="bold" className="text-[32px] text-white">
                {badge}
              </AppText>
            </View>
            <AppText weight="bold" className="mt-3 text-[30px] text-white">
              {title}
            </AppText>
            <AppText className="mt-1 text-[16px] text-white">{subtitle}</AppText>
            <View className="mt-4 h-[82px] w-[82px] items-center justify-center rounded-full border-2 border-white">
              <AppText weight="bold" className="text-[20px] text-white">
                {percent}
              </AppText>
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap justify-between gap-y-3">
          <View className="h-[120px] w-[48%] rounded-[16px] bg-[#1E40AF] px-4 py-3">
            <MaterialCommunityIcons name="target" size={28} color="#D6E4FF" />
            <AppText className="mt-1 text-[14px] text-[#DBEAFE]">Điểm số</AppText>
            <AppText weight="bold" className="mt-2 text-[30px] text-white">
              {scoreLabel}
            </AppText>
          </View>
          <View className="h-[120px] w-[48%] rounded-[16px] bg-[#9A3412] px-4 py-3">
            <Ionicons name="ribbon" size={26} color="#FDE68A" />
            <AppText className="mt-1 text-[14px] text-[#FDE68A]">Xếp hạng</AppText>
            <AppText weight="bold" className="mt-2 text-[30px] text-white">
              {rankLabel}
            </AppText>
          </View>
          <View className="h-[120px] w-[48%] rounded-[16px] bg-[#065F46] px-4 py-3">
            <Ionicons name="time-outline" size={28} color="#CCFBF1" />
            <AppText className="mt-1 text-[14px] text-[#CCFBF1]">Thời gian</AppText>
            <AppText weight="bold" className="mt-2 text-[30px] text-white">
              {timeLabel}
            </AppText>
          </View>
          <View className="h-[120px] w-[48%] rounded-[16px] bg-[#6D28D9] px-4 py-3">
            <Ionicons name="flash" size={26} color="#E9D5FF" />
            <AppText className="mt-1 text-[14px] text-[#E9D5FF]">Chế độ</AppText>
            <AppText weight="bold" className="mt-2 text-[30px] text-white">
              Speed
            </AppText>
          </View>
        </View>

        <View className={`mt-4 rounded-[16px] px-4 py-4 ${isLightMode ? "bg-[#EEF0FF]" : "bg-[#1F2937]"}`}>
          <AppText weight="bold" className={`text-[22px] ${isLightMode ? "text-black" : "text-white"}`}>
            Phân tích kết quả
          </AppText>
          <View className={`mt-3 h-3 rounded-full ${isLightMode ? "bg-white" : "bg-[#374151]"}`}>
            <View className={`h-3 rounded-full ${progressBarClass}`} />
          </View>
          {isLightMode && (
            <View className="mt-5 flex-row items-center justify-around">
              <View className="items-center">
                <View className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <AppText className="mt-1 text-[12px] text-[#64748B]">Đúng</AppText>
              </View>
              <View className="items-center">
                <View className="h-2 w-2 rounded-full bg-[#EF4444]" />
                <AppText className="mt-1 text-[12px] text-[#64748B]">Sai</AppText>
              </View>
              <View className="items-center">
                <View className="h-2 w-2 rounded-full bg-[#64748B]" />
                <AppText className="mt-1 text-[12px] text-[#64748B]">Tổng</AppText>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
