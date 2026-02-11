export const getInsightMessage = (
  strongest: HabitProgress & { percent: number },
  weakest: HabitProgress & { percent: number }
) => {
  if (strongest.percent === 100) {
    return `🔥 Amazing! You completed "${strongest.title}" every single day this week.`;
  }

  if (weakest.percent < 40) {
    return `💪 Let’s focus more on "${weakest.title}" next week and build momentum.`;
  }

  return `👏 "${strongest.title}" is your strongest habit this week. Keep it up!`;
};