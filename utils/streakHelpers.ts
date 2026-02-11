export const getLast7Days = () => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

export const calculateWeeklyProgress = (
  habitId: string,
  completions: any
) => {
  const days = getLast7Days();
  let completed = 0;

  days.forEach(day => {
    if (completions[day]?.includes(habitId)) {
      completed++;
    }
  });

  return completed;
};