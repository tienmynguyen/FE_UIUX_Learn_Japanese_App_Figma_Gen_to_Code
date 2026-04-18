import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlatList, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Plan = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  cycle: string;
  features: string[];
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBg: string;
  highlightBorder?: boolean;
  showBestValue?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "pro",
    name: "Gói Pro",
    subtitle: "Nâng trình lên N3",
    price: "$9.99",
    cycle: "/tháng",
    iconName: "flash-outline",
    iconColor: "#7C6CFF",
    iconBg: "rgba(124,108,255,0.16)",
    features: [
      "+30 Chủ đề Shadowing",
      "Mở khoá kho sách song ngữ trung cấp",
      "Luyện thi JLPT N3",
      "Lưu 500 flashcard",
      "Tăng tốc từ nền tảng N5-N4 miễn phí",
    ],
  },
  {
    id: "premium",
    name: "Gói Premium",
    subtitle: "Nâng trình lên N2",
    price: "$99.99",
    cycle: "/tháng",
    iconName: "crown-outline",
    iconColor: "#E2B33B",
    iconBg: "rgba(226,179,59,0.18)",
    highlightBorder: true,
    showBestValue: true,
    features: [
      "+50 Chủ đề Shadowing",
      "Mở khoá kho sách song ngữ cao cấp",
      "Luyện thi JLPT N2",
      "Lưu 2.500 flashcard",
      "Học chuyên sâu dài hạn",
    ],
  },
  {
    id: "premium-max",
    name: "Gói PremiumMax",
    subtitle: "Nâng trình qua N2",
    price: "$159.99",
    cycle: "/tháng",
    iconName: "crown-outline",
    iconColor: "#E2B33B",
    iconBg: "rgba(226,179,59,0.18)",
    highlightBorder: true,
    showBestValue: true,
    features: [
      "+70 Chủ đề Shadowing",
      "Mở khoá kho sách song ngữ cao cấp",
      "Luyện thi JLPT N3+N2",
      "Lưu 3.500 flashcard",
      "Học chuyên sâu dài hạn",
    ],
  },
  {
    id: "master",
    name: "Gói Master",
    subtitle: "Chinh phục N1",
    price: "$219.99",
    cycle: "/tháng",
    iconName: "star-outline",
    iconColor: "#45C2FF",
    iconBg: "rgba(69,194,255,0.22)",
    features: [
      "+100 Chủ đề Shadowing",
      "Mở khoá kho sách song ngữ cao cấp",
      "Luyện thi JLPT N1",
      "Lưu 5.000 flashcard",
      "Dành mục tiêu cao nhất",
    ],
  },
  {
    id: "master-max",
    name: "Gói MasterMax",
    subtitle: "Chinh phục N1",
    price: "$319.99",
    cycle: "/tháng",
    iconName: "star-outline",
    iconColor: "#FF5C5C",
    iconBg: "rgba(255,92,92,0.2)",
    features: [
      "+100 Chủ đề Shadowing",
      "Mở khoá kho sách song ngữ cao cấp",
      "Luyện thi JLPT N1",
      "Lưu 5.000 flashcard",
      "Dành mục tiêu cao nhất",
    ],
  },
  {
    id: "lifetime",
    name: "Gói Lifetime",
    subtitle: "Mở khoá trọn đời",
    price: "$559.99",
    cycle: "MỘT LẦN DUY NHẤT",
    iconName: "currency-btc",
    iconColor: "#C44C93",
    iconBg: "rgba(196,76,147,0.28)",
    features: [
      "Tất cả nội dung Pro + Premium + Master",
      "Cập nhật hàng tháng",
      "Luyện thi JLPT từ N5 đến N1",
      "Không giới hạn flashcard",
      "Một lần cho mãi mãi",
    ],
  },
];

export default function PremiumScreen() {
  const { width } = useWindowDimensions();

  const exitToDashboard = () => {
    router.replace("/dashboard");
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
        data={PLANS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width }} className="px-5 pb-8 pt-4">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View
                className={`rounded-[20px] bg-[#222939] px-5 pb-6 pt-7 ${item.highlightBorder ? "border-[3px] border-[#F59E0D]" : ""}`}
              >
                {item.showBestValue && (
                  <View className="absolute -top-4 self-center rounded-[8px] bg-[#F59E0D] px-5 py-2">
                    <Text className="text-[14px] font-bold text-white">TIẾT KIỆM NHẤT</Text>
                  </View>
                )}

                <View className="items-center">
                  <View
                    className="h-[62px] w-[62px] items-center justify-center rounded-[8px]"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <MaterialCommunityIcons name={item.iconName} size={40} color={item.iconColor} />
                  </View>
                  <Text className="mt-4 text-[22px] font-bold text-white">{item.name}</Text>
                  <Text className="text-[14px] text-[#9CA3AF]">{item.subtitle}</Text>
                  <Text className="mt-2 text-[42px] font-bold text-white">{item.price}</Text>
                  <Text className={`text-[14px] ${item.id === "lifetime" ? "text-[#FF96CC]" : "text-[#9CA3AF]"}`}>{item.cycle}</Text>
                </View>

                <View className="mt-7 gap-2">
                  {item.features.map((feature) => (
                    <View key={feature} className="flex-row items-start">
                      <Ionicons name="checkbox" size={16} color="#79D76E" />
                      <Text className="ml-2 flex-1 text-[13px] text-white">{feature}</Text>
                    </View>
                  ))}
                </View>

                <Pressable className="mt-6 h-[50px] flex-row items-center justify-center rounded-[8px] bg-[#F59E0D]" onPress={exitToDashboard}>
                  <MaterialCommunityIcons name="bitcoin" size={20} color="#0F172A" />
                  <Text className="ml-2 text-[16px] font-bold text-black">Thanh toán Crypto</Text>
                </Pressable>

                <Pressable className="mt-3 h-[50px] flex-row items-center justify-center rounded-[8px] bg-[#60B586]" onPress={exitToDashboard}>
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
