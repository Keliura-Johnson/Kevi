import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebaseConfig";

const GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

export default function GenreScreen() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const auth = getAuth();
    const user = auth.currentUser;
    const [selected, setSelected] = useState([]);

    // Custom Modal state replacing Native Alerts
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const showAlertModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const toggleGenre = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handleContinue = async () => {
        if (selected.length < 3) {
            showAlertModal("Please select at least 3 genres.");
            return;
        }

        if (!user) {
            showAlertModal("You must be logged in.");
            return;
        }

        try {
            await updateDoc(doc(db, "users", user.uid), {
                favoriteGenres: selected,
            });

            router.replace('/home');
        } catch (error) {
            console.log("Error saving genres:", error);
            showAlertModal("Could not save your genres.");
        }
    };

    const styles = getStyles(colors, isDark);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <Text style={styles.stepText}>
                    STEP 2 OF 3
                </Text>

                <Text style={styles.headerTitle}>
                    Taste Setup
                </Text>

                <View style={styles.progressBarBackground}>
                    <View style={styles.progressBarFill} />
                </View>

                <Text style={styles.questionTitle}>
                    What do you love?
                </Text>

                <Text style={styles.subtitle}>
                    Select at least 3 genres to personalize Kevi's neural movie recommendations.
                </Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 5, paddingBottom: 20 }}>
                    <View style={styles.genreGrid}>
                        {GENRES.map((genre) => {
                            const isSelected = selected.includes(genre.id);
                            return (
                                <TouchableOpacity
                                    key={genre.id}
                                    onPress={() => toggleGenre(genre.id)}
                                    style={[
                                        styles.chip,
                                        isSelected ? styles.chipSelected : styles.chipUnselected
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        isSelected ? styles.chipTextSelected : styles.chipTextUnselected
                                    ]}>
                                        {isSelected ? "✓ " : ""}{genre.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={handleContinue}
                    style={styles.continueButton}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>

            {/* Custom Alert Modal */}
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
        </SafeAreaView>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? "#0A0415" : "#FFFFFF"),
        },
        mainContent: {
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 20,
        },
        stepText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
            letterSpacing: 1.5,
            marginBottom: 12,
        },
        headerTitle: {
            color: colors.textPrimary || (isDark ? "#ffffff" : "#1A102A"),
            fontSize: 30,
            fontFamily: "Outfit_700Bold",
            marginBottom: 18,
        },
        progressBarBackground: {
            height: 6,
            width: "100%",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#E2DCEB"),
            borderRadius: 10,
            marginBottom: 35,
        },
        progressBarFill: {
            height: 6,
            width: "67%",
            backgroundColor: "#7F56D9",
            borderRadius: 10,
        },
        questionTitle: {
            color: colors.textPrimary || (isDark ? "#ffffff" : "#1A102A"),
            fontSize: 28,
            fontFamily: "Outfit_700Bold",
            marginBottom: 10,
        },
        subtitle: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 16,
            lineHeight: 24,
            fontFamily: "Geist_400Regular",
            marginBottom: 25,
        },
        genreGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
        },
        chip: {
            paddingHorizontal: 17,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        chipSelected: {
            borderColor: "#7F56D9",
            backgroundColor: "#7F56D9",
        },
        chipUnselected: {
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
        },
        chipText: {
            fontSize: 15,
            fontFamily: "Geist_400Regular",
        },
        chipTextSelected: {
            color: "#FFFFFF",
            fontFamily: "Outfit_700Bold",
        },
        chipTextUnselected: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
        },
        continueButton: {
            alignSelf: 'center',
            width: '98%',
            backgroundColor: '#7F56D9',
            height: 48,
            borderRadius: 15,
            marginBottom: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
        continueButtonText: {
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
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
        modalText: {
            color: colors.textPrimary || (isDark ? '#FFFFFF' : '#1A102A'),
            fontSize: 16,
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