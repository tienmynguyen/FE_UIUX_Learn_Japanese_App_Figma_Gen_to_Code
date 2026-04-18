import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSession } from "@/hooks/useSession";
import { api, type PremiumPlan } from "@/services/api";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PremiumScreen() {
  const { width } = useWindowDimensions();
  const { session, setSession } = useSession();
  const [plans, setPlans] = useState<PremiumPlan[]>([]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }
    const loadPlans = async () => {
      try {
        const nextPlans = await api.getPremiumPlans();
        setPlans(nextPlans);
      } catch (error) {
        Alert.alert("Không tải được gói premium", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
      }
    };
    loadPlans();
  }, [session]);

  const exitToDashboard = () => {
    router.replace("/dashboard");
  };

  const subscribePlan = async (planId: string, paymentMethod: "crypto" | "bank") => {
    if (!session) return;
    try {
      const result = await api.subscribe(session.userId, planId, paymentMethod);
      setSession({ ...session, planId: result.planId });
      Alert.alert("Thành công", `Bạn đã đăng ký ${result.planName}.`);
      exitToDashboard();
    } catch (error) {
      Alert.alert("Không thể thanh toán", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1220]">
      <StatusBar style="light" />

      <View className="px-4 pt-1">
        <Pressable className="h-10 w-10 items-center justify-center" onPress={exitToDashboard}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
      </View>

      <View className="items-center px-5 pt-2">
        <MaterialCommunityIcons name="crown-outline" size={44} color="#F59E0D" />
        <Text className="mt-2 text-[34px] font-bold text-white">Nâng cấp Vpan</Text>
        <Text className="mt-1 text-center text-[19px] text-[#94A3B8]">
          Chọn gói phù hợp - chinh phục tiếng Nhật nhanh hơn bao giờ hết
        </Text>
      </View>

      <FlatList
        horizontal
        pagingEnabled
        data={plans}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width }} className="px-5 pb-8 pt-4">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View
                className={`rounded-[20px] bg-[#222939] px-5 pb-6 pt-7 ${item.id === "premium" ? "border-[3px] border-[#F59E0D]" : ""}`}
              >
                {item.id === "premium" && (
                  <View className="absolute -top-4 self-center rounded-[8px] bg-[#F59E0D] px-5 py-2">
                    <Text className="text-[14px] font-bold text-white">TIẾT KIỆM NHẤT</Text>
                  </View>
                )}

                <View className="items-center">
                  <View className="h-[62px] w-[62px] items-center justify-center rounded-[8px]" style={{ backgroundColor: "rgba(226,179,59,0.18)" }}>
                    <MaterialCommunityIcons name="crown-outline" size={40} color="#E2B33B" />
                  </View>
                  <Text className="mt-4 text-[22px] font-bold text-white">{item.name}</Text>
                  <Text className="text-[14px] text-[#9CA3AF]">{item.subtitle}</Text>
                  <Text className="mt-2 text-[42px] font-bold text-white">{item.price}</Text>
                  <Text className="text-[14px] text-[#9CA3AF]">{item.cycle}</Text>
                </View>

                <View className="mt-7 gap-2">
                  {item.features.map((feature) => (
                    <View key={feature} className="flex-row items-start">
                      <Ionicons name="checkbox" size={16} color="#79D76E" />
                      <Text className="ml-2 flex-1 text-[13px] text-white">{feature}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  className="mt-6 h-[50px] flex-row items-center justify-center rounded-[8px] bg-[#F59E0D]"
                  onPress={() => subscribePlan(item.id, "crypto")}
                >
                  <MaterialCommunityIcons name="bitcoin" size={20} color="#0F172A" />
                  <Text className="ml-2 text-[16px] font-bold text-black">Thanh toán Crypto</Text>
                </Pressable>

                <Pressable
                  className="mt-3 h-[50px] flex-row items-center justify-center rounded-[8px] bg-[#60B586]"
                  onPress={() => subscribePlan(item.id, "bank")}
                >
                  <Ionicons name="wallet-outline" size={20} color="white" />
                  <Text className="ml-2 text-[16px] font-bold text-white">Chuyển khoản NH</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
