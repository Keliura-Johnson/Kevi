import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    EmailAuthProvider, deleteUser,
    reauthenticateWithCredential,
    updatePassword,
    verifyBeforeUpdateEmail
} from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Image, Modal,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebaseConfig";

export default function AccountSettings() {
    const { colors } = useTheme();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [memberSince, setMemberSince] = useState("");
    const [loading, setLoading] = useState(true);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [showEmailPass, setShowEmailPass] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [showDeletePass, setShowDeletePass] = useState(false);
    const [saving, setSaving] = useState(false);

    const [alertModal, setAlertModal] = useState({ visible: false, title: "", message: "" });
    const showAlert = (title, message) => setAlertModal({ visible: true, title, message });

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setFullname(data.fullname || "");
                setProfilePic(data.profilePic || "");
            }
            setEmail(user.email || "");

            if (user.metadata?.creationTime) {
                const date = new Date(user.metadata.creationTime);
                setMemberSince(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            }
        } catch (error) {
            console.log("ACCOUNT FETCH ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    const reauthenticate = async (password) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
    };

    const mapAuthError = (error, context) => {
        console.log(`${context} ERROR:`, error.code, error.message);

        switch (error.code) {
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return "Incorrect password.";
            case 'auth/email-already-in-use':
                return "That email is already in use by another account.";
            case 'auth/invalid-email':
                return "Please enter a valid email address.";
            case 'auth/requires-recent-login':
                return "For security, please log out and log back in before making this change.";
            case 'auth/operation-not-allowed':
                return "This operation isn't enabled for your account. Please contact support.";
            case 'auth/too-many-requests':
                return "Too many attempts. Please try again later.";
            case 'auth/weak-password':
                return "Password is too weak.";
            case 'auth/network-request-failed':
                return "Network error. Check your connection and try again.";
            default:
                return error.message || "Something went wrong. Please try again.";
        }
    };

    const handleChangeEmail = async () => {
        if (!newEmail.trim() || !emailPassword) {
            showAlert("Missing Info", "Please fill in both fields.");
            return;
        }

        setSaving(true);
        try {
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail.trim());
            setShowEmailModal(false);
            setNewEmail("");
            setEmailPassword("");
            showAlert("Check Your Inbox", "A confirmation link has been sent to your new email address. Your email will update once you click it.");
        } catch (error) {
            showAlert("Error", mapAuthError(error, "CHANGE EMAIL"));
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert("Missing Info", "Please fill in all fields.");
            return;
        }

        if (newPassword.length < 8 || !/\d/.test(newPassword)) {
            showAlert("Weak Password", "New password must be at least 8 characters and contain a number.");
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert("Mismatch", "New passwords do not match.");
            return;
        }

        setSaving(true);
        try {
            await reauthenticate(currentPassword);
            await updatePassword(auth.currentUser, newPassword);
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            showAlert("Success", "Your password has been updated.");
        } catch (error) {
            showAlert("Error", mapAuthError(error, "CHANGE PASSWORD"));
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            showAlert("Missing Password", "Please enter your password to confirm.");
            return;
        }

        setSaving(true);
        try {
            const user = auth.currentUser;
            await reauthenticate(deletePassword);
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(user);

            setShowDeleteModal(false);
            setDeletePassword("");
            router.replace('/signin');
        } catch (error) {
            showAlert("Error", mapAuthError(error, "DELETE ACCOUNT"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent || "#7F56D9"} style={{ marginTop: 60 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Account</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

                <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
                    <Image
                        source={profilePic ? { uri: profilePic } : require("../../assets/images/avatar.png")}
                        style={styles.profileImage}
                    />
                    <View>
                        <Text style={[styles.profileName, { color: colors.text }]}>{fullname}</Text>
                        <Text style={[styles.profileMember, { color: colors.subtext }]}>Member since {memberSince}</Text>
                    </View>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>EMAIL ADDRESS</Text>
                <View style={[styles.row, { backgroundColor: colors.card }]}>
                    <Text style={[styles.rowText, { color: colors.text }]}>{email}</Text>
                    <TouchableOpacity onPress={() => setShowEmailModal(true)}>
                        <Text style={[styles.changeText, { color: colors.accent || "#7F56D9" }]}>Change</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>SECURITY</Text>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.passwordRow}>
                        <Text style={[styles.rowText, { color: colors.text }]}>Password</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.changePasswordButton, { backgroundColor: colors.border || "#2A1F3D" }]} 
                        onPress={() => setShowPasswordModal(true)}
                    >
                        <Text style={[styles.changePasswordText, { color: colors.text }]}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerTitle}>Danger Zone</Text>
                    <Text style={styles.dangerText}>
                        Deleting your account will permanently remove your watchlist, custom AI preferences, and rating history.
                    </Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
                        <Text style={styles.deleteButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Email Modal */}
            <Modal visible={showEmailModal} transparent animationType="fade" onRequestClose={() => setShowEmailModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Change Email</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            placeholder="New email address"
                            placeholderTextColor={colors.subtext || "#6E667D"}
                            value={newEmail}
                            onChangeText={setNewEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <View style={[styles.passwordInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.passwordInput, { color: colors.text }]}
                                placeholder="Current password"
                                placeholderTextColor={colors.subtext || "#6E667D"}
                                value={emailPassword}
                                onChangeText={setEmailPassword}
                                secureTextEntry={!showEmailPass}
                            />
                            <TouchableOpacity onPress={() => setShowEmailPass(!showEmailPass)}>
                                <Ionicons name={showEmailPass ? "eye" : "eye-off"} size={20} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.modalSaveButton, { backgroundColor: colors.accent || "#7F56D9" }]} onPress={handleChangeEmail} disabled={saving}>
                            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.modalSaveText}>Update Email</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowEmailModal(false); setNewEmail(""); setEmailPassword(""); }}>
                            <Text style={[styles.modalCancelText, { color: colors.subtext }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Password Modal */}
            <Modal visible={showPasswordModal} transparent animationType="fade" onRequestClose={() => setShowPasswordModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>

                        <View style={[styles.passwordInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.passwordInput, { color: colors.text }]}
                                placeholder="Current password"
                                placeholderTextColor={colors.subtext || "#6E667D"}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPass}
                            />
                            <TouchableOpacity onPress={() => setShowCurrentPass(!showCurrentPass)}>
                                <Ionicons name={showCurrentPass ? "eye" : "eye-off"} size={20} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.passwordInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.passwordInput, { color: colors.text }]}
                                placeholder="New password"
                                placeholderTextColor={colors.subtext || "#6E667D"}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPass}
                            />
                            <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                                <Ionicons name={showNewPass ? "eye" : "eye-off"} size={20} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.passwordInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.passwordInput, { color: colors.text }]}
                                placeholder="Confirm new password"
                                placeholderTextColor={colors.subtext || "#6E667D"}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPass}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                                <Ionicons name={showConfirmPass ? "eye" : "eye-off"} size={20} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.modalSaveButton, { backgroundColor: colors.accent || "#7F56D9" }]} onPress={handleChangePassword} disabled={saving}>
                            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.modalSaveText}>Update Password</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setShowPasswordModal(false);
                            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                        }}>
                            <Text style={[styles.modalCancelText, { color: colors.subtext }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Delete Account Modal */}
            <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Account</Text>
                        <Text style={styles.dangerText}>
                            This action is permanent and cannot be undone. Enter your password to confirm.
                        </Text>
                        <View style={[styles.passwordInputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.passwordInput, { color: colors.text }]}
                                placeholder="Password"
                                placeholderTextColor={colors.subtext || "#6E667D"}
                                value={deletePassword}
                                onChangeText={setDeletePassword}
                                secureTextEntry={!showDeletePass}
                            />
                            <TouchableOpacity onPress={() => setShowDeletePass(!showDeletePass)}>
                                <Ionicons name={showDeletePass ? "eye" : "eye-off"} size={20} color={colors.subtext} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.deleteConfirmButton} onPress={handleDeleteAccount} disabled={saving}>
                            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.modalSaveText}>Delete My Account</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowDeleteModal(false); setDeletePassword(""); }}>
                            <Text style={[styles.modalCancelText, { color: colors.subtext }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Alert Modal */}
            <Modal visible={alertModal.visible} transparent animationType="fade" onRequestClose={() => setAlertModal({ ...alertModal, visible: false })}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.alertBox, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{alertModal.title}</Text>
                        <Text style={[styles.alertMessage, { color: colors.subtext }]}>{alertModal.message}</Text>
                        <TouchableOpacity
                            style={[styles.modalSaveButton, { backgroundColor: colors.accent || "#7F56D9" }]}
                            onPress={() => setAlertModal({ ...alertModal, visible: false })}
                        >
                            <Text style={styles.modalSaveText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    profileCard: {
        flexDirection: "row", alignItems: "center", gap: 14,
        borderRadius: 16, padding: 16, marginTop: 10, marginBottom: 20,
    },
    profileImage: { width: 56, height: 56, borderRadius: 28 },
    profileName: { fontSize: 16, fontFamily: "Outfit_700Bold" },
    profileMember: { fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 2 },
    sectionLabel: { fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1, marginBottom: 8, marginTop: 10 },
    row: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        borderRadius: 14, padding: 16, marginBottom: 10,
    },
    rowText: { fontSize: 14, fontFamily: "Geist_400Regular" },
    changeText: { fontSize: 14, fontFamily: "Outfit_700Bold" },
    card: { borderRadius: 14, padding: 16, marginBottom: 10 },
    passwordRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
    changePasswordButton: {
        height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center",
    },
    changePasswordText: { fontSize: 14, fontFamily: "Outfit_700Bold" },
    dangerZone: {
        backgroundColor: "rgba(255,77,77,0.08)", borderWidth: 1, borderColor: "rgba(255,77,77,0.3)",
        borderRadius: 16, padding: 16, marginTop: 20,
    },
    dangerTitle: { color: "#FF4D4D", fontSize: 15, fontFamily: "Outfit_700Bold", marginBottom: 8 },
    dangerText: { color: "#C4A9A9", fontSize: 13, fontFamily: "Geist_400Regular", lineHeight: 19, marginBottom: 16 },
    deleteButton: {
        borderWidth: 1, borderColor: "#FF4D4D", height: 46, borderRadius: 12,
        justifyContent: "center", alignItems: "center",
    },
    deleteButtonText: { color: "#FF4D4D", fontSize: 14, fontFamily: "Outfit_700Bold" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
    modalBox: { width: "88%", borderRadius: 20, padding: 22 },
    alertBox: { width: "82%", borderRadius: 20, padding: 22 },
    alertMessage: { fontSize: 14, fontFamily: "Geist_400Regular", lineHeight: 20, marginBottom: 18 },
    modalTitle: { fontSize: 17, fontFamily: "Outfit_700Bold", marginBottom: 14 },
    input: {
        borderWidth: 1, borderRadius: 12,
        height: 46, paddingHorizontal: 14, fontSize: 14, fontFamily: "Geist_400Regular", marginBottom: 12,
    },
    passwordInputWrapper: {
        flexDirection: "row", alignItems: "center",
        borderWidth: 1, borderRadius: 12,
        height: 46, paddingHorizontal: 14, marginBottom: 12,
    },
    passwordInput: { flex: 1, fontSize: 14, fontFamily: "Geist_400Regular" },
    modalSaveButton: {
        height: 48, borderRadius: 12,
        justifyContent: "center", alignItems: "center", marginTop: 4, marginBottom: 12,
    },
    deleteConfirmButton: {
        backgroundColor: "#FF4D4D", height: 48, borderRadius: 12,
        justifyContent: "center", alignItems: "center", marginTop: 4, marginBottom: 12,
    },
    modalSaveText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Outfit_700Bold" },
    modalCancelText: { fontSize: 14, fontFamily: "Outfit_700Bold", textAlign: "center" },
});