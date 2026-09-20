import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";

export default function Settings() {
    const [darkMode, setDarkMode] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            router.replace('/signin');
                        } catch (error) {
                            Alert.alert("Error", "Could not log out. Please try again.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <Text style={styles.headerTitle}>Settings</Text>

                <Text style={styles.sectionLabel}>ACCOUNT</Text>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/Security")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.rowText}>Email & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B859B" />
                    </TouchableOpacity>

                    <View style={styles.divider} />
{/* 
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/linkedaccounts")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="link-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.rowText}>Linked Accounts</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B859B" />
                    </TouchableOpacity> */}
                </View>

                <Text style={styles.sectionLabel}>PREFERENCES</Text>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/Notifications")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.rowText}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B859B" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.row} onPress={() => router.push("/Appearance")}>
                        <View style={styles.rowLeft}>
                            
                            <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.rowText}>Appearance</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B859B" />
                   
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>LEGAL & SUPPORT</Text>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/privacypolicy")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="shield-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.rowText}>Privacy Policy</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B859B" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.row} onPress={() => router.push("/helpsupport")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.rowText}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#8B859B" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>v1.4.0 • Built with Cinematic AI</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090315",marginTop:15, },
    headerTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "800", paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
    sectionLabel: { color: "#8B859B", fontSize: 12, fontWeight: "700", letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8, marginTop: 20 },
    card: { backgroundColor: "#160626", marginHorizontal: 20, borderRadius: 16, overflow: "hidden" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 16 },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
    divider: { height: 1, backgroundColor: "#2A1F3D", marginHorizontal: 16 },
    logoutButton: {
        marginHorizontal: 20, marginTop: 30, height: 50, borderRadius: 14,
        borderWidth: 1, borderColor: "#FF4D4D", justifyContent: "center", alignItems: "center",
    },
    logoutText: { color: "#FF4D4D", fontSize: 15, fontWeight: "700" },
    versionText: { color: "#5C5468", fontSize: 12, textAlign: "center", marginTop: 20 },
});