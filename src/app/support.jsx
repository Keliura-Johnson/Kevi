import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebaseConfig";

const FAQS = [
    {
        question: "How do AI recommendations work?",
        answer: "Go to the AI Recommend tab, then type what you're in the mood for (e.g. \"a mind-bending sci-fi\"). Kevi combines your prompt with your favorite genres to suggest movies, each with a short reason why it was picked. Tap any result to view its full details."
    },
    {
        question: "How do I add movies to my watchlist?",
        answer: "Open any movie's details page and tap the \"Watchlist\" button near the top. Tap it again to remove the movie. You can view everything you've saved from the Watchlist tab, and sort it by title, rating, or release year."
    },
    {
        question: "How do I delete my account?",
        answer: "Go to Profile → Settings → Email & Security, scroll to the Danger Zone, and tap \"Delete Account\". You'll be asked to confirm your password. This permanently removes your watchlist, favorites, watched history, and preferences."
    },
    {
        question: "How do I change my favorite genres?",
        answer: "Go to Profile → Edit Profile, and use the Favorite Genre dropdown to select a new genre, then tap Save Changes. This also affects the movies shown in your \"Recommended for You\" row on Home."
    },
    {
        question: "Can I change my email or password?",
        answer: "Yes. Go to Profile → Settings → Email & Security. You can change your password directly there, or request an email change, which will send a confirmation link to your new email address before it takes effect."
    },
];

export default function HelpSupport() {
    const { colors } = useTheme();
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showEmailSentModal, setShowEmailSentModal] = useState(false);

    const toggleFAQ = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleEmailSupport = async () => {
        const email = "jkeliura@gmail.com";
        const subject = encodeURIComponent("Kevi Support Request");
        const body = encodeURIComponent(
            `Hi,\n\nI need help with...\n\n---\nUser: ${auth.currentUser?.email || "N/A"}`
        );

        const url = `mailto:${email}?subject=${subject}&body=${body}`;

        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
                setShowEmailSentModal(true);
            }
        } catch (error) {
            console.log("EMAIL SUPPORT ERROR:", error);
        }
    };

    const handleReportBug = async () => {
        const email = "jkeliura@gmail.com";
        const subject = encodeURIComponent("Kevi Bug Report");
        const body = encodeURIComponent(
            `Describe the bug:\n\n\nSteps to reproduce:\n\n\n---\nUser: ${auth.currentUser?.email || "N/A"}`
        );
        const url = `mailto:${email}?subject=${subject}&body=${body}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
            setShowEmailSentModal(true);
        }
    };

    const handleRequestFeature = async () => {
        const email = "jkeliura@gmail.com";
        const subject = encodeURIComponent("Kevi Feature Request");
        const body = encodeURIComponent(
            `I'd love to see...\n\n---\nUser: ${auth.currentUser?.email || "N/A"}`
        );
        const url = `mailto:${email}?subject=${subject}&body=${body}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
            setShowEmailSentModal(true);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={18} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <Text style={[styles.sectionLabel, { color: colors.accent }]}>FREQUENTLY ASKED QUESTIONS</Text>

                <View style={styles.faqList}>
                    {FAQS.map((faq, index) => {
                        const isExpanded = expandedIndex === index;
                        return (
                            <View
                                key={index}
                                style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                            >
                                <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(index)}>
                                    <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                                    <Ionicons
                                        name={isExpanded ? "chevron-down" : "chevron-forward"}
                                        size={18}
                                        color={colors.subtext}
                                    />
                                </TouchableOpacity>
                                {isExpanded && (
                                    <Text style={[styles.faqAnswer, { color: colors.subtext }]}>{faq.answer}</Text>
                                )}
                            </View>
                        );
                    })}
                </View>

                <View style={[styles.helpCard, { backgroundColor: colors.card, borderColor: colors.accent }]}>
                    <Text style={[styles.helpTitle, { color: colors.text }]}>Still need help?</Text>
                    <Text style={[styles.helpSubtitle, { color: colors.subtext }]}>
                        We are available 24/7 to solve your problems.
                    </Text>

                    <TouchableOpacity
                        style={[styles.emailButton, { backgroundColor: colors.accent }]}
                        onPress={handleEmailSupport}
                    >
                        <Text style={styles.emailButtonText}>Email Support</Text>
                    </TouchableOpacity>

                    <View style={styles.rowButtons}>
                        <TouchableOpacity
                            style={[styles.smallButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                            onPress={handleReportBug}
                        >
                            <Text style={[styles.smallButtonText, { color: colors.text }]}>Report a Bug</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.smallButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                            onPress={handleRequestFeature}
                        >
                            <Text style={[styles.smallButtonText, { color: colors.text }]}>Request Feature</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            <Modal
                visible={showEmailSentModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowEmailSentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Ionicons name="mail-outline" size={36} color={colors.accent} style={{ marginBottom: 12 }} />
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Check Your Inbox</Text>
                        <Text style={[styles.modalMessage, { color: colors.subtext }]}>
                            Once you've sent your message, keep an eye on your email — our team will reply there.
                        </Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: colors.accent }]}
                            onPress={() => setShowEmailSentModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Got it</Text>
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
        flexDirection: "row", alignItems: "center", gap: 14,
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
    },
    backButton: {
        width: 36, height: 36, borderRadius: 18, borderWidth: 1,
        justifyContent: "center", alignItems: "center",
    },
    headerTitle: { fontSize: 20, fontFamily: "Outfit_700Bold" },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionLabel: { fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 1, marginBottom: 12 },
    faqList: { gap: 10 },
    faqCard: { borderRadius: 14, borderWidth: 1, padding: 16 },
    faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    faqQuestion: { fontSize: 14, fontFamily: "Outfit_700Bold", flex: 1, paddingRight: 10 },
    faqAnswer: { fontSize: 13, fontFamily: "Geist_400Regular", lineHeight: 20, marginTop: 12 },
    helpCard: { borderRadius: 18, borderWidth: 1, padding: 20, marginTop: 28 },
    helpTitle: { fontSize: 16, fontFamily: "Outfit_700Bold", marginBottom: 6 },
    helpSubtitle: { fontSize: 13, fontFamily: "Geist_400Regular", marginBottom: 18 },
    emailButton: { height: 48, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 12 },
    emailButtonText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Outfit_700Bold" },
    rowButtons: { flexDirection: "row", gap: 10 },
    smallButton: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center" },
    smallButtonText: { fontSize: 13, fontFamily: "Outfit_700Bold" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
    modalBox: { width: "85%", borderRadius: 20, padding: 24, alignItems: "center" },
    modalTitle: { fontSize: 17, fontFamily: "Outfit_700Bold", marginBottom: 8 },
    modalMessage: { fontSize: 13, fontFamily: "Geist_400Regular", textAlign: "center", lineHeight: 19, marginBottom: 20 },
    modalButton: { width: "100%", height: 46, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    modalButtonText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Outfit_700Bold" },
});