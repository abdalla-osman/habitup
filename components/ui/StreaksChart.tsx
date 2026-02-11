import { View, Dimensions } from "react-native";
import VerticalBar from "./VerticalBar";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import { useState } from "react";
type HabitProgress = {
  id: string;
  title: string;
  color: string;
  completedDays: number;
  totalDays: number;
};

const getProgressPercent = (completed: number, total: number) =>
  Math.round((completed / total) * 100);

export default function StreaksChart({
  data,
  resetAnimation,
}: {
  data: HabitProgress[];
  resetAnimation?: boolean;
}) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  // 👇 نحسب progress لكل عادة
  const habitsWithProgress = data.map((habit) => ({
    ...habit,
    progress: getProgressPercent(habit.completedDays, habit.totalDays),
  }));

  // 👇 نحدد أعلى وأقل progress
  const bestProgress = Math.max(...habitsWithProgress.map(h => h.progress));
  const worstProgress = Math.min(...habitsWithProgress.map(h => h.progress));

  // layout
  const screenWidth = Dimensions.get("window").width;
  const padding = 40;
  const totalWidth = screenWidth - padding;
  const columnWidth = Math.min(60, totalWidth / data.length - 10);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        backgroundColor: theme.card,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderColor:theme.border,
        borderWidth:1,
      }}
    >
    {habitsWithProgress.map((habit) => (
  <VerticalBar
    key={habit.id}
    title={habit.title}
    color={habit.color}
    progress={habit.progress}
    width={columnWidth}
    resetAnimation={resetAnimation}
    isBest={habit.progress === bestProgress}
    isWorst={habit.progress === worstProgress}
    isSelected={selectedHabitId === habit.id}
    onPress={() =>
      setSelectedHabitId(
        selectedHabitId === habit.id ? null : habit.id
      )
    }
  />
))}
    </View>
  );
}