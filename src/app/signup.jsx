import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebaseConfig";

export default function Signup() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    const [countryCode, setCountryCode] = useState("NG");
    const [callingCode, setCallingCode] = useState("234");
    const [countryPickerVisible, setCountryPickerVisible] = useState(false);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [checkbox, setCheckbox] = useState(false);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const [verificationModal, setVerificationModal] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resending, setResending] = useState(false);

    const showAlertModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const actionCodeSettings = {
        url: "https://kevi-7c236.firebaseapp.com",
        handleCodeInApp: false,
    };

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleResendEmail = async () => {
        if (resendCooldown > 0 || resending) return;

        setResending(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            await sendEmailVerification(userCredential.user, actionCodeSettings);
            await signOut(auth);

            setResendCooldown(60);
            showAlertModal("Verification email resent successfully!");
        } catch (err) {
            console.log("RESEND ERROR:", err);
            showAlertModal("Failed to resend verification email. Please try again later.");
        } finally {
            setResending(false);
        }
    };

    const handleSignup = async () => {
        const hasNumber = /\d/.test(password);

        if (!fullname.trim()) {
            showAlertModal("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            showAlertModal("Please enter your email address.");
            return;
        }

        if (!phone.trim()) {
            showAlertModal("Please enter your phone number.");
            return;
        }

        if (phone.length < 6) {
            showAlertModal("Please enter a valid phone number.");
            return;
        }

        if (password.length < 8 || !hasNumber) {
            showAlertModal("Password must be at least 8 characters and contain a number.");
            return;
        }

        if (password !== confirm) {
            showAlertModal("Passwords do not match.");
            return;
        }

        if (!checkbox) {
            showAlertModal("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            const user = userCredential.user;

            await AsyncStorage.setItem(
                "pendingSignup",
                JSON.stringify({
                    fullname: fullname.trim(),
                    phone: formattedPhone,
                    email: email.trim(),
                    password: password,
                })
            );

            await sendEmailVerification(user, actionCodeSettings);
            await signOut(auth);

            setLoading(false);
            setVerificationModal(true);
        } catch (error) {
            console.log("SIGNUP ERROR:", error);

            setLoading(false);

            let friendlyMessage = "Something went wrong. Please try again.";

            if (error.code === "auth/email-already-in-use") {
                friendlyMessage = "An account with this email already exists. Try signing in.";
            } else if (error.code === "auth/invalid-email") {
                friendlyMessage = "Please enter a valid email address.";
            } else if (error.code === "auth/weak-password") {
                friendlyMessage = "Password is too weak.";
            }

            showAlertModal(friendlyMessage);
        }
    };

    const handleCountrySelect = (country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
        setCountryPickerVisible(false);
    };

    const handlePhoneChange = (text) => {
        const numbersOnly = text.replace(/\D/g, "");
        setPhone(numbersOnly);
        setFormattedPhone(`+${callingCode}${numbersOnly}`);
    };

    const styles = getStyles(colors, isDark);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={[
                            styles.logoHeader,
                            { opacity: loading ? 0.4 : 1 },
                        ]}
                    >
                        <Image
                            style={styles.logoImage}
                            source={require("@/assets/images/kevilogo.png")}
                        />
                        <Text style={styles.appName}>Kevi</Text>
                    </View>

                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join kevi to discover AI-powered cinema
                    </Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            placeholder="Alex Pavier"
                            placeholderTextColor={
                                colors.textSecondary ||
                                (isDark ? "#3B324A" : "#A098AE")
                            }
                            onChangeText={setFullname}
                            value={fullname}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            placeholder="alexpavier123@gmail.com"
                            placeholderTextColor={
                                colors.textSecondary ||
                                (isDark ? "#3B324A" : "#A098AE")
                            }
                            onChangeText={setEmail}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.phoneContainer}>
                            <TouchableOpacity
                                style={styles.countryButton}
                                onPress={() => setCountryPickerVisible(true)}
                            >
                                <CountryPicker
                                    countryCode={countryCode}
                                    withFlag={true}
                                    withEmoji={true}
                                    withCallingCode={false}
                                    withFilter={true}
                                    withFlagButton={true}
                                    visible={countryPickerVisible}
                                    onSelect={handleCountrySelect}
                                    onClose={() => setCountryPickerVisible(false)}
                                />
                                <Text style={styles.callingCode}>
                                    +{callingCode}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={16}
                                    color="#8B859B"
                                />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.phoneInput}
                                value={phone}
                                onChangeText={handlePhoneChange}
                                placeholder="8012345678"
                                placeholderTextColor="#8B859B"
                                keyboardType="number-pad"
                                maxLength={15}
                            />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor={
                                    colors.textSecondary ||
                                    (isDark ? "#3B324A" : "#A098AE")
                                }
                                secureTextEntry={!showPassword}
                                onChangeText={setPassword}
                                value={password}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: "center" }}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color={isDark ? "#412A6F" : "#9E86D0"}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm Password"
                                placeholderTextColor={
                                    colors.textSecondary ||
                                    (isDark ? "#3B324A" : "#A098AE")
                                }
                                secureTextEntry={!showPassword}
                                onChangeText={setConfirm}
                                value={confirm}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: "center" }}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye" : "eye-off"}
                                    size={20}
                                    color={isDark ? "#412A6F" : "#9E86D0"}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.termsRow}>
                            <TouchableOpacity
                                style={{ alignSelf: "center" }}
                                onPress={() => setCheckbox(!checkbox)}
                            >
                                <MaterialIcons
                                    name={
                                        checkbox
                                            ? "check-box"
                                            : "check-box-outline-blank"
                                    }
                                    size={20}
                                    color={
                                        checkbox
                                            ? "#7F56D9"
                                            : isDark
                                            ? "#412A6F"
                                            : "#9E86D0"
                                    }
                                />
                            </TouchableOpacity>

                            <Text style={styles.termsText}>
                                <Text style={{ color: colors.textSecondary || "#8B859B" }}>
                                    I agree to the{" "}
                                </Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={() => router.replace("/termsofservice")}
                                >
                                    Terms of Service{" "}
                                </Text>
                                <Text style={{ color: colors.textSecondary || "#8B859B" }}>
                                    &{" "}
                                </Text>
                                <Text
                                    style={styles.linkText}
                                    onPress={() => router.replace("/privacypolicy")}
                                >
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>

                        <TouchableOpacity
                            disabled={!checkbox || loading}
                            style={[
                                styles.signupButton,
                                {
                                    backgroundColor: checkbox
                                        ? "#7F56D9"
                                        : "#9164f4",
                                    opacity: checkbox ? 1 : 0.5,
                                },
                            ]}
                            onPress={handleSignup}
                        >
                            <Text style={styles.signupButtonText}>
                                Create Account
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>
                                Already have an account?
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/signin")}>
                                <Text style={styles.loginText}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent
                animationType="fade"
                visible={verificationModal}
                onRequestClose={() => {}}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Ionicons
                            name="mail-outline"
                            size={48}
                            color="#7F56D9"
                            style={{ marginBottom: 15 }}
                        />
                        <Text style={styles.verificationTitle}>
                            Check Your Email
                        </Text>
                        <Text style={styles.modalText}>
                            We sent a verification link to {email}. Open the email, tap the link to verify your account, and return to Kevi.
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                            <TouchableOpacity
                                disabled={resendCooldown > 0 || resending}
                                style={[
                                    styles.modalButton,
                                    {
                                        backgroundColor: 'transparent',
                                        borderWidth: 1,
                                        borderColor: resendCooldown > 0 ? '#412A6F' : '#7F56D9',
                                        opacity: resendCooldown > 0 ? 0.6 : 1,
                                    }
                                ]}
                                onPress={handleResendEmail}
                            >
                                {resending ? (
                                    <ActivityIndicator size="small" color="#7F56D9" />
                                ) : (
                                    <Text style={[styles.modalButtonText, { color: resendCooldown > 0 ? '#8B859B' : '#7F56D9' }]}>
                                        {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Email"}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setVerificationModal(false);
                                    router.push("/signin");
                                }}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#7F56D9" />
                </View>
            )}
        </SafeAreaView>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? "#0A0415" : "#FFFFFF"),
        },
        logoHeader: {
            flexDirection: "row",
            justifyContent: "center",
            paddingVertical: "15%",
            alignItems: "center",
        },
        logoImage: {
            width: 55,
            height: 55,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
        },
        appName: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 30,
            fontFamily: "Outfit_700Bold",
            marginLeft: 10,
        },
        title: {
            marginTop: -50,
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 26,
            fontFamily: "Outfit_700Bold",
            alignSelf: "center",
        },
        subtitle: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 14,
            fontFamily: "Geist_400Regular",
            alignSelf: "center",
            marginTop: 4,
            textAlign: "center",
        },
        formContainer: {
            flex: 1,
            flexDirection: "column",
            margin: "5%",
            gap: 8,
            marginTop: 20,
        },
        label: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 15,
            fontFamily: "Geist_400Regular",
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            backgroundColor: colors.surface || (isDark ? "#160C26" : "#F4F2F8"),
            borderRadius: 12,
            height: 48,
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            paddingHorizontal: 12,
            fontFamily: "Geist_400Regular",
        },
        phoneContainer: {
            width: "100%",
            height: 48,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 12,
            backgroundColor: colors.surface || (isDark ? "#160C26" : "#F4F2F8"),
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
        },
        countryButton: {
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 8,
            gap: 5,
        },
        callingCode: {
            color: "#8B859B",
            fontFamily: "Geist_400Regular",
            fontSize: 15,
        },
        phoneInput: {
            flex: 1,
            height: "100%",
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontFamily: "Geist_400Regular",
            fontSize: 15,
            paddingHorizontal: 8,
        },
        passwordContainer: {
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            backgroundColor: colors.surface || (isDark ? "#160C26" : "#F4F2F8"),
            borderRadius: 12,
            height: 48,
            flexDirection: "row",
            paddingHorizontal: 12,
        },
        passwordInput: {
            flex: 1,
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontFamily: "Geist_400Regular",
        },
        termsRow: {
            flexDirection: "row",
            gap: 6,
            marginTop: 8,
            alignItems: "center",
        },
        termsText: {
            fontSize: 13,
            fontFamily: "Geist_400Regular",
        },
        linkText: {
            color: "#704CC0",
            fontFamily: "Outfit_700Bold",
        },
        signupButton: {
            alignSelf: "center",
            width: "98%",
            height: 48,
            borderRadius: 15,
            marginTop: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        signupButtonText: {
            textAlign: "center",
            color: "#FFFFFF",
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
        },
        footerRow: {
            flexDirection: "row",
            marginTop: 12,
            justifyContent: "center",
            gap: 4,
            paddingBottom: 20,
        },
        footerText: {
            fontSize: 15,
            color: colors.textSecondary || "#8B859B",
            fontFamily: "Geist_400Regular",
        },
        loginText: {
            fontSize: 15,
            color: "#704CC0",
            fontFamily: "Outfit_700Bold",
        },
        loadingOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
        },
        modalContent: {
            width: "85%",
            backgroundColor: colors.surface || (isDark ? "#160C26" : "#FFFFFF"),
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            borderWidth: 1,
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            elevation: 5,
        },
        verificationTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 21,
            fontFamily: "Outfit_700Bold",
            marginBottom: 12,
            textAlign: "center",
        },
        modalText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 16,
            fontFamily: "Geist_400Regular",
            textAlign: "center",
            marginBottom: 20,
        },
        modalButton: {
            backgroundColor: "#7F56D9",
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 10,
        },
        modalButtonText: {
            color: "#FFFFFF",
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
    });