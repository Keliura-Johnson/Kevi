import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
    ActivityIndicator, FlatList, Image, KeyboardAvoidingView,
    Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth, db } from "../../firebaseConfig";
import { getAIMovieRecommendations } from "../services/ai";
import { getImageUrl, searchMovies } from "../services/tmbd";

const Ai = () => {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [prompt, setPrompt] = useState("");
    const [movies, setMovies] = useState([]);
    const [intro, setIntro] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const getFavoriteGenres = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return [];

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) return [];

            return userDoc.data().favoriteGenres || [];
        } catch (error) {
            console.log("Error getting favorite genres:", error);
            return [];
        }
    };

    const handleAIRecommendation = async () => {
        if (!prompt.trim() || loading) return;

        try {
            setLoading(true);
            setMovies([]);
            setIntro("");
            setHasMore(true);

            const favoriteGenres = await getFavoriteGenres();
            const aiResult = await getAIMovieRecommendations(prompt.trim(), favoriteGenres, []);

            setIntro(aiResult.intro || "");

            const aiMovies = (aiResult.movies || []).slice(0, 30);

            const movieResults = await Promise.all(
                aiMovies.map(async (movie) => {
                    try {
                        const { results } = await searchMovies(movie.title);
                        if (!results || results.length === 0) return null;

                        return { ...results[0], aiReason: movie.reason, aiYear: movie.year };
                    } catch (error) {
                        console.log(`TMDB search failed for ${movie.title}:`, error);
                        return null;
                    }
                })
            );

            const filtered = movieResults.filter(Boolean);
            setMovies(filtered);

            if (filtered.length < 5) {
                setHasMore(false);
            }
        } catch (error) {
            console.log("AI recommendation error:", error);
            setMovies([]);
            setIntro(error?.message || "I couldn't generate recommendations right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (loadingMore || loading || !hasMore || movies.length === 0) return;

        try {
            setLoadingMore(true);

            const favoriteGenres = await getFavoriteGenres();
            const existingTitles = movies.map((m) => m.title);

            const aiResult = await getAIMovieRecommendations(
                prompt.trim(),
                favoriteGenres,
                existingTitles
            );

            const aiMovies = aiResult.movies || [];

            if (aiMovies.length === 0) {
                setHasMore(false);
                return;
            }

            const movieResults = await Promise.all(
                aiMovies.map(async (movie) => {
                    try {
                        const { results } = await searchMovies(movie.title);
                        if (!results || results.length === 0) return null;

                        return { ...results[0], aiReason: movie.reason, aiYear: movie.year };
                    } catch (error) {
                        return null;
                    }
                })
            );

            const newMovies = movieResults.filter((item) => item && !movies.some((m) => m.id === item.id));

            if (newMovies.length === 0) {
                setHasMore(false);
            } else {
                setMovies((prev) => [...prev, ...newMovies]);
            }
        } catch (error) {
            console.log("Load more error:", error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    };

    const styles = getStyles(colors, isDark);

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/moviedetail', params: { id: item.id } })}
            style={styles.movieCard}
        >
            <Image
                source={{ uri: getImageUrl(item.poster_path) }}
                style={styles.posterImage}
            />

            <View style={styles.movieDetails}>
                <View style={styles.movieHeaderRow}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.movieTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <Text style={styles.movieSubtitle}>
                            {item.release_date ? item.release_date.slice(0, 4) : item.aiYear} · Movie
                        </Text>
                    </View>

                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={13} color="#F5C518" />
                        <Text style={styles.ratingText}>
                            {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                        </Text>
                    </View>
                </View>

                <Text style={styles.aiReasonText} numberOfLines={3}>
                    {item.aiReason}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#7F56D9" />
                <Text style={{ color: colors.textSecondary || "#8B859B", fontSize: 12, marginTop: 6 }}>
                    Loading more picks...
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={{ flex: 1, paddingHorizontal: 18 }}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="sparkles" size={23} color="#7F56D9" />
                        </View>

                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.headerTitle}>
                                AI Picks For You
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                Tell Kevi what you want to watch
                            </Text>
                        </View>
                    </View>

                    {/* Input Box */}
                    <View style={styles.inputCard}>
                        <Text style={styles.inputCardTitle}>
                            What are you in the mood for?
                        </Text>

                        <View style={styles.inputRow}>
                            <TextInput
                                value={prompt}
                                onChangeText={setPrompt}
                                placeholder="A mind-bending sci-fi with deep love"
                                placeholderTextColor={colors.textSecondary || (isDark ? "#6E667D" : "#9E96B0")}
                                multiline
                                style={styles.textInput}
                            />

                            <TouchableOpacity
                                onPress={handleAIRecommendation}
                                disabled={loading}
                                activeOpacity={0.8}
                                style={[
                                    styles.submitButton,
                                    { opacity: loading ? 0.5 : 1 }
                                ]}
                            >
                                <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Loading State */}
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#7F56D9" />
                            <Text style={styles.loadingText}>
                                Finding movies for you...
                            </Text>
                        </View>
                    )}

                    {/* AI Intro / Response Note */}
                    {!loading && intro !== "" && (
                        <View style={styles.introCard}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
                                <Ionicons name="sparkles" size={16} color="#7F56D9" />
                                <Text style={styles.introTitle}>
                                    Kevi's picks
                                </Text>
                            </View>
                            <Text style={styles.introText}>
                                {intro}
                            </Text>
                        </View>
                    )}

                    {/* Movie List */}
                    {!loading && movies.length > 0 && (
                        <View style={{ flex: 1, marginTop: 18 }}>
                            <Text style={styles.sectionTitle}>
                                Recommended for you
                            </Text>
                            <FlatList
                                data={movies}
                                renderItem={renderMovie}
                                keyExtractor={(item, index) => `${item.id}-${index}`}
                                showsVerticalScrollIndicator={false}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={renderFooter}
                                contentContainerStyle={{ paddingBottom: 120 }}
                            />
                        </View>
                    )}

                    {/* Empty State */}
                    {!loading && movies.length === 0 && intro === "" && (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconBox}>
                                <Ionicons name="sparkles-outline" size={45} color="#7F56D9" />
                            </View>
                            <Text style={styles.emptyTitle}>
                                Your next movie is waiting
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                Tell Kevi what you're in the mood for{"\n"}and AI will find movies for you.
                            </Text>
                        </View>
                    )}

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Ai;

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
            marginBottom: 22,
        },
        iconContainer: {
            width: 42,
            height: 42,
            borderRadius: 13,
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
        },
        headerTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 22,
            fontFamily: "Outfit_700Bold",
        },
        headerSubtitle: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 11,
            marginTop: 3,
            fontFamily: "Geist_400Regular",
        },
        inputCard: {
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderRadius: 18,
            padding: 17,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#24103B" : "#E2DCEB"),
        },
        inputCardTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
            marginBottom: 11,
        },
        inputRow: {
            backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
            borderRadius: 14,
            paddingLeft: 15,
            paddingRight: 7,
            minHeight: 70,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#24103B" : "#E2DCEB"),
        },
        textInput: {
            flex: 1,
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            lineHeight: 20,
            paddingVertical: 12,
            fontFamily: "Geist_400Regular",
        },
        submitButton: {
            width: 46,
            height: 46,
            borderRadius: 13,
            backgroundColor: "#7F56D9",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
        },
        loadingContainer: {
            alignItems: "center",
            marginTop: 32,
        },
        loadingText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            marginTop: 12,
            fontFamily: "Geist_400Regular",
        },
        introCard: {
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderRadius: 16,
            padding: 16,
            marginTop: 16,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#24103B" : "#E2DCEB"),
        },
        introTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 13,
            fontFamily: "Outfit_700Bold",
            marginLeft: 7,
        },
        introText: {
            color: colors.textSecondary || (isDark ? "#C8C0D4" : "#4A4356"),
            fontSize: 12,
            lineHeight: 18,
            fontFamily: "Geist_400Regular",
        },
        sectionTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            marginBottom: 12,
        },
        movieCard: {
            flexDirection: "row",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderRadius: 18,
            marginBottom: 16,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#24103B" : "#E2DCEB"),
            minHeight: 132,
        },
        posterImage: {
            width: 88,
            height: 124,
            borderRadius: 12,
        },
        movieDetails: {
            flex: 1,
            marginLeft: 14,
            paddingTop: 2,
        },
        movieHeaderRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
        },
        movieTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            lineHeight: 22,
        },
        movieSubtitle: {
            color: colors.textSecondary || "#9E96B0",
            fontSize: 12,
            marginTop: 5,
            fontFamily: "Geist_400Regular",
        },
        ratingBadge: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
            paddingHorizontal: 9,
            paddingVertical: 6,
            borderRadius: 9,
        },
        ratingText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 11,
            fontFamily: "Outfit_700Bold",
            marginLeft: 4,
        },
        aiReasonText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 11,
            lineHeight: 17,
            marginTop: 10,
            fontFamily: "Geist_400Regular",
        },
        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 80,
        },
        emptyIconBox: {
            width: 90,
            height: 90,
            borderRadius: 28,
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
        },
        emptyTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 16,
            fontFamily: "Outfit_700Bold",
            textAlign: "center",
            marginTop: 20,
        },
        emptySubtitle: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 12,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 19,
            fontFamily: "Geist_400Regular",
        },
    });