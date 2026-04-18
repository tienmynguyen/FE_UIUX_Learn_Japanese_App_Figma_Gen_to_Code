import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StepType = "intro" | "multipleChoice" | "kana" | "picture" | "writing";

type Step = {
  id: string;
  type: StepType;
  progress?: number;
  image?: string;
  prompt?: string;
  word?: string;
  options?: string[];
  selectedOption?: number;
  kanaTiles?: string[];
  selectedKana?: string[];
  writingChar?: string;
  showAddToDictionary?: boolean;
  highlightImageIndex?: number;
  showSwipeHint?: boolean;
};

const IMG_CAT = "https://www.figma.com/api/mcp/asset/9e90ea2c-6e00-42b6-8ab1-31e8ecdb8a86";
const IMG_DOG = "https://www.figma.com/api/mcp/asset/0cc8d460-1e60-4974-a682-73f80f257e59";
const IMG_BEAR = "https://www.figma.com/api/mcp/asset/f267581c-9f5f-48e7-9333-11bad3e62f50";
const IMG_RABBIT = "https://www.figma.com/api/mcp/asset/ed2301a2-5966-4514-8b90-1eadd15b677f";
const IMG_DOG_ALT = "https://www.figma.com/api/mcp/asset/6d766b8f-52a6-479d-9c00-cbe237178f6e";

const STEPS: Step[] = [
  { id: "22-1168", type: "intro" },
  {
    id: "22-1188",
    type: "multipleChoice",
    progress: 0.22,
    image: IMG_CAT,
    prompt: "Choose correct answer",
    options: ["犬（いぬ）", "猫（ねこ）", "熊（くま）"],
    selectedOption: 1,
    showSwipeHint: true,
  },
  {
    id: "22-1333",
    type: "kana",
    progress: 0.36,
    image: IMG_CAT,
    prompt: "Choose correct answer",
    kanaTiles: ["い", "ね", "く", "こ"],
    selectedKana: ["ね", "く"],
    showSwipeHint: true,
  },
  {
    id: "22-1226",
    type: "picture",
    progress: 0.54,
    word: "ねこ",
    prompt: "Choose correct picture",
    showSwipeHint: true,
    highlightImageIndex: 0,
  },
  {
    id: "23-661",
    type: "multipleChoice",
    progress: 0.72,
    image: IMG_CAT,
    prompt: "Choose correct answer",
    options: ["犬（いぬ）", "猫（ねこ）", "熊（くま）"],
    selectedOption: 1,
    showSwipeHint: true,
  },
  {
    id: "23-701",
    type: "multipleChoice",
    progress: 1,
    image: IMG_DOG_ALT,
    prompt: "Choose correct answer",
    options: ["犬（いぬ）", "猫（ねこ）", "熊（くま）"],
    selectedOption: 1,
    showSwipeHint: true,
  },
  { id: "22-1258", type: "writing", progress: 0.54, writingChar: "あ", showAddToDictionary: true },
  { id: "22-1286", type: "writing", progress: 0.54, writingChar: "山", showAddToDictionary: true },
  { id: "22-1314", type: "writing", progress: 0.54, writingChar: "山" },
  { id: "23-619", type: "writing", progress: 0.54, writingChar: "外" },
  { id: "23-640", type: "writing", progress: 0.54, writingChar: "精神" },
];

export default function FlashcardsYouCanDoScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const goDashboard = () => router.replace("/dashboard");
  const onNext = () => {
    if (stepIndex === STEPS.length - 1) {
      goDashboard();
      return;
    }
    setStepIndex((prev) => prev + 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#161D2F]">
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-6 pt-3">
        <Text className="text-[24px] font-bold text-black">9:30</Text>
        <Pressable onPress={goDashboard}>
          <Ionicons name="close" size={24} color="black" />
        </Pressable>
      </View>

      <View className="px-8 pt-6">
        <View className="h-[16px] rounded-full bg-[#E5E7EB]">
          <View
            className="h-[16px] rounded-full bg-[#B273FF]"
            style={{ width: `${Math.max(step.progress ?? 0, 0) * 100}%` }}
          />
        </View>
      </View>

      {step.type === "intro" ? (
        <View className="flex-1 px-8 pt-10">
          <View className="rounded-[14px] bg-white px-7 py-8">
            <Text className="text-center text-[38px] font-bold text-black">Are you ready to learn{"\n"}20 questions of WORD?</Text>
            <View className="mt-8 flex-row items-center justify-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FACC15]">
                <Ionicons name="volume-high" size={20} color="black" />
              </View>
              <Text className="ml-4 text-[38px] font-semibold text-black">Sounds on</Text>
            </View>
            <Text className="mt-8 text-center text-[30px] text-black">Plese turn the sounds on for this exercise</Text>
          </View>
          <Pressable className="mt-auto mb-10 h-[63px] items-center justify-center rounded-[10px] bg-[#9747FF]" onPress={onNext}>
            <Text className="text-[24px] font-bold text-white">READY</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-1 px-5 pt-6">
          {step.type !== "writing" && step.image ? (
            <Image source={{ uri: step.image }} className="mx-auto h-[162px] w-[226px]" resizeMode="cover" />
          ) : null}

          {step.type === "picture" ? (
            <View className="mt-5 rounded-[10px] bg-white px-6 py-4">
              <Text className="text-center text-[38px] font-bold text-black">{step.word}</Text>
            </View>
          ) : null}

          {step.showSwipeHint ? (
            <View className="mt-5 h-8 flex-row items-center justify-center rounded-full bg-[#CD4EC9]">
              <MaterialCommunityIcons name="gesture-swipe" size={18} color="black" />
              <Text className="ml-3 text-[14px] font-bold text-white">Swipe to next</Text>
            </View>
          ) : null}

          {step.prompt ? <Text className="mt-8 text-center text-[36px] font-medium text-white">{step.prompt}</Text> : null}

          {step.type === "multipleChoice" && step.options ? (
            <View className="mt-6 gap-4">
              {step.options.map((option, idx) => (
                <View
                  key={option}
                  className={`h-[67px] flex-row items-center rounded-[10px] bg-white px-7 ${
                    step.selectedOption === idx ? "border-2 border-[#FE00B7]" : ""
                  }`}
                >
                  <Text className="flex-1 text-[24px] font-bold text-black">{option}</Text>
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-[#D946EF]">
                    <Ionicons name="volume-high" size={18} color="white" />
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {step.type === "kana" ? (
            <View className="mt-8">
              <View className="flex-row flex-wrap justify-between">
                {step.kanaTiles?.map((tile) => (
                  <View key={tile} className="mb-3 h-[67px] w-[66px] items-center justify-center rounded-[10px] bg-white">
                    <Text className="text-[42px] font-bold text-black">{tile}</Text>
                  </View>
                ))}
                <View className="mb-3 h-[67px] w-[66px] items-center justify-center rounded-[10px] bg-[#FE00B7]">
                  <Ionicons name="close" size={28} color="#161D2F" />
                </View>
              </View>
            </View>
          ) : null}

          {step.type === "picture" ? (
            <View className="mt-8 flex-row flex-wrap justify-between">
              {[IMG_CAT, IMG_DOG, IMG_BEAR, IMG_RABBIT].map((img, idx) => (
                <View key={img} className={`mb-8 h-[108px] w-[48%] rounded-[10px] ${step.highlightImageIndex === idx ? "border-2 border-[#FF0040]" : ""}`}>
                  <Image source={{ uri: img }} className="h-full w-full rounded-[10px]" resizeMode="cover" />
                </View>
              ))}
            </View>
          ) : null}

          {step.type === "writing" ? (
            <>
              <View className="mt-6 h-[313px] rounded-[10px] bg-white">
                <Text className="pt-8 text-center text-[240px] font-bold text-[#959595]">{step.writingChar}</Text>
                {step.showAddToDictionary ? (
                  <View className="absolute bottom-[-34px] right-0 flex-row items-center">
                    <Text className="mr-3 text-[14px] font-bold text-white">Add to dictionary</Text>
                    <View className="h-[33px] w-[33px] items-center justify-center rounded-full bg-[#FE00B7]">
                      <MaterialCommunityIcons name="book-open-variant" size={18} color="white" />
                    </View>
                  </View>
                ) : null}
              </View>
              <Pressable className="mt-14 h-[63px] flex-row items-center justify-center rounded-[10px] border border-[#9747FF] bg-white">
                <MaterialCommunityIcons name="gesture-tap" size={26} color="#9747FF" />
                <Text className="ml-4 text-[24px] font-bold text-[#9747FF]">Writing</Text>
              </Pressable>
            </>
          ) : null}

          <Pressable className="mt-auto mb-7 h-[63px] items-center justify-center rounded-[10px] bg-[#9747FF]" onPress={onNext}>
            <Text className="text-[24px] font-bold text-white">NEXT</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
