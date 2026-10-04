import {
  Geist_400Regular,
  Geist_700Bold,
  useFonts,
} from '@expo-google-fonts/geist';
import {
  Outfit_400Regular,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { applyActionCode, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from 'react';
import { Linking } from "react-native";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebaseConfig";

SplashScreen.preventAutoHideAsync();

function StackLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'none',
      }}
    >
     
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding2" />
      <Stack.Screen name="onboarding3" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="privacypolicy" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="preference" />
      <Stack.Screen name="forgottenpass" />
      <Stack.Screen name="trailer" />
      <Stack.Screen name="searchResult" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist_400Regular,
    Geist_700Bold,
    Outfit_400Regular,
    Outfit_700Bold,
  });

  const handleDeepLink = async (url) => {
    if (!url) return;

    try {
      let oobCode = null;

      if (url.includes("?")) {
        const query = url.split("?")[1];
        const params = new URLSearchParams(query);
        oobCode = params.get("oobCode");

        const continueUrl = params.get("continueUrl");
        if (!oobCode && continueUrl) {
          const decodedContinueUrl = decodeURIComponent(continueUrl);
          if (decodedContinueUrl.includes("?")) {
            const nestedParams = new URLSearchParams(decodedContinueUrl.split("?")[1]);
            oobCode = nestedParams.get("oobCode");
          }
        }
      }

      if (oobCode) {
        await applyActionCode(auth, oobCode);

        const pendingSignup = await AsyncStorage.getItem("pendingSignup");
        let activeUser = auth.currentUser;

        if (pendingSignup) {
          const userData = JSON.parse(pendingSignup);

          if (!activeUser && userData.email && userData.password) {
            try {
              const credential = await signInWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
              );
              activeUser = credential.user;
            } catch (authErr) {
              console.log("Auto sign-in after link verification failed:", authErr);
            }
          }

          if (activeUser) {
            await setDoc(
              doc(db, "users", activeUser.uid),
              {
                fullname: userData.fullname || "",
                phone: userData.phone || "",
                email: userData.email || "",
                emailVerified: true,
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            );
            await AsyncStorage.removeItem("pendingSignup");
          }
        }

        if (auth.currentUser) {
          await auth.currentUser.reload();
          
          try {
            const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (userSnap.exists() && userSnap.data()?.favoriteGenres?.length >= 3) {
              router.replace("/(tabs)");
              return;
            }
          } catch (docErr) {
            console.log("Firestore fetch error after link:", docErr);
          }

          router.replace("/preference");
          return;
        }

        router.replace("/signin");
      }
    } catch (err) {
      console.log("DEEP LINK ERROR:", err);

      if (auth.currentUser) {
        try {
          const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userSnap.exists() && userSnap.data()?.favoriteGenres?.length >= 3) {
            router.replace("/(tabs)");
            return;
          }
        } catch (e) {
          console.log("Fallback userSnap error:", e);
        }
        router.replace("/preference");
      } else {
        router.replace("/signin");
      }
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      setTimeout(() => {
        handleDeepLink(url);
      }, 100);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        setTimeout(() => {
          handleDeepLink(url);
        }, 100);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}