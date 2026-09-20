import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Alert, Image, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { getBackdropUrl, getImageUrl, getMovieDetails, getTVDetails } from "../services/tmbd";

export default function MovieDetails() {
    const [isFavorite, setIsFavorite] = useState(false);
    const { id, mediaType } = useLocalSearchParams();
    const isTV = mediaType === "tv";
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [watched, setWatched] = useState(false);

    useEffect(() => {
        fetchMovie();
        checkStatus();
    }, [id]);

    const fetchMovie = async () => {
        setLoading(true);
        const data = isTV ? await getTVDetails(id) : await getMovieDetails(id);
        
        setMovie(data);
        setLoading(false);
    };

    const checkStatus = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            const watchlist = data.watchlist || [];
            const favoritesList = data.favorites || [];
            const watchedList = data.watched || [];
            setIsFavorite(favoritesList.includes(Number(id)));
            setInWatchlist(watchlist.includes(Number(id)));
            setWatched(watchedList.includes(Number(id)));
        }
    };

    const handleAddToWatchlist = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be logged in.");
            return;
        }

        try {
            if (inWatchlist) {
                await updateDoc(doc(db, "users", user.uid), { watchlist: arrayRemove(Number(id)) });
                setInWatchlist(false);
                Alert.alert("Removed", "Removed from your watchlist.");
            } else {
                await updateDoc(doc(db, "users", user.uid), { watchlist: arrayUnion(Number(id)) });
                setInWatchlist(true);
                Alert.alert("Added", "Added to your watchlist.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not update watchlist.");
        }
    };

    const handleMarkWatched = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be logged in.");
            return;
        }

        try {
            if (watched) {
                await updateDoc(doc(db, "users", user.uid), { watched: arrayRemove(Number(id)) });
                setWatched(false);
                Alert.alert("Removed", "Removed from watched list.");
            } else {
                await updateDoc(doc(db, "users", user.uid), { watched: arrayUnion(Number(id)) });
                setWatched(true);
                Alert.alert("Marked", "Marked as watched.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not update watched list.");
        }
    };
    const handleToggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
        Alert.alert("Error", "You must be logged in.");
        return;
    }

        try {
            if (isFavorite) {
                await updateDoc(doc(db, "users", user.uid), { favorites: arrayRemove(Number(id)) });
                setIsFavorite(false);
                Alert.alert("Removed", "Removed from favorites.");
            } else {
                await updateDoc(doc(db, "users", user.uid), { favorites: arrayUnion(Number(id)) });
                setIsFavorite(true);
                Alert.alert("Added", "Added to your favorites.");
            }
        } catch (error) {
            Alert.alert("Error", "Could not update favorites.");
        }
    };
    if (loading || !movie) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#7F56D9" style={{ marginTop: 60 }} />
            </SafeAreaView>
        );
    }

    const title = movie.title || movie.name;
    const dateField = movie.release_date || movie.first_air_date;
    const trailer = movie.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || movie.videos?.results?.find(
        (v) => v.site === "YouTube"
    );

    const runtimeText = isTV
        ? (movie.number_of_seasons ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? "s" : ""}` : "")
        : (movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "");

    const cast = (movie.credits?.cast || []).filter((actor) => actor && actor.id);
    const director = movie.credits?.crew?.find((c) => c.job === "Director");

    const backButtonPress = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/home');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.posterWrapper}>
                    <Image
                        source={{ uri: getBackdropUrl(movie.backdrop_path || movie.poster_path) }}
                        style={styles.posterImage}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(9,3,21,0.5)', '#090315']}
                        style={styles.posterOverlay}
                    />

                    <TouchableOpacity style={styles.backButton} onPress={backButtonPress}>
                        <Ionicons name="arrow-back" size={22} color="#090315" />
                    </TouchableOpacity>

                    <View style={styles.posterTextWrapper}>
                        <Text style={styles.movieTitle}>{title}</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaText}>
                                {dateField?.slice(0, 4)} · {runtimeText}
                            </Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="#F5C518" />
                                <Text style={styles.ratingText}>{movie.vote_average?.toFixed(1)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.genreRow}>
                    {movie.genres?.map((g) => (
                        <View key={g.id} style={styles.genreChip}>
                            <Text style={styles.genreChipText}>{g.name}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, inWatchlist && styles.actionButtonActive]}
                        onPress={handleAddToWatchlist}
                    >
                        <Ionicons name={inWatchlist ? "bookmark" : "bookmark-outline"} size={18} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>{inWatchlist ? "In Watchlist" : "Watchlist"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButtonOutline, watched && styles.actionButtonActive]}
                        onPress={handleMarkWatched}
                    >
                        <Ionicons name={watched ? "checkmark-circle" : "checkmark-circle-outline"} size={18} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>{watched ? "Watched" : "Mark Watched"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleToggleFavorite}
                    >
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#7F56D9" : "#FFFFFF"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Plot Summary</Text>
                    <Text style={styles.plotText}>{movie.overview}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cast & Crew</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {cast.map((actor, index) => (
                        <TouchableOpacity
                            key={`${actor.id}-${index}`}
                            style={styles.castItem}
                            onPress={() => router.push({
                                pathname: "/castprofile",
                                params: { id: actor.id, character: actor.character }
                            })}
                        >
                                <Image
                                    source={
                                        actor.profile_path
                                            ? { uri: getImageUrl(actor.profile_path) }
                                            : require("../../../assets/images/avatar.png")
                                    }
                                    style={styles.castImage}
                                />
                                <Text style={styles.castName} numberOfLines={1}>{actor.name}</Text>
                                <Text style={styles.castRole} numberOfLines={1}>{actor.character}</Text>
                            </TouchableOpacity>
                        ))}
                        {director && (
                            <View style={styles.castItem}>
                                <Image
                                    source={
                                        director.profile_path
                                            ? { uri: getImageUrl(director.profile_path) }
                                            : require("../../../assets/images/avatar.png")
                                    }
                                    style={styles.castImage}
                                />
                                <Text style={styles.castName} numberOfLines={1}>{director.name}</Text>
                                <Text style={styles.castRole} numberOfLines={1}>Director</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                {trailer && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Official Trailer</Text>
                        <TouchableOpacity
                            style={styles.trailerWrapper}
                            onPress={() =>
                                router.push({
                                    pathname: "/trailer",
                                    params: { videoKey: trailer.key, title },
                                })
                            }
                        >
                            <Image source={{ uri: getImageUrl(movie.backdrop_path) }} style={styles.trailerImage} />
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={28} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090315" },
    posterWrapper: { width: "100%", height: 380, position: "relative" },
    posterImage: { width: "100%", height: "100%" },
    posterOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 45,
        backgroundColor: "rgba(9,3,21,0.9)",
    },
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    posterTextWrapper: {
        position: "absolute",
        bottom: 16,
        left: 20,
        right: 20,
    },
    movieTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "800" },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    metaText: { color: "#C1B9F9", fontSize: 13 },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    ratingText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
    genreRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        paddingHorizontal: 20,
        marginTop: 16,
    },
    genreChip: {
        borderWidth: 1,
        borderColor: "#412A6F",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    genreChipText: { color: "#C1B9F9", fontSize: 12 },
    actionRow: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        gap: 8,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#7F56D9",
        justifyContent: "center",
        alignItems: "center",
    },
    actionButtonOutline: {
        flex: 1,
        flexDirection: "row",
        gap: 8,
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#7F56D9",
        justifyContent: "center",
        alignItems: "center",
    },
    actionButtonActive: {
        backgroundColor: "#5C3EA6",
        borderColor: "#5C3EA6",
    },
    actionButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
    section: { paddingHorizontal: 20, marginTop: 28 },
    sectionTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "700", marginBottom: 12 },
    plotText: { color: "#B5AFC7", fontSize: 14, lineHeight: 22 },
    castItem: { width: 80, marginRight: 16, alignItems: "center" },
    castImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 6 },
    castName: { color: "#FFFFFF", fontSize: 12, fontWeight: "600", textAlign: "center" },
    castRole: { color: "#8B859B", fontSize: 11, textAlign: "center" },
    trailerWrapper: {
        width: "100%",
        height: 180,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
    },
    trailerImage: { width: "100%", height: "100%" },
    playButton: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -28,
        marginLeft: -28,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(127,86,217,0.85)",
        justifyContent: "center",
        alignItems: "center",
    },
    favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#412A6F",
    justifyContent: "center",
    alignItems: "center",
    },
});