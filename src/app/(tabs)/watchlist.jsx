import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
    ActivityIndicator, FlatList, Image, Modal,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { getImageUrl, getMovieDetails } from "../services/tmbd";

const SORT_OPTIONS = [
    { key: "recent", label: "Recently Added" },
    { key: "title", label: "Title (A-Z)" },
    { key: "rating", label: "Highest Rated" },
    { key: "year", label: "Newest Release" },
];

export default function Watchlist() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("recent");
    const [showSortModal, setShowSortModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchWatchlist();
        }, [])
    );

    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log("NO USER LOGGED IN");
                setMovies([]);
                return;
            }

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                console.log("USER DOC DOES NOT EXIST");
                setMovies([]);
                return;
            }

            console.log("USER DOC DATA:", userDoc.data());

            const watchlistIds = userDoc.data().watchlist || [];

            console.log("WATCHLIST IDS:", watchlistIds);

            const movieDetails = await Promise.all(
                watchlistIds.map(async (id) => {
                    try {
                        return await getMovieDetails(id);
                    } catch (err) {
                        console.log("FAILED TO FETCH MOVIE ID:", id, err);
                        return null;
                    }
                })
            );

            console.log("FETCHED MOVIE DETAILS:", movieDetails);

            setMovies(movieDetails.filter(Boolean).reverse());
        } catch (error) {
            console.log("WATCHLIST ERROR:", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const getSortedMovies = () => {
        const sorted = [...movies];

        if (sortBy === "title") {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "rating") {
            sorted.sort((a, b) => b.vote_average - a.vote_average);
        } else if (sortBy === "year") {
            sorted.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
        }

        return sorted;
    };

    const sortedMovies = getSortedMovies();
    const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.label;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Watchlist</Text>
            </View>

            <View style={styles.sortRow}>
                <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortModal(true)}>
                    <Text style={styles.sortLabel}>
                        Sort by: <Text style={styles.sortValue}>{currentSortLabel}</Text>
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#7F56D9" />
                </TouchableOpacity>

                <Text style={styles.movieCount}>{movies.length} Movies</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7F56D9" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={sortedMovies}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push({ pathname: "/moviedetail", params: { id: item.id } })}
                        >
                            <Image
                                source={{ uri: getImageUrl(item.poster_path) }}
                                style={styles.cardImage}
                            />
                            <View style={styles.bookmarkIcon}>
                                <Ionicons name="bookmark" size={16} color="#FFFFFF" />
                            </View>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <View style={styles.metaRow}>
                                <Text style={styles.cardYear}>
                                    {item.release_date?.slice(0, 4)}
                                </Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={12} color="#F5C518" />
                                    <Text style={styles.ratingText}>
                                        {item.vote_average?.toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="bookmark-outline" size={50} color="#412A6F" />
                            <Text style={styles.emptyText}>Your watchlist is empty</Text>
                            <Text style={styles.emptySubtext}>
                                Movies you add to your watchlist will appear here.
                            </Text>
                        </View>
                    }
                />
            )}

            <Modal
                visible={showSortModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSortModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortModal(false)}
                >
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Sort by</Text>
                        {SORT_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={styles.sortOption}
                                onPress={() => {
                                    setSortBy(option.key);
                                    setShowSortModal(false);
                                }}
                            >
                                <Text style={styles.sortOptionText}>{option.label}</Text>
                                {sortBy === option.key && (
                                    <Ionicons name="checkmark" size={18} color="#7F56D9" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090315" },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 14,
    },
    headerTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "800" },
    sortRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    sortLabel: { color: "#8B859B", fontSize: 13 },
    sortValue: { color: "#7F56D9", fontWeight: "700" },
    movieCount: { color: "#8B859B", fontSize: 13 },
    card: {
        width: "48%",
        marginBottom: 20,
    },
    cardImage: {
        width: "100%",
        height: 220,
        borderRadius: 14,
        marginBottom: 8,
    },
    bookmarkIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(127,86,217,0.85)",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    cardTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 4,
    },
    cardYear: { color: "#8B859B", fontSize: 12 },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
    emptyState: {
        alignItems: "center",
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginTop: 16 },
    emptySubtext: {
        color: "#8B859B",
        fontSize: 13,
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "80%",
        backgroundColor: "#160626",
        borderRadius: 18,
        padding: 20,
    },
    modalTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginBottom: 14 },
    sortOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#24103B",
    },
    sortOptionText: { color: "#FFFFFF", fontSize: 14 },
});