import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Zocial from '@expo/vector-icons/Zocial';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AuthSession from 'expo-auth-session';
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const GITHUB_CLIENT_ID = "Ov23liLuSMkC9sHvCRUK";

GoogleSignin.configure({
    webClientId: "736111976625-ov2csso04pu3roqo8gf4efrdf6nkkq9q.apps.googleusercontent.com"
});

export default function signin() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "kevi",
        path: "github"
    });

    const showAlertModal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showAlertModal("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                showAlertModal(
                    "Email Not Verified",
                    "Please check your inbox and verify your email address before logging in."
                );
                setLoading(false);
                return;
            }

            const pendingSignup = await AsyncStorage.getItem("pendingSignup");
            if (pendingSignup) {
                const userData = JSON.parse(pendingSignup);
                await setDoc(
                    doc(db, "users", user.uid),
                    {
                        fullname: userData.fullname,
                        phone: userData.phone,
                        email: userData.email,
                        emailVerified: true,
                        createdAt: new Date().toISOString(),
                    },
                    { merge: true }
                );
                await AsyncStorage.removeItem("pendingSignup");
            }

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (!userData.favoriteGenres || userData.favoriteGenres.length < 3) {
                    router.replace('/preference');
                    return;
                }
            } else {
                router.replace('/preference');
                return;
            }

            router.replace('/(tabs)');
        } catch (error) {
            let friendlyMessage = "Something went wrong. Please try again.";

            if (
                error.code === 'auth/wrong-password' ||
                error.code === 'auth/invalid-credential'
            ) {
                friendlyMessage = "Incorrect email or password.";
            } else if (error.code === 'auth/user-not-found') {
                friendlyMessage = "No account found with this email.";
            } else if (error.code === 'auth/invalid-email') {
                friendlyMessage = "Please enter a valid email address.";
            } else if (error.code === 'auth/too-many-requests') {
                friendlyMessage = "Too many attempts. Please try again later.";
            }

            showAlertModal("Authentication Failed", friendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (googleLoading) return;

        setGoogleLoading(true);

        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true
            });

            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken || response.idToken;

            if (!idToken) {
                throw new Error("Google did not return an ID token.");
            }

            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    fullname: user.displayName || "",
                    email: user.email || "",
                    favoriteGenres: [],
                    profilePic: user.photoURL || null,
                    emailVerified: true,
                    createdAt: new Date().toISOString()
                });

                router.replace('/preference');
                return;
            }

            const userData = userSnap.data();

            if (!userData.favoriteGenres || userData.favoriteGenres.length < 3) {
                router.replace('/preference');
                return;
            }

            router.replace('/(tabs)');
        } catch (error) {
            console.log("Google login error:", error);

            if (error.code === "SIGN_IN_CANCELLED") return;

            showAlertModal(
                "Google Login Failed",
                error.message || "Could not sign in with Google."
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGitHubLogin = async () => {
        if (githubLoading) return;

        setGithubLoading(true);

        try {
            const authUrl =
                `https://github.com/login/oauth/authorize` +
                `?client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&scope=${encodeURIComponent("read:user user:email")}`;

            const result = await WebBrowser.openAuthSessionAsync(
                authUrl,
                redirectUri
            );

            if (result.type !== "success") {
                setGithubLoading(false);
                return;
            }

            const returnedUrl = new URL(result.url);
            const code = returnedUrl.searchParams.get("code");

            if (!code) {
                throw new Error("GitHub did not return an authorization code.");
            }

            const response = await fetch("/api/github-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code,
                    redirectUri
                })
            });

            const data = await response.json();

            if (!response.ok || !data.accessToken) {
                throw new Error(
                    data.error || "Could not complete GitHub authentication."
                );
            }

            const credential = GithubAuthProvider.credential(data.accessToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    fullname: user.displayName || "",
                    email: user.email || "",
                    favoriteGenres: [],
                    profilePic: user.photoURL || null,
                    emailVerified: true,
                    createdAt: new Date().toISOString()
                });

                router.replace('/preference');
                return;
            }

            const userData = userSnap.data();

            if (!userData.favoriteGenres || userData.favoriteGenres.length < 3) {
                router.replace('/preference');
                return;
            }

            router.replace('/(tabs)');
        } catch (error) {
            console.log("GitHub login error:", error);

            showAlertModal(
                "GitHub Login Failed",
                error.message || "Could not sign in with GitHub."
            );
        } finally {
            setGithubLoading(false);
        }
    };

    const styles = getStyles(colors, isDark);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.logoHeader}>
                        <Image
                            style={styles.logoImage}
                            source={require('@/assets/images/kevilogo.png')}
                        />
                        <Text style={styles.appName}>Kevi</Text>
                    </View>

                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>
                        Log in to access your cinematic recommendations
                    </Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            placeholder="alexpavier123@gmail.com"
                            placeholderTextColor={
                                colors.textSecondary ||
                                (isDark ? '#3B324A' : '#A098AE')
                            }
                            onChangeText={setEmail}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor={
                                    colors.textSecondary ||
                                    (isDark ? '#3B324A' : '#A098AE')
                                }
                                secureTextEntry={!showPassword}
                                onChangeText={setPassword}
                                value={password}
                            />
                            <TouchableOpacity
                                style={{ alignSelf: 'center' }}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye' : 'eye-off'}
                                    size={20}
                                    color={isDark ? '#412A6F' : '#9E86D0'}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end' }}
                            onPress={() => router.push('/forgottenpass')}
                        >
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? "Logging in..." : "Log in"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>
                                Don't have an account?
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.signupText}>Sign Up</Text>
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
                        {modalTitle !== '' && (
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                        )}
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
        </SafeAreaView>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                colors.background ||
                (isDark ? '#0A0415' : '#FFFFFF'),
        },
        logoHeader: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: '15%',
            alignItems: 'center',
        },
        logoImage: {
            width: 55,
            height: 55,
            borderRadius: 10,
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? '#412A6F' : '#E2DCEB'),
        },
        appName: {
            color:
                colors.textPrimary ||
                (isDark ? '#FFFFFF' : '#1A102A'),
            fontSize: 30,
            fontFamily: 'Outfit_700Bold',
            marginLeft: 10,
        },
        title: {
            marginTop: -50,
            color:
                colors.textPrimary ||
                (isDark ? '#FFFFFF' : '#1A102A'),
            fontSize: 26,
            fontFamily: 'Outfit_700Bold',
            alignSelf: 'center',
        },
        subtitle: {
            color: colors.textSecondary || '#8B859B',
            fontSize: 14,
            fontFamily: 'Geist_400Regular',
            alignSelf: 'center',
            marginTop: 4,
            textAlign: 'center',
            paddingHorizontal: 20,
        },
        formContainer: {
            flex: 1,
            flexDirection: 'column',
            margin: '5%',
            gap: 8,
            marginTop: 40,
        },
        label: {
            color: colors.textSecondary || '#8B859B',
            fontSize: 15,
            fontFamily: 'Geist_400Regular',
        },
        input: {
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? '#412A6F' : '#E2DCEB'),
            backgroundColor:
                colors.surface ||
                (isDark ? '#160C26' : '#F4F2F8'),
            borderRadius: 12,
            height: 48,
            color:
                colors.textPrimary ||
                (isDark ? '#FFFFFF' : '#1A102A'),
            paddingHorizontal: 12,
            fontFamily: 'Geist_400Regular',
        },
        passwordContainer: {
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? '#412A6F' : '#E2DCEB'),
            backgroundColor:
                colors.surface ||
                (isDark ? '#160C26' : '#F4F2F8'),
            borderRadius: 12,
            height: 48,
            flexDirection: 'row',
            paddingHorizontal: 12,
        },
        passwordInput: {
            width: '90%',
            color:
                colors.textPrimary ||
                (isDark ? '#FFFFFF' : '#1A102A'),
            fontFamily: 'Geist_400Regular',
        },
        forgotText: {
            color: '#704CC0',
            fontSize: 15,
            fontFamily: 'Outfit_700Bold',
        },
        loginButton: {
            alignSelf: 'center',
            backgroundColor: '#7F56D9',
            width: '98%',
            height: 48,
            borderRadius: 15,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginButtonText: {
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 15,
            fontFamily: 'Outfit_700Bold',
        },
        footerRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 30,
            gap: 4,
        },
        footerText: {
            fontSize: 15,
            color: colors.textSecondary || '#8B859B',
            fontFamily: 'Geist_400Regular',
        },
        signupText: {
            fontSize: 15,
            color: '#704CC0',
            fontFamily: 'Outfit_700Bold',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        modalContent: {
            width: '85%',
            backgroundColor:
                colors.surface ||
                (isDark ? '#160C26' : '#FFFFFF'),
            borderColor:
                colors.border ||
                (isDark ? '#412A6F' : '#E2DCEB'),
            borderWidth: 1,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            elevation: 5,
        },
        modalTitle: {
            color:
                colors.textPrimary ||
                (isDark ? '#FFFFFF' : '#1A102A'),
            fontSize: 18,
            fontFamily: 'Outfit_700Bold',
            textAlign: 'center',
            marginBottom: 8,
        },
        modalText: {
            color:
                colors.textSecondary ||
                (isDark ? '#CCCCCC' : '#4A4058'),
            fontSize: 15,
            fontFamily: 'Geist_400Regular',
            textAlign: 'center',
            marginBottom: 20,
        },
        modalButton: {
            backgroundColor: '#7F56D9',
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 10,
        },
        modalButtonText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontFamily: 'Outfit_700Bold',
        },
    });