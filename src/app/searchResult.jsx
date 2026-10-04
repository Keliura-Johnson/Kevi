import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList, Image, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { discoverMovies, getImageUrl, searchMovies } from "../app/services/tmbd";
import { useTheme } from "../context/ThemeContext";

export default function SearchResults() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const params = useLocalSearchParams();
    const [searchText, setSearchText] = useState(params.query || "");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState("grid");

    const activeFilters = [
        params.genreName,
        params.ratingLabel ? `Rating ${params.ratingLabel}` : null,
        params.year,
    ].filter(Boolean);

    useEffect(() => {
        fetchResults(1, false);
    }, []);

    const fetchResults = async (pageToFetch, append) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            let data;
            if (params.query) {
                data = await searchMovies(params.query, pageToFetch);
            } else {
                data = await discoverMovies({
                    genre: params.genre,
                    year: params.year,
                    rating: params.rating,
                    page: pageToFetch,
                });
            }

            setTotalPages(data.total_pages || 1);
            setPage(pageToFetch);

            if (append) {
                setResults((prev) => [...prev, ...data.results]);
            } else {
                setResults(data.results);
            }
        } catch (error) {
            console.log("SEARCH RESULTS ERROR:", error);
            if (!append) setResults([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (loadingMore || loading || page >= totalPages) return;
        fetchResults(page + 1, true);
    };

    const handleNewSearch = () => {
        if (!searchText) return;
        router.setParams({ query: searchText });
        fetchResults(1, false);
    };

    const openItem = (item) => {
        const mediaType = item.media_type || "movie";
        router.push({
            pathname: '/moviedetail',
            params: { id: item.id, mediaType },
        });
    };

    const styles = getStyles(colors, isDark);

    const renderCard = (item, isGrid) => {
        const title = item.title || item.name;
        const year = (item.release_date || item.first_air_date || "").slice(0, 4);
        const isTV = item.media_type === "tv";

        return (
            <TouchableOpacity
                style={isGrid ? styles.gridCard : styles.listCard}
                onPress={() => openItem(item)}
            >
                <Image
                    source={{ uri: getImageUrl(item.poster_path) }}
                    style={isGrid ? styles.gridImage : styles.listImage}
                />
                {isTV && (
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>TV</Text>
                    </View>
                )}
                <View style={isGrid ? undefined : { flex: 1, marginLeft: 12 }}>
                    <Text style={styles.gridTitle} numberOfLines={1}>{title}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.gridYear}>{year}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={12} color="#F5C518" />
                            <Text style={styles.ratingText}>{item.vote_average?.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search movies, directors, actors..."
                    placeholderTextColor={colors.textSecondary || "#8B859B"}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleNewSearch}
                    returnKeyType="search"
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText("")}>
                        <Ionicons name="close-circle" size={18} color={colors.textSecondary || "#8B859B"} />
                    </TouchableOpacity>
                )}
            </View>

            {activeFilters.length > 0 && (
                <View style={styles.filterRow}>
                    {activeFilters.map((filter, index) => (
                        <View key={index} style={styles.filterChip}>
                            <Text style={styles.filterChipText}>{filter}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {loading ? "Searching..." : `Found ${results.length} results`}
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity onPress={() => setViewMode("grid")}>
                        <Ionicons name="grid-outline" size={20} color={viewMode === "grid" ? "#7F56D9" : colors.textSecondary || "#8B859B"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode("list")}>
                        <Ionicons name="list-outline" size={20} color={viewMode === "list" ? "#7F56D9" : colors.textSecondary || "#8B859B"} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7F56D9" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={results}
                    key={viewMode}
                    numColumns={viewMode === "grid" ? 2 : 1}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    columnWrapperStyle={viewMode === "grid" ? { justifyContent: "space-between" } : undefined}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? <ActivityIndicator size="small" color="#7F56D9" style={{ marginVertical: 20 }} /> : null
                    }
                    renderItem={({ item }) => renderCard(item, viewMode === "grid")}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No results found. Try a different search.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
        },
        searchBar: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            marginHorizontal: 20,
            marginTop: 10,
            paddingHorizontal: 14,
            height: 48,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            gap: 10,
        },
        searchInput: {
            flex: 1,
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 15,
            fontFamily: "Geist_400Regular",
        },
        filterRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            paddingHorizontal: 20,
            marginTop: 14,
        },
        filterChip: {
            backgroundColor: "#7F56D9",
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 16,
        },
        filterChipText: {
            color: "#FFFFFF",
            fontSize: 12,
            fontFamily: "Outfit_700Bold",
        },
        resultsHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 18,
            marginBottom: 14,
        },
        resultsCount: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            fontFamily: "Geist_400Regular",
        },
        gridCard: {
            width: "48%",
            marginBottom: 20,
        },
        gridImage: {
            width: "100%",
            height: 220,
            borderRadius: 12,
            marginBottom: 8,
        },
        gridTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
        metaRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
        },
        gridYear: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 12,
            fontFamily: "Geist_400Regular",
        },
        ratingRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        ratingText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 12,
            fontFamily: "Outfit_700Bold",
        },
        listCard: {
            flexDirection: "row",
            marginBottom: 16,
        },
        listImage: {
            width: 90,
            height: 130,
            borderRadius: 10,
        },
        typeBadge: {
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "#7F56D9",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
        },
        typeBadgeText: {
            color: "#FFFFFF",
            fontSize: 10,
            fontFamily: "Outfit_700Bold",
        },
        emptyText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 14,
            textAlign: "center",
            marginTop: 40,
            fontFamily: "Geist_400Regular",
        },
    });