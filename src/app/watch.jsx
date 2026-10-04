
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useTheme } from "../context/ThemeContext";

export default function WatchScreen() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const { id, title, type, season, episode } = useLocalSearchParams();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [playerKey, setPlayerKey] = useState(0);

    const isTV = type === "tv";

    const NHD_API_KEY = "badb31ea99de822a9aa7d7ba8e949c3848363c8acc6146a0";

    const streamUrl = isTV
        ? `https://nhdapi.st/tv/${id}/${season}/${episode}?key=${NHD_API_KEY}`
        : `https://nhdapi.st/movie/${id}?key=${NHD_API_KEY}`;

    const enterFullscreen = async () => {
        try {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
            );

            setIsFullscreen(true);
        } catch (error) {
            console.log("Fullscreen error:", error);
        }
    };

    const exitFullscreen = async () => {
        try {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );

            setIsFullscreen(false);
        } catch (error) {
            console.log("Exit fullscreen error:", error);
        }
    };

    useEffect(() => {
        return () => {
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            ).catch(() => {});
        };
    }, []);

    const handleError = () => {
        setShowErrorModal(true);
    };

    const retryVideo = () => {
        setShowErrorModal(false);
        setPlayerKey((prev) => prev + 1);
    };

    const styles = getStyles(colors, isDark);

    return (
        <View
            style={
                isFullscreen
                    ? styles.fullscreenContainer
                    : styles.container
            }
        >
            {!isFullscreen && (
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={isDark ? "#FFFFFF" : "#000000"}
                            />
                        </TouchableOpacity>

                        <Text
                            style={[
                                styles.headerTitle,
                                {
                                    color: isDark
                                        ? "#FFFFFF"
                                        : "#000000"
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>

                        <View style={{ width: 24 }} />
                    </View>
                </SafeAreaView>
            )}

            <View
                style={
                    isFullscreen
                        ? styles.fullscreenVideoWrapper
                        : styles.videoWrapper
                }
            >
                <WebView
                    key={playerKey}
                    source={{ uri: streamUrl }}
                    style={
                        isFullscreen
                            ? styles.fullscreenWebView
                            : styles.webView
                    }
                    allowsFullscreenVideo={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onShouldStartLoadWithRequest={(request) => {
                        if (
                            request.url.startsWith(
                                "https://nhdapi.st"
                            )
                        ) {
                            return true;
                        }

                        return false;
                    }}
                    onOpenWindow={() => {}}
                    onError={handleError}
                    onHttpError={handleError}
                />

                {!isFullscreen && (
                    <TouchableOpacity
                        style={styles.fullscreenButton}
                        onPress={enterFullscreen}
                    >
                        <Ionicons
                            name="expand-outline"
                            size={22}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                )}

                {isFullscreen && (
                    <TouchableOpacity
                        style={styles.fullscreenExitButton}
                        onPress={exitFullscreen}
                    >
                        <Ionicons
                            name="contract-outline"
                            size={24}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {!isFullscreen && (
                <>
                    <View style={styles.infoSection}>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: isDark
                                        ? "#FFFFFF"
                                        : "#000000"
                                }
                            ]}
                        >
                            {title}
                        </Text>

                        {isTV ? (
                            <Text style={styles.subtitle}>
                                Season {season} • Episode {episode}
                            </Text>
                        ) : (
                            <Text style={styles.subtitle}>
                                Movie
                            </Text>
                        )}
                    </View>
                </>
            )}

            <Modal
                visible={showErrorModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowErrorModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={45}
                            color="#7F56D9"
                        />

                        <Text style={styles.modalTitle}>
                            Video Unavailable
                        </Text>

                        <Text style={styles.modalText}>
                            The video could not be loaded. Please try again.
                        </Text>

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={retryVideo}
                        >
                            <Text style={styles.retryText}>
                                Try Again
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() =>
                                setShowErrorModal(false)
                            }
                        >
                            <Text style={styles.cancelText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                colors.background || "#090315"
        },

        fullscreenContainer: {
            flex: 1,
            backgroundColor: "#000000"
        },

        header: {
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 18,
            backgroundColor:
                colors.background || "#090315"
        },

        headerTitle: {
            flex: 1,
            textAlign: "center",
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            marginHorizontal: 15
        },

        videoWrapper: {
            width: "94%",
            aspectRatio: 16 / 9,
            backgroundColor: "#000000",
            position: "relative",
            alignSelf: "center",
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 8
        },

        fullscreenVideoWrapper: {
            flex: 1,
            width: "100%",
            backgroundColor: "#000000",
            position: "relative"
        },

        webView: {
            flex: 1,
            backgroundColor: "#000000"
        },

        fullscreenWebView: {
            flex: 1,
            backgroundColor: "#000000"
        },

        fullscreenButton: {
            position: "absolute",
            right: 12,
            bottom: 12,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center"
        },

        fullscreenExitButton: {
            position: "absolute",
            right: 18,
            top: 18,
            width: 45,
            height: 45,
            borderRadius: 23,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center"
        },

        infoSection: {
            paddingHorizontal: 18,
            paddingTop: 20
        },

        title: {
            fontSize: 22,
            fontFamily: "Outfit_700Bold"
        },

        subtitle: {
            marginTop: 7,
            fontSize: 14,
            fontFamily: "Geist_400Regular",
            color:
                colors.textSecondary || "#9E96B0"
        },

        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.75)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 25
        },

        modalBox: {
            width: "100%",
            backgroundColor: "#160626",
            borderRadius: 20,
            padding: 25,
            alignItems: "center"
        },

        modalTitle: {
            fontSize: 20,
            fontFamily: "Outfit_700Bold",
            color: "#FFFFFF",
            marginTop: 12
        },

        modalText: {
            fontSize: 14,
            fontFamily: "Geist_400Regular",
            color: "#9E96B0",
            textAlign: "center",
            marginTop: 8,
            lineHeight: 21
        },

        retryButton: {
            width: "100%",
            height: 48,
            borderRadius: 12,
            backgroundColor: "#7F56D9",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 22
        },

        retryText: {
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
            color: "#FFFFFF"
        },

        cancelButton: {
            marginTop: 15
        },

        cancelText: {
            fontSize: 14,
            fontFamily: "Geist_400Regular",
            color: "#9E96B0"
        }
    });

