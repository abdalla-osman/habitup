import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import HabitCard from "@/components/ui/HabitCard";

/* ================= CONFIG ================= */

const filters = ["today", "week", "month", "date"] as const;
type FilterType = typeof filters[number];
const FILTER_WIDTH = 80;

/* ================= SCREEN ================= */

export default function AllHabits() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const [habits, setHabits] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  /* ===== Animations ===== */
  const contentAnim = useSharedValue(0);
  const underlineX = useSharedValue(0);
  const swipeProgress = useSharedValue(0);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    contentAnim.value = 0;
    contentAnim.value = withTiming(1, { duration: 260 });

    underlineX.value = withSpring(activeIndex * FILTER_WIDTH, {
      damping: 16,
      stiffness: 140,
    });

    Haptics.selectionAsync();
  }, [activeIndex]);

  /* ===== Load Habits ===== */
  const loadHabits = async () => {
    const habitsJson = await AsyncStorage.getItem("@habits");
    const completionsJson = await AsyncStorage.getItem("@completions");

    const storedHabits = habitsJson ? JSON.parse(habitsJson) : [];
    const completions = completionsJson ? JSON.parse(completionsJson) : {};

    const todayKey = new Date().toISOString().split("T")[0];
    const todayCompleted = completions[todayKey] || [];

    const fixed = storedHabits.map((h: any) => ({
      ...h,
      repeatDays: Array.isArray(h.repeatDays) ? h.repeatDays : [],
      completed: todayCompleted.includes(h.id),
    }));

    setHabits(fixed);
  };

  /* ===== Swipe Gesture ===== */
  const swipeGesture = Gesture.Pan()
    .onUpdate(e => {
      swipeProgress.value = e.translationX;
    })
    .onEnd(e => {
      const velocity = e.velocityX;
      const distance = e.translationX;

      if ((distance < -40 || velocity < -600) && activeIndex < filters.length - 1) {
        runOnJS(setActiveIndex)(activeIndex + 1);
      }

      if ((distance > 40 || velocity > 600) && activeIndex > 0) {
        runOnJS(setActiveIndex)(activeIndex - 1);
      }

      swipeProgress.value = withTiming(0);
    });

  /* ===== Filter Logic ===== */
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayName = dayNames[new Date().getDay()];
  const pickedDay = dayNames[selectedDate.getDay()];
  const activeFilter = filters[activeIndex];

  const filteredHabits = habits.filter(h => {
    if (activeFilter === "today") return h.repeatDays.includes(todayName);
    if (activeFilter === "week") return h.frequency === "weekly";
    if (activeFilter === "month") return true;
    if (activeFilter === "date") return h.repeatDays.includes(pickedDay);
    return true;
  });

  /* ===== Time Left ===== */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTimeLeft: { [key: string]: string } = {};

      filteredHabits.forEach(habit => {
        if (!habit.reminder?.startTime || !habit.reminder?.endTime) return;

        const todayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [startH, startM] = habit.reminder.startTime.split(":").map(Number);
        const [endH, endM] = habit.reminder.endTime.split(":").map(Number);

        const startDate = new Date(todayBase);
        startDate.setHours(startH, startM, 0, 0);

        const endDate = new Date(todayBase);
        endDate.setHours(endH, endM, 0, 0);

        if (habit.completed) {
          newTimeLeft[habit.id] = "Completed";
        } else if (now < startDate) {
          const diff = startDate.getTime() - now.getTime();
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[habit.id] = `Starts in ${h}h:${m}m:${s}s`;
        } else if (now >= startDate && now <= endDate) {
          const diff = endDate.getTime() - now.getTime();
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[habit.id] = `Ends in ${h}h:${m}m:${s}s`;
        } else {
          newTimeLeft[habit.id] = "Done";
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredHabits]);

  /* ===== Complete Habit ===== */
  const handleComplete = async (habitId: string) => {
    const todayKey = new Date().toISOString().split("T")[0];
    const completionsJson = await AsyncStorage.getItem("@completions");
    const completions = completionsJson ? JSON.parse(completionsJson) : {};

    const todayCompleted = completions[todayKey] || [];
    if (!todayCompleted.includes(habitId)) todayCompleted.push(habitId);

    completions[todayKey] = todayCompleted;
    await AsyncStorage.setItem("@completions", JSON.stringify(completions));

    setHabits(prev => prev.map(h => (h.id === habitId ? { ...h, completed: true } : h)));
  };

  /* ===== Delete Habit ===== */
  const deleteHabit = async (habitId: string) => {
    const habitsJson = await AsyncStorage.getItem("@habits");
    const storedHabits = habitsJson ? JSON.parse(habitsJson) : [];
    const updated = storedHabits.filter(h => h.id !== habitId);

    await AsyncStorage.setItem("@habits", JSON.stringify(updated));
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  /* ===== Animated Styles ===== */
  const contentStyle = useAnimatedStyle(() => {
    const scale = interpolate(swipeProgress.value, [-120, 0, 120], [0.97, 1, 0.97], Extrapolate.CLAMP);
    return {
      opacity: contentAnim.value,
      transform: [
        { translateY: interpolate(contentAnim.value, [0, 1], [16, 0]) },
        { scale },
      ],
    };
  });

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
  }));

  /* ================= UI ================= */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* HEADER */}
      <View style={{ height: Platform.OS === "ios" ? 96 : 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={{ fontSize: 18, color: theme.textPrimary }}>All Habits</Text>
        <Text style={{ color: theme.textSecondary }}>HabitUp</Text>
      </View>

      {/* FILTER BAR */}
      <View style={{ marginVertical: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {filters.map((f, i) => (
            <Pressable key={f} onPress={() => setActiveIndex(i)} style={{ width: FILTER_WIDTH, alignItems: "center" }}>
              <Ionicons size={22} name={
                f === "today" ? "today-outline" :
                f === "week" ? "calendar-outline" :
                f === "month" ? "calendar-number-outline" : "calendar-clear-outline"
              } color={activeIndex === i ? theme.primary : theme.textSecondary} />
              <Text style={{ fontSize: 12, marginTop: 4, color: activeIndex === i ? theme.primary : theme.textSecondary }}>
                {f.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
        <Animated.View style={[{ height: 3, width: 36, backgroundColor: theme.primary, borderRadius: 2, marginTop: 8, marginLeft: (FILTER_WIDTH-36)/2 }, underlineStyle]} />
      </View>

      {/* DATE PICKER */}
      {activeFilter === "date" && (
        <Pressable onPress={() => setShowPicker(true)} style={{ alignSelf: "center", padding: 10, borderRadius: 12, backgroundColor: theme.card, marginBottom: 8 }}>
          <Text style={{ color: theme.textPrimary }}>{selectedDate.toDateString()}</Text>
        </Pressable>
      )}
      {showPicker && <DateTimePicker value={selectedDate} mode="date" onChange={(e,d) => { setShowPicker(false); if(d) setSelectedDate(d); }} />}

      {/* CONTENT */}
      <GestureDetector gesture={swipeGesture}>
        <Animated.ScrollView style={[{ paddingHorizontal: 16 }, contentStyle]} showsVerticalScrollIndicator={false}>
          {filteredHabits.length === 0 && <Text style={{ textAlign: "center", marginTop: 40, color: theme.textSecondary }}>No habits found 👀</Text>}

          {filteredHabits.map(h => (
            <HabitCard
              key={h.id}
              title={h.title}
              streaktime={h.repeatDays.length}
              countTime={timeLeft[h.id] || "Calculating..."}
              onComplete={() => handleComplete(h.id)}
              onDelete={() => deleteHabit(h.id)}
              completedhabit={h.completed}
            />
          ))}
        </Animated.ScrollView>
      </GestureDetector>
    </SafeAreaView>
  );
}
