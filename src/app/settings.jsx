import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebaseConfig";

export default function Settings() {
    const { colors } = useTheme();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogout = async () => {
        try {
            setShowLogoutModal(false);
            await signOut(auth);
            router.replace('/signin');
        } catch (error) {
            setErrorMessage("Could not log out. Please try again.");
            setShowErrorModal(true);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>ACCOUNT</Text>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/Security")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.text} />
                            <Text style={[styles.rowText, { color: colors.text }]}>Email & Security</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>PREFERENCES</Text>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/Notifications")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="notifications-outline" size={20} color={colors.text} />
                            <Text style={[styles.rowText, { color: colors.text }]}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity style={styles.row} onPress={() => router.push("/Appearance")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="eye-outline" size={20} color={colors.text} />
                            <Text style={[styles.rowText, { color: colors.text }]}>Appearance</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>LEGAL & SUPPORT</Text>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/About")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
                            <Text style={[styles.rowText, { color: colors.text }]}>About</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity style={styles.row} onPress={() => router.push("/support")}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="help-circle-outline" size={20} color={colors.text} />
                            <Text style={[styles.rowText, { color: colors.text }]}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={[styles.versionText, { color: colors.subtext }]}>v1.0 • Built with Cinematic AI</Text>

            </ScrollView>

            {/* LOG OUT CONFIRMATION MODAL */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Ionicons name="log-out-outline" size={36} color="#FF4D4D" style={{ marginBottom: 12 }} />
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Log Out</Text>
                        <Text style={[styles.modalMessage, { color: colors.subtext }]}>
                            Are you sure you want to log out of your account?
                        </Text>
                        <View style={styles.modalRowButtons}>
                            <TouchableOpacity
                                style={[styles.modalSecondaryButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={[styles.modalSecondaryButtonText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalPrimaryButton, { backgroundColor: "#FF4D4D" }]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.modalPrimaryButtonText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ERROR MODAL */}
            <Modal
                visible={showErrorModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowErrorModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Ionicons name="alert-circle-outline" size={36} color="#FF4D4D" style={{ marginBottom: 12 }} />
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Error</Text>
                        <Text style={[styles.modalMessage, { color: colors.subtext }]}>
                            {errorMessage}
                        </Text>
                        <TouchableOpacity
                            style={[styles.modalPrimaryButton, { backgroundColor: colors.accent, width: "100%" }]}
                            onPress={() => setShowErrorModal(false)}
                        >
                            <Text style={styles.modalPrimaryButtonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 15 },
    headerTitle: { fontSize: 26, fontFamily: "Outfit_700Bold", paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
    sectionLabel: { fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1, paddingHorizontal: 20, marginBottom: 8, marginTop: 20 },
    card: { marginHorizontal: 20, borderRadius: 16, overflow: "hidden" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 16 },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowText: { fontSize: 14, fontFamily: "Geist_400Regular" },
    divider: { height: 1, marginHorizontal: 16 },
    logoutButton: {
        marginHorizontal: 20, marginTop: 30, height: 50, borderRadius: 14,
        borderWidth: 1, borderColor: "#FF4D4D", justifyContent: "center", alignItems: "center",
    },
    logoutText: { color: "#FF4D4D", fontSize: 15, fontFamily: "Outfit_700Bold" },
    versionText: { fontSize: 12, fontFamily: "Geist_400Regular", textAlign: "center", marginTop: 20 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
    modalBox: { width: "85%", borderRadius: 20, padding: 24, alignItems: "center" },
    modalTitle: { fontSize: 18, fontFamily: "Outfit_700Bold", marginBottom: 8 },
    modalMessage: { fontSize: 13, fontFamily: "Geist_400Regular", textAlign: "center", lineHeight: 19, marginBottom: 20 },
    modalRowButtons: { flexDirection: "row", gap: 12, width: "100%" },
    modalSecondaryButton: { flex: 1, height: 46, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center" },
    modalSecondaryButtonText: { fontSize: 14, fontFamily: "Outfit_700Bold" },
    modalPrimaryButton: { flex: 1, height: 46, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    modalPrimaryButtonText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Outfit_700Bold" },
});