import type { ReactNode } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;

type KeyboardAvoidingSheetProps = {
  visible: boolean;
  onBackdropPress: () => void;
  children: ReactNode;
};

/**
 * Bottom sheet overlay: backdrop + content that stays above the software keyboard.
 */
export function KeyboardAvoidingSheet({ visible, onBackdropPress, children }: KeyboardAvoidingSheetProps) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  return (
    <View className="absolute inset-0 justify-end" style={{ zIndex: 100 }} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        className="absolute inset-0 bg-black/70"
        onPress={onBackdropPress}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? Math.max(insets.top, 8) : 0}
        style={{ width: "100%", maxHeight: screenHeight * 0.92 }}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 0, paddingBottom: Math.max(insets.bottom, 12) + 12 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
