import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    FlatList, Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { getImageUrl, getMovieDetails } from "../services/tmbd";

export default function Profile() {
    const [fullname, setFullname] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [watchlistCount, setWatchlistCount] = useState(0);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [watchedCount, setWatchedCount] = useState(0);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) return;

            const data = userDoc.data();
            setFullname(data.fullname || "");
            setBio(data.bio || "");
            setProfilePic(data.profilePic || "");

            const watchlist = data.watchlist || [];
            const watched = data.watched || [];
            const favorites = data.favorites || [];

            setWatchlistCount(watchlist.length);
            setWatchedCount(watched.length);
            setFavoritesCount(favorites.length);

            const favoriteDetails = await Promise.all(
                favorites.map(async (id) => {
                    try {
                        return await getMovieDetails(id);
                    } catch {
                        return null;
                    }
                })
            );

            setFavoriteMovies(favoriteDetails.filter(Boolean).reverse());
        } catch (error) {
            console.log("PROFILE FETCH ERROR:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.profileSection}>
                    <Image
                        source={profilePic ? { uri: profilePic } : require("../../../assets/images/avatar.png")}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>{fullname}</Text>
                    {bio ? <Text style={styles.bio}>{bio}</Text> : null}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{watchlistCount}</Text>
                        <Text style={styles.statLabel}>Watchlist</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{favoritesCount}</Text>
                        <Text style={styles.statLabel}>Favorites</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{watchedCount}</Text>
                        <Text style={styles.statLabel}>Watched</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => router.push("/editProfile")}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Favorite Movies</Text>

                    <FlatList
                        data={favoriteMovies}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingRight: 20 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.movieCard}
                                onPress={() => router.push({ pathname: "/moviedetail", params: { id: item.id } })}
                            >
                                <Image
                                    source={{ uri: getImageUrl(item.poster_path) }}
                                    style={styles.movieImage}
                                />
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No favorites added yet.</Text>
                        }
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#090315" },
    profileSection: {
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 30,
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 14,
    },
    name: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
    bio: {
        color: "#8B859B",
        fontSize: 13,
        textAlign: "center",
        marginTop: 8,
        lineHeight: 19,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#160626",
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 16,
        paddingVertical: 16,
    },
    statItem: { flex: 1, alignItems: "center" },
    statDivider: { width: 1, height: 30, backgroundColor: "#2A1F3D" },
    statNumber: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
    statLabel: { color: "#8B859B", fontSize: 12, marginTop: 4 },
    editButton: {
        marginHorizontal: 20,
        marginTop: 16,
        height: 46,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#7F56D9",
        justifyContent: "center",
        alignItems: "center",
    },
    editButtonText: { color: "#7F56D9", fontSize: 14, fontWeight: "700" },
    section: { marginTop: 28, paddingLeft: 20 },
    sectionTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "700", marginBottom: 12 },
    movieCard: { marginRight: 12 },
    movieImage: { width: 100, height: 145, borderRadius: 12 },
    emptyText: { color: "#8B859B", fontSize: 13, marginRight: 20 },
});