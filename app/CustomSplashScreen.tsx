import HabitUpTitle from '../components/HabitUpTitle';
import { SafeAreaView,Text,View } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import {useEffect,useState} from "react";
export default function CustomSplashScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 800 });
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:theme.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View style={style}>
          <HabitUpTitle />
      </Animated.View>
    </View>
  );
}