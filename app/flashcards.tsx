import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FlashcardsScreen() {
  const { isLightMode } = useThemeMode();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [title, setTitle] = useState("29/03");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className="px-5 pt-2">
        <View className="flex-row items-center">
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-[10px] bg-[#6366F1]"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>

          <View className="ml-5 flex-1">
            <AppText weight="bold" className={`text-[22px] ${isLightMode ? "text-black" : "text-[#F56666]"}`}>
              {isLightMode ? "BỘ FLASHCARD CỦA TÔI" : "FLASHCARD"}
            </AppText>
            {!isLightMode && <AppText className="text-[14px] text-[#F2AB1B]">Học Từ Vựng Cùng Pan Nào!!!</AppText>}
          </View>

          <View
            className={`ml-auto h-10 w-10 items-center justify-center rounded-full ${
              isLightMode ? "bg-[#EEF2FF]" : "bg-[#1E293B]"
            }`}
          >
            <AppText className="text-[20px]">🦩</AppText>
          </View>
        </View>

        <View className="mt-8 flex-row gap-4">
          <View
            className={`h-[52px] flex-1 justify-center rounded-[10px] px-4 ${
              isLightMode ? "border border-[#CBD5E1] bg-[#F8FAFC]" : "bg-[#141E37]"
            }`}
          >
            <AppText className={`text-[14px] ${isLightMode ? "text-[#94A3B8]" : "text-[#F8FAFC99]"}`}>Tìm theo tiêu đề...</AppText>
          </View>
          <Pressable className="h-[52px] w-[106px] flex-row items-center justify-center rounded-[10px] bg-[#6366F1]">
            <AppText className="text-[14px] text-white">+  Bộ mới</AppText>
          </Pressable>
        </View>
      </View>

      <View className={`mt-3 border-t ${isLightMode ? "border-[#E5E7EB]" : "border-[#CBD5E133]"}`} />

      {!isDeleted && (
        <>
          <View className="mt-3 pt-5">
            <View className="flex-row justify-around">
              <View className="items-center">
                <AppText weight="bold" className="text-[48px] text-[#4F3FF0]">
                  1
                </AppText>
                <AppText className={`text-[18px] ${isLightMode ? "text-[#949494]" : "text-[#F8FAFC]"}`}>Bộ thẻ</AppText>
              </View>
              <View className="items-center">
                <AppText weight="bold" className="text-[48px] text-[#5130E4]">
                  62
                </AppText>
                <AppText className={`text-[18px] ${isLightMode ? "text-[#949494]" : "text-[#F8FAFC]"}`}>Tổng thẻ</AppText>
              </View>
              <View className="items-center">
                <AppText weight="bold" className="text-[48px] text-[#5130E4]">
                  0%
                </AppText>
                <AppText className={`text-[18px] ${isLightMode ? "text-[#949494]" : "text-[#F8FAFC]"}`}>Điểm trung bình</AppText>
              </View>
            </View>
          </View>

          <View className="mt-6 px-5">
            <View className={`rounded-[20px] p-5 ${isLightMode ? "bg-[#EEF0FF]" : "bg-[#1E293B]"}`}>
              <View className="flex-row items-start justify-between">
                <View>
                  <AppText weight="semibold" className={`text-[12px] ${isLightMode ? "text-[#A3A3A3]" : "text-[#F8FAFC]"}`}>
                    29/3/2026
                  </AppText>
                  <AppText
                    weight="semibold"
                    className={`mt-1 text-[32px] leading-[36px] ${isLightMode ? "text-black" : "text-[#F8FAFC]"}`}
                  >
                    {title}
                  </AppText>
                </View>
                <Pressable onPress={() => setShowDeleteModal(true)}>
                  <Ionicons name="trash-outline" size={26} color={isLightMode ? "#A3A3A3" : "white"} />
                </Pressable>
              </View>

              <View className={`mt-5 flex-row items-center justify-between border-t pt-4 ${isLightMode ? "border-[#D4D4D8]" : "border-[#CBD5E133]"}`}>
                <View className="flex-row items-center">
                  <Feather name="menu" size={18} color={isLightMode ? "#A3A3A3" : "white"} />
                  <AppText weight="semibold" className={`ml-2 text-[14px] ${isLightMode ? "text-[#A3A3A3]" : "text-[#F8FAFC]"}`}>
                    62 thẻ
                  </AppText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="play-circle" size={24} color={isLightMode ? "#A3A3A3" : "white"} />
                  <AppText weight="semibold" className={`ml-2 text-[14px] ${isLightMode ? "text-[#A3A3A3]" : "text-[#F8FAFC]"}`}>
                    0 lượt
                  </AppText>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="trophy-outline" size={20} color={isLightMode ? "#A3A3A3" : "white"} />
                  <AppText weight="semibold" className={`ml-2 text-[14px] ${isLightMode ? "text-[#A3A3A3]" : "text-[#F8FAFC]"}`}>
                    0%
                  </AppText>
                </View>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <Pressable className="flex-row items-center" onPress={() => setShowEditModal(true)}>
                  <Feather name="edit-2" size={18} color="#4F3FF0" />
                  <AppText weight="bold" className="ml-2 text-[15px] text-[#4F3FF0]">
                    Sửa
                  </AppText>
                </Pressable>

                <Pressable
                  className="h-[38px] w-[110px] items-center justify-center rounded-full bg-[#4F3FF0]"
                  onPress={() => router.push("/flashcards-practice")}
                >
                  <AppText weight="bold" className="text-[14px] text-white">
                    Luyện thi
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}

      {showEditModal && (
        <>
          <Pressable
            className="absolute inset-0"
            style={{ backgroundColor: isLightMode ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)" }}
            onPress={() => setShowEditModal(false)}
          />
          <View
            className={`absolute bottom-0 left-[2px] right-0 rounded-t-[24px] px-6 pb-6 pt-6 ${
              isLightMode ? "border border-[#D1D5DB] bg-white" : "bg-black"
            }`}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <AppText weight="bold" className={`text-[22px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                Chỉnh sửa bộ flashcard
              </AppText>
              <Pressable onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={isLightMode ? "#0F172A" : "white"} />
              </Pressable>
            </View>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={isLightMode ? "#94A3B8" : "#FFFFFF"}
              className={`h-[43px] rounded-[8px] border px-4 text-[16px] ${
                isLightMode ? "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]" : "border-[#CBD5E1] bg-[#1E293B] text-white"
              }`}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả (tuỳ chọn)"
              placeholderTextColor={isLightMode ? "#94A3B8" : "#FFFFFF"}
              multiline
              className={`mt-4 h-[100px] rounded-[8px] border px-4 py-3 text-[16px] ${
                isLightMode ? "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]" : "border-[#CBD5E1] bg-[#1E293B] text-white"
              }`}
            />

            <View className="mt-6 flex-row gap-5">
              <Pressable
                className={`h-[37px] flex-1 items-center justify-center rounded-[8px] ${
                  isLightMode ? "bg-[#E2E8F0]" : "bg-[#1E293B]"
                }`}
                onPress={() => setShowEditModal(false)}
              >
                <AppText weight="semibold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                  Hủy
                </AppText>
              </Pressable>
              <Pressable
                className="h-[37px] flex-1 items-center justify-center rounded-[8px] bg-[#3B82F6]"
                onPress={() => setShowEditModal(false)}
              >
                <AppText weight="semibold" className="text-[16px] text-white">
                  Lưu
                </AppText>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {showDeleteModal && (
        <>
          <Pressable
            className="absolute inset-0"
            style={{ backgroundColor: isLightMode ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)" }}
            onPress={() => setShowDeleteModal(false)}
          />
          <View
            className={`absolute left-[68px] right-[69px] top-[333px] rounded-[20px] p-5 ${
              isLightMode ? "border border-[#D1D5DB] bg-white" : "bg-black"
            }`}
          >
            <View className="items-center">
              <Ionicons name="warning" size={48} color="#EF4444" />
              <AppText weight="bold" className={`mt-3 text-[24px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                Xóa bộ flashcard?
              </AppText>
              <AppText className={`mt-1 text-center text-[14px] ${isLightMode ? "text-[#475569]" : "text-white"}`}>
                Hành động này không thể hoàn tác.
              </AppText>
            </View>
            <View className="mt-5 flex-row gap-4">
              <Pressable
                className={`h-[37px] flex-1 items-center justify-center rounded-[8px] ${
                  isLightMode ? "bg-[#E2E8F0]" : "bg-[#1E293B]"
                }`}
                onPress={() => setShowDeleteModal(false)}
              >
                <AppText weight="semibold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                  Hủy
                </AppText>
              </Pressable>
              <Pressable
                className="h-[37px] flex-1 items-center justify-center rounded-[8px] bg-[#EF4444]"
                onPress={() => {
                  setShowDeleteModal(false);
                  setIsDeleted(true);
                }}
              >
                <AppText weight="semibold" className="text-[16px] text-white">
                  Xóa
                </AppText>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
