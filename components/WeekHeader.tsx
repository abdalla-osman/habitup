import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
function getWeekDates() {
  const today = new Date();
  const dayIndex = (today.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayIndex);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}
import { View, Text } from "react-native";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekHeader() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const weekDates = getWeekDates();
  const today = new Date().toDateString();

  return (
    <View style={{ paddingVertical: 12 }}>
      {/* صف الأيام */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {days.map(day => (
          <Text
            key={day}
            style={{
              width: 40,
              textAlign: "center",
              color: "#6B7280",
              fontSize: 12,
            }}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* صف التواريخ */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {weekDates.map((date, index) => {
          const isToday = date.toDateString() === today;

          return (
            <View
              key={index}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isToday ?theme.orange : "transparent",
              }}
            >
              <Text
                style={{
                  color: isToday ? "white" :theme.textSecondary,
                  fontWeight: isToday ? "bold" : "normal",
                }}
              >
                {date.getDate()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}