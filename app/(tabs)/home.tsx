import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import useHabitReminder from "@/hooks/useHabitReminder"; // بدون { }
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import WeekHeader from "../../components/WeekHeader";
import HabitCard from "../../components/ui/HabitCard";
import NotificationCart from "../../components/ui/NotificationCart";
import EmptyHabitsAnimation from "../../components/ui/EmptyHabitsAnimation";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";

export default function TodayHabitsScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const [habits, setHabits] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
const { enableReminder, disableReminder } =
    useHabitReminder(habits, setHabits);
  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = daysMap[new Date().getDay()];

  // ========================= LOAD HABITS =========================
  const loadHabits = async () => {
    try {
      const habitsJson = await AsyncStorage.getItem("@habits");
      const completionsJson = await AsyncStorage.getItem("@completions");

      const storedHabits = habitsJson ? JSON.parse(habitsJson) : [];
      const completions = completionsJson ? JSON.parse(completionsJson) : {};

      const todayDate = new Date().toISOString().split("T")[0];
      const todayCompleted: string[] = completions[todayDate] || [];

      const fixedHabits = storedHabits.map(habit => ({
        ...habit,
        repeatDays: Array.isArray(habit.repeatDays) ? habit.repeatDays : [],
        // ✅ completed اليوم فقط حسب completions
        completed: todayCompleted.includes(habit.id),
      }));

      setHabits(fixedHabits);
    } catch (err) {
      console.log("Error loading habits:", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHabits();
    }, [])
  );

  // ========================= TIME LEFT =========================
  useEffect(() => {
  const interval = setInterval(() => {
    const newTimeLeft: { [key: string]: string } = {};
    const now = new Date();

    habits
      .filter(h => h.repeatDays.includes(today))
      .forEach(habit => {
        if (!habit.reminder?.startTime || !habit.reminder?.endTime) return;

        const todayBase = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const [startH, startM] = habit.reminder.startTime.split(":").map(Number);
        const [endH, endM] = habit.reminder.endTime.split(":").map(Number);

        const startDate = new Date(todayBase);
        startDate.setHours(startH, startM, 0, 0);

        const endDate = new Date(todayBase);
        endDate.setHours(endH, endM, 0, 0);

        let diff = 0;
        let status = "";

        // ✅ لو عملت completed توقف الزمن
        if (habit.completed) {
          newTimeLeft[habit.id] = "Completed";
          return;
        }

        if (now < startDate) {
          diff = startDate.getTime() - now.getTime();
          status = "Starts in ";
        } else if (now >= startDate && now <= endDate) {
          diff = endDate.getTime() - now.getTime();
          status = "Ends in ";
        } else {
          diff = 0;
          status = "Done";
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        newTimeLeft[habit.id] =
          status === "Done" ? "Done" : `${status}${hours}h:${minutes}m:${seconds}s`;
      });

    setTimeLeft(newTimeLeft);
  }, 1000);

  return () => clearInterval(interval);
}, [habits, today]);

  // ========================= HANDLE COMPLETE =========================
  const handleComplete = async (habitId: string) => {
    const todayDate = new Date().toISOString().split("T")[0];
    const completionJson = await AsyncStorage.getItem("@completions");
    const completions = completionJson ? JSON.parse(completionJson) : {};
    const todayCompleted: string[] = completions[todayDate] || [];

    if (!todayCompleted.includes(habitId)) todayCompleted.push(habitId);
    completions[todayDate] = todayCompleted;

    await AsyncStorage.setItem("@completions", JSON.stringify(completions));

    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, completed: true } : h))
    );
  };

  // ========================= DELETE HABIT =========================
  const deleteHabit = async (habitId: string) => {
    const habitsJson = await AsyncStorage.getItem("@habits");
    const storedHabits = habitsJson ? JSON.parse(habitsJson) : [];
    const updatedHabits = storedHabits.filter(h => h.id !== habitId);
    await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));

    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  // ========================= TODAY HABITS =========================
  const todaysHabits = habits
    .filter(h => h.repeatDays.includes(today))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const visibleHabits = todaysHabits.slice(0, 3);
  const reminderHabit = todaysHabits.find(h => !h.completed);
  // ========================= RENDER =========================
  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: theme.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            height: Platform.OS === "ios" ? 96 : 56,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "500", color: theme.textPrimary }}>
            Today Habit
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "300", color: theme.textPrimary }}>
            HabitUp
          </Text>
        </View>

        {/* Week Header */}
        <WeekHeader />

        {/* Notification Cart */}
        {reminderHabit && (
            <NotificationCart
              habit={reminderHabit}
              onEnable={() => enableReminder(reminderHabit)}
              onDisable={() => disableReminder(reminderHabit)}
            />
          )}

        {/* Daily Routine Header */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "600", color: theme.text }}>
            Daily Routine
          </Text>
          <TouchableOpacity onPress={() => router.push("/allHabits")}>
            <Text style={{ color: theme.textSecondary }}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Habits List */}
        {visibleHabits.length === 0 && <EmptyHabitsAnimation />}
        {visibleHabits.map(habit => (
          <HabitCard
            key={habit.id}
            title={habit.title}
            streaktime={habit.repeatDays.length}
            countTime={timeLeft[habit.id] || "Calculating..."}
            onComplete={() => handleComplete(habit.id)}
            onDelete={() => deleteHabit(habit.id)}
            completedhabit={habit.completed}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}