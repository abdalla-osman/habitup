import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
type Props = {
  focused: boolean;
  icon: any;
  label: string;
};

export default function TabIcon({ focused, icon, label }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
const { isDark } = useTheme();
const theme = isDark ? darkTheme : lightTheme;
  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
    scale.value = withTiming(focused ? 1 : 0.8, { duration: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ 
      alignItems: "center",
      justifyContent: "center" ,
      flexDirection: 'row',
      gap:4,
      
    }}>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? theme.tabActive:theme.tabInactive}
      />

      {focused && (
        <Animated.Text
          style={[
            {
              fontSize: 11,
              color:focused ? theme.tabActive:theme.tabInactive,
            },
            animatedStyle,
          ]}
        >
          {label}
        </Animated.Text>
      )}
    </View>
  );
}