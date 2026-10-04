import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function HomeSkeleton() {
    const { colors, isDark } = useTheme();

    const skeletonColor = isDark ? "#1C1130" : (colors.border || "#E0E0E0");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View>
                    <View style={[styles.lineSmall, { backgroundColor: skeletonColor }]} />
                    <View style={[styles.lineMedium, { backgroundColor: skeletonColor }]} />
                </View>
                <View style={[styles.avatarCircle, { backgroundColor: skeletonColor }]} />
            </View>

            <View style={[styles.bannerBlock, { backgroundColor: skeletonColor }]} />

            <View style={styles.sectionHeaderRow}>
                <View style={[styles.lineLabel, { backgroundColor: skeletonColor }]} />
                <View style={[styles.lineTiny, { backgroundColor: skeletonColor }]} />
            </View>

            <View style={styles.cardRow}>
                <View style={[styles.cardBlock, { backgroundColor: skeletonColor }]} />
                <View style={[styles.cardBlock, { backgroundColor: skeletonColor }]} />
                <View style={[styles.cardBlock, { backgroundColor: skeletonColor }]} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    lineSmall: { width: 90, height: 12, borderRadius: 6, marginBottom: 8 },
    lineMedium: { width: 130, height: 14, borderRadius: 6 },
    avatarCircle: { width: 44, height: 44, borderRadius: 22 },
    bannerBlock: { width: "100%", height: 150, borderRadius: 18, marginBottom: 20 },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    lineLabel: { width: 100, height: 12, borderRadius: 6 },
    lineTiny: { width: 40, height: 12, borderRadius: 6 },
    cardRow: { flexDirection: "row", gap: 12 },
    cardBlock: { flex: 1, height: 140, borderRadius: 14 },
});