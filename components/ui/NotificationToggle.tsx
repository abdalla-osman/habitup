import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useState } from "react";

export default function NotificationToggle() {
  const [enabled, setEnabled] = useState(false);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onToggle = () => {
    setEnabled(!enabled);
    translateX.value = withTiming(enabled ? 0 : 22, { duration: 200 });

    // 👇 هنا لاحقاً نربط الإشعارات
    // scheduleNotification()
  };

  return (
    <Pressable
      onPress={onToggle}
      style={{
        width: 50,
        height: 28,
        borderRadius: 20,
        backgroundColor: enabled ? "#4CAF50" : "#ccc",
        padding: 3,
      }}
    >
      <Animated.View
        style={[
          {
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: "#fff",
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}