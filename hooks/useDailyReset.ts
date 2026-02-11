import { useEffect } from "react";

export default function useDailyReset(onNewDay: () => void) {
  useEffect(() => {
    const now = new Date();

    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0, 0
    );

    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      onNewDay(); // 🔄 إعادة حساب اليوم
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [onNewDay]);
}