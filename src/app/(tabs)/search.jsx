import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth } from "../../firebaseConfig";
import { getImageUrl, getTrending, searchMovies, searchMulti } from "../services/tmbd";

const GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

const YEARS = ["2024", "2023", "2022", "2021", "2020"];

const RATINGS = [
    { label: "8.0+", value: 8 },
    { label: "7.0+", value: 7 },
    { label: "6.0+", value: 6 },
];

export default function SearchScreen() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [showGenrePicker, setShowGenrePicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showRatingPicker, setShowRatingPicker] = useState(false);
    const [trendingSearches, setTrendingSearches] = useState([]);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    useEffect(() => {
        const loadTrending = async () => {
            const movies = await getTrending();
            setTrendingSearches(movies ? movies.slice(0, 5) : []);
        };

        loadTrending();
    }, []);

    useEffect(() => {
        const query = searchText.trim();

        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const getSuggestions = async () => {
            try {
                let rawResults = [];

                if (typeof searchMulti === "function") {
                    const response = await searchMulti(query);
                    rawResults = response?.results || (Array.isArray(response) ? response : []);
                }

                if (rawResults.length === 0 && typeof searchMovies === "function") {
                    const response = await searchMovies(query);
                    rawResults = response?.results || (Array.isArray(response) ? response : []);
                }

                const filtered = rawResults.filter(
                    (item) => item && (item.title || item.name) && item.media_type !== "person"
                );

                setSuggestions(filtered.slice(0, 6));
            } catch (error) {
                console.log("Autocomplete Error:", error);
                setSuggestions([]);
            }
        };

        const timer = setTimeout(() => {
            getSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchText]);

    const getRecentSearchKey = () => {
        const user = auth.currentUser;
        if (!user) return null;
        return `recentSearches_${user.uid}`;
    };

    const loadRecentSearches = async () => {
        const key = getRecentSearchKey();
        if (!key) {
            setRecentSearches([]);
            return;
        }

        const existing = await AsyncStorage.getItem(key);
        setRecentSearches(existing ? JSON.parse(existing) : []);
    };

    const saveRecentSearch = async (term) => {
        if (!term) return;
        const key = getRecentSearchKey();
        if (!key) return;

        const existing = await AsyncStorage.getItem(key);
        let searches = existing ? JSON.parse(existing) : [];

        searches = [term, ...searches.filter((s) => s !== term)].slice(0, 5);

        await AsyncStorage.setItem(key, JSON.stringify(searches));
        setRecentSearches(searches);
    };

    const removeRecentSearch = async (term) => {
        const key = getRecentSearchKey();
        if (!key) return;

        const updated = recentSearches.filter((s) => s !== term);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
        setRecentSearches(updated);
    };

    const clearAllRecent = async () => {
        const key = getRecentSearchKey();
        if (!key) return;

        await AsyncStorage.removeItem(key);
        setRecentSearches([]);
    };

    const runSearch = async (term, overrideGenre, overrideYear, overrideRating) => {
        const query = term || searchText;

        if (query) {
            await saveRecentSearch(query);
        }

        setSuggestions([]);

        const genre = overrideGenre !== undefined ? overrideGenre : selectedGenre;
        const year = overrideYear !== undefined ? overrideYear : selectedYear;
        const rating = overrideRating !== undefined ? overrideRating : selectedRating;

        router.push({
            pathname: '/searchResult',
            params: {
                query: query || '',
                genre: genre?.id || '',
                genreName: genre?.name || '',
                year: year || '',
                rating: rating?.value || '',
                ratingLabel: rating?.label || '',
            }
        });
    };

    const selectSuggestion = (item) => {
        const title = item.title || item.name;
        runSearch(title);
    };

    const styles = getStyles(colors, isDark);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.searchBar}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={colors.textSecondary || "#8B859B"}
                    />

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search movies, directors, actors..."
                        placeholderTextColor={colors.textSecondary || "#8B859B"}
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={() => runSearch(searchText)}
                        returnKeyType="search"
                        autoCorrect={false}
                    />

                    {searchText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchText("");
                                setSuggestions([]);
                            }}
                        >
                            <Ionicons
                                name="close-circle"
                                size={19}
                                color={colors.textSecondary || "#8B859B"}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((item) => {
                            const title = item.title || item.name;
                            const year = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
                            const isTV = item.media_type === "tv";

                            return (
                                <TouchableOpacity
                                    key={`${item.id}-${title}`}
                                    style={styles.suggestionRow}
                                    onPress={() => selectSuggestion(item)}
                                >
                                    {item.poster_path ? (
                                        <Image
                                            source={{ uri: getImageUrl(item.poster_path) }}
                                            style={styles.suggestionPoster}
                                        />
                                    ) : (
                                        <View style={styles.suggestionPosterPlaceholder}>
                                            <Ionicons
                                                name={isTV ? "tv-outline" : "film-outline"}
                                                size={16}
                                                color={colors.textSecondary || "#8B859B"}
                                            />
                                        </View>
                                    )}

                                    <View style={styles.suggestionInfo}>
                                        <Text style={styles.suggestionTitle} numberOfLines={1}>
                                            {title}
                                        </Text>

                                        <Text style={styles.suggestionYear}>
                                            {year ? `${year} · ` : ""}{isTV ? "TV Series" : "Movie"}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward-outline"
                                        size={18}
                                        color={colors.textSecondary || "#8B859B"}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedGenre && styles.filterChipActive]}
                        onPress={() => setShowGenrePicker(!showGenrePicker)}
                    >
                        <Text style={[styles.filterChipText, selectedGenre && styles.filterChipTextActive]}>
                            {selectedGenre ? selectedGenre.name : "Genre"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, selectedYear && styles.filterChipActive]}
                        onPress={() => setShowYearPicker(!showYearPicker)}
                    >
                        <Text style={[styles.filterChipText, selectedYear && styles.filterChipTextActive]}>
                            {selectedYear || "Year"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, selectedRating && styles.filterChipActive]}
                        onPress={() => setShowRatingPicker(!showRatingPicker)}
                    >
                        <Text style={[styles.filterChipText, selectedRating && styles.filterChipTextActive]}>
                            {selectedRating ? selectedRating.label : "Rating"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showGenrePicker && (
                    <View style={styles.dropdown}>
                        {GENRES.map((g) => (
                            <TouchableOpacity
                                key={g.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedGenre(g);
                                    setShowGenrePicker(false);
                                    runSearch(null, g, undefined, undefined);
                                }}
                            >
                                <Text style={styles.dropdownText}>{g.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {showYearPicker && (
                    <View style={styles.dropdown}>
                        {YEARS.map((y) => (
                            <TouchableOpacity
                                key={y}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedYear(y);
                                    setShowYearPicker(false);
                                    runSearch(null, undefined, y, undefined);
                                }}
                            >
                                <Text style={styles.dropdownText}>{y}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {showRatingPicker && (
                    <View style={styles.dropdown}>
                        {RATINGS.map((r) => (
                            <TouchableOpacity
                                key={r.value}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedRating(r);
                                    setShowRatingPicker(false);
                                    runSearch(null, undefined, undefined, r);
                                }}
                            >
                                <Text style={styles.dropdownText}>{r.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {searchText.length === 0 && recentSearches.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>

                            <TouchableOpacity onPress={clearAllRecent}>
                                <Text style={styles.clearAll}>Clear All</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.recentChipsRow}>
                            {recentSearches.map((term, index) => (
                                <View key={index} style={styles.recentChip}>
                                    <TouchableOpacity onPress={() => runSearch(term)}>
                                        <Text style={styles.recentChipText}>{term}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => removeRecentSearch(term)}>
                                        <Ionicons
                                            name="close"
                                            size={14}
                                            color={colors.textSecondary || "#8B859B"}
                                            style={{ marginLeft: 6 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {searchText.length === 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trending Searches</Text>

                        {trendingSearches.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.trendingRow}
                                onPress={() => runSearch(item.title)}
                            >
                                <Text style={styles.trendingRank}>{index + 1}</Text>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.trendingTitle}>{item.title}</Text>
                                    <Text style={styles.trendingSubtitle}>
                                        ⭐ {item.vote_average?.toFixed(1)} · {item.release_date?.slice(0, 4)}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="arrow-forward"
                                    size={16}
                                    color={colors.textSecondary || "#8B859B"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
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
            marginTop: 16,
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

        suggestionsContainer: {
            marginHorizontal: 20,
            marginTop: 6,
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            overflow: "hidden",
            zIndex: 10,
        },

        suggestionRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderBottomColor: colors.border || (isDark ? "#2A1F3D" : "#ECE8F3"),
            gap: 12,
        },

        suggestionPoster: {
            width: 32,
            height: 46,
            borderRadius: 6,
        },

        suggestionPosterPlaceholder: {
            width: 32,
            height: 46,
            borderRadius: 6,
            backgroundColor: colors.background || (isDark ? "#090315" : "#E2DCEB"),
            justifyContent: "center",
            alignItems: "center",
        },

        suggestionInfo: {
            flex: 1,
        },

        suggestionTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Geist_400Regular",
        },

        suggestionYear: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 11,
            marginTop: 3,
            fontFamily: "Geist_400Regular",
        },

        filterRow: {
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: 20,
            marginTop: 16,
        },

        filterChip: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
        },

        filterChipActive: {
            backgroundColor: "#7F56D9",
            borderColor: "#7F56D9",
        },

        filterChipText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 13,
            fontFamily: "Geist_400Regular",
        },

        filterChipTextActive: {
            color: "#FFFFFF",
        },

        dropdown: {
            marginHorizontal: 20,
            marginTop: 8,
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            maxHeight: 220,
            overflow: "hidden",
        },

        dropdownItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border || (isDark ? "#2A1F3D" : "#ECE8F3"),
        },

        dropdownText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Geist_400Regular",
        },

        section: {
            marginTop: 28,
            paddingHorizontal: 20,
        },

        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
        },

        sectionTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 18,
            fontFamily: "Outfit_700Bold",
            marginBottom: 12,
        },

        clearAll: {
            color: "#7F56D9",
            fontSize: 13,
            fontFamily: "Geist_400Regular",
        },

        recentChipsRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
        },

        recentChip: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
        },

        recentChipText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 13,
            fontFamily: "Geist_400Regular",
        },

        trendingRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border || (isDark ? "#2A1F3D" : "#ECE8F3"),
            gap: 12,
        },

        trendingRank: {
            color: "#7F56D9",
            fontSize: 16,
            fontFamily: "Outfit_700Bold",
            width: 20,
        },

        trendingTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
        },

        trendingSubtitle: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 12,
            marginTop: 2,
            fontFamily: "Geist_400Regular",
        },
    });