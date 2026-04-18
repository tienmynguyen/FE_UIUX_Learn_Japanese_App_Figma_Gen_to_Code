import { AppText } from "@/components";
import { useSession } from "@/hooks/useSession";
import { api } from "@/services/api";
import { FontAwesome, AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BG_IMAGE_URI = "https://www.figma.com/api/mcp/asset/a2b8bf83-0e64-43bc-81fb-39e90fa78c0a";
const INTRO_IMAGE_1 = "https://www.figma.com/api/mcp/asset/ef299516-df32-44f4-8fc1-5ac8e6b6a8f8";
const INTRO_IMAGE_2 = "https://www.figma.com/api/mcp/asset/9e20421f-77be-48ef-b71c-26755fe01a1e";
const INTRO_IMAGE_3 = "https://www.figma.com/api/mcp/asset/4e0a0982-0e31-4776-b44a-6f05ee7274d9";

const INTRO_SLIDES = [
  {
    image: INTRO_IMAGE_1,
    titleLine1: "App học tiếng Nhật",
    titleLine2: "Được bình chọn tốt nhất",
    topTitle: false,
    cta: "",
  },
  {
    image: INTRO_IMAGE_2,
    titleLine1: "Phù hợp với",
    titleLine2: "Tất cả mọi người",
    topTitle: true,
    cta: "",
  },
  {
    image: INTRO_IMAGE_3,
    titleLine1: "Nơi nào có ý chí,",
    titleLine2: "nơi đó có con đường",
    topTitle: false,
    cta: "Học ngay",
  },
] as const;

function SocialLoginButton({ provider }: { provider: "facebook" | "google" }) {
  return (
    <Pressable className="h-[52px] w-[52px] items-center justify-center rounded-full border border-[#F3F4F6] bg-white shadow-sm">
      {provider === "facebook" ? (
        <FontAwesome name="facebook" size={20} color="#1877F2" />
      ) : (
        <AntDesign name="google" size={20} color="#EA4335" />
      )}
    </Pressable>
  );
}

export default function LoginScreen() {
  const [introStep, setIntroStep] = useState(0);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSession } = useSession();
  const formOpacity = useRef(new Animated.Value(1)).current;
  const formTranslateY = useRef(new Animated.Value(0)).current;

  const switchAuthMode = (nextMode: "signin" | "signup") => {
    if (nextMode === authMode) return;
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 12,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAuthMode(nextMode);
      formTranslateY.setValue(-12);
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!email.trim() || !password.trim() || (authMode === "signup" && !username.trim())) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setIsSubmitting(true);
      const authResponse =
        authMode === "signin"
          ? await api.signIn(email.trim(), password)
          : await api.signUp(username.trim(), email.trim(), password);

      setSession({
        userId: authResponse.userId,
        username: authResponse.username,
        email: authResponse.email,
        token: authResponse.token,
        planId: authResponse.planId,
      });
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Không thể xác thực", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (introStep < INTRO_SLIDES.length) {
    const currentSlide = INTRO_SLIDES[introStep];
    const isTopTitle = currentSlide.topTitle;

    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        <View className="flex-1">
          {isTopTitle ? (
            <View className="px-8 pt-6">
              <Text className="text-center text-[28px] font-semibold text-black">{currentSlide.titleLine1}</Text>
              <View className="mt-2 h-[8px] bg-[#00629B]" />
              <Text className="mt-3 text-center text-[28px] font-semibold text-black">{currentSlide.titleLine2}</Text>
            </View>
          ) : null}

          <View className={`items-center ${isTopTitle ? "mt-8" : "mt-3"}`}>
            <Image
              source={{ uri: currentSlide.image }}
              className={`${isTopTitle ? "h-[470px] w-[410px]" : "h-[500px] w-[420px]"}`}
              resizeMode="contain"
            />
          </View>

          {!isTopTitle ? (
            <View className={`${introStep === 2 ? "mt-0" : "mt-2"} px-7`}>
              <Text className="text-[28px] font-semibold text-black">{currentSlide.titleLine1}</Text>
              <Text className="text-[28px] font-semibold text-black">{currentSlide.titleLine2}</Text>
              <View className="mt-3 h-[8px] bg-[#00629B]" />
            </View>
          ) : null}

          <View className="mt-auto flex-row items-center justify-end px-7 pb-8">
            {currentSlide.cta ? <Text className="mr-5 text-[48px] font-semibold text-black">{currentSlide.cta}</Text> : null}
            <Pressable
              className="h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] border-[#0B294B] bg-white"
              onPress={() => setIntroStep((prev) => prev + 1)}
            >
              <View className="h-[64px] w-[64px] items-center justify-center rounded-full bg-[#00629B]">
                <Ionicons name="arrow-forward" size={28} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground source={{ uri: BG_IMAGE_URI }} className="flex-1" resizeMode="cover">
      <View className="flex-1 bg-black/30">
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
          >
            <ScrollView
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 30, paddingBottom: 32 }}
            >
            <View className="mt-[120px] items-center">
              <AppText
                weight="bold"
                className="text-[48px] leading-[48px] text-white"
                style={{ textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 4 }}
              >
                Welcome
              </AppText>
            </View>

            <View className="mt-8 flex-row rounded-full bg-white/20 p-1">
              <Pressable
                className={`flex-1 items-center justify-center rounded-full py-3 ${authMode === "signin" ? "bg-white" : ""}`}
                onPress={() => switchAuthMode("signin")}
              >
                <AppText weight="bold" className={`text-[15px] ${authMode === "signin" ? "text-[#006097]" : "text-white"}`}>
                  Sign In
                </AppText>
              </Pressable>
              <Pressable
                className={`flex-1 items-center justify-center rounded-full py-3 ${authMode === "signup" ? "bg-white" : ""}`}
                onPress={() => switchAuthMode("signup")}
              >
                <AppText weight="bold" className={`text-[15px] ${authMode === "signup" ? "text-[#006097]" : "text-white"}`}>
                  Sign Up
                </AppText>
              </Pressable>
            </View>

            <Animated.View
              className={`mt-6 rounded-[24px] bg-background px-5 pb-7 shadow-2xl ${authMode === "signup" ? "pt-[42px]" : "pt-7"}`}
              style={{ opacity: formOpacity, transform: [{ translateY: formTranslateY }] }}
            >
              <View className="gap-4">
                {authMode === "signup" ? (
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Tên người dùng"
                    placeholderTextColor="#9CA3AF"
                    className="h-[52px] rounded-[14px] border border-border bg-white px-4 text-[15px] text-text"
                  />
                ) : null}
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="h-[52px] rounded-[14px] border border-border bg-white px-4 text-[15px] text-text"
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="h-[52px] rounded-[14px] border border-border bg-white px-4 text-[15px] text-text"
                />
                <Pressable
                  className="mt-2 h-[52px] items-center justify-center rounded-full bg-primary shadow-[0px_4px_14px_rgba(0,98,155,0.4)]"
                  onPress={handleSubmit}
                >
                  <AppText weight="bold" className="text-[15px] tracking-[0.4px] text-white">
                    {isSubmitting ? "ĐANG XỬ LÝ..." : authMode === "signin" ? "SIGN IN" : "SIGN UP"}
                  </AppText>
                </Pressable>
              </View>

              {authMode === "signin" ? (
                <>
                  <View className="mt-7 items-center">
                    <AppText className="text-[13px] text-muted">or continue with</AppText>
                  </View>

                  <View className="mt-5 flex-row items-center justify-center gap-6">
                    <SocialLoginButton provider="facebook" />
                    <SocialLoginButton provider="google" />
                  </View>
                </>
              ) : null}
            </Animated.View>

            <View className="mt-8 items-center">
              <AppText
                className="text-[14px] text-white"
                style={{ textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 4 }}
              >
                {authMode === "signin" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                <AppText
                  weight="bold"
                  className="text-[14px] text-white underline"
                  style={{ textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 4 }}
                  onPress={() => switchAuthMode(authMode === "signin" ? "signup" : "signin")}
                >
                  {authMode === "signin" ? "Đăng ký" : "Đăng nhập"}
                </AppText>
              </AppText>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
