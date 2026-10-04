import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const SECTIONS = [
    {
        title: "1. Information We Collect",
        body: "When you create an account, we collect your full name, email address, and phone number. If you choose to add a profile picture, it is stored securely via our image hosting provider. We also store your favorite genres and movie preferences to personalize your experience."
    },
    {
        title: "2. How We Use Your Information",
        body: "We use your information to create and manage your account, personalize movie recommendations based on your genre preferences, maintain your watchlist and watched history, and improve the app's features and performance."
    },
    {
        title: "3. Third-Party Services",
        body: "Kevi uses The Movie Database (TMDB) to provide movie information, posters, and trailers. We use Firebase for authentication and data storage, and Cloudinary for image hosting. These providers have their own privacy policies governing how they handle data."
    },
    {
        title: "4. AI Recommendations",
        body: "When you use Kevi's AI recommendation feature, your typed prompts and genre preferences may be processed to generate personalized movie suggestions. We do not use this data for any purpose beyond improving your recommendations."
    },
    {
        title: "5. Data Storage & Security",
        body: "Your account data is stored securely using Firebase's infrastructure. We take reasonable measures to protect your information, but no method of electronic storage is 100% secure."
    },
    {
        title: "6. Your Choices",
        body: "You may update your profile information, change your favorite genres, or delete your account at any time from the Account settings screen. Deleting your account permanently removes your watchlist, favorites, watched history, and preferences."
    },
    {
        title: "7. Notifications",
        body: "If you enable notifications, we may send you reminders about new AI picks or trending movies. You can disable these at any time in Settings."
    },
    {
        title: "8. Changes to This Policy",
        body: "We may update this privacy policy from time to time. Continued use of Kevi after changes are made constitutes acceptance of the updated policy."
    },
    {
        title: "9. Contact Us",
        body: "If you have questions about this privacy policy or how your data is handled, please reach out through the Help & Support section of the app."
    },
];

export default function PrivacyPolicy() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={18} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={[styles.updated, { color: colors.subtext }]}>Last updated: September 2026</Text>

                <Text style={[styles.intro, { color: colors.subtext }]}>
                    Kevi ("we", "our", "the app") respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.
                </Text>

                {SECTIONS.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                        <Text style={[styles.sectionBody, { color: colors.subtext }]}>{section.body}</Text>
                    </View>
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row", alignItems: "center", gap: 14,
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
    },
    backButton: {
        width: 36, height: 36, borderRadius: 18, borderWidth: 1,
        justifyContent: "center", alignItems: "center",
    },
    headerTitle: { fontSize: 20, fontFamily: "Outfit_700Bold" },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    updated: { fontSize: 12, fontFamily: "Geist_400Regular", marginBottom: 12 },
    intro: { fontSize: 13, fontFamily: "Geist_400Regular", lineHeight: 20, marginBottom: 24 },
    section: { marginBottom: 22 },
    sectionTitle: { fontSize: 15, fontFamily: "Outfit_700Bold", marginBottom: 8 },
    sectionBody: { fontSize: 13, fontFamily: "Geist_400Regular", lineHeight: 20 },
});