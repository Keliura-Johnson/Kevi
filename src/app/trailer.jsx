import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Modal, StyleSheet, Text,
    TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

export default function TrailerScreen() {
    const { videoKey, title } = useLocalSearchParams();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [playerKey, setPlayerKey] = useState(0);

    const handleError = (error) => {
        console.log("TRAILER ERROR:", error);
        setShowErrorModal(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title} - Trailer
                </Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.videoWrapper}>
                <YoutubePlayer
                    key={playerKey}
                    height={"100%"}
                    width={"100%"}
                    play={true}
                    videoId={videoKey}
                    onError={handleError}
                />
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.movieTitle}>{title}</Text>
                <Text style={styles.subtitle}>Official Cinematic Trailer 2 • 4K HDR</Text>

                <View style={styles.platformsSection}>
                    <Text style={styles.platformsLabel}>Available on</Text>
                    <View style={styles.platformsRow}>
                        <View style={styles.platformChip}>
                            <Text style={styles.platformText}>Netflix</Text>
                        </View>
                        <View style={styles.platformChip}>
                            <Text style={styles.platformText}>Prime Video</Text>
                        </View>
                        <View style={styles.platformChip}>
                            <Text style={styles.platformText}>Apple TV</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Modal
                visible={showErrorModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowErrorModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Ionicons name="cloud-offline-outline" size={40} color="#7F56D9" style={{ marginBottom: 16 }} />
                        <Text style={styles.modalTitle}>Trailer Unavailable</Text>
                        <Text style={styles.modalText}>
                            We couldn't load this trailer. Please check your internet connection and try again.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setShowErrorModal(false);
                                setPlayerKey((prev) => prev + 1);
                            }}
                        >
                            <Text style={styles.modalButtonText}>Try Again</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.modalCancelText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090315" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", flex: 1, textAlign: "center" },
    videoWrapper: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#4b18b0",
        aspectRatio: 16 / 9,
    },
    infoSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    movieTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        color: "#8B859B",
        fontSize: 13,
        marginBottom: 20,
    },
    platformsSection: {
        marginTop: 10,
    },
    platformsLabel: {
        color: "#8B859B",
        fontSize: 13,
        marginBottom: 10,
    },
    platformsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    platformChip: {
        backgroundColor: "#160626",
        borderWidth: 1,
        borderColor: "#412A6F",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    platformText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#160626",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    modalText: {
        color: "#8B859B",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    modalButton: {
        width: "100%",
        height: 48,
        backgroundColor: "#7F56D9",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    modalButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
    modalCancelButton: {
        width: "100%",
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    modalCancelText: { color: "#8B859B", fontSize: 14, fontWeight: "600" },
});