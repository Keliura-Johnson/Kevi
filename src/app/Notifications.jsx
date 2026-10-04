
// import { Ionicons } from "@expo/vector-icons";
// import * as ExpoNotifications from "expo-notifications";
// import { router } from "expo-router";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTheme } from "../context/ThemeContext";
// import { auth, db } from "../firebaseConfig";

// ExpoNotifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//     }),
// });

// const DEFAULT_PREFS = {
//     pushEnabled: true,
//     appUpdates: true,
//     aiPicks: true,
//     newMovies: false,
// };

// export default function Notifications() {
//     const { colors } = useTheme();
//     const [prefs, setPrefs] = useState(DEFAULT_PREFS);

//     useEffect(() => {
//         fetchPrefs();
//     }, []);

//     const fetchPrefs = async () => {
//         const user = auth.currentUser;
//         if (!user) return;

//         try {
//             const userDoc = await getDoc(doc(db, "users", user.uid));
//             if (userDoc.exists()) {
//                 const data = userDoc.data();
//                 if (data.notificationPrefs) {
//                     setPrefs({ ...DEFAULT_PREFS, ...data.notificationPrefs });
//                 }
//             }
//         } catch (error) {
//             console.log("FETCH PREFS ERROR:", error);
//         }
//     };

//     const savePrefs = async (updated) => {
//         setPrefs(updated);
//         const user = auth.currentUser;
//         if (!user) return;

//         try {
//             await updateDoc(doc(db, "users", user.uid), {
//                 notificationPrefs: updated,
//             });
//         } catch (error) {
//             console.log("NOTIFICATION PREFS SAVE ERROR:", error);
//         }
//     };

//     const requestPermissions = async () => {
//         try {
//             const { status } = await ExpoNotifications.requestPermissionsAsync();
//             return status === "granted";
//         } catch (error) {
//             console.log("PERMISSION ERROR:", error);
//             return false;
//         }
//     };

//     const scheduleAIPicks = async () => {
//         try {
//             await ExpoNotifications.scheduleNotificationAsync({
//                 identifier: "aiPicksWeekly",
//                 content: {
//                     title: "Your AI Picks are ready 🍿",
//                     body: "Use Kevi Ai to find new movies matching your mood this week.",
//                     data: { url: "/(tabs)/Ai" }, // 👈 Capitalized tab route
//                 },
//                 trigger: {
//                     type: ExpoNotifications.SchedulableTriggerInputTypes.WEEKLY,
//                     weekday: 2, // Monday
//                     hour: 10,
//                     minute: 0,
//                 },
//             });
//         } catch (error) {
//             console.log("SCHEDULE AI PICKS ERROR:", error);
//         }
//     };

//     const cancelAIPicks = async () => {
//         try {
//             await ExpoNotifications.cancelScheduledNotificationAsync("aiPicksWeekly");
//         } catch (error) {
//             console.log("CANCEL AI PICKS ERROR:", error);
//         }
//     };

//     const scheduleNewMovies = async () => {
//         try {
//             await ExpoNotifications.scheduleNotificationAsync({
//                 identifier: "newMoviesWeekly",
//                 content: {
//                     title: "New Movies on Kevi 🎬",
//                     body: "Fresh trending titles just landed. Come take a look.",
//                     data: { url: "/Trending" }, 
//                 },
//                 trigger: {
//                     type: ExpoNotifications.SchedulableTriggerInputTypes.WEEKLY,
//                     weekday: 6, // Friday
//                     hour: 12,
//                     minute: 0,
//                 },
//             });
//         } catch (error) {
//             console.log("SCHEDULE NEW MOVIES ERROR:", error);
//         }
//     };

//     const cancelNewMovies = async () => {
//         try {
//             await ExpoNotifications.cancelScheduledNotificationAsync("newMoviesWeekly");
//         } catch (error) {
//             console.log("CANCEL NEW MOVIES ERROR:", error);
//         }
//     };

//     const fireUpdateConfirmation = async () => {
//         try {
//             await ExpoNotifications.scheduleNotificationAsync({
//                 content: {
//                     title: "Notifications On",
//                     body: "You'll be notified here whenever Kevi has an update.",
//                     data: { url: "/Notifications" },
//                 },
//                 trigger: {
//                     type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//                     seconds: 1,
//                 },
//             });
//         } catch (error) {
//             console.log("UPDATE CONFIRMATION ERROR:", error);
//         }
//     };

//     // 🧪 TEMPORARY TEST FUNCTION FOR AI PICKS (10 Seconds)
//     const testAIPicksNotification = async () => {
//         const granted = await requestPermissions();
//         if (!granted) return;

//         try {
//             await ExpoNotifications.scheduleNotificationAsync({
//                 content: {
//                     title: "Your AI Picks are ready 🍿",
//                     body: "Kevi found new movies matching your mood this week.",
//                     data: { url: "/(tabs)/Ai" },
//                 },
//                 trigger: {
//                     type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//                     seconds: 10,
//                 },
//             });
//             alert("AI Picks test notification set! Lock your phone or minimize the app. It will trigger in 10 seconds.");
//         } catch (error) {
//             console.log("TEST AI PICKS ERROR:", error);
//         }
//     };

//     // 🧪 TEMPORARY TEST FUNCTION FOR NEW MOVIES / TRENDING (10 Seconds)
//     const testNewMoviesNotification = async () => {
//         const granted = await requestPermissions();
//         if (!granted) return;

//         try {
//             await ExpoNotifications.scheduleNotificationAsync({
//                 content: {
//                     title: "New Movies on Kevi 🎬",
//                     body: "Fresh trending titles just landed. Come take a look.",
//                     data: { url: "/Trending" },
//                 },
//                 trigger: {
//                     type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//                     seconds: 10,
//                 },
//             });
//             alert("New Movies test notification set! Lock your phone or minimize the app. It will trigger in 10 seconds.");
//         } catch (error) {
//             console.log("TEST NEW MOVIES ERROR:", error);
//         }
//     };

//     const togglePref = async (key) => {
//         const turningOn = !prefs[key];
//         const updated = { ...prefs, [key]: turningOn };

//         if (turningOn) {
//             const granted = await requestPermissions();
//             if (!granted) return;
//         }

//         if (key === "aiPicks") {
//             turningOn ? await scheduleAIPicks() : await cancelAIPicks();
//         } else if (key === "newMovies") {
//             turningOn ? await scheduleNewMovies() : await cancelNewMovies();
//         } else if (key === "appUpdates" && turningOn) {
//             await fireUpdateConfirmation();
//         }

//         savePrefs(updated);
//     };

//     const toggleMaster = async () => {
//         const newValue = !prefs.pushEnabled;

//         if (!newValue) {
//             try {
//                 await ExpoNotifications.cancelAllScheduledNotificationsAsync();
//             } catch (error) {
//                 console.log("CANCEL ALL ERROR:", error);
//             }
//             savePrefs({
//                 pushEnabled: false,
//                 appUpdates: false,
//                 aiPicks: false,
//                 newMovies: false,
//             });
//         } else {
//             const granted = await requestPermissions();
//             if (!granted) return;
//             savePrefs({ ...prefs, pushEnabled: true });
//         }
//     };

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Ionicons name="arrow-back" size={22} color={colors.text} />
//                 </TouchableOpacity>
//                 <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
//                 <View style={{ width: 22 }} />
//             </View>

//             <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

//                 <View style={[styles.masterCard, { backgroundColor: colors.card, borderColor: colors.accent || "#7F56D9" }]}>
//                     <View style={{ flex: 1 }}>
//                         <Text style={[styles.masterTitle, { color: colors.text }]}>Allow Push Notifications</Text>
//                         <Text style={[styles.masterSubtitle, { color: colors.subtext }]}>Toggle all visual mobile updates on this device</Text>
//                     </View>
//                     <Switch
//                         value={prefs.pushEnabled}
//                         onValueChange={toggleMaster}
//                         trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
//                         thumbColor="#FFFFFF"
//                     />
//                 </View>

//                 {/* TEMPORARY TEST BUTTONS (10s DELAY) */}
//                 <View style={styles.testContainer}>
//                     <TouchableOpacity style={styles.testButton} onPress={testAIPicksNotification}>
//                         <Ionicons name="sparkles-outline" size={16} color="#FFFFFF" />
//                         <Text style={styles.testButtonText}>Test AI Picks (10s)</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.testButton} onPress={testNewMoviesNotification}>
//                         <Ionicons name="film-outline" size={16} color="#FFFFFF" />
//                         <Text style={styles.testButtonText}>Test Trending (10s)</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <Text style={[styles.sectionLabel, { color: colors.subtext }]}>APP UPDATES</Text>
//                 <View style={[styles.card, { backgroundColor: colors.card }]}>
//                     <View style={styles.row}>
//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.rowTitle, { color: colors.text }]}>Product Updates</Text>
//                             <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>Get notified about new features and changes to Kevi</Text>
//                         </View>
//                         <Switch
//                             value={prefs.appUpdates}
//                             onValueChange={() => togglePref("appUpdates")}
//                             disabled={!prefs.pushEnabled}
//                             trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
//                             thumbColor="#FFFFFF"
//                         />
//                     </View>
//                 </View>

//                 <Text style={[styles.sectionLabel, { color: colors.subtext }]}>RECOMMENDATIONS</Text>
//                 <View style={[styles.card, { backgroundColor: colors.card }]}>
//                     <View style={styles.row}>
//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.rowTitle, { color: colors.text }]}>AI Movie Picks</Text>
//                             <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>Weekly hand-picked movies based on your mood</Text>
//                         </View>
//                         <Switch
//                             value={prefs.aiPicks}
//                             onValueChange={() => togglePref("aiPicks")}
//                             disabled={!prefs.pushEnabled}
//                             trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
//                             thumbColor="#FFFFFF"
//                         />
//                     </View>

//                     <View style={[styles.divider, { backgroundColor: colors.border || "#2A1F3D" }]} />

//                     <View style={styles.row}>
//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.rowTitle, { color: colors.text }]}>New Movies</Text>
//                             <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>Weekly reminder about fresh trending titles</Text>
//                         </View>
//                         <Switch
//                             value={prefs.newMovies}
//                             onValueChange={() => togglePref("newMovies")}
//                             disabled={!prefs.pushEnabled}
//                             trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
//                             thumbColor="#FFFFFF"
//                         />
//                     </View>
//                 </View>

//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     header: {
//         flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//         paddingHorizontal: 20, paddingVertical: 16,
//     },
//     headerTitle: { fontSize: 18, fontFamily: "Outfit_700Bold" },
//     masterCard: {
//         flexDirection: "row", alignItems: "center",
//         borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 10, marginBottom: 12,
//     },
//     masterTitle: { fontSize: 15, fontFamily: "Outfit_700Bold" },
//     masterSubtitle: { fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 4 },
//     testContainer: {
//         flexDirection: "row",
//         gap: 10,
//         marginBottom: 10,
//     },
//     testButton: {
//         flex: 1,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 6,
//         backgroundColor: "#7F56D9",
//         paddingVertical: 10,
//         borderRadius: 12,
//     },
//     testButtonText: {
//         color: "#FFFFFF",
//         fontFamily: "Outfit_700Bold",
//         fontSize: 12,
//     },
//     sectionLabel: { fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1, marginBottom: 8, marginTop: 16 },
//     card: { borderRadius: 14, padding: 16 },
//     row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
//     rowTitle: { fontSize: 14, fontFamily: "Outfit_700Bold" },
//     rowSubtitle: { fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 3, lineHeight: 17 },
//     divider: { height: 1, marginVertical: 14 },
// });
import { Ionicons } from "@expo/vector-icons";
import * as ExpoNotifications from "expo-notifications";
import { router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebaseConfig";

const DEFAULT_PREFS = {
    pushEnabled: true,
    appUpdates: true,
    aiPicks: true,
    newMovies: false,
};

// 2 days in seconds (2 * 24 * 60 * 60)
const TWO_DAYS_IN_SECONDS = 172800;

export default function Notifications() {
    const { colors } = useTheme();
    const [prefs, setPrefs] = useState(DEFAULT_PREFS);

    useEffect(() => {
        // Safe configuration inside useEffect after component mounts
        ExpoNotifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        fetchPrefs();
    }, []);

    const fetchPrefs = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.notificationPrefs) {
                    setPrefs({ ...DEFAULT_PREFS, ...data.notificationPrefs });
                }
            }
        } catch (error) {
            console.log("FETCH PREFS ERROR:", error);
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
                identifier: "aiPicksBiDaily",
                content: {
                    title: "Your AI Picks are ready 🍿",
                    body: "Use Kevi AI to find new movies matching your mood.",
                    data: { url: "/(tabs)/Ai" },
                },
                trigger: {
                    type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: TWO_DAYS_IN_SECONDS,
                    repeats: true,
                },
            });
        } catch (error) {
            console.log("SCHEDULE AI PICKS ERROR:", error);
        }
    };

    const cancelAIPicks = async () => {
        try {
            await ExpoNotifications.cancelScheduledNotificationAsync("aiPicksBiDaily");
        } catch (error) {
            console.log("CANCEL AI PICKS ERROR:", error);
        }
    };

    const scheduleNewMovies = async () => {
        try {
            await ExpoNotifications.scheduleNotificationAsync({
                identifier: "newMoviesBiDaily",
                content: {
                    title: "New Movies on Kevi 🎬",
                    body: "Fresh trending titles just landed. Come take a look.",
                    data: { url: "/Trending" },
                },
                trigger: {
                    type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: TWO_DAYS_IN_SECONDS,
                    repeats: true,
                },
            });
        } catch (error) {
            console.log("SCHEDULE NEW MOVIES ERROR:", error);
        }
    };

    const cancelNewMovies = async () => {
        try {
            await ExpoNotifications.cancelScheduledNotificationAsync("newMoviesBiDaily");
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
                    data: { url: "/Notifications" },
                },
                trigger: {
                    type: ExpoNotifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 1,
                },
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

                <View style={[styles.masterCard, { backgroundColor: colors.card, borderColor: colors.accent || "#7F56D9" }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.masterTitle, { color: colors.text }]}>Allow Push Notifications</Text>
                        <Text style={[styles.masterSubtitle, { color: colors.subtext }]}>Toggle all visual mobile updates on this device</Text>
                    </View>
                    <Switch
                        value={prefs.pushEnabled}
                        onValueChange={toggleMaster}
                        trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>APP UPDATES</Text>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.rowTitle, { color: colors.text }]}>Product Updates</Text>
                            <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>Get notified about new features and changes to Kevi</Text>
                        </View>
                        <Switch
                            value={prefs.appUpdates}
                            onValueChange={() => togglePref("appUpdates")}
                            disabled={!prefs.pushEnabled}
                            trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>RECOMMENDATIONS</Text>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.rowTitle, { color: colors.text }]}>AI Movie Picks</Text>
                            <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>Hand-picked movies based on your mood every 2 days</Text>
                        </View>
                        <Switch
                            value={prefs.aiPicks}
                            onValueChange={() => togglePref("aiPicks")}
                            disabled={!prefs.pushEnabled}
                            trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border || "#2A1F3D" }]} />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.rowTitle, { color: colors.text }]}>New Movies</Text>
                            <Text style={[styles.rowSubtitle, { color: colors.subtext }]}>Reminder about fresh trending titles every 2 days</Text>
                        </View>
                        <Switch
                            value={prefs.newMovies}
                            onValueChange={() => togglePref("newMovies")}
                            disabled={!prefs.pushEnabled}
                            trackColor={{ false: colors.border || "#412A6F", true: colors.accent || "#7F56D9" }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 20, paddingVertical: 16,
    },
    headerTitle: { fontSize: 18, fontFamily: "Outfit_700Bold" },
    masterCard: {
        flexDirection: "row", alignItems: "center",
        borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 10, marginBottom: 20,
    },
    masterTitle: { fontSize: 15, fontFamily: "Outfit_700Bold" },
    masterSubtitle: { fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 4 },
    sectionLabel: { fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1, marginBottom: 8, marginTop: 16 },
    card: { borderRadius: 14, padding: 16 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
    rowTitle: { fontSize: 14, fontFamily: "Outfit_700Bold" },
    rowSubtitle: { fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 3, lineHeight: 17 },
    divider: { height: 1, marginVertical: 14 },
});