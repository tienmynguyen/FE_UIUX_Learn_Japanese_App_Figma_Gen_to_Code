import { AppText } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api, type ShadowingTopic } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TopicCard({ onPress, isLightMode, topic }: { onPress?: () => void; isLightMode: boolean; topic: ShadowingTopic }) {
  return (
    <Pressable
      className={`w-[159px] rounded-[20px] px-[11px] py-[9px] ${isLightMode ? "bg-white" : "bg-[#303A51]"}`}
      onPress={onPress}
    >
      <View className="h-[28px] w-[118px] flex-row items-center">
        <View className="h-7 w-[29px] items-center justify-center rounded-[10px] bg-[#465473]">
          <Ionicons name="mic-outline" size={14} color="#9EB0D0" />
        </View>
        <AppText weight="bold" className={`ml-[10px] text-[32px] ${isLightMode ? "text-black" : "text-white"}`}>
          {topic.title}
        </AppText>
      </View>

      <AppText className={`mt-3 text-[24px] leading-[20px] ${isLightMode ? "text-black" : "text-white"}`}>
        {topic.description}
      </AppText>

      <View className="mt-4 flex-row items-center justify-end">
        <AppText className={`text-[24px] ${isLightMode ? "text-black" : "text-white"}`}>Bắt đầu</AppText>
        <View className="ml-1 h-[19px] w-[19px] items-center justify-center rounded-[4px] bg-[#465473]">
          <Ionicons name="arrow-forward" size={11} color="white" />
        </View>
      </View>
    </Pressable>
  );
}

export default function ShadowingScreen() {
  const { isLightMode } = useThemeMode();
  const { session } = useSession();
  const [topics, setTopics] = useState<ShadowingTopic[]>([]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }
    api
      .getShadowingTopics()
      .then(setTopics)
      .catch((error) => Alert.alert("Không tải được shadowing", error instanceof Error ? error.message : "Đã có lỗi xảy ra."));
  }, [session]);

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-[#EFEFEF]" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <Pressable className="ml-[13px] mt-[6px] h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
      </Pressable>

      <View className={`mx-[30px] mt-2 rounded-[20px] p-4 ${isLightMode ? "bg-white" : "bg-[#303A51]"}`}>
        <AppText weight="bold" className={`text-[48px] ${isLightMode ? "text-black" : "text-white"}`}>
          Chào mừng bạn! 👋
        </AppText>
        <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#444444]" : "text-[rgba(255,255,255,0.7)]"}`}>
          Luyện tập phát âm cùng Pan ngay nào
        </AppText>
      </View>

      <ScrollView
        className="mt-5 px-[31px]"
        contentContainerStyle={{ paddingBottom: 220 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between gap-y-5">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onPress={() => router.push({ pathname: "/shadowing-work", params: { topicId: topic.id } })}
              isLightMode={isLightMode}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
