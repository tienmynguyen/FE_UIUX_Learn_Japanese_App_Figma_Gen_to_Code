import { SafeAreaView } from "react-native-safe-area-context";
import { View, type ViewProps } from "react-native";

type ContainerProps = ViewProps & {
  className?: string;
};

export function Container({ className = "", children, ...props }: ContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={`flex-1 px-5 py-4 ${className}`} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}
