
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = 'HABITS_STORAGE';

/* =========================
   init (اختياري)
========================= */
export const initDB = async () => {
  const data = await AsyncStorage.getItem(HABITS_KEY);
  if (!data) {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify([]));
  }
  console.log('AsyncStorage initialized');
};

/* =========================
   Save Habit
========================= */
export const saveHabit = async (habit: any) => {
  try {
    const stored = await AsyncStorage.getItem(HABITS_KEY);
    const habits = stored ? JSON.parse(stored) : [];

    habits.push(habit);

    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    console.log('Habit saved!', habit.title);
  } catch (err) {
    console.log('Error saving habit:', err);
  }
};

/* =========================
   Get Habits
========================= */
export const getHabits = async () => {
  try {
    const stored = await AsyncStorage.getItem(HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.log('Error fetching habits:', err);
    return [];
  }
};

/* =========================
   Delete Habit (اختياري)
========================= */
export const deleteHabit = async (id: string) => {
  const stored = await AsyncStorage.getItem(HABITS_KEY);
  const habits = stored ? JSON.parse(stored) : [];

  const filtered = habits.filter((h: any) => h.id !== id);
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(filtered));
};