import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
export default function AppLayout() {
  const { isDark } = useTheme()
  const theme = isDark ? 'dark' : 'light';
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}