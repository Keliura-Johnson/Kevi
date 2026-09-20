import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { getImageUrl, getPersonalizedRecommendations, getTrending, getYouMightAlsoLike } from "../services/tmbd";

export default function home() {
    const [fullname, setFullname] = useState("");
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [youMightAlsoLike, setYouMightAlsoLike] = useState([]);
    const [profilePic, setProfilePic] = useState("");
    const [trendingPage, setTrendingPage] = useState(1);
    const [recommendationPage, setRecommendationPage] = useState(1);

    const fetchUserGenres = async () => {
        const user = auth.currentUser;
        if (!user) return [];
        try {
            const snap = await getDoc(doc(db, "users", user.uid));
            return snap.exists() ? snap.data().favoriteGenres || [] : [];
        } catch (error) {
            console.log("GENRE ERROR:", error);
            return [];
        }
    };

    const loadTrending = async (page = 1) => {
        try {
            const movies = await getTrending(page);
            setTrendingMovies(movies || []);
        } catch (error) { console.log("TRENDING ERROR:", error); }
    };

    const loadRecommendations = async (page = 1) => {
        try {
            const genres = await fetchUserGenres();
            if (!genres.length) {
                setRecommendedMovies([]);
                return;
            }
            const movies = await getPersonalizedRecommendations(genres, page);
            setRecommendedMovies(movies || []);
        } catch (error) { console.log("RECOMMENDATION ERROR:", error); }
    };

    const loadYouMightAlsoLike = async () => {
        try {
            const movies = await getYouMightAlsoLike();
            setYouMightAlsoLike(movies || []);
        } catch (error) { console.log("YOU MIGHT ERROR:", error); }
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
        } catch (error) { console.log("USER ERROR:", error); }
    };

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [])
    );

    useState(() => {
        loadTrending();
        loadRecommendations();
        loadYouMightAlsoLike();
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
        pathname: "/moviedetail",
        params: { id }
    });

    const renderMovie = ({ item }) => (
        <TouchableOpacity style={styles.recCard} onPress={() => openMovie(item.id)}>
            <Image source={{ uri: getImageUrl(item.poster_path) }} style={styles.recImage} />
            <Text style={styles.recTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F5C518" />
                <Text style={styles.ratingText}>{item.vote_average?.toFixed(1)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#090315" }}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={{ flex: 1, paddingLeft: "3%" }}>
                        <Text style={styles.welcome}>Welcome</Text>
                        <Text style={styles.name}>{fullname}</Text>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.profile}>
                            <Image
                                source={profilePic ? { uri: profilePic } : require("../../../assets/images/avatar.png")}
                                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                            />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => router.push("/settings")} style={styles.search}>
                            <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
                        </TouchableOpacity>


                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <TouchableOpacity onPress={refreshTrending}>
                            <Text style={styles.seeAll}>Load More</Text>
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
                                        <Text style={styles.ratingText}>{item.vote_average?.toFixed(1)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.aiTitleRow}>
                            <Ionicons name="sparkles" size={16} color="#7F56D9" />
                            <Text style={styles.sectionTitle}> Recommended for You</Text>
                        </View>

                        <TouchableOpacity onPress={refreshRecommendations}>
                            <Text style={styles.seeAll}>Refresh</Text>
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
                        <Text style={styles.sectionTitle}>You Might Also Like</Text>
                        <TouchableOpacity onPress={loadYouMightAlsoLike}>
                            <Text style={styles.seeAll}>Refresh</Text>
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
            </ScrollView>
        </SafeAreaView>
    );
}
const styles=StyleSheet.create({
    header:{flexDirection:"row",justifyContent:"space-between",
        alignItems:"flex-start",marginTop:20,marginBottom:10,paddingLeft:10},

    welcome:{color:"#8B859B",fontSize:16,marginBottom:4},
    name:{color:"#FFFFFF",fontSize:18,marginTop:-5,fontWeight:"700"},

    headerButtons:{flexDirection:"row",alignItems:"center",gap:38,paddingRight:20},

    search:{width:40,height:40,borderRadius:16,marginLeft:-30,backgroundColor:"#160626",
        borderWidth:1,borderColor:"#412A6F",justifyContent:"center",alignItems:"center"},
    profile:{width:40,height:40,borderRadius:35,overflow:"hidden"},

    section:{marginTop:24},
    sectionHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",
        paddingHorizontal:20,marginBottom:12},

    sectionTitle:{color:"#FFFFFF",fontSize:18,fontWeight:"700"},

    aiTitleRow:{flexDirection:"row",alignItems:"center"},

    seeAll:{color:"#7F56D9",fontSize:14,fontWeight:"600"},

    trendingCard:{width:260,height:150,borderRadius:16,overflow:"hidden",marginRight:12},
    trendingImage:{width:"100%",height:"100%"},

    trendingOverlay:{position:"absolute",bottom:0,left:0,right:0,
        backgroundColor:"rgba(0,0,0,.5)",padding:10},
    trendingTitle:{color:"#FFFFFF",fontSize:15,fontWeight:"700"},

    ratingRow:{flexDirection:"row",alignItems:"center",marginTop:4,gap:4}
    ,
    ratingText:{color:"#FFFFFF",fontSize:12,fontWeight:"600"},
    recCard:{width:120,marginRight:12},
    recImage:{width:120,height:170,borderRadius:12,marginBottom:6},
    recTitle:{color:"#FFFFFF",fontSize:13,fontWeight:"600"},

    modalBackground:{flex:1,backgroundColor:"rgba(0,0,0,.7)",justifyContent:"center",
        alignItems:"center"},
    modalBox:{width:"85%",backgroundColor:"#160626",borderRadius:20,padding:24},
    modalTitle:{color:"#FFFFFF",fontSize:22,fontWeight:"700",marginBottom:10},
    modalText:{color:"#8B859B",fontSize:15,marginBottom:25},
    chooseButton:{height:52,backgroundColor:"#7F56D9",borderRadius:14,
        justifyContent:"center",alignItems:"center",marginBottom:12},
    modalButton:{height:52,backgroundColor:"#2A1F3D",borderRadius:14,justifyContent:"center",alignItems:"center",marginBottom:12},
    buttonText:{color:"#FFFFFF",fontSize:16,fontWeight:"700"},
    removeText:{color:"#FF6B6B",fontSize:16,fontWeight:"700"},
    cancel:{height:52,justifyContent:"center",alignItems:"center"},
    cancelText:{color:"#8B859B",fontSize:16,fontWeight:"600"}
});