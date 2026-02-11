import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";

export default function EmptyStreaksAnimation() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={{ alignItems: "center", marginTop: 80 }}>
      <Animated.View style={iconStyle}>
        <Ionicons name="flame-outline" size={80} color={theme.primary} />
      </Animated.View>

      <Text
        style={{
          marginTop: 20,
          fontSize: 16,
          color: theme.textSecondary,
          textAlign: "center",
        }}
      >
        No streaks yet 🔥{"\n"}Complete habits to build streaks
      </Text>
    </View>
  );
}