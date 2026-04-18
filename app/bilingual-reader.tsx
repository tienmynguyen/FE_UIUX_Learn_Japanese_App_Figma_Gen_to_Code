import { AppText } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api } from "@/services/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BOOK_COVER_URI = "https://www.figma.com/api/mcp/asset/f45447a4-5216-4be6-96d0-0be7ded04fc6";

export default function BilingualReaderScreen() {
  const { isLightMode } = useThemeMode();
  const { session } = useSession();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const [bookTitle, setBookTitle] = useState("Một ngày của Yumi");
  const [bookLevel, setBookLevel] = useState("N5");
  const [bookCover, setBookCover] = useState(BOOK_COVER_URI);
  const [contentText, setContentText] = useState("Đang tải nội dung...");
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(16);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }
    const bookId = params.bookId ?? "book-yumi";
    api
      .getBook(bookId)
      .then((book) => {
        setBookTitle(book.title);
        setBookLevel(book.level);
        setBookCover(book.coverUrl);
        setContentText(book.content);
      })
      .catch((error) => Alert.alert("Không tải được sách", error instanceof Error ? error.message : "Đã có lỗi xảy ra."));
  }, [params.bookId, session]);

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-[#EFEFEF]" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className={`h-[52px] items-center justify-center border-b ${isLightMode ? "border-[#1E293B]" : "border-[#868686]"}`}>
        <AppText weight="bold" className={`text-[18px] ${isLightMode ? "text-black" : "text-white"}`}>
          Sách song ngữ Nhật - Việt
        </AppText>
      </View>

      <Pressable className="absolute left-4 top-11 z-20 h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
      </Pressable>

      <View className={`mx-[21px] mt-[24px] rounded-[20px] px-[19px] pb-5 pt-[77px] ${isLightMode ? "bg-[#C2C7CE]" : "bg-[#303A51]"}`}>
        <Image source={{ uri: bookCover }} className="absolute left-[137px] top-[6px] h-[84px] w-[75px] rounded-[10px]" />

        <View className="min-h-[94px] flex-row items-center rounded-[15px] bg-white px-5 py-3">
          <Ionicons name="information-circle-outline" size={24} color="#0B1220" />
          <View className="mx-4 flex-1 items-center">
            <AppText weight="bold" className="text-[18px] text-[#0F0F0F]">
              {bookTitle}
            </AppText>
            <AppText className="text-[14px] text-[rgba(0,0,0,0.6)]">sách dành cho trình độ từ {bookLevel}</AppText>
            <AppText weight="bold" className="text-[18px] text-black">
              {"<   CHƯƠNG 1   >"}
            </AppText>
          </View>
          <Pressable onPress={() => setShowSettingsPopup((v) => !v)}>
            <Feather name="menu" size={24} color="#0B1220" />
          </Pressable>
        </View>

        <View className="mt-[29px] max-h-[611px] min-h-[460px] rounded-[15px] bg-white px-4 py-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            <AppText className="text-black" style={{ fontSize: readerFontSize, lineHeight: Math.round(readerFontSize * 1.6) }}>
              {contentText}
            </AppText>
          </ScrollView>
        </View>
      </View>

      {showSettingsPopup && (
        <>
          <Pressable className="absolute inset-0" onPress={() => setShowSettingsPopup(false)} />
          <View
            className={`absolute right-[26px] top-[180px] w-[260px] rounded-[20px] px-[15px] py-[17px] ${
              isLightMode ? "bg-white border border-[#D1D5DB]" : "bg-[#303A51]"
            }`}
          >
            <View className={`items-center rounded-[15px] px-[29px] py-2 ${isLightMode ? "bg-[#F3F4F6]" : "bg-[#303A51]"}`}>
              <AppText weight="bold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                CÀI ĐẶT
              </AppText>
            </View>

            <View className={`mt-2 items-center gap-[17px] rounded-[15px] px-[7px] py-[13px] ${isLightMode ? "bg-[#F8FAFC]" : "bg-[#303A51]"}`}>
              <View
                className={`h-[34px] w-[204px] flex-row items-center rounded-[10px] border px-3 ${
                  isLightMode ? "border-[#D1D5DB] bg-[#F8FAFC]" : "border-[#CBD5E1] bg-white"
                }`}
              >
                <AppText className="flex-1 text-[12px] text-[#0F172A]">Cỡ chữ: {readerFontSize}</AppText>
                <View className="flex-row items-center gap-2">
                  <Pressable
                    className="h-6 w-6 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
                    onPress={() => setReaderFontSize((prev) => Math.max(14, prev - 1))}
                  >
                    <Ionicons name="remove" size={12} color="#475569" />
                  </Pressable>
                  <Pressable
                    className="h-6 w-6 items-center justify-center rounded-full border border-[#CBD5E1] bg-white"
                    onPress={() => setReaderFontSize((prev) => Math.min(24, prev + 1))}
                  >
                    <Ionicons name="add" size={12} color="#475569" />
                  </Pressable>
                </View>
              </View>
              <View
                className={`h-[34px] w-[204px] flex-row items-center rounded-[10px] border px-3 ${
                  isLightMode ? "border-[#D1D5DB] bg-[#F8FAFC]" : "border-[#CBD5E1] bg-white"
                }`}
              >
                <AppText className="flex-1 text-[12px] text-[#0F172A]">Màu nền: Trắng</AppText>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </View>
              <View
                className={`h-[34px] w-[204px] flex-row items-center rounded-[10px] border px-3 ${
                  isLightMode ? "border-[#D1D5DB] bg-[#F8FAFC]" : "border-[#CBD5E1] bg-white"
                }`}
              >
                <AppText className="flex-1 text-[12px] text-[#0F172A]">Màu chữ: Đen</AppText>
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
