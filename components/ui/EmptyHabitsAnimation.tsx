import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";

export default function EmptyHabitsAnimation() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          alignItems: "center",
          marginTop: 60,
        },
        containerStyle,
      ]}
    >
      <Animated.View style={iconStyle}>
        <Ionicons name="leaf-outline" size={70} color={theme.primary} />
      </Animated.View>

      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          color: theme.textSecondary,
          textAlign: "center",
        }}
      >
        No habits today 🌱{"\n"}Start your first habit!
      </Text>
    </Animated.View>
  );
}
