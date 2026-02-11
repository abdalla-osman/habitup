import {getInsightMessage} from "@/utils/getInsightMessage";
export const getHabitInsight = (habits: HabitProgress[]) => {
  if (!habits || habits.length === 0) return null;

  const habitsWithPercent = habits.map(habit => ({
    ...habit,
    percent: Math.round((habit.completedDays / habit.totalDays) * 100),
  }));

  let strongest = habitsWithPercent[0];
  let weakest = habitsWithPercent[0];

  habitsWithPercent.forEach(habit => {
    if (habit.percent > strongest.percent) strongest = habit;
    if (habit.percent < weakest.percent) weakest = habit;
  });

  return {
    strongest,
    weakest,
    message: getInsightMessage(strongest, weakest),
  };
};