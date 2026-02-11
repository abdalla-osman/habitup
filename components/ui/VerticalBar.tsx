import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
type BarProps = {
  color: string;
  progress: number;
  title: string;
  width?: number;
  resetAnimation?: boolean;
  isBest?: boolean;
  isWorst?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
};
const getInsightMessage = (
  strongest: HabitProgress & { percent: number },
  weakest: HabitProgress & { percent: number }
) => {
  if (strongest.percent === 100) {
    return `🔥 Amazing! You completed "${strongest.title}" every single day this week.`;
  }

  if (weakest.percent < 40) {
    return `💪 Let’s focus more on "${weakest.title}" next week and build momentum.`;
  }

  return `👏 "${strongest.title}" is your strongest habit this week. Keep it up!`;
};
export default function VerticalBar({
  color,
  progress,
  title,
  width = 60,
  resetAnimation,
  isBest = false,
  isWorst = false,
  onPress,
  isSelected=false
}: BarProps) {
  const animatedHeight = useSharedValue(0);
  const [showHighlight, setShowHighlight] = useState(false); // لإظهار كرت الأفضل/الأضعف بعد الانميشن
const cardOpacity = useSharedValue(0);
const cardTranslate = useSharedValue(10);
const { isDark } = useTheme();
const theme = isDark ? darkTheme : lightTheme;
useEffect(() => {
  if (isSelected) {
    cardOpacity.value = withTiming(1, { duration: 300 });
    cardTranslate.value = withTiming(0, { duration: 300 });
  } else {
    cardOpacity.value = withTiming(0, { duration: 200 });
    cardTranslate.value = withTiming(10, { duration: 200 });
  }
}, [isSelected]);
const cardStyle = useAnimatedStyle(() => ({
  opacity: cardOpacity.value,
  transform: [{ translateY: cardTranslate.value }],
}));

  useEffect(() => {
    // نعيد الانيميشن من الصفر لو resetAnimation = true
    animatedHeight.value = 0;
    setShowHighlight(false); // نخفي الكرت

    // تشغيل الانيميشن للارتفاع
    animatedHeight.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    }, (finished) => {
      if (finished) runOnJS(setShowHighlight)(true); // نعرض الكرت بعد انتهاء الانميشن
    });
  }, [progress, resetAnimation]);

  const barStyle = useAnimatedStyle(() => ({
    height: `${animatedHeight.value}%`,
  }));

  return (
    <Pressable onPress={onPress}>
    <View style={[styles.container, { width }]}>
      <Text style={[styles.percent,{color:theme.textPrimary}]}>{progress}%</Text>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, barStyle]} />
      </View>
      <Text style={[styles.title,{color:theme.textPrimary}]}>{title}</Text>

      {/* كرت إبراز الأفضل/الأضعف */}
{isSelected && (
  <Animated.View style={[styles.infoCard, cardStyle,{backgroundColor:theme.background}]}>
    <Text style={[styles.cardTitle,{color:theme.textPrimary}]}>
      {isBest ? "🏆 Best Habit" : isWorst ? "⚠️ Needs Attention" : "Progress"}
    </Text>
    <Text style={[styles.cardText,{color:theme.textSecondary}]}>
      {progress}% completed this week
    </Text>
  </Animated.View>
)}
    </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  percent: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },
  barBackground: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E7EB",
    borderRadius: 30,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 30,
  },
  title: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
  },
  highlightCard: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 50,
  },
  highlightText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1F2937',
  },
  infoCard: {
  marginTop: 8,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 12,
  minWidth:80,
  //backgroundColor: "#F3F4F6",
},
cardTitle: {
  fontSize: 12,
  fontWeight: "700",
  textAlign: "center",
},
cardText: {
  fontSize: 11,
  textAlign: "center",
  opacity: 0.7,
},
});