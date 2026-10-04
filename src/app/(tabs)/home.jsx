import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth, db } from "../../firebaseConfig";

import HomeSkeleton from "../HomeSkeleton";
import { getImageUrl, getPersonalizedRecommendations, getTrending, getYouMightAlsoLike } from "../services/tmbd";

export default function home() {
    const { colors } = useTheme();

    const [fullname, setFullname] = useState("");
    const [initialLoading, setInitialLoading] = useState(true);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [youMightAlsoLike, setYouMightAlsoLike] = useState([]);
    const [profilePic, setProfilePic] = useState("");
    const [trendingPage, setTrendingPage] = useState(1);
    const [recommendationPage, setRecommendationPage] = useState(1);

    // Alert Modal State
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [infoModalTitle, setInfoModalTitle] = useState("");
    const [infoModalMessage, setInfoModalMessage] = useState("");
    const [infoModalIcon, setInfoModalIcon] = useState("alert-circle-outline");

    const showAlert = (title, message, icon = "alert-circle-outline") => {
        setInfoModalTitle(title);
        setInfoModalMessage(message);
        setInfoModalIcon(icon);
        setInfoModalVisible(true);
    };

    // Intercept hardware Back press ONLY on Home screen to exit app directly
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => subscription.remove();
        }, [])
    );

    const fetchUserGenres = async () => {
        const user = auth.currentUser;
        if (!user) return [];
        try {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) return [];

            const genres = snap.data().favoriteGenres || [];
            
            // Format genre IDs cleanly whether stored as primitives or objects
            return genres.map(g => (typeof g === 'object' && g !== null ? g.id : g));
        } catch (error) {
            console.log("GENRE ERROR:", error);
            return [];
        }
    };

    const loadTrending = async (page = 1) => {
        try {
            const movies = await getTrending(page);
            setTrendingMovies(movies || []);
        } catch (error) { 
            console.log("TRENDING ERROR:", error); 
        }
    };

    const loadRecommendations = async (page = null) => {
        try {
            const genres = await fetchUserGenres();
            if (!genres.length) {
                setRecommendedMovies([]);
                return;
            }

            const targetPage = page || Math.floor(Math.random() * 5) + 1;
            setRecommendationPage(targetPage);

            const movies = await getPersonalizedRecommendations(genres, targetPage);

            if (movies && movies.length) {
                const shuffled = [...movies].sort(() => Math.random() - 0.5);
                setRecommendedMovies(shuffled);
            } else {
                setRecommendedMovies([]);
            }
        } catch (error) { 
            console.log("RECOMMENDATION ERROR:", error); 
        }
    };

    const loadYouMightAlsoLike = async () => {
        try {
            const movies = await getYouMightAlsoLike();
            setYouMightAlsoLike(movies || []);
        } catch (error) { 
            console.log("YOU MIGHT ERROR:", error); 
        }
    };

    const loadUser = async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                const data = snap.data();
                setFullname(data.fullname || "");
                setProfilePic(data.profilePic || "");
            }
        } catch (error) { 
            console.log("USER ERROR:", error); 
        }
    };

    // Re-fetch user profile AND personalized recommendations every time home gains focus
    useFocusEffect(
        useCallback(() => {
            loadUser();
            loadRecommendations();
        }, [])
    );

    useEffect(() => {
        const loadAll = async () => {
            await Promise.all([
                loadTrending(),
                loadRecommendations(),
                loadYouMightAlsoLike(),
            ]);
            setInitialLoading(false);
        };
        loadAll();
    }, []);

    const refreshTrending = () => {
        const next = trendingPage >= 20 ? 1 : trendingPage + 1;
        setTrendingPage(next);
        loadTrending(next);
    };

    const refreshRecommendations = () => {
        const next = recommendationPage >= 20 ? 1 : recommendationPage + 1;
        setRecommendationPage(next);
        loadRecommendations(next);
    };

    const openMovie = id => router.push({
        pathname: "../(tabs)/moviedetail",
        params: { id }
    });

    const renderMovie = ({ item }) => (
        <TouchableOpacity style={styles.recCard} onPress={() => openMovie(item.id)}>
            <Image source={{ uri: getImageUrl(item.poster_path) }} style={styles.recImage} />
            <Text style={[styles.recTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F5C518" />
                <Text style={[styles.ratingText, { color: colors.text }]}>{item.vote_average?.toFixed(1)}</Text>
            </View>
        </TouchableOpacity>
    );

    if (initialLoading) {
        return <HomeSkeleton />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={{ flex: 1, paddingLeft: "3%" }}>
                        <Text style={[styles.welcome, { color: colors.subtext }]}>Welcome</Text>
                        <Text style={[styles.name, { color: colors.text }]}>{fullname}</Text>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.profile}>
                            <Image
                                source={profilePic ? { uri: profilePic } : require("../../../assets/images/avatar.png")}
                                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={() => router.push("/settings")} 
                            style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                            <Ionicons name="settings-outline" size={22} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
                        <TouchableOpacity onPress={refreshTrending}>
                            <Text style={[styles.seeAll, { color: colors.accent || "#7F56D9" }]}>Load More</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={trendingMovies}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.trendingCard} onPress={() => openMovie(item.id)}>
                                <Image
                                    source={{ uri: getImageUrl(item.backdrop_path || item.poster_path) }}
                                    style={styles.trendingImage}
                                />
                                <View style={styles.trendingOverlay}>
                                    <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={12} color="#F5C518" />
                                        <Text style={styles.trendingRatingText}>{item.vote_average?.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.aiTitleRow}>
                            <Ionicons name="sparkles" size={16} color={colors.accent || "#7F56D9"} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}> Recommended for You</Text>
                        </View>

                        <TouchableOpacity onPress={() => refreshRecommendations()}>
                            <Text style={[styles.seeAll, { color: colors.accent || "#7F56D9" }]}>Refresh</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={recommendedMovies}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        renderItem={renderMovie}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>You Might Also Like</Text>
                        <TouchableOpacity onPress={loadYouMightAlsoLike}>
                            <Text style={[styles.seeAll, { color: colors.accent || "#7F56D9" }]}>Refresh</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={youMightAlsoLike}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        renderItem={renderMovie}
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* CUSTOM ALERT MODAL */}
            <Modal
                visible={infoModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setInfoModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        <Ionicons name={infoModalIcon} size={36} color={colors.accent || "#7F56D9"} style={{ marginBottom: 12 }} />
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{infoModalTitle}</Text>
                        <Text style={[styles.modalText, { color: colors.subtext }]}>{infoModalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: colors.accent || "#7F56D9", width: "100%" }]}
                            onPress={() => setInfoModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 20,
        marginBottom: 10,
        paddingLeft: 10
    },
    welcome: {
        fontFamily: "Geist_400Regular",
        fontSize: 16,
        marginBottom: 4
    },
    name: {
        fontFamily: "Outfit_700Bold",
        fontSize: 18,
        marginTop: -5
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 38,
        paddingRight: 20
    },
    search: {
        width: 40,
        height: 40,
        borderRadius: 16,
        marginLeft: -30,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    profile: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden"
    },
    section: {
        marginTop: 24
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 12
    },
    sectionTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 18
    },
    aiTitleRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    seeAll: {
        fontFamily: "Outfit_700Bold",
        fontSize: 14
    },
    trendingCard: {
        width: 260,
        height: 150,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 12
    },
    trendingImage: {
        width: "100%",
        height: "100%"
    },
    trendingOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,.5)",
        padding: 10
    },
    trendingTitle: {
        color: "#FFFFFF",
        fontFamily: "Outfit_700Bold",
        fontSize: 15
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 4
    },
    ratingText: {
        fontFamily: "Outfit_700Bold",
        fontSize: 12
    },
    trendingRatingText: {
        color: "#FFFFFF",
        fontFamily: "Outfit_700Bold",
        fontSize: 12
    },
    recCard: {
        width: 120,
        marginRight: 12
    },
    recImage: {
        width: 120,
        height: 170,
        borderRadius: 12,
        marginBottom: 6
    },
    recTitle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 13
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.7)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        width: "85%",
        borderRadius: 20,
        padding: 24,
        alignItems: "center"
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "Outfit_700Bold",
        marginBottom: 8
    },
    modalText: {
        fontSize: 13,
        fontFamily: "Geist_400Regular",
        textAlign: "center",
        lineHeight: 19,
        marginBottom: 20
    },
    modalButton: {
        height: 46,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontFamily: "Outfit_700Bold"
    }
});