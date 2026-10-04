// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import { useState } from "react";
// import {
//     Modal, StyleSheet, Text,
//     TouchableOpacity, View
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import YoutubePlayer from "react-native-youtube-iframe";
// import { useTheme } from "../context/ThemeContext";

// export default function TrailerScreen() {
//     const { colors, theme } = useTheme();
//     const isDark = theme === "dark";

//     const { videoKey, title } = useLocalSearchParams();
//     const [showErrorModal, setShowErrorModal] = useState(false);
//     const [playerKey, setPlayerKey] = useState(0);

//     const handleError = (error) => {
//         console.log("TRAILER ERROR:", error);
//         setShowErrorModal(true);
//     };

//     const styles = getStyles(colors, isDark);

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Ionicons name="arrow-back" size={22} color={colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle} numberOfLines={1}>
//                     {title} - Trailer
//                 </Text>
//                 <View style={{ width: 22 }} />
//             </View>

//             <View style={styles.videoWrapper}>
//                 <YoutubePlayer
//                     key={playerKey}
//                     height={"100%"}
//                     width={"100%"}
//                     play={true}
//                     videoId={videoKey}
//                     onError={handleError}
//                 />
//             </View>

//             <View style={styles.infoSection}>
//                 <Text style={styles.movieTitle}>{title}</Text>
//                 <Text style={styles.subtitle}>Official Cinematic Trailer 2 • 4K HDR</Text>

//                 <View style={styles.platformsSection}>
//                     <Text style={styles.platformsLabel}>Available on</Text>
//                     <View style={styles.platformsRow}>
//                         <View style={styles.platformChip}>
//                             <Text style={styles.platformText}>Netflix</Text>
//                         </View>
//                         <View style={styles.platformChip}>
//                             <Text style={styles.platformText}>Prime Video</Text>
//                         </View>
//                         <View style={styles.platformChip}>
//                             <Text style={styles.platformText}>Apple TV</Text>
//                         </View>
//                     </View>
//                 </View>
//             </View>

//             <Modal
//                 visible={showErrorModal}
//                 transparent={true}
//                 animationType="fade"
//                 onRequestClose={() => setShowErrorModal(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalBox}>
//                         <Ionicons name="cloud-offline-outline" size={40} color="#7F56D9" style={{ marginBottom: 16 }} />
//                         <Text style={styles.modalTitle}>Trailer Unavailable</Text>
//                         <Text style={styles.modalText}>
//                             We couldn't load this trailer. Please check your internet connection and try again.
//                         </Text>

//                         <TouchableOpacity
//                             style={styles.modalButton}
//                             onPress={() => {
//                                 setShowErrorModal(false);
//                                 setPlayerKey((prev) => prev + 1);
//                             }}
//                         >
//                             <Text style={styles.modalButtonText}>Try Again</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.modalCancelButton}
//                             onPress={() => router.back()}
//                         >
//                             <Text style={styles.modalCancelText}>Go Back</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const getStyles = (colors, isDark) =>
//     StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
//         },
//         header: {
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             paddingHorizontal: 20,
//             paddingVertical: 16,
//         },
//         headerTitle: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 15,
//             fontFamily: "Outfit_700Bold",
//             flex: 1,
//             textAlign: "center",
//         },
//         videoWrapper: {
//             marginHorizontal: 20,
//             borderRadius: 16,
//             overflow: "hidden",
//             borderWidth: 1,
//             borderColor: colors.border || (isDark ? "#4b18b0" : "#E2DCEB"),
//             aspectRatio: 16 / 9,
//             backgroundColor: "#000000",
//         },
//         infoSection: {
//             paddingHorizontal: 20,
//             marginTop: 20,
//         },
//         movieTitle: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 20,
//             fontFamily: "Outfit_700Bold",
//             marginBottom: 4,
//         },
//         subtitle: {
//             color: colors.textSecondary || "#8B859B",
//             fontSize: 13,
//             fontFamily: "Geist_400Regular",
//             marginBottom: 20,
//         },
//         platformsSection: {
//             marginTop: 10,
//         },
//         platformsLabel: {
//             color: colors.textSecondary || "#8B859B",
//             fontSize: 13,
//             fontFamily: "Geist_400Regular",
//             marginBottom: 10,
//         },
//         platformsRow: {
//             flexDirection: "row",
//             flexWrap: "wrap",
//             gap: 10,
//         },
//         platformChip: {
//             backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
//             borderWidth: 1,
//             borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
//             borderRadius: 20,
//             paddingHorizontal: 16,
//             paddingVertical: 8,
//         },
//         platformText: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 13,
//             fontFamily: "Outfit_700Bold",
//         },
//         modalOverlay: {
//             flex: 1,
//             backgroundColor: "rgba(0,0,0,0.7)",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         modalBox: {
//             width: "85%",
//             backgroundColor: colors.card || (isDark ? "#160626" : "#FFFFFF"),
//             borderRadius: 20,
//             padding: 24,
//             alignItems: "center",
//         },
//         modalTitle: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 18,
//             fontFamily: "Outfit_700Bold",
//             marginBottom: 8,
//         },
//         modalText: {
//             color: colors.textSecondary || "#8B859B",
//             fontSize: 14,
//             textAlign: "center",
//             lineHeight: 20,
//             fontFamily: "Geist_400Regular",
//             marginBottom: 24,
//         },
//         modalButton: {
//             width: "100%",
//             height: 48,
//             backgroundColor: "#7F56D9",
//             borderRadius: 14,
//             justifyContent: "center",
//             alignItems: "center",
//             marginBottom: 10,
//         },
//         modalButtonText: {
//             color: "#FFFFFF",
//             fontSize: 15,
//             fontFamily: "Outfit_700Bold",
//         },
//         modalCancelButton: {
//             width: "100%",
//             height: 48,
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         modalCancelText: {
//             color: colors.textSecondary || "#8B859B",
//             fontSize: 14,
//             fontFamily: "Outfit_700Bold",
//         },
//     });

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { getTVDetails, getTVSeasonDetails } from "../app/services/tmbd";
import { useTheme } from "../context/ThemeContext";

export default function TrailerScreen() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const { videoKey, title, id, type } = useLocalSearchParams();

    const isTV = type === "tv";

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [playerKey, setPlayerKey] = useState(0);

    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loadingSeasons, setLoadingSeasons] = useState(false);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    useEffect(() => {
        if (isTV && id) {
            loadTVSeasons();
        }
    }, [id, isTV]);

    useEffect(() => {
        if (isTV && id && selectedSeason !== null) {
            loadEpisodes(selectedSeason);
        }
    }, [selectedSeason]);

    const loadTVSeasons = async () => {
        try {
            setLoadingSeasons(true);

            const data = await getTVDetails(id);

            const validSeasons = (data.seasons || []).filter(
                (season) => season.season_number > 0
            );

            setSeasons(validSeasons);

            if (validSeasons.length > 0) {
                setSelectedSeason(validSeasons[0].season_number);
            }
        } catch (error) {
            console.log("Error loading seasons:", error);
        } finally {
            setLoadingSeasons(false);
        }
    };

    const loadEpisodes = async (seasonNumber) => {
        try {
            setLoadingEpisodes(true);

            const data = await getTVSeasonDetails(
                id,
                seasonNumber
            );

            setEpisodes(data.episodes || []);
        } catch (error) {
            console.log("Error loading episodes:", error);
            setEpisodes([]);
        } finally {
            setLoadingEpisodes(false);
        }
    };

    const handleError = (error) => {
        console.log("TRAILER ERROR:", error);
        setShowErrorModal(true);
    };

    const handleWatchMovie = () => {
        router.push({
            pathname: "/watch",
            params: {
                id: String(id),
                title: String(title),
                type: "movie"
            }
        });
    };

    const handleWatchEpisode = (episode) => {
        router.push({
            pathname: "/watch",
            params: {
                id: String(id),
                title: String(title),
                type: "tv",
                season: String(selectedSeason),
                episode: String(episode.episode_number)
            }
        });
    };

    const styles = getStyles(colors, isDark);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color={
                                colors.textPrimary ||
                                (isDark ? "#FFFFFF" : "#1A102A")
                            }
                        />
                    </TouchableOpacity>

                    <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                    >
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
                    <Text style={styles.movieTitle}>
                        {title}
                    </Text>

                    <Text style={styles.subtitle}>
                        Official Cinematic Trailer 2 • 4K HDR
                    </Text>

                    {!isTV && (
                        <TouchableOpacity
                            style={styles.watchButton}
                            onPress={handleWatchMovie}
                        >
                            <Ionicons
                                name="play"
                                size={19}
                                color="#FFFFFF"
                            />

                            <Text style={styles.watchButtonText}>
                                Watch Now
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.platformsSection}>
                        <Text style={styles.platformsLabel}>
                            Available on
                        </Text>

                        <View style={styles.platformsRow}>
                            <View style={styles.platformChip}>
                                <Text style={styles.platformText}>
                                    Netflix
                                </Text>
                            </View>

                            <View style={styles.platformChip}>
                                <Text style={styles.platformText}>
                                    Prime Video
                                </Text>
                            </View>

                            <View style={styles.platformChip}>
                                <Text style={styles.platformText}>
                                    Apple TV
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {isTV && (
                    <View style={styles.tvSection}>
                        <Text style={styles.sectionTitle}>
                            Seasons
                        </Text>

                        {loadingSeasons ? (
                            <ActivityIndicator
                                size="small"
                                color="#7F56D9"
                                style={{ marginVertical: 20 }}
                            />
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingRight: 20
                                }}
                            >
                                {seasons.map((season) => (
                                    <TouchableOpacity
                                        key={season.id}
                                        style={[
                                            styles.seasonChip,
                                            selectedSeason ===
                                                season.season_number &&
                                                styles.seasonChipActive
                                        ]}
                                        onPress={() =>
                                            setSelectedSeason(
                                                season.season_number
                                            )
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.seasonText,
                                                selectedSeason ===
                                                    season.season_number &&
                                                    styles.seasonTextActive
                                            ]}
                                        >
                                            Season{" "}
                                            {season.season_number}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}

                        {selectedSeason !== null && (
                            <View style={styles.episodesSection}>
                                <Text style={styles.sectionTitle}>
                                    Episodes
                                </Text>

                                {loadingEpisodes ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#7F56D9"
                                        style={{ marginVertical: 20 }}
                                    />
                                ) : episodes.length === 0 ? (
                                    <Text style={styles.emptyText}>
                                        No episodes available.
                                    </Text>
                                ) : (
                                    episodes.map((episode) => (
                                        <TouchableOpacity
                                            key={episode.id}
                                            style={styles.episodeCard}
                                            onPress={() =>
                                                handleWatchEpisode(
                                                    episode
                                                )
                                            }
                                        >
                                            <View style={styles.episodeNumber}>
                                                <Text
                                                    style={
                                                        styles.episodeNumberText
                                                    }
                                                >
                                                    {episode.episode_number}
                                                </Text>
                                            </View>

                                            <View
                                                style={
                                                    styles.episodeInfo
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.episodeTitle
                                                    }
                                                    numberOfLines={2}
                                                >
                                                    {episode.name}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.episodeOverview
                                                    }
                                                    numberOfLines={2}
                                                >
                                                    {episode.overview ||
                                                        "No episode description available."}
                                                </Text>
                                            </View>

                                            <View
                                                style={
                                                    styles.episodePlayButton
                                                }
                                            >
                                                <Ionicons
                                                    name="play"
                                                    size={18}
                                                    color="#FFFFFF"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={showErrorModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() =>
                    setShowErrorModal(false)
                }
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Ionicons
                            name="cloud-offline-outline"
                            size={40}
                            color="#7F56D9"
                            style={{ marginBottom: 16 }}
                        />

                        <Text style={styles.modalTitle}>
                            Trailer Unavailable
                        </Text>

                        <Text style={styles.modalText}>
                            We couldn't load this trailer. Please
                            check your internet connection and try
                            again.
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setShowErrorModal(false);
                                setPlayerKey(
                                    (prev) => prev + 1
                                );
                            }}
                        >
                            <Text style={styles.modalButtonText}>
                                Try Again
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.modalCancelText}>
                                Go Back
                            </Text>
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
            backgroundColor:
                colors.background ||
                (isDark ? "#090315" : "#FFFFFF"),
        },

        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
        },

        headerTitle: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
            flex: 1,
            textAlign: "center",
        },

        videoWrapper: {
            marginHorizontal: 20,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? "#4b18b0" : "#E2DCEB"),
            aspectRatio: 16 / 9,
            backgroundColor: "#000000",
        },

        infoSection: {
            paddingHorizontal: 20,
            marginTop: 20,
        },

        movieTitle: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 20,
            fontFamily: "Outfit_700Bold",
            marginBottom: 4,
        },

        subtitle: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            fontFamily: "Geist_400Regular",
            marginBottom: 20,
        },

        watchButton: {
            width: "100%",
            height: 52,
            borderRadius: 14,
            backgroundColor: "#7F56D9",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 9,
            marginBottom: 24,
        },

        watchButtonText: {
            color: "#FFFFFF",
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
        },

        platformsSection: {
            marginTop: 10,
        },

        platformsLabel: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            fontFamily: "Geist_400Regular",
            marginBottom: 10,
        },

        platformsRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
        },

        platformChip: {
            backgroundColor:
                colors.surface ||
                (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
        },

        platformText: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 13,
            fontFamily: "Outfit_700Bold",
        },

        tvSection: {
            marginTop: 28,
            paddingHorizontal: 20,
        },

        sectionTitle: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            marginBottom: 12,
        },

        seasonChip: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? "#412A6F" : "#E2DCEB"),
            backgroundColor:
                colors.surface ||
                (isDark ? "#160626" : "#F4F2F8"),
            marginRight: 10,
        },

        seasonChipActive: {
            backgroundColor: "#7F56D9",
            borderColor: "#7F56D9",
        },

        seasonText: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 13,
            fontFamily: "Outfit_700Bold",
        },

        seasonTextActive: {
            color: "#FFFFFF",
        },

        episodesSection: {
            marginTop: 28,
        },

        episodeCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                colors.surface ||
                (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor:
                colors.border ||
                (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 14,
            padding: 12,
            marginBottom: 12,
        },

        episodeNumber: {
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: "#7F56D9",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },

        episodeNumberText: {
            color: "#FFFFFF",
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
        },

        episodeInfo: {
            flex: 1,
            marginRight: 10,
        },

        episodeTitle: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
            marginBottom: 4,
        },

        episodeOverview: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 11,
            lineHeight: 16,
            fontFamily: "Geist_400Regular",
        },

        episodePlayButton: {
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: "#7F56D9",
            justifyContent: "center",
            alignItems: "center",
        },

        emptyText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            fontFamily: "Geist_400Regular",
        },

        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
        },

        modalBox: {
            width: "85%",
            backgroundColor:
                colors.card ||
                (isDark ? "#160626" : "#FFFFFF"),
            borderRadius: 20,
            padding: 24,
            alignItems: "center",
        },

        modalTitle: {
            color:
                colors.textPrimary ||
                (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 18,
            fontFamily: "Outfit_700Bold",
            marginBottom: 8,
        },

        modalText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
            fontFamily: "Geist_400Regular",
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

        modalButtonText: {
            color: "#FFFFFF",
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
        },

        modalCancelButton: {
            width: "100%",
            height: 48,
            justifyContent: "center",
            alignItems: "center",
        },

        modalCancelText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
    });