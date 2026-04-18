import { AppText } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api, type Card } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_QUIZ_QUESTIONS = 15;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  }
  return a;
}

function optionLabel(c: Card): string {
  const m = c.meaning?.trim();
  if (m) return m;
  const p = c.phonetic?.trim();
  if (p && p !== "Tự động điền") return p;
  return c.vocabulary;
}

const PAD_WRONG = ["(Không phải nghĩa này)", "(Phương án khác)", "(Không đúng)"];

type QuizQuestion = {
  prompt: string;
  reading: string;
  options: string[];
  correctIndex: number;
};

function buildQuestionForCard(cards: Card[], correct: Card): QuizQuestion | null {
  const correctMeaning = optionLabel(correct);
  const others = cards.filter((c) => c.id !== correct.id);
  const wrongPool = shuffle(others).map(optionLabel);
  const wrongs: string[] = [];
  for (const label of wrongPool) {
    if (label !== correctMeaning && !wrongs.includes(label)) wrongs.push(label);
    if (wrongs.length >= 3) break;
  }
  let padI = 0;
  while (wrongs.length < 3 && padI < 40) {
    const pad = `${PAD_WRONG[padI % PAD_WRONG.length]!} ·${padI}`;
    if (!wrongs.includes(pad) && pad !== correctMeaning) wrongs.push(pad);
    padI++;
  }
  while (wrongs.length < 3) {
    wrongs.push(`#${wrongs.length + 1}`);
  }
  const combined = shuffle([correctMeaning, ...wrongs.slice(0, 3)]);
  const correctIndex = combined.indexOf(correctMeaning);
  if (correctIndex < 0) return null;
  const reading = correct.phonetic?.trim() && correct.phonetic !== "Tự động điền" ? correct.phonetic : "";
  return { prompt: correct.vocabulary, reading, options: combined, correctIndex };
}

function buildQuizQuestions(allCards: Card[]): QuizQuestion[] {
  if (allCards.length === 0) return [];
  const n = Math.min(allCards.length, MAX_QUIZ_QUESTIONS);
  const order = shuffle([...allCards]).slice(0, n);
  const out: QuizQuestion[] = [];
  for (const card of order) {
    const q = buildQuestionForCard(allCards, card);
    if (q) out.push(q);
  }
  return out;
}

export default function FlashcardsQuizScreen() {
  const { isLightMode } = useThemeMode();
  const { session } = useSession();
  const { deckId: deckIdParam } = useLocalSearchParams<{ deckId?: string }>();
  const deckId = typeof deckIdParam === "string" ? deckIdParam : Array.isArray(deckIdParam) ? deckIdParam[0] : undefined;

  const [cards, setCards] = useState<Card[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = quizQuestions[currentIndex] ?? null;
  const quizLength = quizQuestions.length;
  const correctIndex = question?.correctIndex ?? -1;

  const userId = session?.userId;

  const loadCards = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const decks = await api.getDecks(userId);
      const pick =
        deckId && decks.length > 0 ? decks.find((d) => d.id === deckId) ?? decks[0] : decks[0] ?? null;
      if (!pick) {
        setCards([]);
        setQuizQuestions([]);
        return;
      }
      setCards(pick.cards);
      const qs = buildQuizQuestions(pick.cards);
      setQuizQuestions(qs);
      setCurrentIndex(0);
      setCorrectCount(0);
      setSelectedIndex(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Đã có lỗi xảy ra.");
      setCards([]);
      setQuizQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [userId, deckId]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }
    void loadCards();
  }, [session, loadCards]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const displayScorePercent =
    quizLength === 0
      ? 0
      : selectedIndex === null
        ? Math.round((correctCount / quizLength) * 100)
        : Math.round(((correctCount + (selectedIndex === correctIndex ? 1 : 0)) / quizLength) * 100);

  const goToResult = useCallback(
    (finalCorrect: number) => {
      const percent = quizLength > 0 ? Math.round((finalCorrect / quizLength) * 100) : 0;
      const result = finalCorrect === quizLength ? "success" : percent >= 70 ? "success" : "fail";
      void api.submitQuiz(result === "success" ? 0 : 1).catch(() => undefined);
      router.push({
        pathname: "/flashcards-quiz-result",
        params: {
          result,
          correct: String(finalCorrect),
          total: String(quizLength),
          percent: String(percent),
        },
      });
    },
    [quizLength]
  );

  const handleSelect = (index: number) => {
    if (selectedIndex !== null || !question || quizLength === 0) return;
    setSelectedIndex(index);
    const isCorrect = index === correctIndex;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);

    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      if (currentIndex < quizLength - 1) {
        setCorrectCount(nextCorrect);
        setCurrentIndex((i) => i + 1);
        setSelectedIndex(null);
      } else {
        goToResult(nextCorrect);
      }
    }, 900);
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
        <StatusBar style={isLightMode ? "dark" : "light"} />
        <ActivityIndicator size="large" color="#60A5FA" />
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView className={`flex-1 px-6 pt-16 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
        <StatusBar style={isLightMode ? "dark" : "light"} />
        <AppText className={isLightMode ? "text-black" : "text-white"}>{loadError}</AppText>
        <Pressable className="mt-6" onPress={() => router.back()}>
          <AppText className="text-[#60A5FA]">Quay lại</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (cards.length === 0 || !question || quizLength === 0) {
    return (
      <SafeAreaView className={`flex-1 px-6 pt-16 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
        <StatusBar style={isLightMode ? "dark" : "light"} />
        <AppText weight="bold" className={`text-[18px] ${isLightMode ? "text-black" : "text-[#F8FAFC]"}`}>
          Cần ít nhất 1 thẻ trong bộ để làm quiz
        </AppText>
        <AppText className={`mt-2 text-[14px] ${isLightMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
          Thêm thẻ ở màn luyện tập, rồi quay lại đây.
        </AppText>
        <Pressable className="mt-8" onPress={() => router.back()}>
          <AppText className="text-[#60A5FA]">Quay lại</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className="px-5 pt-5">
        <View className="flex-row items-center justify-between">
          <AppText weight="bold" className={`text-[16px] ${isLightMode ? "text-black" : "text-[#F8FAFC]"}`}>
            Câu {currentIndex + 1}/{quizLength}
          </AppText>
          <AppText weight="bold" className={`text-[14px] ${isLightMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
            {cards.length > MAX_QUIZ_QUESTIONS
              ? `${quizLength}/${cards.length} từ`
              : `${quizLength} câu`}
          </AppText>
        </View>
      </View>

      <View className={`mx-[42px] mt-8 rounded-[20px] px-7 pb-7 pt-9 ${isLightMode ? "bg-[#EEF0FF]" : "bg-[#141E37]"}`}>
        <AppText
          weight="bold"
          className={`text-center text-[48px] tracking-[1px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}
          adjustsFontSizeToFit
          numberOfLines={2}
        >
          {question.prompt}
        </AppText>
        {question.reading ? (
          <AppText className={`mt-2 text-center text-[16px] ${isLightMode ? "text-[#5974A6]" : "text-[#94A3B8]"}`}>
            {question.reading}
          </AppText>
        ) : null}

        <View className="mt-8 gap-5">
          {question.options.map((item, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectSelection = isSelected && index === correctIndex;
            const isWrongSelection = isSelected && index !== correctIndex;

            return (
              <Pressable
                key={`${currentIndex}-${item}-${index}`}
                onPress={() => handleSelect(index)}
                className={`min-h-[82px] items-center justify-center rounded-[12px] border px-2 ${
                  isCorrectSelection
                    ? "border-[#334155] bg-[#065F46]"
                    : isWrongSelection
                      ? isLightMode
                        ? "border-[#1E3A8A] bg-[#EF4444]"
                        : "border-[#334155] bg-[#9A3412]"
                      : isLightMode
                        ? "border-[#1E3A8A] bg-white"
                        : "border-[#334155] bg-[#1E293B]"
                }`}
              >
                <AppText
                  weight="medium"
                  className={`text-center text-[15px] leading-[20px] ${
                    isLightMode && !isCorrectSelection && !isWrongSelection ? "text-black" : "text-white"
                  }`}
                >
                  {item}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-auto items-center pb-6">
        <AppText weight="bold" className="text-[18px] text-[#60A5FA]">
          Đúng: {correctCount + (selectedIndex !== null && selectedIndex === correctIndex ? 1 : 0)}/{quizLength}
        </AppText>
        <AppText className={`mt-1 text-[14px] ${isLightMode ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
          Tỉ lệ: {displayScorePercent}%
        </AppText>
      </View>

      <Pressable className="absolute left-4 top-12 h-10 w-10 justify-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
      </Pressable>
    </SafeAreaView>
  );
}
