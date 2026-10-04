import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const SECTIONS = [
    {
        title: "1. Acceptance of Terms",
        body: "By creating an account or using Kevi, you agree to be bound by these Terms of Service. If you do not agree, please do not use the app."
    },
    {
        title: "2. Eligibility",
        body: "You must be able to form a legally binding agreement to use Kevi. By using the app, you confirm that the information you provide during sign-up is accurate."
    },
    {
        title: "3. Account Responsibility",
        body: "You are responsible for maintaining the confidentiality of your password and account. You agree to notify us if you suspect unauthorized use of your account."
    },
    {
       title: "4. Movie Data & Content",

        body: "Movie information, posters, ratings, and trailers displayed in Kevi are provided by The Movie Database (TMDB) and are used under their API terms. Movie and TV playback is provided through the NHD API, an external third-party streaming service. Kevi does not host or store the streamed video content. Trailer playback is provided via publicly available YouTube embeds."
    },
    {
        title: "5. AI Recommendations",
        body: "AI-generated movie suggestions are provided for entertainment and discovery purposes only. Kevi does not guarantee the accuracy, availability, or suitability of any recommendation."
    },
    {
        title: "6. Acceptable Use",
        body: "You agree not to misuse the app, attempt to interfere with its normal operation, or use it for any unlawful purpose. We reserve the right to suspend or terminate accounts that violate these terms."
    },
    {
        title: "7. User Content",
        body: "Any profile picture or personal information you upload remains yours. By uploading content, you grant Kevi permission to display it back to you within the app."
    },
    {
        title: "8. Limitation of Liability",
        body: "Kevi is provided \"as is\" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the app."
    },
    {
        title: "9. Changes to the App",
        body: "We may modify, suspend, or discontinue features of Kevi at any time. We will make reasonable efforts to notify users of significant changes."
    },
    {
        title: "10. Termination",
        body: "You may stop using Kevi and delete your account at any time from Account Settings. We may also suspend or terminate access for violations of these terms."
    },
    {
        title: "11. Governing Terms",
        body: "These terms constitute the entire agreement between you and Kevi regarding use of the app, superseding any prior agreements."
    },
    {
        title: "12. Contact",
        body: "Questions about these terms can be directed to us through the Help & Support section of the app."
    },
];

export default function TermsOfService() {
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={[styles.updated, { color: colors.subtext }]}>Last updated: September 2026</Text>

                <Text style={[styles.intro, { color: colors.subtext }]}>
                    Please read these Terms of Service carefully before using Kevi.
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