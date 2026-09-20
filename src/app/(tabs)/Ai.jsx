import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
    ActivityIndicator, FlatList, Image, KeyboardAvoidingView,
    Platform, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { getAIMovieRecommendations } from "../services/ai";
import { getImageUrl, searchMovies } from "../services/tmbd";

const Ai = () => {
    const [prompt, setPrompt] = useState("");
    const [movies, setMovies] = useState([]);
    const [intro, setIntro] = useState("");
    const [loading, setLoading] = useState(false);

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

            const favoriteGenres = await getFavoriteGenres();
            const aiResult = await getAIMovieRecommendations(prompt.trim(), favoriteGenres);

            setIntro(aiResult.intro || "");

            const aiMovies = (aiResult.movies || []).slice(0, 30);

            const movieResults = await Promise.all(
                aiMovies.map(async (movie) => {
                    try {
                        const { results } = await searchMovies(movie.title);
                        if (!results || results.length === 0) return null;

                        return { ...results[0], aiReason: movie.reason, aiYear: movie.year };
                    } catch (error) {
                        console.log(`TMDB search failed for ${movie.title}:`, error);
                        return null;
                    }
                })
            );

            setMovies(movieResults.filter(Boolean));
        } catch (error) {
            console.log("AI recommendation error:", error);
            setMovies([]);
            setIntro(error?.message || "I couldn't generate recommendations right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/moviedetail', params: { id: item.id } })}
            style={{
                flexDirection: "row", backgroundColor: "#160626", borderRadius: 18,
                marginBottom: 16, padding: 12, borderWidth: 1, borderColor: "#24103B", minHeight: 132,
            }}
        >
            <Image
                source={{ uri: getImageUrl(item.poster_path) }}
                style={{ width: 88, height: 124, borderRadius: 12 }}
            />

            <View style={{ flex: 1, marginLeft: 14, paddingTop: 2 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "700", lineHeight: 22 }} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <Text style={{ color: "#9E96B0", fontSize: 12, marginTop: 5 }}>
                            {item.release_date ? item.release_date.slice(0, 4) : item.aiYear} · Movie
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: "row", alignItems: "center", backgroundColor: "#090315",
                        paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9,
                    }}>
                        <Ionicons name="star" size={13} color="#F5C518" />
                        <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700", marginLeft: 4 }}>
                            {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                        </Text>
                    </View>
                </View>

                <Text style={{ color: "#8B859B", fontSize: 11, lineHeight: 17, marginTop: 10 }} numberOfLines={3}>
                    {item.aiReason}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#090315" }} edges={["top"]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View style={{ flex: 1, paddingHorizontal: 18 }}>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 22 }}>
                        <View style={{
                            width: 42, height: 42, borderRadius: 13, backgroundColor: "#160626",
                            justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#412A6F",
                        }}>
                            <Ionicons name="sparkles" size={23} color="#7F56D9" />
                        </View>

                        <View style={{ marginLeft: 12 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "700" }}>
                                AI Picks For You
                            </Text>
                            <Text style={{ color: "#8B859B", fontSize: 11, marginTop: 3 }}>
                                Tell Kevi what you want to watch
                            </Text>
                        </View>
                    </View>

                    <View style={{
                        backgroundColor: "#160626", borderRadius: 18, padding: 17,
                        borderWidth: 1, borderColor: "#24103B",
                    }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600", marginBottom: 11 }}>
                            What are you in the mood for?
                        </Text>

                        <View style={{
                            backgroundColor: "#090315", borderRadius: 14, paddingLeft: 15, paddingRight: 7,
                            minHeight: 70, flexDirection: "row", alignItems: "center",
                            borderWidth: 1, borderColor: "#24103B",
                        }}>
                            <TextInput
                                value={prompt}
                                onChangeText={setPrompt}
                                placeholder="A mind-bending sci-fi with deep love"
                                placeholderTextColor="#6E667D"
                                multiline
                                style={{ flex: 1, color: "#FFFFFF", fontSize: 14, lineHeight: 20, paddingVertical: 12 }}
                            />

                            <TouchableOpacity
                                onPress={handleAIRecommendation}
                                disabled={loading}
                                activeOpacity={0.8}
                                style={{
                                    width: 46, height: 46, borderRadius: 13, backgroundColor: "#7F56D9",
                                    justifyContent: "center", alignItems: "center",
                                    opacity: loading ? 0.5 : 1, marginLeft: 8,
                                }}
                            >
                                <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loading && (
                        <View style={{ alignItems: "center", marginTop: 32 }}>
                            <ActivityIndicator size="large" color="#7F56D9" />
                            <Text style={{ color: "#8B859B", fontSize: 13, marginTop: 12 }}>
                                Finding movies for you...
                            </Text>
                        </View>
                    )}

                    {!loading && intro !== "" && (
                        <View style={{
                            backgroundColor: "#160626", borderRadius: 16, padding: 16,
                            marginTop: 16, borderWidth: 1, borderColor: "#24103B",
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
                                <Ionicons name="sparkles" size={16} color="#7F56D9" />
                                <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600", marginLeft: 7 }}>
                                    Kevi's picks
                                </Text>
                            </View>
                            <Text style={{ color: "#C8C0D4", fontSize: 12, lineHeight: 18 }}>
                                {intro}
                            </Text>
                        </View>
                    )}

                    {!loading && movies.length > 0 && (
                        <View style={{ flex: 1, marginTop: 18 }}>
                            <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "700", marginBottom: 12 }}>
                                Recommended for you
                            </Text>
                            <FlatList
                                data={movies}
                                renderItem={renderMovie}
                                keyExtractor={(item, index) => `${item.id}-${index}`}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 120 }}
                            />
                        </View>
                    )}

                    {!loading && movies.length === 0 && intro === "" && (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
                            <View style={{
                                width: 90, height: 90, borderRadius: 28, backgroundColor: "#160626",
                                justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#412A6F",
                            }}>
                                <Ionicons name="sparkles-outline" size={45} color="#7F56D9" />
                            </View>
                            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 20 }}>
                                Your next movie is waiting
                            </Text>
                            <Text style={{ color: "#8B859B", fontSize: 12, textAlign: "center", marginTop: 8, lineHeight: 19 }}>
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