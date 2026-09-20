import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConfig";

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
    { id: 878, name: "Sci-Fi" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

export default function GenreScreen() {
    const auth = getAuth();
    const user = auth.currentUser;
    const [selected, setSelected] = useState([]);

    const toggleGenre = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const handleContinue = async () => {
        if (selected.length < 3) {
            alert("Please select at least 3 genres.");
            return;
        }

        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            await updateDoc(doc(db, "users", user.uid), {
                favoriteGenres: selected,
            });

            router.replace('/home');
        } catch (error) {
            console.log("Error saving genres:", error);
            Alert.alert("Could not save your genres.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0415" }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
                <Text style={{ color: "#8B859B", fontSize: 14, fontWeight: "700", letterSpacing: 1.5, marginBottom: 12 }}>
                    STEP 2 OF 3
                </Text>

                <Text style={{ color: "#ffffff", fontSize: 30, fontWeight: "800", marginBottom: 18 }}>
                    Taste Setup
                </Text>

                <View style={{ height: 6, width: "100%", backgroundColor: "#160626", borderRadius: 10, marginBottom: 35 }}>
                    <View style={{ height: 6, width: "67%", backgroundColor: "#7F56D9", borderRadius: 10 }} />
                </View>

                <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "800", marginBottom: 10 }}>
                    What do you love?
                </Text>

                <Text style={{ color: "#8B859B", fontSize: 16, lineHeight: 24, marginBottom: 25 }}>
                    Select at least 3 genres to personalize Kevi's neural movie recommendations.
                </Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 5, paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                        {GENRES.map((genre) => {
                            const isSelected = selected.includes(genre.id);
                            return (
                                <TouchableOpacity
                                    key={genre.id}
                                    onPress={() => toggleGenre(genre.id)}
                                    style={{
                                        paddingHorizontal: 17, height: 40, borderRadius: 20, borderWidth: 1,
                                        borderColor: isSelected ? "#7F56D9" : "#412A6F",
                                        backgroundColor: isSelected ? "#7F56D9" : "#160626",
                                        justifyContent: "center", alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#ffffff", fontSize: 15, fontWeight: "600" }}>
                                        {isSelected ? "✓ " : ""}{genre.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={handleContinue}
                    style={{
                        alignSelf: 'center', fontSize: 14, width: '98%',
                        backgroundColor: '#7F56D9', height: 48, borderRadius: 15, marginBottom: 25,
                    }}
                >
                    <Text style={{ marginTop: 13, textAlign: 'center', color: '#FFFFFF' }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}