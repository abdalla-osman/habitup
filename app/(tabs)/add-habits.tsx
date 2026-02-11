import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import { saveHabit, initDB } from "@/db";
import NotificationToggle from "@/components/ui/NotificationToggle";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
//import * as Notifications from "expo-notifications";
import { scheduleHabitNotification, requestPermission } from "@/utils/notifications";
export default function NewHabitScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const router = useRouter();

  const [habitName, setHabitName] = useState("");
  const [selectedDays, setSelectedDays] = useState(["Mon"]);
  const [reminder, setReminder] = useState(false);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const days=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  //const days = ["M", "T", "W", "T", "F", "S", "S"];

  useEffect(() => {
    initDB(); // initialize database once
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Time Picker handlers
  const showStartPicker = () => setStartPickerVisible(true);
  const hideStartPicker = () => setStartPickerVisible(false);
  const handleConfirmStart = (date: Date) => {
    setStartTime(date);
    hideStartPicker();
  };

  const showEndPicker = () => setEndPickerVisible(true);
  const hideEndPicker = () => setEndPickerVisible(false);
  const handleConfirmEnd = (date: Date) => {
    setEndTime(date);
    hideEndPicker();
  };

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };
  const getNextTriggerDate = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const now = new Date();
  const trigger = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );

  // لو الوقت فات اليوم، نخليها لليوم الجاي
  if (trigger < now) trigger.setDate(trigger.getDate() + 1);
  return trigger;
};

const saveHabitHandler = async () => {
  if (!habitName.trim()) return;

  const newHabit = {
    id: Date.now().toString(),
    title: habitName,
    repeatDays: selectedDays,
    reminder: {
      enabled: reminder,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
    },
    notificationId: null,
    createdAt: new Date().toISOString(),
  };

  try {
    // ✅ حفظ habit في AsyncStorage
    const jsonValue = await AsyncStorage.getItem("@habits");
    const storedHabits = jsonValue != null ? JSON.parse(jsonValue) : [];
    const updatedHabits = [...storedHabits, newHabit];
    await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));

    // ✅ تشغيل الإشعار إذا مفعّل
    if (reminder) {
      const ok = await requestPermission();
      if (ok && newHabit.reminder.startTime) {
        const [hour, minute] = newHabit.reminder.startTime.split(":").map(Number);
        const notificationId = await scheduleHabitNotification(
          newHabit.id,
          "Habit Reminder",
          newHabit.title,
          hour,
          minute
        );
        newHabit.notificationId = notificationId;

        // تحديث AsyncStorage مع notificationId
        await AsyncStorage.setItem("@habits", JSON.stringify([...storedHabits, newHabit]));
      }
    }

    console.log("Habit saved!", newHabit);

    setHabitName("");
    setSelectedDays(["Mon"]);
    setReminder(false);

    router.push("/home");
  } catch (err) {
    console.log("Error saving habit:", err);
  }
};

  

  const clearHabits = async () => {
    await AsyncStorage.removeItem('@habits');
    console.log('All habits cleared');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: theme.textPrimary }}>New habit</Text>
            <Ionicons name="close" size={20} color={theme.textPrimary} />
          </View>

          {/* Habit Name */}
          <Text style={styles(theme).label}>Name your habit</Text>
          <TextInput
            style={styles(theme).input}
            placeholder="Morning Meditations"
            placeholderTextColor={theme.textSecondary}
            value={habitName}
            onChangeText={setHabitName}
          />

          {/* Repeat Days */}
          <Text style={styles(theme).label}>Repeat days</Text>
          <View style={styles(theme).daysRow}>
            {days.map((day, i) => {
              const active = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => toggleDay(day)}
                  style={{
                    ...styles(theme).dayCircle,
                    backgroundColor: active ? theme.primary : theme.card,
                  }}
                >
                  <Text style={{ color: active ? "#fff" : theme.textSecondary, fontWeight: "600" }}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Reminder */}
          <View style={styles(theme).reminderRow}>
            <Text style={styles(theme).label}>Get reminders</Text>
            <NotificationToggle />
          </View>

          {/* Start & End Time */}
          {reminder && (
            <>
      
            </>
          )}
                  <TouchableOpacity style={styles(theme).timePicker} onPress={showStartPicker}>
                <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
                <Text style={{ color: theme.textPrimary }}>Start: {formatTime(startTime)}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="time"
                date={startTime}
                onConfirm={handleConfirmStart}
                onCancel={hideStartPicker}
              />

              <TouchableOpacity style={styles(theme).timePicker} onPress={showEndPicker}>
                <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
                <Text style={{ color: theme.textPrimary }}>End: {formatTime(endTime)}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndPickerVisible}
                mode="time"
                date={endTime}
                onConfirm={handleConfirmEnd}
                onCancel={hideEndPicker}
              />
          {/* Save Button */}
          <TouchableOpacity
            style={styles(theme).saveBtn}
            onPress={saveHabitHandler}
          >
            <Text style={styles(theme).saveText}>Save Habit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 10,
    },
    input: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
      fontSize: 16,
      color: theme.textPrimary,
      marginBottom: 20,
    },
    daysRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    dayCircle: {
      width: 42,
      height: 42,
      borderRadius: 21,
      justifyContent: "center",
      alignItems: "center",
    },
    reminderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    timePicker: {
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
    },
    saveBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 18,
      borderRadius: 26,
      alignItems: "center",
      marginTop: 10,
    },
    saveText: {
      color: "#FFF",
      fontSize: 18,
      fontWeight: "700",
    },
  });