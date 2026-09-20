import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return(
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#090315',
          },
          animation: 'none',
        }}
      >
        <Stack.Screen name="index"/>
        <Stack.Screen name="onboarding2"/>
        <Stack.Screen name="onboarding3"/>
        <Stack.Screen name="signup"/>
        <Stack.Screen name="signin"/>
        <Stack.Screen name="privacypolicy"/>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="preference"/>
        <Stack.Screen name="forgottenpass"/>
        <Stack.Screen name="trailer"/>
        <Stack.Screen name="searchResult"/>
      </Stack>
    </ThemeProvider>
  )
}