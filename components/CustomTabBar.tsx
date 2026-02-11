import TabIcon from './TabIcon';
import { View, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import { useEffect } from "react";
//import {TabIcon} from "./TabIcon";
const { width } = Dimensions.get("window");
const TAB_COUNT = 4;
const TAB_WIDTH = width * 0.95 / TAB_COUNT;

export default function CustomTabBar({ state, navigation }) {
  // indicator position
  const translateX = useSharedValue(0);
const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  useEffect(() => {
  translateX.value = withTiming(state.index * TAB_WIDTH, {
    duration: 300,
  });
}, [state.index]);
  // لما التاب يتغير
  translateX.value = withTiming(state.index * TAB_WIDTH, {
    duration: 250,
  });

const indicatorStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
}));

  return (
<View
  style={{
    flexDirection: "row",
    height:86,
    width: "95%",
    backgroundColor: theme.tabBarBackground,
    borderRadius: 15,
    alignSelf: "center",
    position: "absolute",
    bottom:48,
    
  }}
>
      {/* Indicator */}
<Animated.View
  style={[
    {
      position: "absolute",
      //height: 38,
      width: TAB_WIDTH-8 ,
      left:4,
      backgroundColor:theme.primaryLight,
      height: 44,
      top: (86 - 44) /2,
      borderRadius: 22,
    },
    indicatorStyle,
  ]}
/>

      {state.routes.map((route, index) => {
        const focused = state.index === index;
        let calendar=focused?'calendar-number':'calendar-number-outline';
        let barChar=focused?'bar-chart':'bar-chart-outline';
        let person=focused?'person':'person-outline';
        let add=focused?"add-circle":'add-circle-outline'
        return (
          <Pressable
            key={route.key}
            style={{
              width: TAB_WIDTH,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate(route.name)}
          >
            <TabIcon
              icon={
                route.name === "home"
                  ? calendar
                  : route.name === "streaks"
                  ? barChar
                  :route.name=="settings" 
                  ?person
                  :add
              }
              label={
                route.name === "home"
                  ? "Today"
                  : route.name === "streaks"
                  ? "Streaks"
                  :route.name=="settings" 
                  ?"Profile"
                  :"Add-Habit"
              }
              size={16}
              focused={focused}
              
            />
          </Pressable>
        );
      })}
    </View>
  );
}