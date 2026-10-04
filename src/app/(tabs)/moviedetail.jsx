// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from 'expo-linear-gradient';
// import { router, useLocalSearchParams } from "expo-router";
// import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator, Alert, Image, ScrollView,
//     StyleSheet, Text, TouchableOpacity, View
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTheme } from "../../context/ThemeContext";
// import { auth, db } from "../../firebaseConfig";
// import { getBackdropUrl, getImageUrl, getMovieDetails, getTVDetails } from "../services/tmbd";

// export default function MovieDetails() {
//     const { colors, theme } = useTheme();
//     const isDark = theme === "dark";

//     const [isFavorite, setIsFavorite] = useState(false);
//     const { id, mediaType } = useLocalSearchParams();
//     const isTV = mediaType === "tv";
//     const [movie, setMovie] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [inWatchlist, setInWatchlist] = useState(false);
//     const [watched, setWatched] = useState(false);

//     useEffect(() => {
//         fetchMovie();
//         checkStatus();
//     }, [id]);

//     const fetchMovie = async () => {
//         setLoading(true);
//         const data = isTV ? await getTVDetails(id) : await getMovieDetails(id);
        
//         setMovie(data);
//         setLoading(false);
//     };

//     const checkStatus = async () => {
//         const user = auth.currentUser;
//         if (!user) return;

//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//             const data = userDoc.data();
//             const watchlist = data.watchlist || [];
//             const favoritesList = data.favorites || [];
//             const watchedList = data.watched || [];
//             setIsFavorite(favoritesList.includes(Number(id)));
//             setInWatchlist(watchlist.includes(Number(id)));
//             setWatched(watchedList.includes(Number(id)));
//         }
//     };

//     const handleAddToWatchlist = async () => {
//         const user = auth.currentUser;
//         if (!user) {
//             Alert.alert("Error", "You must be logged in.");
//             return;
//         }

//         try {
//             if (inWatchlist) {
//                 await updateDoc(doc(db, "users", user.uid), { watchlist: arrayRemove(Number(id)) });
//                 setInWatchlist(false);
//                 Alert.alert("Removed", "Removed from your watchlist.");
//             } else {
//                 await updateDoc(doc(db, "users", user.uid), { watchlist: arrayUnion(Number(id)) });
//                 setInWatchlist(true);
//                 Alert.alert("Added", "Added to your watchlist.");
//             }
//         } catch (error) {
//             Alert.alert("Error", "Could not update watchlist.");
//         }
//     };

//     const handleMarkWatched = async () => {
//         const user = auth.currentUser;
//         if (!user) {
//             Alert.alert("Error", "You must be logged in.");
//             return;
//         }

//         try {
//             if (watched) {
//                 await updateDoc(doc(db, "users", user.uid), { watched: arrayRemove(Number(id)) });
//                 setWatched(false);
//                 Alert.alert("Removed", "Removed from watched list.");
//             } else {
//                 await updateDoc(doc(db, "users", user.uid), { watched: arrayUnion(Number(id)) });
//                 setWatched(true);
//                 Alert.alert("Marked", "Marked as watched.");
//             }
//         } catch (error) {
//             Alert.alert("Error", "Could not update watched list.");
//         }
//     };

//     const handleToggleFavorite = async () => {
//         const user = auth.currentUser;
//         if (!user) {
//             Alert.alert("Error", "You must be logged in.");
//             return;
//         }

//         try {
//             if (isFavorite) {
//                 await updateDoc(doc(db, "users", user.uid), { favorites: arrayRemove(Number(id)) });
//                 setIsFavorite(false);
//                 Alert.alert("Removed", "Removed from favorites.");
//             } else {
//                 await updateDoc(doc(db, "users", user.uid), { favorites: arrayUnion(Number(id)) });
//                 setIsFavorite(true);
//                 Alert.alert("Added", "Added to your favorites.");
//             }
//         } catch (error) {
//             Alert.alert("Error", "Could not update favorites.");
//         }
//     };

//     const styles = getStyles(colors, isDark);

//     if (loading || !movie) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <ActivityIndicator size="large" color="#7F56D9" style={{ marginTop: 60 }} />
//             </SafeAreaView>
//         );
//     }

//     const title = movie.title || movie.name;
//     const dateField = movie.release_date || movie.first_air_date;
//     const trailer = movie.videos?.results?.find(
//         (v) => v.type === "Trailer" && v.site === "YouTube"
//     ) || movie.videos?.results?.find(
//         (v) => v.site === "YouTube"
//     );

//     const runtimeText = isTV
//         ? (movie.number_of_seasons ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? "s" : ""}` : "")
//         : (movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "");

//     const cast = (movie.credits?.cast || []).filter((actor) => actor && actor.id);
//     const director = movie.credits?.crew?.find((c) => c.job === "Director");

//     const backButtonPress = () => {
//         if (router.canGoBack()) {
//             router.back();
//         } else {
//             router.push('/home');
//         }
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView showsVerticalScrollIndicator={false}>
//                 <View style={styles.posterWrapper}>
//                     <Image
//                         source={{ uri: getBackdropUrl(movie.backdrop_path || movie.poster_path) }}
//                         style={styles.posterImage}
//                     />
//                     <LinearGradient
//                         colors={[
//                             'transparent',
//                             isDark ? 'rgba(9,3,21,0.5)' : 'rgba(255,255,255,0.5)',
//                             colors.background || (isDark ? '#090315' : '#FFFFFF')
//                         ]}
//                         style={styles.posterOverlay}
//                     />

//                     <TouchableOpacity style={styles.backButton} onPress={backButtonPress}>
//                         <Ionicons name="arrow-back" size={22} color={isDark ? "#FFFFFF" : "#1A102A"} />
//                     </TouchableOpacity>

//                     <View style={styles.posterTextWrapper}>
//                         <Text style={styles.movieTitle}>{title}</Text>
//                         <View style={styles.metaRow}>
//                             <Text style={styles.metaText}>
//                                 {dateField?.slice(0, 4)} · {runtimeText}
//                             </Text>
//                             <View style={styles.ratingRow}>
//                                 <Ionicons name="star" size={14} color="#F5C518" />
//                                 <Text style={styles.ratingText}>{movie.vote_average?.toFixed(1)}</Text>
//                             </View>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={styles.genreRow}>
//                     {movie.genres?.map((g) => (
//                         <View key={g.id} style={styles.genreChip}>
//                             <Text style={styles.genreChipText}>{g.name}</Text>
//                         </View>
//                     ))}
//                 </View>

//                 <View style={styles.actionRow}>
//                     <TouchableOpacity
//                         style={[styles.actionButton, inWatchlist && styles.actionButtonActive]}
//                         onPress={handleAddToWatchlist}
//                     >
//                         <Ionicons name={inWatchlist ? "bookmark" : "bookmark-outline"} size={18} color="#FFFFFF" />
//                         <Text style={styles.actionButtonText}>{inWatchlist ? "In Watchlist" : "Watchlist"}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.actionButtonOutline, watched && styles.actionButtonActive]}
//                         onPress={handleMarkWatched}
//                     >
//                         <Ionicons name={watched ? "checkmark-circle" : "checkmark-circle-outline"} size={18} color={watched ? "#FFFFFF" : colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
//                         <Text style={[styles.actionButtonText, !watched && { color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A") }]}>
//                             {watched ? "Watched" : "Mark Watched"}
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.favoriteButton}
//                         onPress={handleToggleFavorite}
//                     >
//                         <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#7F56D9" : colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Plot Summary</Text>
//                     <Text style={styles.plotText}>{movie.overview}</Text>
//                 </View>

//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Cast & Crew</Text>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                         {cast.map((actor, index) => (
//                             <TouchableOpacity
//                                 key={`${actor.id}-${index}`}
//                                 style={styles.castItem}
//                                 onPress={() => router.push({
//                                     pathname: "/castprofile",
//                                     params: { id: actor.id, character: actor.character }
//                                 })}
//                             >
//                                 <Image
//                                     source={
//                                         actor.profile_path
//                                             ? { uri: getImageUrl(actor.profile_path) }
//                                             : require("../../../assets/images/avatar.png")
//                                     }
//                                     style={styles.castImage}
//                                 />
//                                 <Text style={styles.castName} numberOfLines={1}>{actor.name}</Text>
//                                 <Text style={styles.castRole} numberOfLines={1}>{actor.character}</Text>
//                             </TouchableOpacity>
//                         ))}
//                         {director && (
//                             <View style={styles.castItem}>
//                                 <Image
//                                     source={
//                                         director.profile_path
//                                             ? { uri: getImageUrl(director.profile_path) }
//                                             : require("../../../assets/images/avatar.png")
//                                     }
//                                     style={styles.castImage}
//                                 />
//                                 <Text style={styles.castName} numberOfLines={1}>{director.name}</Text>
//                                 <Text style={styles.castRole} numberOfLines={1}>Director</Text>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </View>

//                 {trailer && (
//                     <View style={styles.section}>
//                         <Text style={styles.sectionTitle}>Official Trailer</Text>
//                         <TouchableOpacity
//                             style={styles.trailerWrapper}
//                             onPress={() =>
//                                 router.push({
//                                     pathname: "/trailer",
//                                     params: { videoKey: trailer.key, title },
//                                 })
//                             }
//                         >
//                             <Image source={{ uri: getImageUrl(movie.backdrop_path) }} style={styles.trailerImage} />
//                             <View style={styles.playButton}>
//                                 <Ionicons name="play" size={28} color="#FFFFFF" />
//                             </View>
//                         </TouchableOpacity>
//                     </View>
//                 )}

//                 <View style={{ height: 40 }} />
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const getStyles = (colors, isDark) =>
//     StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
//         },
//         posterWrapper: {
//             width: "100%",
//             height: 380,
//             position: "relative",
//         },
//         posterImage: {
//             width: "100%",
//             height: "100%",
//         },
//         posterOverlay: {
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             height: 45,
//         },
//         backButton: {
//             position: "absolute",
//             top: 16,
//             left: 16,
//             width: 40,
//             height: 40,
//             borderRadius: 20,
//             backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         posterTextWrapper: {
//             position: "absolute",
//             bottom: 16,
//             left: 20,
//             right: 20,
//         },
//         movieTitle: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 26,
//             fontFamily: "Outfit_700Bold",
//         },
//         metaRow: {
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: 8,
//         },
//         metaText: {
//             color: colors.textSecondary || "#C1B9F9",
//             fontSize: 13,
//             fontFamily: "Geist_400Regular",
//         },
//         ratingRow: {
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 4,
//         },
//         ratingText: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 13,
//             fontFamily: "Outfit_700Bold",
//         },
//         genreRow: {
//             flexDirection: "row",
//             flexWrap: "wrap",
//             gap: 8,
//             paddingHorizontal: 20,
//             marginTop: 16,
//         },
//         genreChip: {
//             borderWidth: 1,
//             borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
//             backgroundColor: colors.surface || (isDark ? "transparent" : "#F4F2F8"),
//             borderRadius: 16,
//             paddingHorizontal: 14,
//             paddingVertical: 6,
//         },
//         genreChipText: {
//             color: colors.textSecondary || "#C1B9F9",
//             fontSize: 12,
//             fontFamily: "Geist_400Regular",
//         },
//         actionRow: {
//             flexDirection: "row",
//             gap: 12,
//             paddingHorizontal: 20,
//             marginTop: 20,
//         },
//         actionButton: {
//             flex: 1,
//             flexDirection: "row",
//             gap: 8,
//             height: 50,
//             borderRadius: 14,
//             backgroundColor: "#7F56D9",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         actionButtonOutline: {
//             flex: 1,
//             flexDirection: "row",
//             gap: 8,
//             height: 50,
//             borderRadius: 14,
//             borderWidth: 1,
//             borderColor: "#7F56D9",
//             backgroundColor: colors.surface || (isDark ? "transparent" : "#F4F2F8"),
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         actionButtonActive: {
//             backgroundColor: "#5C3EA6",
//             borderColor: "#5C3EA6",
//         },
//         actionButtonText: {
//             color: "#FFFFFF",
//             fontSize: 14,
//             fontFamily: "Outfit_700Bold",
//         },
//         section: {
//             paddingHorizontal: 20,
//             marginTop: 28,
//         },
//         sectionTitle: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 17,
//             fontFamily: "Outfit_700Bold",
//             marginBottom: 12,
//         },
//         plotText: {
//             color: colors.textSecondary || "#B5AFC7",
//             fontSize: 14,
//             lineHeight: 22,
//             fontFamily: "Geist_400Regular",
//         },
//         castItem: {
//             width: 80,
//             marginRight: 16,
//             alignItems: "center",
//         },
//         castImage: {
//             width: 60,
//             height: 60,
//             borderRadius: 30,
//             marginBottom: 6,
//         },
//         castName: {
//             color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
//             fontSize: 12,
//             fontFamily: "Outfit_700Bold",
//             textAlign: "center",
//         },
//         castRole: {
//             color: colors.textSecondary || "#8B859B",
//             fontSize: 11,
//             textAlign: "center",
//             fontFamily: "Geist_400Regular",
//         },
//         trailerWrapper: {
//             width: "100%",
//             height: 180,
//             borderRadius: 14,
//             overflow: "hidden",
//             position: "relative",
//         },
//         trailerImage: {
//             width: "100%",
//             height: "100%",
//         },
//         playButton: {
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             marginTop: -28,
//             marginLeft: -28,
//             width: 56,
//             height: 56,
//             borderRadius: 28,
//             backgroundColor: "rgba(127,86,217,0.85)",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         favoriteButton: {
//             width: 50,
//             height: 50,
//             borderRadius: 14,
//             borderWidth: 1,
//             borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
//             backgroundColor: colors.surface || (isDark ? "transparent" : "#F4F2F8"),
//             justifyContent: "center",
//             alignItems: "center",
//         },
//     });


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
    const [batchCount, setBatchCount] = useState(0); // Tracks scroll fetches

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
            setBatchCount(0); // Reset count on new query

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
        // Prevent infinite API calls from burning through the 20 requests/day quota
        if (batchCount >= 2) {
            setHasMore(false);
            return;
        }

        if (loadingMore || loading || !hasMore || movies.length === 0) return;

        try {
            setLoadingMore(true);
            setBatchCount((prev) => prev + 1);

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