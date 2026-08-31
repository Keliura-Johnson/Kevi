import { Stack } from "expo-router";

export default function RootLayout() {
  return(
       <Stack screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="onboarding2"/>
      <Stack.Screen name="onboarding3"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="signin"/>
    </Stack>
    
  ) 
}
