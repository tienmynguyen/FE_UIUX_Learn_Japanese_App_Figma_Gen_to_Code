import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FIRST_RESULT_IMAGE_URI = "https://www.figma.com/api/mcp/asset/94a2acb0-26fe-4779-bee3-bf5b2ecd6b2d";
const FINAL_RESULT_IMAGE_URI = "https://www.figma.com/api/mcp/asset/e7d9a369-e5b6-4a95-8782-41da828b0d40";

export default function ShadowingSessionScreen() {
  const { isLightMode } = useThemeMode();
  const [showResult, setShowResult] = useState<"none" | "first" | "final">("none");
  const [isFinalRound, setIsFinalRound] = useState(false);

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-[#EFEFEF]" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className="px-[14px] pt-4">
        <Pressable className="h-10 w-10 justify-center" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
        </Pressable>
      </View>

      <View className="px-[22px] pt-1">
        <AppText weight="bold" className={`text-[48px] ${isLightMode ? "text-black" : "text-white"}`}>
          Công việc
        </AppText>
        <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#444444]" : "text-[rgba(255,255,255,0.7)]"}`}>
          các câu giao tiếp cơ bản trong môi trường công sở
        </AppText>
      </View>

      <View className="mt-5 px-[14px]">
        <View className={`h-[10px] rounded-[10px] ${isLightMode ? "bg-[#233A62]" : "bg-[#303A51]"}`}>
          <View className={`h-[10px] rounded-[10px] bg-[#6179AF] ${isFinalRound ? "w-full" : "w-[46px]"}`} />
        </View>
        <AppText weight="bold" className={`mt-2 text-[24px] ${isLightMode ? "text-[#444444]" : "text-[rgba(255,255,255,0.7)]"}`}>
          {isFinalRound ? "Câu 10/10 - 100%" : "Câu 1/10 - 10%"}
        </AppText>
      </View>

      <View className={`mx-[30px] mt-4 rounded-[20px] px-4 pb-7 pt-3 ${isLightMode ? "bg-white" : "bg-[#303A51]"}`}>
        <View className="flex-row justify-between">
          <AppText weight="bold" className="text-[24px] text-[#84A9FE]">
            {isFinalRound ? "#10" : "#1"}
          </AppText>
          <AppText weight="bold" className={`text-[24px] ${isLightMode ? "text-black" : "text-white"}`}>
            7 ký tự
          </AppText>
        </View>

        <View className="mt-3 items-center">
          <AppText weight="bold" className={`text-[48px] ${isLightMode ? "text-black" : "text-white"}`}>
            お疲れ様です
          </AppText>
        </View>

        <View className="mt-3 flex-row items-center self-center rounded-[10px] bg-[#536284] px-3 py-2">
          <View className="h-[33px] w-[42px] items-center justify-center rounded-[16px] bg-[rgba(30,30,30,0.9)]">
            <Ionicons name="volume-high" size={18} color="white" />
          </View>
          <AppText weight="bold" className="ml-3 text-[31px] text-[rgba(0,0,0,0.7)]">
            Nghe mẫu
          </AppText>
        </View>

        <View
          className={`mt-3 h-[38px] items-center justify-center rounded-[10px] border ${
            isLightMode ? "border-[#1E293B] bg-[#0B1220]" : "border-[#687DAE] bg-[#0B1220]"
          }`}
        >
          <AppText weight="bold" className="text-[27px] text-[rgba(255,255,255,0.7)]">
            Sẵn sàng ghi âm
          </AppText>
        </View>

        <View className="mt-5 h-[121px]">
          <View className="absolute left-[14px] top-5 flex-row items-center rounded-[15px] bg-[#FA4545] px-[5px]">
            <View className="h-[39px] w-[39px] items-center justify-center">
              <Ionicons name="radio-button-on" size={20} color="white" />
            </View>
            <AppText weight="bold" className="w-[71px] text-center text-[26px] text-white">
              Ghi âm
            </AppText>
          </View>

          <View className="absolute right-0 top-[8px] flex-row items-center rounded-[15px] bg-[#0B1220] px-[5px]">
            <View className="h-[37px] w-[36px] items-center justify-center">
              <Ionicons name="play" size={18} color="white" />
            </View>
            <AppText weight="bold" className="w-[60px] text-center text-[24px] text-[rgba(255,255,255,0.7)]">
              Nghe lại
            </AppText>
          </View>

          <Pressable
            className="absolute right-0 top-[66px] h-[36px] w-[111px] items-center justify-center rounded-[15px] bg-[#3F7D41]"
            onPress={() => setShowResult(isFinalRound ? "final" : "first")}
          >
            <AppText weight="bold" className="text-[24px] text-white">
              Chấm & Tiếp
            </AppText>
          </Pressable>
        </View>
      </View>

      <View
        className={`mx-[31px] mt-4 h-[96px] items-center rounded-[20px] border px-4 py-[14px] ${
          isLightMode ? "border-[#6D87C0] bg-white" : "border-[#687DAE] bg-[#303A51]"
        }`}
      >
        <AppText weight="bold" className={`text-[24px] ${isLightMode ? "text-[#444444]" : "text-[rgba(255,255,255,0.7)]"}`}>
          Tổng điểm hiện tại
        </AppText>
        <AppText weight="bold" className="mt-1 text-[72px] text-[#8AA6E9]">
          0.0
        </AppText>
      </View>

      {showResult !== "none" && (
        <View className="absolute inset-0 items-center justify-center bg-[rgba(0,0,0,0.5)] px-[30px] py-[218px]">
          <View
            className={`h-[403px] w-full items-center rounded-[20px] px-[40px] pb-[35px] ${
              isLightMode ? "bg-white border border-[#D1D5DB]" : "bg-[#303A51]"
            }`}
          >
            <Image
              source={{ uri: showResult === "final" ? FINAL_RESULT_IMAGE_URI : FIRST_RESULT_IMAGE_URI }}
              className="h-[132px] w-[127px]"
              resizeMode="cover"
            />
            <AppText weight="bold" className={`mt-2 text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
              {showResult === "final" ? "Hoàn thành! 🎉" : "Câu 1"}
            </AppText>
            <AppText weight="bold" className="mt-2 text-[54px] text-[#FFDE24]">
              {showResult === "final" ? "Điểm: 697.7" : "Điểm: 72.5"}
            </AppText>
            <AppText
              className={`mt-2 text-center text-[30px] ${
                isLightMode ? "text-[#4B5563]" : "text-[rgba(255,255,255,0.7)]"
              }`}
            >
              {showResult === "final"
                ? "Bạn đã luyện xong 10 câu.\nCần chú ý các lỗi như:\nReading error, Wrong Particle"
                : "Lỗi: Missing Kana, missing particle, Reading error, Wrong Particle"}
            </AppText>
            <Pressable
              className="mt-5 h-[43px] w-[131px] items-center justify-center rounded-[10px] bg-[#6188E3]"
              onPress={() => {
                if (showResult === "first") {
                  setShowResult("none");
                  setIsFinalRound(true);
                  return;
                }
                router.back();
              }}
            >
              <AppText weight="bold" className="text-[24px] text-white">
                {showResult === "final" ? "Quay lại" : "OK"}
              </AppText>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
