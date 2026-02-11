import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* 1️⃣ شكل البيانات داخل الـ context */
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

/* 2️⃣ إنشاء الـ context */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* 3️⃣ نوع children */
type ThemeProviderProps = {
  children: ReactNode;
};

const THEME_KEY = "@app_theme";

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  // 🔹 تحميل الثيم المحفوظ
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setIsDark(savedTheme === "dark");
      }
      setLoaded(true);
    };
    loadTheme();
  }, []);

  // 🔹 تغيير + حفظ الثيم
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem(
      THEME_KEY,
      newTheme ? "dark" : "light"
    );
  };

  // عشان ما يفلش قبل ما يقرأ التخزين
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}