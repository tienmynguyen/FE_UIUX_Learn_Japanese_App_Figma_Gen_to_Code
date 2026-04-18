import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons, Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DeckCardProps = {
  title: string;
  subtitle: string;
  level: string;
  count: string;
  date: string;
  levelColor: string;
  onPress?: () => void;
  isLightMode?: boolean;
};

const profileImageUri = "https://www.figma.com/api/mcp/asset/b7085512-ed2e-46f8-80fb-3861882ec241";
const popupProfileImageUri = "https://www.figma.com/api/mcp/asset/f6367b6f-3e56-4837-bc51-d7b90d57d895";
const chatUsers = [
  { name: "Khoi Huynh", email: "khoihuyh152004@gmail.com" },
  { name: "Minh Huyền", email: "huyen@gmail.com" },
  { name: "NGUYỄN TÔN MINH HUYỀN", email: "huyenmt.2it@vku.udn.vn" },
  { name: "Phạm Hoàng Bảo", email: "27baokpham27@gmail.com" },
];
const notificationItems = Array.from({ length: 5 }).map(() => ({
  title: "Đăng nhập mới từ Máy tính - Windows - Postman",
  time: "10 phút trước",
}));
const searchResults = [
  { kanji: "開発", hira: "【かいはつ】", meaning: "development, cultivation, application" },
  { kanji: "開発途上国", hira: "【かいはつとじょうこく】", meaning: "developing country" },
  { kanji: "開発者", hira: "【かいはつしゃ】", meaning: "developer" },
  { kanji: "開発元", hira: "【かいはつもと】", meaning: "developer (of software, video games, etc.)" },
  { kanji: "開発部", hira: "【かいはつぶ】", meaning: "development department" },
];

function QuickFeatureCard({
  title,
  bgColor,
  icon,
  onPress,
  isLightMode = false,
}: {
  title: string;
  bgColor: string;
  icon: ReactNode;
  onPress?: () => void;
  isLightMode?: boolean;
}) {
  return (
    <Pressable
      className="flex-1 items-center rounded-2xl py-6"
      style={{ backgroundColor: bgColor }}
      onPress={onPress}
    >
      <View className="mb-2">{icon}</View>
      <AppText className={`text-[31px] ${isLightMode ? "text-black" : "text-white"}`}>{title}</AppText>
    </Pressable>
  );
}

function DeckCard({ title, subtitle, level, count, date, levelColor, onPress, isLightMode = false }: DeckCardProps) {
  return (
    <Pressable
      className={`w-full flex-row items-center gap-4 rounded-2xl border border-[#35435E] p-[19px] ${
        isLightMode ? "bg-white" : "bg-[#212B3E]"
      }`}
      onPress={onPress}
    >
      <View className="h-[42px] w-[42px] items-center justify-center">
        <MaterialCommunityIcons name="layers-outline" size={34} color={levelColor} />
      </View>

      <View className="flex-1">
        <AppText className={`text-[34px] ${isLightMode ? "text-black" : "text-white"}`}>{title}</AppText>
        <View className="mt-[2px] flex-row items-center justify-between">
          <AppText className={`text-[30px] ${isLightMode ? "text-black" : "text-white"}`}>{subtitle}</AppText>
          <AppText className={`text-[30px] ${isLightMode ? "text-black" : "text-white"}`}>{count}</AppText>
        </View>
        <View className="mt-[2px] flex-row items-center justify-between">
          <AppText className={`text-[30px] ${isLightMode ? "text-black" : "text-white"}`}>
            {level}
          </AppText>
          <AppText className={`text-[30px] ${isLightMode ? "text-black" : "text-white"}`}>{date}</AppText>
        </View>
      </View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLightMode, toggleMode } = useThemeMode();
  const showSearchResults = searchQuery.trim().length > 0;
  const filteredResults = searchResults.filter((item) =>
    `${item.kanji} ${item.hira} ${item.meaning}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const closeAllPopups = () => {
    setIsProfilePopupOpen(false);
    setShowChatPopup(false);
    setShowNotificationPopup(false);
    setShowLogoutConfirm(false);
  };

  return (
    <SafeAreaView className={`relative flex-1 ${isLightMode ? "bg-white" : "bg-[#20293C]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />
      <View className="flex-1">
        <View className="px-4 pb-2 pt-1">
          <View className="h-[41px] flex-row items-center">
            <View
              className={`mr-3 h-10 flex-1 flex-row items-center rounded-full px-4 ${
                isLightMode ? "bg-white border border-[#CBD5E1]" : "bg-[#1E293B]"
              }`}
            >
              <Ionicons name="search-outline" size={18} color={isLightMode ? "#94A3B8" : "#9CA3AF"} />
              <TextInput
                value={searchQuery}
                onChangeText={(value) => {
                  setSearchQuery(value);
                  setIsProfilePopupOpen(false);
                  setShowChatPopup(false);
                  setShowNotificationPopup(false);
                }}
                placeholder="Tìm từ tiếng Nhật"
                placeholderTextColor={isLightMode ? "#94A3B8" : "#9CA3AF"}
                className={`ml-2 flex-1 text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Ionicons name="close" size={18} color={isLightMode ? "#94A3B8" : "#9CA3AF"} />
                </Pressable>
              )}
            </View>

            <View className="ml-auto flex-row items-center gap-2">
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: isLightMode ? "#3F7DF3" : "#2A3447" }}
                onPress={() => {
                  setShowChatPopup((prev) => {
                    const next = !prev;
                    setShowNotificationPopup(false);
                    setIsProfilePopupOpen(false);
                    return next;
                  });
                }}
              >
                <Feather name="message-square" size={20} color="white" />
              </Pressable>
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: isLightMode ? "#3F7DF3" : "#2A3447" }}
                onPress={() => {
                  setShowNotificationPopup((prev) => {
                    const next = !prev;
                    setShowChatPopup(false);
                    setIsProfilePopupOpen(false);
                    return next;
                  });
                }}
              >
                <Ionicons name="notifications-outline" size={20} color="white" />
                <View className="absolute right-[-2px] top-[-2px] h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#EF4444] px-1">
                  <AppText className="text-[10px] text-white">7</AppText>
                </View>
              </Pressable>
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: isLightMode ? "#3F7DF3" : "#2A3447" }}
                onPress={toggleMode}
              >
                <Ionicons
                  name={isLightMode ? "moon-outline" : "sunny-outline"}
                  size={20}
                  color={isLightMode ? "white" : "#FFD23C"}
                />
              </Pressable>
              <Pressable
                className="h-10 w-10 rounded-full border-2 border-[#3B82F6]"
                onPress={() =>
                  setIsProfilePopupOpen((prev) => {
                    const next = !prev;
                    setShowChatPopup(false);
                    setShowNotificationPopup(false);
                    return next;
                  })
                }
              >
                <Image source={{ uri: profileImageUri }} className="h-full w-full rounded-full" />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="px-4 pb-7 pt-5">
          <AppText className={`mb-4 text-[42px] ${isLightMode ? "text-black" : "text-white"}`}>Tính năng nhanh</AppText>
          <View className="flex-row gap-3">
            <QuickFeatureCard
              title="Shadowing"
              bgColor="#46B4FF"
              icon={<Ionicons name="mic-outline" size={28} color="white" />}
              onPress={() => router.push("/shadowing")}
              isLightMode={isLightMode}
            />
            <QuickFeatureCard
              title="Sách Song Ngữ"
              bgColor="#E24FC2"
              icon={<Ionicons name="book-outline" size={28} color="white" />}
              onPress={() => router.push("/bilingual-books")}
              isLightMode={isLightMode}
            />
          </View>
        </View>

        <View
          className={`flex-1 rounded-t-[32px] px-4 pt-7 shadow-2xl ${
            isLightMode ? "bg-[#D6F2FF]" : "bg-[#20293C]"
          }`}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            <View className="mb-5 flex-row items-center justify-between">
              <AppText className={`text-[40px] ${isLightMode ? "text-[#0A0A0A]" : "text-white"}`}>
                Bộ flashcard của tôi
              </AppText>
              <Pressable className="h-[38px] flex-row items-center rounded-full bg-[#3B82F6] px-4">
                <AntDesign name="plus" size={16} color={isLightMode ? "#000000" : "white"} />
                <AppText className={`ml-2 text-[30px] ${isLightMode ? "text-black" : "text-white"}`}>Tạo mới</AppText>
              </Pressable>
            </View>

            <DeckCard
              title="29/03"
              subtitle="Không có mô tả"
              level="Cấp độ: N5"
              count="62 thẻ"
              date="29/3/2026"
              levelColor="#3B82F6"
              onPress={() => router.push("/flashcards")}
              isLightMode={isLightMode}
            />

            <AppText className={`mb-4 mt-8 text-[40px] ${isLightMode ? "text-[#0A0A0A]" : "text-white"}`}>
              Flashcards bạn có thể làm
            </AppText>

            <View className="gap-4">
              <DeckCard
                title="Từ Vựng 14/01"
                subtitle="Choukai"
                level="Cấp độ N5"
                count="38 thẻ"
                date="13/1/2026"
                levelColor="#A855F7"
                onPress={() => router.push("/flashcards-you-can-do")}
                isLightMode={isLightMode}
              />
              <DeckCard
                title="Từ Vựng 28/01"
                subtitle="トピック④・健康的な生活"
                level="Cấp độ: N3"
                count="19 thẻ"
                date="27/1/2026"
                levelColor="#A855F7"
                onPress={() => router.push("/flashcards-you-can-do")}
                isLightMode={isLightMode}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      {showSearchResults && (
        <View
          className={`absolute left-0 right-0 top-[84px] bottom-0 ${isLightMode ? "bg-white" : "bg-[#0D1522]"}`}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            {(filteredResults.length > 0 ? filteredResults : searchResults).map((item) => (
              <View key={item.kanji} className={`border-b px-3 py-4 ${isLightMode ? "border-[#E2E8F0]" : "border-[#1E293B]"}`}>
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <AppText className={`text-[32px] leading-[38px] ${isLightMode ? "text-[#0F172A]" : "text-[#CBD5E1]"}`}>
                      {item.kanji}
                    </AppText>
                    <AppText className="text-[20px] leading-[26px] text-[#3B82F6]">{item.hira}</AppText>
                    <AppText className="mt-1 text-[15px] leading-[22px] text-[#64748B]">
                      {item.meaning}
                    </AppText>
                  </View>
                  <Ionicons name="mic-outline" size={22} color="#3B82F6" />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {(showChatPopup || showNotificationPopup || isProfilePopupOpen || showLogoutConfirm) && (
        <>
          <Pressable
            className="absolute inset-0"
            style={{ backgroundColor: showLogoutConfirm ? "rgba(0,0,0,0.61)" : "transparent" }}
            onPress={closeAllPopups}
          />
        </>
      )}

      {showNotificationPopup && (
        <View
          className={`absolute left-1 top-[104px] w-[310px] rounded-[24px] p-4 ${
            isLightMode ? "bg-[#EAEAEA]" : "bg-[#0F2147]"
          }`}
        >
          <View className="mb-3 flex-row items-center justify-between px-2">
            <AppText className={`text-[36px] ${isLightMode ? "text-black" : "text-white"}`}>Thông báo</AppText>
            <AppText className="text-[24px] text-[#38BDF8]">7 mới</AppText>
          </View>
          <View className="gap-3">
            {notificationItems.map((item, idx) => (
              <View
                key={`${item.time}-${idx}`}
                className={`rounded-[16px] px-4 py-3 ${isLightMode ? "bg-white" : "bg-[#162A4D]"}`}
              >
                <View className="flex-row items-start">
                  <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
                  <View className="ml-3 flex-1">
                    <AppText className={`text-[14px] leading-5 ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                      {item.title}
                    </AppText>
                    <AppText className="mt-1 text-[14px] text-[#94A3B8]">{item.time}</AppText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {showChatPopup && (
        <View
          className={`absolute left-5 top-[128px] w-[360px] rounded-[20px] border ${
            isLightMode ? "border-[#1E3A8A] bg-white" : "border-[#334155] bg-[#162A4D]"
          }`}
        >
          <View className={`h-[60px] flex-row items-center border-b px-4 ${isLightMode ? "border-[#1E3A8A]" : "border-[#334155]"}`}>
            <Ionicons name="close" size={20} color={isLightMode ? "#94A3B8" : "#64748B"} />
            <AppText className={`ml-3 text-[14px] ${isLightMode ? "text-[#94A3B8]" : "text-[#64748B]"}`}>
              Tìm người để chat...
            </AppText>
          </View>
          <View className="py-2">
            {chatUsers.map((user) => (
              <View key={user.email} className="flex-row items-center px-5 py-2">
                <Image source={{ uri: popupProfileImageUri }} className="h-11 w-11 rounded-full border border-[#3B82F6]" />
                <View className="ml-4">
                  <AppText className={`text-[18px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>{user.name}</AppText>
                  <AppText className="text-[14px] text-[#94A3B8]">{user.email}</AppText>
                </View>
              </View>
            ))}
          </View>
          <View className={`items-center border-t py-3 ${isLightMode ? "border-[#1E3A8A]" : "border-[#334155]"}`}>
            <AppText className="text-[34px] text-[#2563EB]">Xem tất cả trong Messenger</AppText>
          </View>
        </View>
      )}

      {isProfilePopupOpen && (
        <>
          <View
            className={`absolute right-3 top-[86px] w-[269px] rounded-[20px] border p-3 shadow-2xl ${
              isLightMode ? "border-[#D1D5DB] bg-white" : "border-[#CBCBCB] bg-[#232E45]"
            }`}
          >
            <View className="flex-row items-center gap-3">
              <Image source={{ uri: popupProfileImageUri }} className="h-[52px] w-[52px] rounded-full" />
              <View>
                <AppText weight="bold" className={`text-[26px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>
                  Khoi Huynh
                </AppText>
                <AppText weight="medium" className={`text-[23px] ${isLightMode ? "text-[#475569]" : "text-[#DCDCDC]"}`}>
                  khoihuynh152004@gmail.com
                </AppText>
                <AppText className="text-[22px] text-[#8F9EB3]">Tài khoản miễn phí</AppText>
              </View>
            </View>

            <View className={`my-3 border-t ${isLightMode ? "border-[#E2E8F0]" : "border-[#3A4A66]"}`} />

            <Pressable
              className="mb-1 flex-row items-center gap-3 py-1"
              onPress={() => {
                setIsProfilePopupOpen(false);
                router.push("/settings");
              }}
            >
              <Feather name="edit-2" size={14} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
              <AppText weight="semibold" className={`text-[26px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>
                Chỉnh sửa hồ sơ
              </AppText>
            </Pressable>

            <Pressable className="mb-2 flex-row items-center gap-3 py-1">
              <Ionicons name="book-outline" size={16} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
              <AppText weight="semibold" className={`text-[26px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>
                Quản lí Flashcard
              </AppText>
            </Pressable>

            <Pressable
              className="mb-3 flex-row items-center rounded-[10px] bg-[#FFC54742] px-3 py-2"
              onPress={() => {
                setIsProfilePopupOpen(false);
                router.push("/premium");
              }}
            >
              <View className="mr-3 h-[31px] w-[29px] items-center justify-center rounded-[7px] bg-[#FF8903]">
                <MaterialCommunityIcons name="crown-outline" size={14} color="white" />
              </View>
              <View className="flex-1">
                <AppText weight="bold" className="text-[31px] text-[#F3A704]">
                  Nâng cấp Premier
                </AppText>
                <AppText weight="medium" className={`text-[23px] ${isLightMode ? "text-[#334155]" : "text-[#DCDCDC]"}`}>
                  Mở khóa tất cả tính năng
                </AppText>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#D4A61E" />
            </Pressable>

            <View className={`mb-2 border-t ${isLightMode ? "border-[#E2E8F0]" : "border-[#3A4A66]"}`} />

            <Pressable
              className="flex-row items-center gap-3 py-1"
              onPress={() => {
                setIsProfilePopupOpen(false);
                setShowLogoutConfirm(true);
              }}
            >
              <Ionicons name="log-out-outline" size={16} color="#FB3E09" />
              <AppText weight="semibold" className="text-[26px] text-[#FB3E09]">
                Đăng xuất
              </AppText>
            </Pressable>
          </View>
        </>
      )}

      {showLogoutConfirm && (
        <View
          className={`absolute left-[61px] top-[310px] w-[279px] rounded-[22px] px-6 py-8 ${
            isLightMode ? "border border-[#D1D5DB] bg-white" : "bg-[#14253C]"
          }`}
        >
          <AppText
            weight="bold"
            className={`text-center text-[32px] tracking-[0.4px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}
          >
            ĐĂNG XUẤT
          </AppText>
          <AppText className={`mt-6 text-center text-[18px] ${isLightMode ? "text-[#334155]" : "text-[#DCDCDC]"}`}>
            Bạn có chắc muốn thoát không?
          </AppText>

          <View className="mt-8 flex-row justify-between">
            <Pressable
              className={`h-[38px] w-[97px] items-center justify-center rounded-[10px] ${
                isLightMode ? "bg-[#E2E8F0]" : "bg-[#8B8B8B]"
              }`}
              onPress={() => setShowLogoutConfirm(false)}
            >
              <AppText weight="bold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>
                Hủy
              </AppText>
            </Pressable>

            <Pressable
              className="h-[38px] w-[101px] items-center justify-center rounded-[10px] bg-[#C90000]"
              onPress={() => {
                setShowLogoutConfirm(false);
                router.replace("/");
              }}
            >
              <AppText weight="bold" className="text-[16px] text-[#F8FAFC]">
                Đăng xuất
              </AppText>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
