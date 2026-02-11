import * as Notifications from "expo-notifications";

export async function requestPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleHabitNotification(
  habitId: string,
  title: string,
  body: string,
  hour: number,
  minute: number
) {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { habitId },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: 'time',       // مهم جدًا
        hour,
        minute,
        repeats: true,      // لو عايز يوميًا، خليها true
        channelId: 'default', // مهم للـ Android
      } as any, // TypeScript
    });
  } catch (err) {
    console.log("❌ Error scheduling notification:", err);
    throw err;
  }
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}