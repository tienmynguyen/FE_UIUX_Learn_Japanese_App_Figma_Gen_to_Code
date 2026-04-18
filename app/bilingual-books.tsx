import { AppText } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api, type Book } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function BookItem({ isLightMode, book }: { isLightMode: boolean; book: Book }) {
  return (
    <Pressable
      className={`w-full flex-row items-center rounded-[20px] px-[18px] py-[13px] ${
        isLightMode ? "bg-white" : "bg-[#303A51]"
      }`}
      onPress={() => router.push({ pathname: "/bilingual-reader", params: { bookId: book.id } })}
    >
      <Image source={{ uri: book.coverUrl }} className="h-[106px] w-[77px]" resizeMode="cover" />

      <View className="ml-[23px] flex-1">
        <AppText weight="bold" className={`text-[31px] ${isLightMode ? "text-black" : "text-white"}`}>
          {book.title}
        </AppText>
        <AppText weight="bold" className={`mt-1 text-[24px] ${isLightMode ? "text-[#363636]" : "text-[rgba(255,255,255,0.7)]"}`}>
          {book.author}
        </AppText>
        <View className="mt-3 flex-row items-center">
          <View className="h-[18px] w-[23px] items-center justify-center rounded-[5px] bg-[#737373]">
            <AppText weight="bold" className="text-[21px] text-white">
              {book.level}
            </AppText>
          </View>
          <AppText weight="bold" className={`ml-8 text-[24px] ${isLightMode ? "text-[#363636]" : "text-[rgba(255,255,255,0.7)]"}`}>
            {book.chapters} chương
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
  const { session } = useSession();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }
    api
      .getBooks()
      .then(setBooks)
      .catch((error) => Alert.alert("Không tải được sách", error instanceof Error ? error.message : "Đã có lỗi xảy ra."));
  }, [session]);

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
        {books.map((book) => (
          <BookItem key={book.id} isLightMode={isLightMode} book={book} />
        ))}
      </View>
    </SafeAreaView>
  );
}
