import { Pressable, type PressableProps } from "react-native";

import { AppText } from "./AppText";

type AppButtonVariant = "primary" | "secondary" | "outline";

type AppButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: AppButtonVariant;
  className?: string;
};

const variantClasses: Record<AppButtonVariant, string> = {
  primary: "bg-primary border-primary",
  secondary: "bg-secondary border-secondary",
  outline: "bg-transparent border-slate-300",
};

const textVariantClasses: Record<AppButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-text",
};

export function AppButton({
  title,
  variant = "primary",
  className = "",
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      className={`h-12 items-center justify-center rounded-xl border px-4 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <AppText weight="semibold" className={textVariantClasses[variant]}>
        {title}
      </AppText>
    </Pressable>
  );
}
