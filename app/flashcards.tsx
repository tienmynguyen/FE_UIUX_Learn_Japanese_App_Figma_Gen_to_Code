import { AppText, KeyboardAvoidingSheet } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api, type Deck } from "@/services/api";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDeckDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])}/${Number(m[2])}/${m[1]}`;
}

export default function FlashcardsScreen() {
  const { isLightMode } = useThemeMode();
  const { session } = useSession();
  const { createDeck: createDeckParam } = useLocalSearchParams<{ createDeck?: string }>();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [newDeckLevel, setNewDeckLevel] = useState("N5");

  const totalCards = useMemo(() => decks.reduce((n, d) => n + d.cards.length, 0), [decks]);

  useEffect(() => {
    if (createDeckParam === "1" || createDeckParam === "true") {
      setShowCreateModal(true);
    }
  }, [createDeckParam]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }

    const loadDecks = async () => {
      try {
        const list = await api.getDecks(session.userId);
        setDecks(list);
      } catch (error) {
        Alert.alert("Không tải được flashcards", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
      }
    };

    void loadDecks();
  }, [session]);

  const openEditModal = (deck: Deck) => {
    setEditingDeck(deck);
    setTitle(deck.title);
    setDescription(deck.description);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingDeck(null);
  };

  const saveDeck = async () => {
    if (!session || !editingDeck) return;
    try {
      const updated = await api.updateDeck(session.userId, editingDeck.id, { title, description });
      setDecks((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      closeEditModal();
    } catch (error) {
      Alert.alert("Không thể lưu", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  const openDeleteModal = (deck: Deck) => {
    setEditingDeck(deck);
    setShowDeleteModal(true);
  };

  const removeDeck = async () => {
    if (!session || !editingDeck) return;
    try {
      await api.deleteDeck(session.userId, editingDeck.id);
      const list = await api.getDecks(session.userId);
      setDecks(list);
      setShowDeleteModal(false);
      setEditingDeck(null);
    } catch (error) {
      Alert.alert("Không thể xóa", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  const handleCreateDeck = async () => {
    if (!session) return;
    const t = newDeckTitle.trim();
    if (!t) {
      Alert.alert("Thiếu tiêu đề", "Nhập tên bộ flashcard.");
      return;
    }
    try {
      await api.createDeck(session.userId, {
        title: t,
        description: newDeckDescription.trim(),
        level: newDeckLevel.trim() || "N5",
      });
      setNewDeckTitle("");
      setNewDeckDescription("");
      setNewDeckLevel("N5");
      setShowCreateModal(false);
      const list = await api.getDecks(session.userId);
      setDecks(list);
    } catch (error) {
      Alert.alert("Không thể tạo bộ", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

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
          <Pressable
            className="h-[52px] w-[106px] flex-row items-center justify-center rounded-[10px] bg-[#6366F1]"
            onPress={() => setShowCreateModal(true)}
          >
            <AppText className="text-[14px] text-white">+  Bộ mới</AppText>
          </Pressable>
        </View>
      </View>

      <View className={`mt-3 border-t ${isLightMode ? "border-[#E5E7EB]" : "border-[#CBD5E133]"}`} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {decks.length > 0 ? (
          <>
            <View className="mt-3 pt-5">
              <View className="flex-row justify-around">
                <View className="items-center">
                  <AppText weight="bold" className="text-[48px] text-[#4F3FF0]">
                    {decks.length}
                  </AppText>
                  <AppText className={`text-[18px] ${isLightMode ? "text-[#949494]" : "text-[#F8FAFC]"}`}>Bộ thẻ</AppText>
                </View>
                <View className="items-center">
                  <AppText weight="bold" className="text-[48px] text-[#5130E4]">
                    {totalCards}
                  </AppText>
                  <AppText className={`text-[18px] ${isLightMode ? "text-[#949494]" : "text-[#F8FAFC]"}`}>Tổng thẻ</AppText>
                </View>
                <View className="items-center">
                  <AppText weight="bold" className="text-[48px] text-[#5130E4]">
                    0%
                  </AppText>
                  <AppText className={`text-[18px] ${isLightMode ? "text-[#949494]" : "text-[#F8FAFC]"}`}>Điểm TB</AppText>
                </View>
              </View>
            </View>

            {decks.map((deck) => (
              <View key={deck.id} className="mt-6 px-5">
                <View className={`rounded-[20px] p-5 ${isLightMode ? "bg-[#EEF0FF]" : "bg-[#1E293B]"}`}>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <AppText
                        weight="semibold"
                        className={`text-[12px] ${isLightMode ? "text-[#A3A3A3]" : "text-[#F8FAFC]"}`}
                      >
                        {formatDeckDate(deck.createdDate)}
                      </AppText>
                      <AppText
                        weight="semibold"
                        className={`mt-1 text-[32px] leading-[36px] ${isLightMode ? "text-black" : "text-[#F8FAFC]"}`}
                      >
                        {deck.title}
                      </AppText>
                      <AppText className={`mt-1 text-[13px] ${isLightMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
                        {deck.level} · {deck.description || "Không có mô tả"}
                      </AppText>
                    </View>
                    <Pressable onPress={() => openDeleteModal(deck)}>
                      <Ionicons name="trash-outline" size={26} color={isLightMode ? "#A3A3A3" : "white"} />
                    </Pressable>
                  </View>

                  <View
                    className={`mt-5 flex-row items-center justify-between border-t pt-4 ${isLightMode ? "border-[#D4D4D8]" : "border-[#CBD5E133]"}`}
                  >
                    <View className="flex-row items-center">
                      <Feather name="menu" size={18} color={isLightMode ? "#A3A3A3" : "white"} />
                      <AppText weight="semibold" className={`ml-2 text-[14px] ${isLightMode ? "text-[#A3A3A3]" : "text-[#F8FAFC]"}`}>
                        {deck.cards.length} thẻ
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
                    <Pressable className="flex-row items-center" onPress={() => openEditModal(deck)}>
                      <Feather name="edit-2" size={18} color="#4F3FF0" />
                      <AppText weight="bold" className="ml-2 text-[15px] text-[#4F3FF0]">
                        Sửa
                      </AppText>
                    </Pressable>

                    <Pressable
                      className="h-[38px] w-[110px] items-center justify-center rounded-full bg-[#4F3FF0]"
                      onPress={() => router.push({ pathname: "/flashcards-practice", params: { deckId: deck.id } })}
                    >
                      <AppText weight="bold" className="text-[14px] text-white">
                        Luyện thi
                      </AppText>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View className="mt-16 items-center px-8">
            <AppText className={`text-center text-[16px] ${isLightMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
              Chưa có bộ flashcard. Nhấn &quot;+ Bộ mới&quot; để tạo bộ đầu tiên.
            </AppText>
          </View>
        )}
      </ScrollView>

      {showEditModal && editingDeck && (
        <KeyboardAvoidingSheet visible onBackdropPress={closeEditModal}>
          <View
            className={`rounded-t-[24px] px-6 pb-6 pt-6 ${
              isLightMode ? "border border-[#D1D5DB] bg-white" : "bg-black"
            }`}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <AppText weight="bold" className={`text-[22px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                Chỉnh sửa bộ flashcard
              </AppText>
              <Pressable onPress={closeEditModal}>
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
                onPress={closeEditModal}
              >
                <AppText weight="semibold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                  Hủy
                </AppText>
              </Pressable>
              <Pressable className="h-[37px] flex-1 items-center justify-center rounded-[8px] bg-[#3B82F6]" onPress={saveDeck}>
                <AppText weight="semibold" className="text-[16px] text-white">
                  Lưu
                </AppText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingSheet>
      )}

      {showCreateModal && (
        <KeyboardAvoidingSheet visible onBackdropPress={() => setShowCreateModal(false)}>
          <View
            className={`rounded-t-[24px] px-6 pb-6 pt-6 ${
              isLightMode ? "border border-[#D1D5DB] bg-white" : "bg-black"
            }`}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <AppText weight="bold" className={`text-[22px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                Bộ flashcard mới
              </AppText>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={isLightMode ? "#0F172A" : "white"} />
              </Pressable>
            </View>

            <TextInput
              value={newDeckTitle}
              onChangeText={setNewDeckTitle}
              placeholder="Tiêu đề (bắt buộc)"
              placeholderTextColor={isLightMode ? "#94A3B8" : "#FFFFFF"}
              className={`h-[43px] rounded-[8px] border px-4 text-[16px] ${
                isLightMode ? "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]" : "border-[#CBD5E1] bg-[#1E293B] text-white"
              }`}
            />
            <TextInput
              value={newDeckDescription}
              onChangeText={setNewDeckDescription}
              placeholder="Mô tả (tuỳ chọn)"
              placeholderTextColor={isLightMode ? "#94A3B8" : "#FFFFFF"}
              multiline
              className={`mt-4 h-[80px] rounded-[8px] border px-4 py-3 text-[16px] ${
                isLightMode ? "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]" : "border-[#CBD5E1] bg-[#1E293B] text-white"
              }`}
            />
            <TextInput
              value={newDeckLevel}
              onChangeText={setNewDeckLevel}
              placeholder="Cấp độ (vd: N5)"
              placeholderTextColor={isLightMode ? "#94A3B8" : "#FFFFFF"}
              className={`mt-4 h-[43px] rounded-[8px] border px-4 text-[16px] ${
                isLightMode ? "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A]" : "border-[#CBD5E1] bg-[#1E293B] text-white"
              }`}
            />

            <View className="mt-6 flex-row gap-5">
              <Pressable
                className={`h-[37px] flex-1 items-center justify-center rounded-[8px] ${
                  isLightMode ? "bg-[#E2E8F0]" : "bg-[#1E293B]"
                }`}
                onPress={() => setShowCreateModal(false)}
              >
                <AppText weight="semibold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                  Hủy
                </AppText>
              </Pressable>
              <Pressable
                className="h-[37px] flex-1 items-center justify-center rounded-[8px] bg-[#6366F1]"
                onPress={() => void handleCreateDeck()}
              >
                <AppText weight="semibold" className="text-[16px] text-white">
                  Tạo bộ
                </AppText>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingSheet>
      )}

      {showDeleteModal && editingDeck && (
        <>
          <Pressable
            className="absolute inset-0"
            style={{ backgroundColor: isLightMode ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)" }}
            onPress={() => {
              setShowDeleteModal(false);
              setEditingDeck(null);
            }}
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
                {editingDeck.title} — hành động này không thể hoàn tác.
              </AppText>
            </View>
            <View className="mt-5 flex-row gap-4">
              <Pressable
                className={`h-[37px] flex-1 items-center justify-center rounded-[8px] ${
                  isLightMode ? "bg-[#E2E8F0]" : "bg-[#1E293B]"
                }`}
                onPress={() => {
                  setShowDeleteModal(false);
                  setEditingDeck(null);
                }}
              >
                <AppText weight="semibold" className={`text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>
                  Hủy
                </AppText>
              </Pressable>
              <Pressable
                className="h-[37px] flex-1 items-center justify-center rounded-[8px] bg-[#EF4444]"
                onPress={() => void removeDeck()}
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
