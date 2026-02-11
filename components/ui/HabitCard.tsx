import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
export default function HabitCard({ title, isLast, onDelete,streaktime,countTime,onComplete,completedhabit}) {
  const [completed, setCompleted] = useState(completedhabit|| false);
  const [deleted, setDeleted] = useState(false);
  
  const translateX = useSharedValue(0);
  
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  // القيمة المسؤولة عن عرض التايم لاين (تبدأ من 0)
  const timelineWidth = useSharedValue(0);
const bgColor = useSharedValue(theme.background);
useEffect(() => {
  setCompleted(completedhabit || false);
}, [completedhabit]);
  // مراقبة حالة الإتمام لتحريك العرض
  useEffect(() => {
    if (completed) {
      timelineWidth.value = withSpring(30); // يظهر التايم لاين (تقريباً 10-15%)
    } else {
      timelineWidth.value = withTiming(0);
    }
  }, [completed]);

  const panGesture = Gesture.Pan()
    .enabled(!deleted)
    .onUpdate((event) => {
      // المنطق الجديد:
      if (completed) {
        // إذا مكتملة: اسمح فقط بالسحب لليسار (قيم سالبة)
        translateX.value = Math.min(0, event.translationX);
      } else {
        // إذا غير مكتملة: اسحب في الاتجاهين عادي
        translateX.value = event.translationX;
      }

      // تغيير لون الخلفية بناءً على الاتجاه
      if (translateX.value > 0) {
        bgColor.value = theme.completedColor; // أخضر (إتمام)
      } else if (translateX.value < 0) {
        bgColor.value =theme.delColor; // أحمر (حذف)
      }
    })
    .onEnd(() => {
      if (translateX.value > 100 && !completed) {
        // إتمام المهمة (فقط إذا لم تكن مكتملة أصلاً)
        translateX.value = withTiming(0);
        runOnJS(setCompleted)(true);
        onComplete && runOnJS(onComplete)();
      } else if (translateX.value < -100) {
        // حذف المهمة (متاح دائماً)
        translateX.value = withTiming(-500);
        runOnJS(setDeleted)(true);
        onDelete && runOnJS(onDelete)();
      } else {
        // إرجاع الكرت لمكانه
        translateX.value = withTiming(0);
        bgColor.value = withTiming(theme.background);
      }
    });


  // أنيميشن عمود التايم لاين
  const animatedTimelineStyle = useAnimatedStyle(() => ({
    width: timelineWidth.value,
    opacity: timelineWidth.value > 0 ? withTiming(1) : withTiming(0),
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(bgColor.value),
  }));
  const backgroundCardTheme={
    backgroundColor:theme.card
  }
  if (deleted) return null;

  return (
    <View style={styles.mainWrapper}>
      
      {/* --- الجزء الأيسر: الـ Timeline (متحرك العرض) --- */}
      <Animated.View style={[styles.timelineContainer, animatedTimelineStyle]}>
        <View style={[styles.dot, styles.dotCompleted]}>
          <Ionicons name="checkmark" size={10} color="white" />
        </View>
        {!isLast && <View style={styles.dottedLine} />}
      </Animated.View>

      {/* --- الجزء الأيمن: الكرت (يأخذ باقي المساحة تلقائياً) --- */}
      <View style={styles.cardWrapper}>
        <Animated.View style={[styles.background, backgroundStyle]}>
          <Ionicons name="checkmark-done" size={24} color="#22C55E" />
          <Ionicons name="trash-outline" size={24} color="#F87171" />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, cardStyle,backgroundCardTheme]}>
            <View style={[styles.cardContent]}>
              <View style={[styles.textGroup,{borderRightWidth:1,borderColor:theme.border}]}>
                <Text style={[{color:theme.textPrimary,fontSize: 14, fontWeight: "600",}, completed && styles.completedText]}>
                  {title}
                </Text>
                <Text style={styles.subTitle}>Streak {streaktime} Days</Text>
              </View>
                <View style={styles.timeGroup}>
                <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                <Text style={styles.timeText}>{countTime}</Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flexDirection: "row",
    paddingRight:4,
    minHeight: 80,
    overflow: 'hidden',
  },
  timelineContainer: {
    alignItems: "center",
    justifyContent: 'center',
    // العرض يتم التحكم به عبر AnimatedStyle
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  dotCompleted: {
    backgroundColor: "#FF8C42",
  },
  dottedLine: {
    position: "absolute",
    top: '60%',
    bottom: -20,
    width: 2,
    borderWidth: 1,
    borderColor: "#FF8C42",
    borderStyle: "dashed",
    zIndex: 1,
    
  },
  cardWrapper: {
    flex: 1, // هذا يجعله يأخذ كل المساحة المتبقية (100% ثم 90% تلقائياً)
    marginVertical: 5,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius:17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal:18,
  },
  card: {
    borderRadius: 15,
    padding: 18,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  iconPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  timeGroup: {
    alignItems: "center",
    marginLeft: 10,
  },
  timeText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  textGroup: {
    width: '70%',
    
    //marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  subTitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
});
