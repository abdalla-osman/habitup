import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import {getInsightMessage} from "@/utils/getInsightMessage";
type InsightCardProps = {
  strongest: HabitProgress & { percent: number };
  weakest: HabitProgress & { percent: number };
  message: string;
};

export default function InsightCard({ strongest,weakest}: Props) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const message = getInsightMessage(strongest, weakest);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Insight this week ✨
      </Text>

      <Text style={[styles.message, { color: theme.text }]}>
        {message}
      </Text>

      <View style={styles.row}>
        <Text style={{ color: theme.textSecondary }}>
          🏆 Best:{" "}
          <Text style={{ color: strongest.color }}>
            {strongest.title} ({strongest.percent}%)
          </Text>
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={{ color: theme.textSecondary }}>
          ⚠️ Needs work:{" "}
          <Text style={{ color: weakest.color }}>
            {weakest.title} ({weakest.percent}%)
          </Text>
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    marginTop: 4,
  },
});