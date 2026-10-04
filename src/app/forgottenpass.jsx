import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth } from '../firebaseConfig';

export default function recovery() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal Alert State
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [onModalClose, setOnModalClose] = useState(null);

    const showAlertModal = (title, message, onCloseCallback = null) => {
        setModalTitle(title);
        setModalMessage(message);
        setOnModalClose(() => onCloseCallback);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (onModalClose) {
            onModalClose();
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            showAlertModal("Missing Email", "Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            showAlertModal(
                "Check Your Email",
                "A password reset link has been sent to your email address.",
                () => router.back()
            );
        } catch (error) {
            let friendlyMessage = "Something went wrong. Please try again.";

            if (error.code === 'auth/user-not-found') {
                friendlyMessage = "No account found with this email address.";
            } else if (error.code === 'auth/invalid-email') {
                friendlyMessage = "Please enter a valid email address.";
            } else if (error.code === 'auth/too-many-requests') {
                friendlyMessage = "Too many attempts. Please try again later.";
            }

            showAlertModal("Reset Failed", friendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    const styles = getStyles(colors, isDark);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="chevron-back"
                                style={styles.backIcon}
                                size={20}
                                color={colors.textSecondary || '#bdbbc1'}
                            />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Reset Password</Text>
                    </View>

                    <Image
                        style={styles.iconImage}
                        source={require('@/assets/images/lockcircle.png')}
                    />

                    <Text style={styles.title}>
                        Forgot Password?
                    </Text>

                    <Text style={styles.subtitle}>
                        {'Enter your registered email below, and we\'ll send you \nan encrypted link to reset and secure your credentials.'}
                    </Text>

                    <Text style={styles.label}>Email Address</Text>

                    <TextInput
                        placeholder="alexpavier123@gmail.com"
                        placeholderTextColor={colors.textSecondary || (isDark ? '#3B324A' : '#A098AE')}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <TouchableOpacity
                        onPress={handleResetPassword}
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/signin')}
                        style={styles.backToLoginButton}
                    >
                        <Text style={styles.backToLoginText}>
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Custom Alert Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {modalTitle !== '' && (
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                        )}
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleModalClose}
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
            backgroundColor: colors.background || (isDark ? '#090315' : '#FFFFFF'),
        },
        header: {
            flexDirection: 'row',
            paddingVertical: '10%',
            paddingHorizontal: '5%',
            alignItems: 'center',
        },
        backButton: {
            width: 32,
            height: 32,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border || (isDark ? '#211830' : '#E2DCEB'),
            backgroundColor: colors.surface || (isDark ? 'transparent' : '#F4F2F8'),
            justifyContent: 'center',
            alignItems: 'center',
        },
        backIcon: {
            alignSelf: 'center',
        },
        headerTitle: {
            flex: 1,
            textAlign: 'center',
            marginRight: 32,
            color: colors.textSecondary || '#79728A',
            fontSize: 17,
            fontFamily: 'Outfit_700Bold',
        },
        iconImage: {
            borderRadius: 48,
            width: 96,
            height: 96,
            alignSelf: 'center',
            marginTop: 20,
        },
        title: {
            color: colors.textPrimary || (isDark ? '#FFFFFF' : '#1A102A'),
            alignSelf: 'center',
            fontSize: 23,
            fontFamily: 'Outfit_700Bold',
            marginTop: '10%',
        },
        subtitle: {
            color: colors.textSecondary || '#79728A',
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 14,
            fontFamily: 'Geist_400Regular',
            marginTop: '4%',
            paddingHorizontal: '5%',
            lineHeight: 20,
        },
        label: {
            color: colors.textSecondary || '#8B859B',
            fontSize: 15,
            fontFamily: 'Geist_400Regular',
            marginTop: 40,
            paddingLeft: '5%',
        },
        input: {
            borderWidth: 1,
            alignSelf: 'center',
            borderColor: colors.border || (isDark ? '#412A6F' : '#E2DCEB'),
            backgroundColor: colors.surface || (isDark ? '#160C26' : '#F4F2F8'),
            borderRadius: 12,
            height: 48,
            width: '90%',
            marginTop: 7,
            color: colors.textPrimary || (isDark ? '#FFFFFF' : '#1A102A'),
            paddingHorizontal: 12,
            fontFamily: 'Geist_400Regular',
        },
        submitButton: {
            alignSelf: 'center',
            backgroundColor: '#7F56D9',
            height: 48,
            borderRadius: 15,
            marginTop: 20,
            width: '90%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        submitButtonText: {
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 15,
            fontFamily: 'Outfit_700Bold',
        },
        backToLoginButton: {
            alignSelf: 'center',
            paddingVertical: 40,
        },
        backToLoginText: {
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
            backgroundColor: colors.surface || (isDark ? '#160C26' : '#FFFFFF'),
            borderColor: colors.border || (isDark ? '#412A6F' : '#E2DCEB'),
            borderWidth: 1,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            elevation: 5,
        },
        modalTitle: {
            color: colors.textPrimary || (isDark ? '#FFFFFF' : '#1A102A'),
            fontSize: 18,
            fontFamily: 'Outfit_700Bold',
            textAlign: 'center',
            marginBottom: 8,
        },
        modalText: {
            color: colors.textSecondary || (isDark ? '#CCCCCC' : '#4A4058'),
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