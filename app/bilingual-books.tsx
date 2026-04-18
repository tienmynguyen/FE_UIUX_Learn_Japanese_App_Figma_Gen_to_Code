import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOOK_COVER_URI = "https://www.figma.com/api/mcp/asset/b28d36ed-7fef-4547-9e23-27d957bb29d2";

function BookItem({ isLightMode }: { isLightMode: boolean }) {
  return (
    <Pressable
      className={`w-full flex-row items-center rounded-[20px] px-[18px] py-[13px] ${
        isLightMode ? "bg-white" : "bg-[#303A51]"
      }`}
      onPress={() => router.push("/bilingual-reader")}
    >
      <Image source={{ uri: BOOK_COVER_URI }} className="h-[106px] w-[77px]" resizeMode="cover" />

      <View className="ml-[23px] flex-1">
        <AppText weight="bold" className={`text-[31px] ${isLightMode ? "text-black" : "text-white"}`}>
          Một ngày của Yumi
        </AppText>
        <AppText weight="bold" className={`mt-1 text-[24px] ${isLightMode ? "text-[#363636]" : "text-[rgba(255,255,255,0.7)]"}`}>
          B.B
        </AppText>
        <View className="mt-3 flex-row items-center">
          <View className="h-[18px] w-[23px] items-center justify-center rounded-[5px] bg-[#737373]">
            <AppText weight="bold" className="text-[21px] text-white">
              N5
            </AppText>
          </View>
          <AppText weight="bold" className={`ml-8 text-[24px] ${isLightMode ? "text-[#363636]" : "text-[rgba(255,255,255,0.7)]"}`}>
            3 chương
          </AppText>
        </View>
      </View>

      <AppText weight="bold" className={`ml-2 text-[24px] ${isLightMode ? "text-black" : "text-white"}`}>
        {">"}
      </AppText>
    </Pressable>
  );
}

export default function BilingualBooksScreen() {
  const { isLightMode } = useThemeMode();

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-[#EFEFEF]" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <Pressable className="ml-[17px] mt-[4px] h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
      </Pressable>

      <View className="mt-7 items-center">
        <AppText weight="bold" className={`text-[48px] ${isLightMode ? "text-black" : "text-white"}`}>
          Sách song ngữ Nhật - Việt
        </AppText>
      </View>

      <View className="mt-6 gap-[10px] px-[30px]">
        <BookItem isLightMode={isLightMode} />
        <BookItem isLightMode={isLightMode} />
        <BookItem isLightMode={isLightMode} />
      </View>
    </SafeAreaView>
  );
}
