export type AppTheme = {
  background: string;
  card: string;
  primary:string;
  primaryLight:string;
  orange:string;
  yellow:string;
  pink:string;
  green:string;
  textPrimary:string;
  text:string
  textSecondary:string;
  tabBarBackground:string;
  tabInactive:string;
  tabActive:string;
  tabBorder:string;
  border:string;
  delColor:string;
  completedColor:string;
  promoCardColor:string;
  promoBottonColor:string;
  promoCardTextColor:string;
};

// theme/lightTheme.js
export const lightTheme: AppTheme = {
  background: "#FAF7F2",          // ممتاز
  card: "#FFFFFF",               // ممتاز

  primary: "#5A2E15",             // أغمق شوية (أكثر فخامة)
  primaryLight: "#EAD5C5",

  orange: "#F4A261",              // خليها زي ما هي
  promoCardColor: "#FFD7B0",      // ممتاز
  promoCardTextColor: "##3A2A1F",      // ممتاز
  promoBottonColor: "#5A2E15",    // نفس primary → انسجام

  green: "#9ED2C6",               // أهدى شوية
  completedColor: "#E6F6F1",      // أخف (ما يصرخ)

  yellow: "#F6D365",
  pink: "#F2B5D4",

  textPrimary: "#2A2A2A",         // أوضح شوية
  textSecondary: "#7A7A7A",
  text: "#6B7280",

  border: "#EFE6DC",

  tabBarBackground: "#FFFFFF",
  tabInactive: "#9A9A9A",
  tabActive: "#5A2E15",
  tabBorder: "#EFE6DC",

  delColor: "#DC2626",            // أنضف من ef4444
};
export const darkTheme: AppTheme = {
  background: "#0F0F0F",          // أعمق شوية
  card: "#1B1B1B",

  primary: "#F1D0B5",             // دافي وناعم
  primaryLight: "#7A3E1D",

  orange: "#F4A261",
  promoCardColor: "#ED9455",      // ممتاز
  promoBottonColor: "#6B3A12",  
  promoCardTextColor:"#FFFFFF",// يندمج مع الكرت

  green: "#7FC8A9",
  completedColor: "#0F3D2E",      // واضح لكن هادي

  yellow: "#EFD07A",
  pink: "#E7A7C6",

  textPrimary: "#F9FAFB",
  textSecondary: "#A1A1AA",
  text: "#9CA3AF",

  border: "#2A2A2A",

  tabBarBackground: "#1B1B1B",
  tabInactive: "#7A7A7A",
  tabActive: "#F1D0B5",
  tabBorder: "#2A2A2A",

  delColor: "#7F1D1D",             // ممتاز
};
// theme/darkTheme.js
