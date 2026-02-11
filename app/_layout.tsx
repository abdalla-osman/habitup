import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

import { ThemeProvider } from "@/context/ThemeContext";
import { initDB } from "@/db";
import AppLayout from "./AppLayout";
import CustomSplashScreen from "./CustomSplashScreen";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FFD7B0',
  });
}
// تمنع Expo من إخفاء Splash تلقائياً
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // تحضير الـ DB أو أي عملية async قبل إظهار التطبيق
    const prepareApp = async () => {
      try {
        await initDB();
        // أي عمليات ثانية ممكن تحطها هنا (مثلاً جلب الإعدادات)
      } catch (e) {
        console.warn("Error preparing app:", e);
      } finally {
        // Simulate delay لو تحب
        setTimeout(async () => {
          setAppReady(true);
          await SplashScreen.hideAsync();
        }, 2000); // 2 ثانية Splash
      }
    };

    prepareApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          {appReady ? (
            <Animated.View
              style={{ flex: 1 }}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(500)}
            >
              <AppLayout />
            </Animated.View>
          ) : (
            <Animated.View
              style={{ flex: 1 }}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
            >
              <CustomSplashScreen />
            </Animated.View>
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}