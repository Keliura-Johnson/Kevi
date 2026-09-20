import { Ionicons } from "@expo/vector-icons";
import * as ExpoNotifications from "expo-notifications";
import { router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";

ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const DEFAULT_PREFS = {
    pushEnabled: true,
    appUpdates: true,
    aiPicks: true,
    newMovies: false,
};

export default function Notifications() {
    const [prefs, setPrefs] = useState(DEFAULT_PREFS);

    useEffect(() => {
        fetchPrefs();
    }, []);

    const fetchPrefs = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.notificationPrefs) {
                setPrefs({ ...DEFAULT_PREFS, ...data.notificationPrefs });
            }
        }
    };

    const savePrefs = async (updated) => {
        setPrefs(updated);
        const user = auth.currentUser;
        if (!user) return;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                notificationPrefs: updated,
            });
        } catch (error) {
            console.log("NOTIFICATION PREFS SAVE ERROR:", error);
        }
    };

    const requestPermissions = async () => {
        try {
            const { status } = await ExpoNotifications.requestPermissionsAsync();
            return status === "granted";
        } catch (error) {
            console.log("PERMISSION ERROR:", error);
            return false;
        }
    };

    const scheduleAIPicks = async () => {
        try {
            await ExpoNotifications.scheduleNotificationAsync({
                identifier: "aiPicksWeekly",
                content: {
                    title: "Your AI Picks are ready 🍿",
                    body: "Kevi found new movies matching your mood this week.",
                },
                trigger: {
                    weekday: 1,
                    hour: 10,
                    minute: 0,
                    repeats: true,
                },
            });
        } catch (error) {
            console.log("SCHEDULE AI PICKS ERROR:", error);
        }
    };

    const cancelAIPicks = async () => {
        try {
            await ExpoNotifications.cancelScheduledNotificationAsync("aiPicksWeekly");
        } catch (error) {
            console.log("CANCEL AI PICKS ERROR:", error);
        }
    };

    const scheduleNewMovies = async () => {
        try {
            await ExpoNotifications.scheduleNotificationAsync({
                identifier: "newMoviesWeekly",
                content: {
                    title: "New Movies on Kevi 🎬",
                    body: "Fresh trending titles just landed. Come take a look.",
                },
                trigger: {
                    weekday: 5,
                    hour: 12,
                    minute: 0,
                    repeats: true,
                },
            });
        } catch (error) {
            console.log("SCHEDULE NEW MOVIES ERROR:", error);
        }
    };

    const cancelNewMovies = async () => {
        try {
            await ExpoNotifications.cancelScheduledNotificationAsync("newMoviesWeekly");
        } catch (error) {
            console.log("CANCEL NEW MOVIES ERROR:", error);
        }
    };

    const fireUpdateConfirmation = async () => {
        try {
            await ExpoNotifications.scheduleNotificationAsync({
                content: {
                    title: "Notifications On",
                    body: "You'll be notified here whenever Kevi has an update.",
                },
                trigger: null,
            });
        } catch (error) {
            console.log("UPDATE CONFIRMATION ERROR:", error);
        }
    };

    const togglePref = async (key) => {
        const turningOn = !prefs[key];
        const updated = { ...prefs, [key]: turningOn };

        if (turningOn) {
            const granted = await requestPermissions();
            if (!granted) return;
        }

        if (key === "aiPicks") {
            turningOn ? await scheduleAIPicks() : await cancelAIPicks();
        } else if (key === "newMovies") {
            turningOn ? await scheduleNewMovies() : await cancelNewMovies();
        } else if (key === "appUpdates" && turningOn) {
            await fireUpdateConfirmation();
        }

        savePrefs(updated);
    };

    const toggleMaster = async () => {
        const newValue = !prefs.pushEnabled;

        if (!newValue) {
            try {
                await ExpoNotifications.cancelAllScheduledNotificationsAsync();
            } catch (error) {
                console.log("CANCEL ALL ERROR:", error);
            }
            savePrefs({
                pushEnabled: false,
                appUpdates: false,
                aiPicks: false,
                newMovies: false,
            });
        } else {
            const granted = await requestPermissions();
            if (!granted) return;
            savePrefs({ ...prefs, pushEnabled: true });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

                <View style={styles.masterCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.masterTitle}>Allow Push Notifications</Text>
                        <Text style={styles.masterSubtitle}>Toggle all visual mobile updates on this device</Text>
                    </View>
                    <Switch
                        value={prefs.pushEnabled}
                        onValueChange={toggleMaster}
                        trackColor={{ false: "#412A6F", true: "#7F56D9" }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <Text style={styles.sectionLabel}>APP UPDATES</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>Product Updates</Text>
                            <Text style={styles.rowSubtitle}>Get notified about new features and changes to Kevi</Text>
                        </View>
                        <Switch
                            value={prefs.appUpdates}
                            onValueChange={() => togglePref("appUpdates")}
                            disabled={!prefs.pushEnabled}
                            trackColor={{ false: "#412A6F", true: "#7F56D9" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <Text style={styles.sectionLabel}>RECOMMENDATIONS</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>AI Movie Picks</Text>
                            <Text style={styles.rowSubtitle}>Weekly hand-picked movies based on your mood</Text>
                        </View>
                        <Switch
                            value={prefs.aiPicks}
                            onValueChange={() => togglePref("aiPicks")}
                            disabled={!prefs.pushEnabled}
                            trackColor={{ false: "#412A6F", true: "#7F56D9" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitle}>New Movies</Text>
                            <Text style={styles.rowSubtitle}>Weekly reminder about fresh trending titles</Text>
                        </View>
                        <Switch
                            value={prefs.newMovies}
                            onValueChange={() => togglePref("newMovies")}
                            disabled={!prefs.pushEnabled}
                            trackColor={{ false: "#412A6F", true: "#7F56D9" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090315" },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 20, paddingVertical: 16,
    },
    headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
    masterCard: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#160626", borderWidth: 1, borderColor: "#7F56D9",
        borderRadius: 16, padding: 16, marginTop: 10, marginBottom: 20,
    },
    masterTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
    masterSubtitle: { color: "#8B859B", fontSize: 12, marginTop: 4 },
    sectionLabel: { color: "#8B859B", fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 8, marginTop: 16 },
    card: { backgroundColor: "#160626", borderRadius: 14, padding: 16 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
    rowTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
    rowSubtitle: { color: "#8B859B", fontSize: 12, marginTop: 3, lineHeight: 17 },
    divider: { height: 1, backgroundColor: "#2A1F3D", marginVertical: 14 },
});