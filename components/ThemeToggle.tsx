import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
const theme = isDark ? darkTheme : lightTheme;
  /* shared value = number */
  const translateX = useSharedValue<number>(isDark ? 22 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onToggle = () => {
    toggleTheme();
    translateX.value = withTiming(isDark ? 0 : 22, { duration: 200 });
  };

  return (
    <Pressable
      onPress={onToggle}
      style={{
        width: 50,
        height: 28,
        borderRadius: 20,
        backgroundColor: isDark ?theme.primaryLight:theme.primary,
        padding: 3,
      }}
    >
      <Animated.View
        style={[
          {
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor:"#fff",
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}