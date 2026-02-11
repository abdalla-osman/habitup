import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import { Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";

interface NotificationCartProps {
  habit: any;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
}

export default function NotificationCart({ habit, onEnable, onDisable }: NotificationCartProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const handlePress = async () => {
    console.log("Habit clicked for reminder:", habit); // 🔥 نطبع كل بيانات habit
    if (habit.reminder.enabled) {
      await onDisable();
    } else {
      await onEnable();
    }
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.promoCardColor,
      width: '100%',
      borderRadius: 20,
      marginTop: 10,
      padding: 10,
    }}>
      <View style={{ width: '70%' }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          color: theme.textPrimary,
        }}>Set the Reminder</Text>

        <Text style={{
          fontSize: 16,
          marginVertical: 10,
          fontWeight: '300',
          color: theme.promoCardTextColor,
        }}>
          Never miss your morning routine! Set reminder to start your day.
        </Text>

        <TouchableOpacity
          style={{
            width: 90,
            height: 40,
            borderRadius: 20,
            backgroundColor: habit.reminder.enabled
              ? theme.primary
              : theme.promoBottonColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 5,
          }}
          onPress={handlePress}
        >
          <Text style={{
            fontWeight: '700',
            textAlign: 'center',
            color: 'white',
          }}>
            {habit.reminder.enabled ? "Enabled" : "Set Now"}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <Image
          source={require("../../assets/images/Notifications.png")}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
      </View>
    </View>
  );
}