import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useEffect } from "react";

// شكل كل habit عنده وقت بالدقائق (نحسبها)
type HabitProgress = {
  id: string;
  title: string;
  completedDays: number;
  totalDays: number;
  reminder?: {
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
  };
};

type WeeklySummaryCardProps = {
  habitsProgress: HabitProgress[];
};

export default function WeeklySummaryCard({ habitsProgress }: WeeklySummaryCardProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  // Animation
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 600 });
  }, [habitsProgress]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // دالة لحساب مدة Habit بالدقائق
  const getHabitDurationMinutes = (habit: HabitProgress) => {
    if (!habit.reminder?.startTime || !habit.reminder?.endTime) return 0;
    const [startH, startM] = habit.reminder.startTime.split(":").map(Number);
    const [endH, endM] = habit.reminder.endTime.split(":").map(Number);

    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    const diff = end - start;
    return diff > 0 ? diff : 0;
  };

  // عدد العادات المكتملة (اليوم المكتمل > 0)
  const completedHabits = habitsProgress.filter(h => h.completedDays > 0).length;

  // حساب الوقت الكلي بالدقائق لكل Habit
  const totalMinutes = habitsProgress.reduce(
    (sum, h) => sum + h.completedDays * getHabitDurationMinutes(h),
    0
  );

  // نقاط مكتسبة: 10 لكل يوم مكتمل
  const pointsEarned = habitsProgress.reduce(
    (sum, h) => sum + h.completedDays * 10,
    0
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalTime = `${hours}h ${minutes}m`;

  return (
    <Animated.View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }, animStyle]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Weekly Summary</Text>

      <View style={styles.statsContainer}>
        {/* Completed Habits */}
        <View style={styles.stat}>
          <Ionicons name="checkmark-done-circle" size={28} color="#22C55E" />
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>{completedHabits}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed Habits</Text>
        </View>

        {/* Total Time */}
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={28} color="#3B82F6" />
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>{totalTime}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Time</Text>
        </View>

        {/* Points Earned */}
        <View style={styles.stat}>
          <Ionicons name="star-outline" size={28} color="#FACC15" />
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>{pointsEarned}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Points Earned</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
});