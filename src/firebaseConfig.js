import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKqM4FyT1Nuh-Mz1QTVuMP1lQds3CuSJA",
  authDomain: "kevi-7c236.firebaseapp.com",
  projectId: "kevi-7c236",
  storageBucket: "kevi-7c236.firebasestorage.app",
  messagingSenderId: "736111976625",
  appId: "1:736111976625:web:b86d35e4d2a8ccb1880290",
  measurementId: "G-MN4GEK0PYD"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);