import EmptyStreaksAnimation from '../../components/ui/EmptyStreaksAnimation';
import WeeklySummaryCard from '../../components/ui/WeeklySummaryCard';
import { View, Text ,Platform,SafeAreaView,ScrollView} from "react-native";
import StreaksChart from "@/components/ui/StreaksChart";
import InsightCard from "@/components/ui/InsightCard";
import {getInsightMessage} from "@/utils/getInsightMessage";
import {getHabitInsight} from "@/utils/getHabitInsight";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateWeeklyProgress } from "@/utils/streakHelpers";
/*const habitsProgress = [
  { id: "1", title: "Walking", color: "#F4A261", completedDays: 5, totalDays: 7 },
  { id: "2", title: "Running", color: "#CC7035", completedDays: 3, totalDays: 7 },
  { id: "3", title: "Meditation", color: "#9BC53D", completedDays: 2, totalDays: 7 },
  { id: "4", title: "Drink", color: "#F2B5D4", completedDays: 4, totalDays: 7 },
  { id: "5", title: "Drink", color: "#d2B5D4", completedDays: 4, totalDays: 7 },
  { id: "6", title: "Drink", color: "#32B5D4", completedDays: 4, totalDays: 7 },
];*/


const COLORS = [
  "#F4A261",
  "#CC7035",
  "#9BC53D",
  "#F2B5D4",
  "#32B5D4",
  "#6C63FF",
];

export default function StreaksScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
const [resetAnimation, setResetAnimation] = useState(false);
const [habitsProgress, setHabitsProgress] = useState<any[]>([]);

  const loadHabitsProgress = async () => {
  const habitsJson = await AsyncStorage.getItem("@habits");
  const completionsJson = await AsyncStorage.getItem("@completions");

  const habits = habitsJson ? JSON.parse(habitsJson) : [];
  const completions = completionsJson ? JSON.parse(completionsJson) : {};

const progress = habits.map((habit, index) => ({
  id: habit.id,
  title: habit.title,
  color: habit.color || COLORS[index % COLORS.length],
  completedDays: calculateWeeklyProgress(habit.id, completions),
  totalDays: 7,
  reminder: habit.reminder, // 🔥 مهم
}));
  setHabitsProgress(progress);
  console.log('completions',completions)
  console.log('habits',habits)
  console.log('progress',progress)
};
  const insight = getHabitInsight(habitsProgress);
  // useFocusEffect(
  //   useCallback(() => {
  //     setResetAnimation(prev => !prev); // toggle لتشغيل الانيميشن
  //   }, [])
  // );
  useFocusEffect(
  useCallback(() => {
    loadHabitsProgress();
    setResetAnimation(prev => !prev);
  }, [])
);
  
  return (
<ScrollView  showsVerticalScrollIndicator={false} style={{
}}>
<SafeAreaView
style={{
flex: 1,
backgroundColor: theme.background,
paddingTop: 40,
paddingHorizontal: 20,
paddingBottom: 150,
}}
>
<View
style={{
height:Platform.Os==='ios'?96:56,
alignItems: 'center',
justifyContent: 'space-between',
flexDirection: 'row',
}}>
<Text style={{
fontSize: 20,
fontWeight: '500',
color:theme.textPrimary
}}>
Your Habits Streaks
</Text>
<Text style={{
fontSize:18,
fontWeight: '300',
color:theme.textPrimary
}}>
HabitUp
</Text>
</View>
{habitsProgress.length===0&&(
<EmptyStreaksAnimation />
)}
<StreaksChart data={habitsProgress}   
resetAnimation={resetAnimation}/>
{insight && (
<InsightCard  
strongest={insight.strongest}  
weakest={insight.weakest}  
message={insight.message}  
/>
)}
<WeeklySummaryCard habitsProgress={habitsProgress} />
</SafeAreaView>
</ScrollView>
);


}