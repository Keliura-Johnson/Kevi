import { router, useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
    BackHandler,
    FlatList, Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth, db } from "../../firebaseConfig";
import { getImageUrl, getMovieDetails } from "../services/tmbd";

export default function Profile() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [fullname, setFullname] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [watchlistCount, setWatchlistCount] = useState(0);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [watchedCount, setWatchedCount] = useState(0);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

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

    // Refetches data when screen comes into focus & handles Android back button to Home tab
    useFocusEffect(
        useCallback(() => {
            fetchProfile();

            const onBackPress = () => {
                router.navigate("/(tabs)/home");
                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => subscription.remove();
        }, [])
    );

    const styles = getStyles(colors, isDark);

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

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
        },
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
        name: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 20,
            fontFamily: "Outfit_700Bold",
        },
        bio: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 19,
            fontFamily: "Geist_400Regular",
        },
        statsRow: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            marginHorizontal: 20,
            marginTop: 24,
            borderRadius: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#24103B" : "#E2DCEB"),
        },
        statItem: {
            flex: 1,
            alignItems: "center",
        },
        statDivider: {
            width: 1,
            height: 30,
            backgroundColor: colors.border || (isDark ? "#2A1F3D" : "#E2DCEB"),
        },
        statNumber: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 18,
            fontFamily: "Outfit_700Bold",
        },
        statLabel: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 12,
            marginTop: 4,
            fontFamily: "Geist_400Regular",
        },
        editButton: {
            marginHorizontal: 20,
            marginTop: 16,
            height: 46,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#7F56D9",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
        },
        editButtonText: {
            color: "#7F56D9",
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
        section: {
            marginTop: 28,
            paddingLeft: 20,
        },
        sectionTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            marginBottom: 12,
        },
        movieCard: {
            marginRight: 12,
        },
        movieImage: {
            width: 100,
            height: 145,
            borderRadius: 12,
        },
        emptyText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            marginRight: 20,
            fontFamily: "Geist_400Regular",
        },
    });