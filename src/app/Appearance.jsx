import { Ionicons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import { router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "../firebaseConfig";

const TEXT_SIZES = ["Small", "Medium", "Large"];

export default function Appearance() {
    const { theme, setTheme, textSizeIndex, setTextSizeIndex, colors } = useTheme();

    const savePreference = async (updates) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await updateDoc(doc(db, "users", user.uid), updates);
        } catch (error) {
            console.log("APPEARANCE SAVE ERROR:", error);
        }
    };

    const handleThemeSelect = (value) => {
        setTheme(value);
        savePreference({ theme: value });
    };

    const handleTextSizeChange = (value) => {
        setTextSizeIndex(Math.round(value));
    };

    const handleTextSizeComplete = (value) => {
        const rounded = Math.round(value);
        savePreference({ textSizeIndex: rounded });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={{ paddingHorizontal: 20 }}>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>THEME</Text>
                <View style={styles.themeRow}>
                    <TouchableOpacity
                        style={[styles.themeCard, { backgroundColor: colors.card, borderColor: theme === "dark" ? colors.accent : colors.border }]}
                        onPress={() => handleThemeSelect("dark")}
                    >
                        <View style={styles.themeSwatchDark} />
                        <Text style={[styles.themeLabel, { color: colors.text }]}>Dark</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.themeCard, { backgroundColor: colors.card, borderColor: theme === "light" ? colors.accent : colors.border }]}
                        onPress={() => handleThemeSelect("light")}
                    >
                        <View style={styles.themeSwatchLight} />
                        <Text style={[styles.themeLabel, { color: colors.text }]}>Light</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionLabel, { color: colors.subtext }]}>TEXT SIZE</Text>
                <View style={[styles.sliderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.sliderLabelsRow}>
                        <Text style={{ color: colors.subtext, fontSize: 13 }}>Small</Text>
                        <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 13 }}>
                            {TEXT_SIZES[textSizeIndex]}
                        </Text>
                        <Text style={{ color: colors.subtext, fontSize: 13 }}>Large</Text>
                    </View>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={2}
                        step={1}
                        value={textSizeIndex}
                        onValueChange={handleTextSizeChange}
                        onSlidingComplete={handleTextSizeComplete}
                        minimumTrackTintColor={colors.accent}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.accent}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 20, paddingVertical: 16,
    },
    headerTitle: { fontSize: 20, fontWeight: "800" },
    sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 10, marginTop: 20 },
    themeRow: { flexDirection: "row", gap: 12 },
    themeCard: { flex: 1, borderRadius: 14, borderWidth: 1, alignItems: "center", paddingVertical: 16, gap: 10 },
    themeSwatchDark: { width: 40, height: 30, borderRadius: 6, backgroundColor: "#0A0415" },
    themeSwatchLight: { width: 40, height: 30, borderRadius: 6, backgroundColor: "#F2F2F2" },
    themeLabel: { fontSize: 13, fontWeight: "600" },
    sliderCard: { borderRadius: 14, borderWidth: 1, padding: 16 },
    sliderLabelsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
});