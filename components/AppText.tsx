import { Text, type TextProps } from "react-native";

import { useThemeMode } from "@/hooks/useThemeMode";

type AppTextVariant = "title" | "subtitle" | "body" | "caption";
type AppTextWeight = "regular" | "medium" | "semibold" | "bold";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  weight?: AppTextWeight;
  className?: string;
};

const variantClasses: Record<AppTextVariant, string> = {
  title: "text-3xl",
  subtitle: "text-xl",
  body: "text-base",
  caption: "text-sm",
};

const weightClasses: Record<AppTextWeight, string> = {
  regular: "font-regular",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function AppText({
  variant = "body",
  weight = "regular",
  className = "",
  ...props
}: AppTextProps) {
  const { isLightMode } = useThemeMode();
  return (
    <Text
      className={`text-text ${variantClasses[variant]} ${weightClasses[weight]} ${className} ${
        isLightMode ? "text-black" : "text-white"
      }`}
      {...props}
    />
  );
}
