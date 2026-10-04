import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { getImageUrl, getTrending } from "../../src/app/services/tmbd";

export default function Trending() {
    const { colors } = useTheme();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    const loadTrendingMovies = async () => {
        try {
            const results = await getTrending(1);
            setMovies(results.slice(0, 20));
        } catch (error) {
            console.log("FETCH TRENDING MOVIES ERROR:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadTrendingMovies();
    };

    const handleMoviePress = (item) => {
        // Wrapped in setTimeout to prevent navigation from executing mid-render
        setTimeout(() => {
            router.push({
                pathname: "/moviedetail",
                params: {
                    id: item.id,
                    mediaType: item.media_type || "movie",
                },
            });
        }, 0);
    };

    const renderMovieCard = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            activeOpacity={0.8}
            onPress={() => handleMoviePress(item)}
        >
            <View style={[styles.rankBadge, { backgroundColor: colors.accent || "#7F56D9" }]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
            </View>

            <Image
                source={{
                    uri: item.poster_path
                        ? getImageUrl(item.poster_path)
                        : "https://via.placeholder.com/150",
                }}
                style={styles.poster}
            />

            <View style={styles.info}>
                <Text style={[styles.movieTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title || item.name}
                </Text>

                <View style={styles.metaRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={[styles.rating, { color: colors.text }]}>
                        {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                    </Text>
                    <Text style={[styles.dot, { color: colors.subtext }]}>•</Text>
                    <Text style={[styles.releaseDate, { color: colors.subtext }]}>
                        {(item.release_date || item.first_air_date) ? (item.release_date || item.first_air_date).split("-")[0] : "N/A"}
                    </Text>
                </View>

                <Text style={[styles.overview, { color: colors.subtext }]} numberOfLines={2}>
                    {item.overview || "No description available."}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Top 20 Trending 🎬
                </Text>
                <View style={{ width: 22 }} />
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.accent || "#7F56D9"} />
                </View>
            ) : (
                <FlatList
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMovieCard}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.accent || "#7F56D9"}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        justifycontent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: { fontSize: 18, fontFamily: "Outfit_700Bold" },
    loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    listContainer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
    card: {
        flexDirection: "row",
        borderRadius: 14,
        marginBottom: 16,
        padding: 12,
        overflow: "hidden",
        position: "relative",
    },
    rankBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomRightRadius: 10,
        zIndex: 10,
    },
    rankText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Outfit_700Bold" },
    poster: { width: 80, height: 110, borderRadius: 10, marginTop: 12 },
    info: { flex: 1, marginLeft: 14, justifyContent: "center" },
    movieTitle: { fontSize: 15, fontFamily: "Outfit_700Bold" },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginVertical: 6 },
    rating: { fontSize: 13, fontFamily: "Outfit_700Bold" },
    dot: { fontSize: 12 },
    releaseDate: { fontSize: 12, fontFamily: "Geist_400Regular" },
    overview: { fontSize: 12, fontFamily: "Geist_400Regular", lineHeight: 16 },
});