import { AppText, KeyboardAvoidingSheet } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api, type Card, type Deck } from "@/services/api";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PracticeCardProps = {
  word: string;
  reading: string;
  isLightMode: boolean;
  onPress: () => void;
};

function PracticeCard({ word, reading, isLightMode, onPress }: PracticeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[172px] rounded-[12px] px-6 py-12 ${isLightMode ? "bg-white shadow-sm" : "bg-[#1E293B]"}`}
    >
      <View className="items-center">
        <AppText
          weight="bold"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className={`px-1 text-center text-[40px] leading-[46px] ${isLightMode ? "text-black" : "text-[#F8FAFC]"}`}
        >
          {word}
        </AppText>
        {reading ? (
          <AppText className={`mt-1 text-[14px] ${isLightMode ? "text-[#5974A6]" : "text-white"}`}>{reading}</AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function FlashcardsPracticeScreen() {
  const { isLightMode } = useThemeMode();
  const { session } = useSession();
  const { deckId: deckIdParam } = useLocalSearchParams<{ deckId?: string }>();
  const deckIdFromRoute =
    typeof deckIdParam === "string" ? deckIdParam : Array.isArray(deckIdParam) ? deckIdParam[0] : undefined;
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isShareEnabled, setIsShareEnabled] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [vocabulary, setVocabulary] = useState("");
  const [phonetic, setPhonetic] = useState("Tự động điền");
  const [meaning, setMeaning] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [editVocabulary, setEditVocabulary] = useState("");
  const [editPhonetic, setEditPhonetic] = useState("");
  const [editMeaning, setEditMeaning] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }

    const loadDeck = async () => {
      try {
        const decks = await api.getDecks(session.userId);
        if (decks.length === 0) {
          setDeck(null);
          return;
        }
        const pick =
          deckIdFromRoute && decks.some((d) => d.id === deckIdFromRoute)
            ? decks.find((d) => d.id === deckIdFromRoute)!
            : decks[0];
        setDeck(pick);
        setIsShareEnabled(Boolean(pick.shareEnabled));
        setShareLink(pick.shareLink ?? "");
      } catch (error) {
        Alert.alert("Không tải được flashcards", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
      }
    };

    loadDeck();
  }, [session, deckIdFromRoute]);

  const cards = useMemo(() => deck?.cards ?? [], [deck]);

  const closeAllModals = () => {
    setShowShareModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
  };

  const refreshDeck = async () => {
    if (!session) return;
    const decks = await api.getDecks(session.userId);
    if (decks.length === 0) {
      setDeck(null);
      return;
    }
    const currentId = deck?.id;
    const pick =
      currentId && decks.some((d) => d.id === currentId)
        ? decks.find((d) => d.id === currentId)!
        : deckIdFromRoute && decks.some((d) => d.id === deckIdFromRoute)
          ? decks.find((d) => d.id === deckIdFromRoute)!
          : decks[0];
    setDeck(pick);
    setIsShareEnabled(Boolean(pick.shareEnabled));
    setShareLink(pick.shareLink ?? "");
  };

  const openEditCard = (card: Card) => {
    closeAllModals();
    setSelectedCard(card);
    setEditVocabulary(card.vocabulary);
    setEditPhonetic(card.phonetic);
    setEditMeaning(card.meaning);
    setShowEditModal(true);
  };

  const handleCreateCard = async () => {
    if (!session || !deck) return;
    try {
      await api.createCard(session.userId, deck.id, {
        vocabulary,
        phonetic,
        meaning,
        imageUrl: null,
      });
      setVocabulary("");
      setPhonetic("Tự động điền");
      setMeaning("");
      setShowCreateModal(false);
      await refreshDeck();
    } catch (error) {
      Alert.alert("Không thể thêm thẻ", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  const handleUpdateCard = async () => {
    if (!session || !deck || !selectedCard) return;
    try {
      await api.updateCard(session.userId, deck.id, selectedCard.id, {
        vocabulary: editVocabulary,
        phonetic: editPhonetic,
        meaning: editMeaning,
      });
      setShowEditModal(false);
      await refreshDeck();
    } catch (error) {
      Alert.alert("Không thể sửa thẻ", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  const toggleShare = async (enabled: boolean) => {
    if (!session || !deck) return;
    try {
      const result = await api.setDeckShare(session.userId, deck.id, enabled);
      setIsShareEnabled(result.shareEnabled);
      setShareLink(result.shareLink ?? "");
    } catch (error) {
      Alert.alert("Không thể cập nhật chia sẻ", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  return (
    <SafeAreaView className={`relative flex-1 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className={`border-b px-4 pb-4 pt-1 ${isLightMode ? "border-[#D4D4D8]" : "border-[#CBD5E133]"}`}>
        <View className="flex-row items-center">
          <Pressable className="mr-2 p-1" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={isLightMode ? "#0F172A" : "#1E293B"} />
          </Pressable>

          <View className="mr-auto">
            <AppText weight="bold" className={`text-[30px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>
              {deck?.title ?? "Flashcards"}
            </AppText>
            <AppText className={`-mt-1 text-[13px] ${isLightMode ? "text-[#738CB4]" : "text-[#F8FAFC]"}`}>
              {cards.length} thẻ
            </AppText>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#10B981]"
              onPress={() => {
                if (!deck) return;
                router.push({ pathname: "/flashcards-quiz", params: { deckId: deck.id } });
              }}
            >
              <Ionicons name="play" size={18} color="white" />
            </Pressable>
            <Pressable
              className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#3B82F6]"
              onPress={() => {
                closeAllModals();
                setShowCreateModal(true);
              }}
            >
              <Ionicons name="add" size={22} color="white" />
            </Pressable>
            <Pressable
              className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#8B5CF6]"
              onPress={() => {
                closeAllModals();
                setShowShareModal(true);
              }}
            >
              <Feather name="share-2" size={18} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="px-5 py-4">
        <View
          className={`h-[52px] flex-row items-center rounded-[12px] px-4 ${
            isLightMode ? "border border-[#D9E1EE] bg-white shadow-sm" : "bg-[#141E37]"
          }`}
        >
          <Feather name="search" size={17} color={isLightMode ? "#8BA1C4" : "white"} />
          <AppText className={`ml-3 text-[14px] ${isLightMode ? "text-[#A1B2CF]" : "text-[#F8FAFC]"}`}>
            Tìm từ vựng, nghĩa hoặc âm đọc...
          </AppText>
        </View>
      </View>

      <View className={`flex-1 px-5 pt-5 ${isLightMode ? "bg-[#F8FBFF]" : "bg-[#141E37]"}`}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View className="gap-6">
            {cards.map((card) => (
              <PracticeCard
                key={card.id}
                word={card.vocabulary}
                reading={card.phonetic ? `/${card.phonetic}/` : ""}
                isLightMode={isLightMode}
                onPress={() => openEditCard(card)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {showShareModal && !isShareEnabled && (
        <KeyboardAvoidingSheet visible onBackdropPress={closeAllModals}>
        <View className="rounded-t-[20px] bg-white px-6 pb-12 pt-9">
          <AppText weight="bold" className="text-[24px] text-black">
            Chia sẻ bộ thẻ
          </AppText>
          <AppText weight="semibold" className="mt-4 text-center text-[16px] text-[#343434]">
            Bạn có muốn bật chia sẻ qua link?
          </AppText>
          <AppText className="mt-3 text-center text-[16px] leading-[24px] text-[#474545]">
            Sau khi bật bất kỳ ai có link đều có thể xem và luyện thi bộ đề này
          </AppText>
          <View className="mt-8 flex-row justify-between gap-4">
            <Pressable
              className="h-[53px] flex-1 items-center justify-center rounded-[10px] bg-[#E0E0E0]"
              onPress={closeAllModals}
            >
              <AppText weight="semibold" className="text-[16px] text-black">
                Huỷ
              </AppText>
            </Pressable>
            <Pressable
              className="h-[53px] flex-1 items-center justify-center rounded-[10px] bg-[#10B981]"
              onPress={() => toggleShare(true)}
            >
              <AppText weight="semibold" className="text-[16px] text-white">
                Đồng ý bật chia sẻ
              </AppText>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingSheet>
      )}

      {showShareModal && isShareEnabled && (
        <KeyboardAvoidingSheet visible onBackdropPress={closeAllModals}>
        <View className="rounded-t-[20px] bg-white px-6 pb-7 pt-8">
          <AppText weight="bold" className="text-[24px] text-black">
            Chia sẻ bộ thẻ
          </AppText>
          <AppText weight="bold" className="mt-4 text-center text-[14px] text-[#5FAD8E]">
            Bộ thẻ đang được chia sẻ qua link
          </AppText>
          <AppText weight="semibold" className="mt-2 text-center text-[14px] text-[#96A2B3]">
            Ai có link đều có thể xem và luyện thi bộ này
          </AppText>

          <View className="mt-5 rounded-[10px] bg-[#F3F4F6] p-4">
            <AppText weight="bold" className="text-center text-[14px] leading-[20px] text-[#72757F]" numberOfLines={3}>
              {shareLink}
            </AppText>
          </View>

          <Pressable className="mt-7 h-[50px] items-center justify-center rounded-[15px] bg-[#3B82F6]">
            <AppText weight="semibold" className="text-[16px] text-white">
              Copy link chia sẻ
            </AppText>
          </Pressable>
          <Pressable
            className="mt-4 h-[50px] items-center justify-center rounded-[15px] bg-[#EF4444]"
            onPress={() => toggleShare(false)}
          >
            <AppText weight="semibold" className="text-[16px] text-white">
              Huỷ chia sẻ
            </AppText>
          </Pressable>
          <Pressable className="mt-4 items-center py-3" onPress={closeAllModals}>
            <AppText weight="semibold" className="text-[16px] text-[#8390A3]">
              Đóng
            </AppText>
          </Pressable>
        </View>
        </KeyboardAvoidingSheet>
      )}

      {showCreateModal && (
        <KeyboardAvoidingSheet visible onBackdropPress={closeAllModals}>
        <View className="rounded-t-[20px] bg-white px-5 pb-4 pt-6">
          <View className="flex-row items-center justify-between">
            <AppText weight="bold" className="text-[30px] text-[#181818]">
              Add Flashcard
            </AppText>
            <Pressable onPress={closeAllModals}>
              <Ionicons name="close" size={23} color="#0F172A" />
            </Pressable>
          </View>

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Vocabulary *
          </AppText>
          <TextInput
            value={vocabulary}
            onChangeText={setVocabulary}
            placeholder="Nhập romaji, kanji hoặc hiragana (vsd: kaihatsu)"
            placeholderTextColor="#9CA3AF"
            className="mt-2 h-[47px] rounded-[10px] border border-[#F1F5F9] bg-[#F8F8F8] px-3 text-[16px] text-[#334155]"
          />

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Phonetic (Hiragana)
          </AppText>
          <TextInput
            value={phonetic}
            onChangeText={setPhonetic}
            className="mt-2 h-[47px] rounded-[10px] border border-[#F1F5F9] bg-[#F8F8F8] px-3 text-[16px] text-[#334155]"
          />

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Meaning *
          </AppText>
          <TextInput
            value={meaning}
            onChangeText={setMeaning}
            placeholder="Enter the meaning"
            placeholderTextColor="#9CA3AF"
            multiline
            className="mt-2 h-[93px] rounded-[10px] border border-[#F1F5F9] bg-[#F8F8F8] px-3 py-3 text-[16px] text-[#334155]"
          />

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Illustrative Image
          </AppText>
          <Pressable className="mt-2 h-[93px] items-center justify-center rounded-[10px] border-2 border-dashed border-[#3A96FF] bg-[#F8F8F8]">
            <Ionicons name="image-outline" size={22} color="#4090FF" />
            <AppText weight="bold" className="mt-1 text-[13px] text-[#4090FF]">
              Tap to add image
            </AppText>
          </Pressable>

          <View className="mt-6 flex-row gap-4">
            <Pressable className="h-[43px] flex-1 items-center justify-center rounded-[10px] bg-[#E0E0E0]" onPress={closeAllModals}>
              <AppText weight="semibold" className="text-[16px] text-black">
                Cancel
              </AppText>
            </Pressable>
            <Pressable className="h-[43px] flex-1 items-center justify-center rounded-[10px] bg-[#007BFF]" onPress={handleCreateCard}>
              <AppText weight="semibold" className="text-[16px] text-white">
                Create
              </AppText>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingSheet>
      )}

      {showEditModal && (
        <KeyboardAvoidingSheet visible onBackdropPress={closeAllModals}>
        <View className="rounded-t-[20px] bg-white px-5 pb-4 pt-6">
          <View className="flex-row items-center justify-between">
            <AppText weight="bold" className="text-[30px] text-[#181818]">
              Edit Flashcard
            </AppText>
            <Pressable onPress={closeAllModals}>
              <Ionicons name="close" size={23} color="#0F172A" />
            </Pressable>
          </View>

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Vocabulary *
          </AppText>
          <TextInput
            value={editVocabulary}
            onChangeText={setEditVocabulary}
            className="mt-2 h-[47px] rounded-[10px] border border-[#F1F5F9] bg-[#F8F8F8] px-3 text-[16px] text-[#334155]"
          />

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Phonetic (Hiragana)
          </AppText>
          <TextInput
            value={editPhonetic}
            onChangeText={setEditPhonetic}
            className="mt-2 h-[47px] rounded-[10px] border border-[#F1F5F9] bg-[#F8F8F8] px-3 text-[16px] text-[#334155]"
          />

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Meaning *
          </AppText>
          <TextInput
            value={editMeaning}
            onChangeText={setEditMeaning}
            multiline
            className="mt-2 h-[93px] rounded-[10px] border border-[#F1F5F9] bg-[#F8F8F8] px-3 py-3 text-[16px] text-[#334155]"
          />

          <AppText weight="bold" className="mt-4 text-[20px] text-black">
            Illustrative Image
          </AppText>
          <Pressable className="mt-2 h-[93px] items-center justify-center rounded-[10px] border-2 border-dashed border-[#3A96FF] bg-[#F8F8F8]">
            <Ionicons name="image-outline" size={22} color="#4090FF" />
            <AppText weight="bold" className="mt-1 text-[13px] text-[#4090FF]">
              Tap to add image
            </AppText>
          </Pressable>

          <View className="mt-6 flex-row gap-4">
            <Pressable className="h-[43px] flex-1 items-center justify-center rounded-[10px] bg-[#E0E0E0]" onPress={closeAllModals}>
              <AppText weight="semibold" className="text-[16px] text-black">
                Cancel
              </AppText>
            </Pressable>
            <Pressable className="h-[43px] flex-1 items-center justify-center rounded-[10px] bg-[#007BFF]" onPress={handleUpdateCard}>
              <AppText weight="semibold" className="text-[16px] text-white">
                Change
              </AppText>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingSheet>
      )}
    </SafeAreaView>
  );
}
