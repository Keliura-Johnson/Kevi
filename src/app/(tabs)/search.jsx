import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebaseConfig";
import { getTrending } from "../services/tmbd";

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
    const [searchText, setSearchText] = useState("");
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
            setTrendingSearches(movies.slice(0, 5));
        };
        loadTrending();
    }, []);

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

        searches = [
            term,
            ...searches.filter(s => s !== term)
        ].slice(0, 5);

        await AsyncStorage.setItem(key, JSON.stringify(searches));

        setRecentSearches(searches);
    };

    const removeRecentSearch = async (term) => {
        const key = getRecentSearchKey();

        if (!key) return;

        const updated = recentSearches.filter(s => s !== term);

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
        if (query) await saveRecentSearch(query);

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#8B859B" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search movies, directors, actors..."
                        placeholderTextColor="#8B859B"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={() => runSearch(searchText)}
                        returnKeyType="search"
                    />
                </View>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedGenre && styles.filterChipActive]}
                        onPress={() => setShowGenrePicker(!showGenrePicker)}
                    >
                        <Text style={styles.filterChipText}>
                            {selectedGenre ? selectedGenre.name : "Genre"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, selectedYear && styles.filterChipActive]}
                        onPress={() => setShowYearPicker(!showYearPicker)}
                    >
                        <Text style={styles.filterChipText}>
                            {selectedYear || "Year"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, selectedRating && styles.filterChipActive]}
                        onPress={() => setShowRatingPicker(!showRatingPicker)}
                    >
                        <Text style={styles.filterChipText}>
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

                {recentSearches.length > 0 && (
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
                                        <Ionicons name="close" size={14} color="#8B859B" style={{ marginLeft: 6 }} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trending Searches</Text>

                    <FlatList
                        data={trendingSearches}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
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
                                <Ionicons name="arrow-forward" size={16} color="#8B859B" />
                            </TouchableOpacity>
                        )}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#090315",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#160626",
        marginHorizontal: 20,
        marginTop: 16,
        paddingHorizontal: 14,
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#412A6F",
        gap: 10,
    },
    searchInput: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 15,
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
        backgroundColor: "#160626",
        borderWidth: 1,
        borderColor: "#412A6F",
    },
    filterChipActive: {
        backgroundColor: "#7F56D9",
        borderColor: "#7F56D9",
    },
    filterChipText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    dropdown: {
        marginHorizontal: 20,
        marginTop: 8,
        backgroundColor: "#160626",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#412A6F",
        maxHeight: 220,
        overflow: "hidden",
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2A1F3D",
    },
    dropdownText: {
        color: "#FFFFFF",
        fontSize: 14,
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
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
    },
    clearAll: {
        color: "#7F56D9",
        fontSize: 13,
        fontWeight: "600",
    },
    recentChipsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    recentChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#160626",
        borderWidth: 1,
        borderColor: "#412A6F",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    recentChipText: {
        color: "#FFFFFF",
        fontSize: 13,
    },
    trendingRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#2A1F3D",
        gap: 12,
    },
    trendingRank: {
        color: "#7F56D9",
        fontSize: 16,
        fontWeight: "700",
        width: 20,
    },
    trendingTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    trendingSubtitle: {
        color: "#8B859B",
        fontSize: 12,
        marginTop: 2,
    },
});