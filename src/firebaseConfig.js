import AsyncStorage from "@react-native-async-storage/async-storage";

import { initializeApp } from "firebase/app";

import {
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { getRemoteConfig } from "firebase/remote-config";

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

let auth;

try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (error) {
    if (error.code === "auth/already-initialized") {
        auth = getAuth(app);
    } else {
        throw error;
    }
}

export { auth };

export const db = getFirestore(app);

export const storage = getStorage(app);

export const remoteConfig = getRemoteConfig(app);

remoteConfig.defaultConfig = {
    subscription_required: false
};

remoteConfig.settings.minimumFetchIntervalMillis = 3600000;