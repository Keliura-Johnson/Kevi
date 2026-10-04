import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function About() {
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <View style={styles.logoSection}>
                    <Image
                        source={require("../../assets/images/kevilogo.png")}
                        style={styles.logoImage}
                    />
                    <Text style={[styles.appName, { color: colors.text }]}>KEVI</Text>
                    <Text style={[styles.tagline, { color: colors.accent }]}>YOUR AI CINEMA COMPANION</Text>
                    <Text style={[styles.version, { color: colors.subtext }]}>Version 1.0</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push("/termsofservice")}>
                        <Text style={[styles.rowText, { color: colors.text }]}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity style={styles.row} onPress={() => router.push("/privacypolicy")}>
                        <Text style={[styles.rowText, { color: colors.text }]}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                </View>

                <View style={styles.socialRow}>
                    <View style={[styles.socialIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="film-outline" size={20} color={colors.text} />
                    </View>
                    <View style={[styles.socialIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="sparkles-outline" size={20} color={colors.text} />
                    </View>
                    <View style={[styles.socialIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="heart-outline" size={20} color={colors.text} />
                    </View>
                    <View style={[styles.socialIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="planet-outline" size={20} color={colors.text} />
                    </View>
                </View>

                <Text style={[styles.footerText, { color: colors.subtext }]}>
                    Made with <Text style={{ color: "#FF4D6D" }}>♥</Text> in Adamawa
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: { fontSize: 20, fontFamily: "Outfit_700Bold" },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    logoSection: { alignItems: "center", marginTop: 10, marginBottom: 28 },
    logoImage: { width: 84, height: 84, borderRadius: 20, marginBottom: 14 },
    appName: { fontSize: 19, fontFamily: "Outfit_700Bold", letterSpacing: 1 },
    tagline: { fontSize: 12, fontFamily: "Outfit_700Bold", letterSpacing: 0.5, marginTop: 6 },
    version: { fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 6 },
    card: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
    row: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingVertical: 15, paddingHorizontal: 16,
    },
    rowText: { fontSize: 14, fontFamily: "Outfit_700Bold" },
    divider: { height: 1, marginHorizontal: 16 },
    socialRow: { flexDirection: "row", justifyContent: "center", gap: 14, marginTop: 30 },
    socialIcon: {
        width: 42, height: 42, borderRadius: 21, borderWidth: 1,
        justifyContent: "center", alignItems: "center",
    },
    footerText: { textAlign: "center", fontSize: 12, fontFamily: "Geist_400Regular", marginTop: 24 },
});