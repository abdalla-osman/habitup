import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
const AnimatedText = ({ word }: { word: string }) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  
  const letters = word.split("");

  const scales = letters.map(() => useSharedValue(0));

  useEffect(() => {
    letters.forEach((_, i) => {
      scales[i].value = withDelay(
        i * 150, // تأخير متسلسل لكل حرف
        withSpring(1, { damping: 8, stiffness: 120 })
      );
    });
  }, []);

  return (
    <View style={{ flexDirection: "row" }}>
      {letters.map((letter, i) => {
        const style = useAnimatedStyle(() => ({
          transform: [{ scale: scales[i].value }],
          opacity: scales[i].value,
        }));

        return (
          <Animated.Text key={i} style={[styles.letter, style,{color:theme.textPrimary}]}>
            {letter}
          </Animated.Text>
        );
      })}
    </View>
  );
};

export default function HabitUpTitle() {
  return (
    <View style={styles.container}>
      <AnimatedText word="HabitUp" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: "linear-gradient(180deg, #0A0A23, #001240)", // dark gradient
  },
  letter: {
    fontSize: 48,
    fontWeight: "bold",
  },
});