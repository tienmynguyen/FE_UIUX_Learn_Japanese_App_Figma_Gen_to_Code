import { AppText } from "@/components";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
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
  const [isShareEnabled, setIsShareEnabled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [vocabulary, setVocabulary] = useState("");
  const [phonetic, setPhonetic] = useState("Tự động điền");
  const [meaning, setMeaning] = useState("");
  const [editVocabulary, setEditVocabulary] = useState("手法");
  const [editPhonetic, setEditPhonetic] = useState("しゅほう");
  const [editMeaning, setEditMeaning] = useState("Phương Pháp");
  const shareLink = "htt://yourdomain.com/flashcards/7959934329r92f82342?seltd=284fsj4hheee41324455611";

  const closeAllModals = () => {
    setShowShareModal(false);
    setShowCreateModal(false);
    setShowEditModal(false);
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
              29/03
            </AppText>
            <AppText className={`-mt-1 text-[13px] ${isLightMode ? "text-[#738CB4]" : "text-[#F8FAFC]"}`}>62 thẻ</AppText>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#10B981]"
              onPress={() => router.push("/flashcards-quiz")}
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
            <PracticeCard
              word="手法"
              reading="/しゅほう/"
              isLightMode={isLightMode}
              onPress={() => {
                closeAllModals();
                setShowEditModal(true);
              }}
            />
            <PracticeCard
              word="階層的な"
              reading="/かいそうてきな/"
              isLightMode={isLightMode}
              onPress={() => {
                closeAllModals();
                setShowEditModal(true);
              }}
            />
            <PracticeCard
              word="オブジェクト指向"
              reading=""
              isLightMode={isLightMode}
              onPress={() => {
                closeAllModals();
                setShowEditModal(true);
              }}
            />
          </View>
        </ScrollView>
      </View>

      {(showShareModal || showCreateModal || showEditModal) && (
        <Pressable className="absolute inset-0 bg-black/70" onPress={closeAllModals} />
      )}

      {showShareModal && !isShareEnabled && (
        <View className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-white px-6 pb-12 pt-9">
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
              onPress={() => setIsShareEnabled(true)}
            >
              <AppText weight="semibold" className="text-[16px] text-white">
                Đồng ý bật chia sẻ
              </AppText>
            </Pressable>
          </View>
        </View>
      )}

      {showShareModal && isShareEnabled && (
        <View className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-white px-6 pb-7 pt-8">
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
            <AppText weight="bold" className="text-center text-[14px] leading-[20px] text-[#72757F]">
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
            onPress={() => setIsShareEnabled(false)}
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
      )}

      {showCreateModal && (
        <View className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-white px-5 pb-4 pt-6">
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
            <Pressable className="h-[43px] flex-1 items-center justify-center rounded-[10px] bg-[#007BFF]" onPress={closeAllModals}>
              <AppText weight="semibold" className="text-[16px] text-white">
                Create
              </AppText>
            </Pressable>
          </View>
        </View>
      )}

      {showEditModal && (
        <View className="absolute bottom-0 left-0 right-0 rounded-t-[20px] bg-white px-5 pb-4 pt-6">
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
            <Pressable className="h-[43px] flex-1 items-center justify-center rounded-[10px] bg-[#007BFF]" onPress={closeAllModals}>
              <AppText weight="semibold" className="text-[16px] text-white">
                Change
              </AppText>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
