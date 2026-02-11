import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { requestPermission, scheduleHabitNotification, cancelNotification } from "@/utils/notifications";

export default function useHabitReminder(habits: any[], setHabits: (h: any[]) => void) {

  const enableReminder = async (habit: any) => {
    console.log("Habit clicked for reminder:", habit);

    if (!habit.reminder?.startTime || !habit.reminder?.endTime) {
      console.warn("Reminder not enabled or start/end time missing for habit:", habit.title);
      return;
    }

    const ok = await requestPermission();
    if (!ok) return;

    const [hour, minute] = habit.reminder.startTime.split(":").map(Number);

    const notificationId = await scheduleHabitNotification(
      habit.id,
      "Habit Reminder",
      habit.title,
      hour,
      minute
    );

    updateHabitReminder(habit.id, true, notificationId);
  };

  const disableReminder = async (habit: any) => {
    if (habit.notificationId) {
      await cancelNotification(habit.notificationId);
    }

    updateHabitReminder(habit.id, false, null);
  };

  const updateHabitReminder = (habitId: string, enabled: boolean, notificationId: string | null) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? { ...h, reminder: { ...h.reminder, enabled }, notificationId }
          : h
      )
    );
  };

  return { enableReminder, disableReminder };
}