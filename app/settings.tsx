import { AppText as BaseText, KeyboardAvoidingSheet } from "@/components";
import { useSession } from "@/hooks/useSession";
import { useThemeMode } from "@/hooks/useThemeMode";
import { api } from "@/services/api";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type SettingsTab = "account" | "profile" | "password" | "links";

const profileImage = "https://www.figma.com/api/mcp/asset/73a890f3-fcea-462b-a4f5-8727e9e2efb7";
const catImage = "https://www.figma.com/api/mcp/asset/f1cdd767-dd26-4f7d-965d-67e20fc0303e";

function AppText({ className = "", ...props }: ComponentProps<typeof BaseText>) {
  const { isLightMode } = useThemeMode();
  return <BaseText className={`${isLightMode ? "text-[#0F172A]" : "text-white"} ${className}`} {...props} />;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const { isLightMode } = useThemeMode();
  return (
    <View>
      <AppText className={`mb-2 text-[30px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>{label}</AppText>
      {children}
    </View>
  );
}

function InputRow({
  icon,
  value,
  trailing,
  onPress,
  editable = false,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}: {
  icon: ReactNode;
  value: string;
  trailing?: ReactNode;
  onPress?: () => void;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}) {
  const { isLightMode } = useThemeMode();
  const containerClassName = `h-[56px] flex-row items-center rounded-[12px] border px-4 ${
    isLightMode ? "border-[#1E3A8A] bg-[#F3F4F6]" : "border-[#334155] bg-[#1E293B]"
  }`;

  if (editable) {
    return (
      <View className={containerClassName}>
        <View className="mr-3">{icon}</View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={isLightMode ? "#94A3B8" : "#64748B"}
          className={`flex-1 text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}
        />
        {trailing}
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} className={containerClassName}>
      <View className="mr-3">{icon}</View>
      <AppText className={`flex-1 text-[31px] ${isLightMode ? "text-[#6B7280]" : "text-[#F8FAFC]"}`}>{value}</AppText>
      {trailing}
    </Pressable>
  );
}

function TabButton({
  active,
  label,
  icon,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  const color = active ? "#4480FF" : "#64748B";
  return (
    <Pressable onPress={onPress} className="flex-1 items-center">
      {icon}
      <AppText className="mt-1 text-[21px]" style={{ color }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { isLightMode } = useThemeMode();
  const insets = useSafeAreaInsets();
  const { session, setSession } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [language, setLanguage] = useState("Tiếng Việt");
  const [timezone, setTimezone] = useState("UTC+7 (Việt Nam)");
  const [pickerTab, setPickerTab] = useState<"Photos" | "Albums">("Photos");
  const [username, setUsername] = useState("test user");
  const [email, setEmail] = useState("testuser@gmail.com");
  const [website, setWebsite] = useState("https://yourwebsite.com");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [linkedFacebook, setLinkedFacebook] = useState(false);
  const [linkedGoogle, setLinkedGoogle] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await api.getProfile(session.userId);
        setUsername(profile.username);
        setEmail(profile.email);
        setWebsite(profile.website);
        setBio(profile.bio);
        setLanguage(profile.language);
        setTimezone(profile.timezone);
        setLinkedFacebook(profile.linkedFacebook);
        setLinkedGoogle(profile.linkedGoogle);
      } catch (error) {
        Alert.alert("Không tải được cài đặt", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
      }
    };

    loadProfile();
  }, [session]);

  const saveChanges = async () => {
    if (!session) return;
    try {
      if (activeTab === "account") {
        const updated = await api.updateAccount(session.userId, username, email);
        await api.updatePreferences(session.userId, language, timezone);
        setSession({ ...session, username: updated.username, email: updated.email });
      } else if (activeTab === "profile") {
        await api.updateProfile(session.userId, website, bio);
      } else if (activeTab === "password") {
        await api.changePassword(session.userId, currentPassword, newPassword, confirmPassword);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      Alert.alert("Thành công", activeTab === "password" ? "Đổi mật khẩu thành công." : "Đã lưu thay đổi.");
    } catch (error) {
      Alert.alert("Không thể lưu", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  const toggleSocialLink = async (provider: "facebook" | "google") => {
    if (!session) return;
    try {
      const nextLinked = provider === "facebook" ? !linkedFacebook : !linkedGoogle;
      const profile = await api.linkSocial(session.userId, provider, nextLinked);
      setLinkedFacebook(profile.linkedFacebook);
      setLinkedGoogle(profile.linkedGoogle);
      if (provider === "facebook") {
        Alert.alert("Cập nhật", profile.linkedFacebook ? "Đã liên kết Facebook." : "Đã hủy liên kết Facebook.");
      } else {
        Alert.alert("Cập nhật", profile.linkedGoogle ? "Đã liên kết Google." : "Đã hủy liên kết Google.");
      }
    } catch (error) {
      Alert.alert("Không thể cập nhật", error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isLightMode ? "bg-white" : "bg-[#0B1220]"}`}>
      <StatusBar style={isLightMode ? "dark" : "light"} />

      <View className={`h-[52px] flex-row items-center px-4 ${isLightMode ? "bg-white border-b border-[#E5E7EB]" : "bg-[#0B111E]"}`}>
        <Pressable onPress={() => router.back()} className="pr-3 py-2">
          <Ionicons name="chevron-back" size={24} color={isLightMode ? "#0F172A" : "#F8FAFC"} />
        </Pressable>
        <View className="flex-1 items-center pr-6">
          <AppText className={`text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Cài đặt</AppText>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
      >
        <ScrollView
          className="flex-1 px-5 pt-4"
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
        {activeTab === "account" && (
          <>
            <View className="mb-8">
              <AppText className={`text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Tài khoản</AppText>
              <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#94A3C7]" : "text-[#94A3B8]"}`}>
                Quản lý thông tin tài khoản và cài đặt bảo mật
              </AppText>
              <View className="mt-5 gap-6">
                <Field label="Tên người dùng">
                  <InputRow
                    icon={<Feather name="user" size={18} color="#94A3B8" />}
                    value={username}
                    editable
                    onChangeText={setUsername}
                  />
                </Field>
                <Field label="Email">
                  <InputRow
                    icon={<Feather name="mail" size={18} color="#94A3B8" />}
                    value={email}
                    editable
                    onChangeText={setEmail}
                  />
                </Field>
                <Pressable
                  className={`h-[56px] flex-row items-center justify-center rounded-[12px] border ${
                    isLightMode ? "border-[#1E3A8A] bg-[#3B82F6]" : "border-[#334155] bg-[#1E293B]"
                  }`}
                >
                  <Feather name="mail" size={18} color={isLightMode ? "white" : "#94A3B8"} />
                  <AppText className={`ml-3 text-[32px] ${isLightMode ? "text-white" : "text-[#CBD5E1]"}`}>Gửi mã xác thực OTP</AppText>
                </Pressable>
              </View>
            </View>

            <View className="mb-8">
              <AppText className={`mb-4 text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Bảo mật</AppText>
              <View
                className={`rounded-2xl border p-4 ${
                  isLightMode ? "border-[#1E3A8A] bg-[#F3F4F6]" : "border-[#334155] bg-[#1E293B]"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <AppText className={`text-[34px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Xác thực 2 bước</AppText>
                    <AppText className={`text-[28px] ${isLightMode ? "text-[#5B6473]" : "text-[#94A3B8]"}`}>
                      Bảo vệ tài khoản với mã xác thực qua email
                    </AppText>
                  </View>
                  <View className={`ml-2 h-6 w-11 rounded-full p-1 ${isLightMode ? "bg-[#E5E7EB]" : "bg-[#334155]"}`}>
                    <View className={`h-4 w-4 rounded-full ${isLightMode ? "bg-[#4B5563]" : "bg-[#94A3B8]"}`} />
                  </View>
                </View>
              </View>
            </View>

            <View className="gap-6">
              <Field label="Ngôn ngữ">
                <InputRow
                  icon={<Ionicons name="globe-outline" size={18} color="#94A3B8" />}
                  value={language}
                  trailing={<Ionicons name="chevron-down" size={18} color="#64748B" />}
                  onPress={() => setShowLanguageModal(true)}
                />
              </Field>
              <Field label="Múi giờ">
                <InputRow
                  icon={<Feather name="clock" size={18} color="#94A3B8" />}
                  value={timezone}
                  trailing={<Ionicons name="chevron-down" size={18} color="#64748B" />}
                  onPress={() => setShowTimezoneModal(true)}
                />
              </Field>
            </View>
          </>
        )}

        {activeTab === "profile" && (
          <>
            <AppText className={`text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Hồ sơ</AppText>
            <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#94A3C7]" : "text-[#8A99AF]"}`}>
              Cập nhật ảnh đại diện và thông tin cá nhân
            </AppText>

            <View className="items-center py-12">
              <Pressable onPress={() => setShowAvatarPicker(true)} className="relative">
                <View className="h-[114px] w-[114px] items-center justify-center rounded-full border-[3px] border-[#3B82F6] p-[5px]">
                  <Image source={{ uri: profileImage }} className="h-full w-full rounded-full" />
                </View>
                <View className="absolute bottom-1 right-1 h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-[#0F1520] bg-[#3B82F6]">
                  <Feather name="edit-3" size={14} color="white" />
                </View>
              </Pressable>
              <AppText className={`mt-4 text-[28px] ${isLightMode ? "text-[#5B6473]" : "text-[#8A99AF]"}`}>
                Nhấn để thay đổi ảnh đại diện
              </AppText>
            </View>

            <View className="gap-6">
              <Field label="Website cá nhân">
                <InputRow
                  icon={<Ionicons name="globe-outline" size={18} color="#6B7A95" />}
                  value={website}
                  editable
                  onChangeText={setWebsite}
                />
              </Field>
              <Field label="Giới thiệu">
                <View
                  className={`rounded-[14px] border p-4 ${
                    isLightMode ? "border-[#1E3A8A] bg-[#F3F4F6]" : "border-[#2B3749] bg-[#1B2333]"
                  }`}
                >
                  <TextInput
                    value={bio}
                    onChangeText={(text) => setBio(text.slice(0, 500))}
                    multiline
                    placeholder="Viết vài dòng về bản thân..."
                    placeholderTextColor="#6B7A95"
                    className={`min-h-[88px] text-[16px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}
                  />
                </View>
                <AppText className="mt-2 text-[26px] text-[#6B7A95]">{bio.length}/500 ký tự</AppText>
              </Field>
            </View>
          </>
        )}

        {activeTab === "password" && (
          <>
            <AppText className={`text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8F9FA]"}`}>Mật khẩu</AppText>
            <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#94A3C7]" : "text-[#8A99AF]"}`}>
              Thay đổi mật khẩu để bảo mật tài khoản
            </AppText>

            <View className={`mt-6 rounded-[12px] border-l-4 border-l-[#3B82F6] p-4 ${isLightMode ? "bg-[#F3F4F6]" : "bg-[#1E293B]"}`}>
              <AppText className={`text-[32px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Lưu ý bảo mật</AppText>
              <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#5B6473]" : "text-[#94A3B8]"}`}>
                Mật khẩu nên có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
              </AppText>
            </View>

            <View className="mt-6 gap-6">
              <Field label="Mật khẩu hiện tại">
                <InputRow
                  icon={<Ionicons name="lock-closed-outline" size={18} color="#64748B" />}
                  value={currentPassword}
                  placeholder="Nhập mật khẩu hiện tại"
                  editable
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  trailing={<Ionicons name="eye-outline" size={18} color="#64748B" />}
                />
              </Field>
              <Field label="Mật khẩu mới">
                <InputRow
                  icon={<Ionicons name="lock-closed-outline" size={18} color="#64748B" />}
                  value={newPassword}
                  placeholder="Nhập mật khẩu mới"
                  editable
                  onChangeText={setNewPassword}
                  secureTextEntry
                  trailing={<Ionicons name="eye-outline" size={18} color="#64748B" />}
                />
              </Field>
              <Field label="Xác nhận mật khẩu mới">
                <InputRow
                  icon={<Ionicons name="lock-closed-outline" size={18} color="#64748B" />}
                  value={confirmPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  editable
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </Field>
            </View>
          </>
        )}

        {activeTab === "links" && (
          <>
            <AppText className={`text-[40px] ${isLightMode ? "text-[#0F172A]" : "text-[#F8FAFC]"}`}>Liên kết tài khoản</AppText>
            <AppText className={`mt-1 text-[28px] ${isLightMode ? "text-[#94A3C7]" : "text-[#8A98AE]"}`}>
              Liên kết với các tài khoản mạng xã hội để đăng nhập dễ dàng hơn
            </AppText>

            <View className="mt-6 gap-4">
              <View
                className={`flex-row items-center justify-between rounded-[14px] border p-4 ${
                  isLightMode ? "border-[#1E3A8A] bg-[#F3F4F6]" : "border-[#2D3A4D] bg-[#1C2534]"
                }`}
              >
                <View className="flex-row items-center gap-4">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#1877F2]">
                    <Ionicons name="logo-facebook" size={18} color="white" />
                  </View>
                  <View>
                    <AppText className={`text-[31px] ${isLightMode ? "text-[#0F172A]" : "text-[#F3F4F6]"}`}>Facebook</AppText>
                    <AppText className="text-[27px] text-[#8A98AE]">{linkedFacebook ? "Đã liên kết" : "Chưa liên kết"}</AppText>
                  </View>
                </View>
                <Pressable className="rounded-[8px] bg-[#4182F6] px-4 py-2" onPress={() => toggleSocialLink("facebook")}>
                  <AppText className="text-[26px] text-white">{linkedFacebook ? "Hủy liên kết" : "Liên kết"}</AppText>
                </Pressable>
              </View>

              <View
                className={`flex-row items-center justify-between rounded-[14px] border p-4 ${
                  isLightMode ? "border-[#1E3A8A] bg-[#F3F4F6]" : "border-[#2D3A4D] bg-[#1C2534]"
                }`}
              >
                <View className="flex-row items-center gap-4">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                    <Ionicons name="mail-outline" size={18} color="#EA4335" />
                  </View>
                  <View>
                    <AppText className={`text-[31px] ${isLightMode ? "text-[#0F172A]" : "text-[#F3F4F6]"}`}>Google</AppText>
                    <AppText className="text-[27px] text-[#8A98AE]">{linkedGoogle ? "Đã liên kết" : "Chưa liên kết"}</AppText>
                  </View>
                </View>
                <Pressable className="rounded-[8px] bg-[#4182F6] px-4 py-2" onPress={() => toggleSocialLink("google")}>
                  <AppText className="text-[26px] text-white">{linkedGoogle ? "Hủy liên kết" : "Liên kết"}</AppText>
                </Pressable>
              </View>

              <View className={`rounded-[14px] p-4 ${isLightMode ? "bg-[#F3F4F6]" : "bg-[#1C2534]"}`}>
                <AppText className={`text-[30px] ${isLightMode ? "text-[#0F172A]" : "text-white"}`}>Lưu ý</AppText>
                <AppText className="mt-1 text-[27px] text-[#8A98AE]">
                  Sau khi liên kết, bạn có thể đăng nhập bằng tài khoản mạng xã hội mà không cần nhập mật khẩu.
                </AppText>
              </View>
            </View>
          </>
        )}
        </ScrollView>

        <View className={`border-t px-4 pt-3 ${isLightMode ? "border-[#E5E7EB] bg-white" : "border-[#1E293B] bg-[#0B111E]"}`}>
          <Pressable className="h-[56px] items-center justify-center rounded-[12px] bg-[#3B82F6]" onPress={saveChanges}>
            <AppText className="text-[32px] text-white">
              {activeTab === "password" ? "Đổi mật khẩu" : "Lưu thay đổi"}
            </AppText>
          </Pressable>
        </View>

        <View
          className={`min-h-[62px] flex-row items-center border-t pb-2 pt-3 ${
            isLightMode ? "border-[#1E293B] bg-white" : "border-[#1E293B] bg-[#111827]"
          }`}
          style={{ paddingBottom: Math.max(insets.bottom, 10) }}
        >
        <TabButton
          active={activeTab === "account"}
          label="Tài khoản"
          icon={<Ionicons name="person-outline" size={22} color={activeTab === "account" ? "#4480FF" : "#64748B"} />}
          onPress={() => setActiveTab("account")}
        />
        <TabButton
          active={activeTab === "profile"}
          label="Hồ sơ"
          icon={
            <MaterialCommunityIcons
              name="shield-outline"
              size={20}
              color={activeTab === "profile" ? "#4480FF" : "#64748B"}
            />
          }
          onPress={() => setActiveTab("profile")}
        />
        <TabButton
          active={activeTab === "password"}
          label="Mật khẩu"
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={activeTab === "password" ? "#4480FF" : "#64748B"}
            />
          }
          onPress={() => setActiveTab("password")}
        />
        <TabButton
          active={activeTab === "links"}
          label="Liên kết"
          icon={
            <MaterialCommunityIcons
              name="link-variant"
              size={20}
              color={activeTab === "links" ? "#4480FF" : "#64748B"}
            />
          }
          onPress={() => setActiveTab("links")}
        />
        </View>
      </KeyboardAvoidingView>

      {showLanguageModal && (
        <KeyboardAvoidingSheet visible onBackdropPress={() => setShowLanguageModal(false)}>
          <View className={`rounded-t-[32px] pb-10 pt-8 ${isLightMode ? "bg-white" : "bg-[#161B26]"}`}>
            <AppText className={`mb-6 text-center text-[40px] ${isLightMode ? "text-black" : "text-white"}`}>chọn ngôn ngữ</AppText>
            {["Tiếng Việt", "English", "日本語", "中語"].map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  setLanguage(item);
                  setShowLanguageModal(false);
                }}
                className={`mx-6 mb-2 items-center rounded-[18px] py-4 ${
                  language === item ? "bg-[#4182F9]" : "bg-transparent"
                }`}
              >
                <AppText className={`text-[34px] ${language === item ? "text-white" : isLightMode ? "text-black" : "text-[#E5E7EB]"}`}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </View>
        </KeyboardAvoidingSheet>
      )}

      {showTimezoneModal && (
        <KeyboardAvoidingSheet visible onBackdropPress={() => setShowTimezoneModal(false)}>
          <View className={`rounded-t-[32px] pb-10 pt-8 ${isLightMode ? "bg-white" : "bg-[#161B26]"}`}>
            <AppText className={`mb-6 text-center text-[40px] ${isLightMode ? "text-black" : "text-white"}`}>chọn múi giờ</AppText>
            {[
              "UTC+7 (Việt Nam)",
              "UTC+7 (Bangkok)",
              "UTC+9 (Tokyo)",
              "UTC+8 (Thượng Hải)",
              "UTC-5 (New York)",
            ].map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  setTimezone(item);
                  setShowTimezoneModal(false);
                }}
                className={`mx-6 mb-2 items-center rounded-[18px] py-4 ${
                  timezone === item ? "bg-[#4182F9]" : "bg-transparent"
                }`}
              >
                <AppText className={`text-[34px] ${timezone === item ? "text-white" : isLightMode ? "text-black" : "text-[#E5E7EB]"}`}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </View>
        </KeyboardAvoidingSheet>
      )}

      {showAvatarPicker && (
        <KeyboardAvoidingSheet visible onBackdropPress={() => setShowAvatarPicker(false)}>
          <View className={`rounded-t-[28px] ${isLightMode ? "bg-white" : "bg-[#1B2333]"}`}>
            <View className="items-center pt-4">
              <View className="h-1 w-8 rounded-full bg-[#DEDEE1]" />
            </View>
            <AppText className={`mt-5 text-center text-[31px] ${isLightMode ? "text-black" : "text-white"}`}>
              This app can only access the photos you select
            </AppText>

            <View className="mt-6 flex-row items-center px-4">
              <Pressable className="h-10 w-10 items-center justify-center" onPress={() => setShowAvatarPicker(false)}>
                <Ionicons name="close" size={24} color={isLightMode ? "black" : "white"} />
              </Pressable>
              <View className="ml-4 flex-row gap-2">
                <Pressable
                  onPress={() => setPickerTab("Photos")}
                  className={`min-w-[100px] items-center rounded-full px-6 py-2 ${
                    pickerTab === "Photos" ? "bg-[#E0E6FF]" : "bg-[#F3F3F5]"
                  }`}
                >
                  <AppText className="text-[30px] text-[#1C1B1F]">Photos</AppText>
                </Pressable>
                <Pressable
                  onPress={() => setPickerTab("Albums")}
                  className={`min-w-[100px] items-center rounded-full px-6 py-2 ${
                    pickerTab === "Albums" ? "bg-[#E0E6FF]" : "bg-[#F3F3F5]"
                  }`}
                >
                  <AppText className="text-[30px] text-[#49454F]">Albums</AppText>
                </Pressable>
              </View>
            </View>

            <View className="mt-6 px-4 pb-20">
              <AppText className={`mb-3 text-[31px] ${isLightMode ? "text-black" : "text-white"}`}>Recent</AppText>
              <Image source={{ uri: catImage }} className="h-[136px] w-[136px]" />
            </View>
          </View>
        </KeyboardAvoidingSheet>
      )}
    </SafeAreaView>
  );
}
