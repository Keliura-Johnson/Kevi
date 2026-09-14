import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert, FlatList, Image, Modal, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import { getImageUrl, getPersonalizedRecommendations, getTrending, getYouMightAlsoLike } from '../services/tmbd';

export default function home() {
    const [fullname, setFullname] = useState("");
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [profilePic, setProfilePic] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [youMightAlsoLike, setYouMightAlsoLike] = useState([]);


    useEffect(() => {
        const loadTrending = async () => {
            const trending = await getTrending();
            setTrendingMovies(trending);
        };
        loadTrending();
    }, []);

    useEffect(() => {
        const loadYouMightAlsoLike = async () => {
            const movies = await getYouMightAlsoLike();
            setYouMightAlsoLike(movies);
        };

        loadYouMightAlsoLike();
    }, []);

    const fetchUserGenres = async () => {
        const user = auth.currentUser;
        if (!user) return [];

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            return userDoc.data().favoriteGenres || [];
        }
        return [];
    };

    useEffect(() => {
        const loadRecommendations = async () => {
            const genreIds = await fetchUserGenres();
            if (genreIds.length === 0) return;

            const recommended = await getPersonalizedRecommendations(genreIds);
            setRecommendedMovies(recommended);
        };
        loadRecommendations();
    }, []);

    
    useEffect(() => {
        const getUserData = async () => {
            const authInstance = getAuth();
            const user = authInstance.currentUser;
            if (!user) return;

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFullname(data.fullname);
                }
            } catch (error) {
                console.log("Error getting user data:", error);
            }
        };
        getUserData();
    }, []);

    useEffect(() => {
        const fetchProfilePic = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.profilePic) {
                    setProfilePic(data.profilePic);
                }
            }
        };
        fetchProfilePic();
    }, []);

    const handleChangeProfilePicture = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission Required", "Please allow access to your photos.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled) return;

            const imageUri = result.assets[0].uri;
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "You must be logged in.");
                return;
            }

            const uriParts = imageUri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/scw2o59n/image/upload`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file: `data:image/${fileType};base64,${base64}`,
                        upload_preset: 'Keliura',
                    }),
                }
            );

            const cloudinaryData = await cloudinaryRes.json();
            if (!cloudinaryRes.ok) {
                throw new Error(cloudinaryData.error?.message || "Upload failed");
            }

            const downloadURL = cloudinaryData.secure_url;

            await updateDoc(doc(db, "users", user.uid), { profilePic: downloadURL });
            setProfilePic(downloadURL);
            setShowProfileModal(false);
            Alert.alert("Success", "Profile picture updated.");
        } catch (error) {
            console.log("CHANGE PICTURE ERROR:", error);
            Alert.alert("Update Failed", error.message || "Could not update your profile picture.");
        }
    };

    const handleProfilePicture = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission Required", "Please allow access to your photos.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled) return;

            const imageUri = result.assets[0].uri;
            setProfilePic(imageUri);
            setShowProfileModal(false);

            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "You must be logged in.");
                return;
            }

            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/scw2o59n/image/upload`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file: `data:image/jpeg;base64,${base64}`,
                        upload_preset: 'Keliura',
                    }),
                }
            );

            const rawText = await cloudinaryRes.text();
            const cloudinaryData = JSON.parse(rawText);

            if (!cloudinaryRes.ok) {
                throw new Error(cloudinaryData.error?.message || "Upload failed");
            }

            const downloadURL = cloudinaryData.secure_url;

            await updateDoc(doc(db, "users", user.uid), { profilePic: downloadURL });
            setProfilePic(downloadURL);
            Alert.alert("Success", "Profile picture updated.");
        } catch (error) {
            console.log("PROFILE PICTURE ERROR:", error);
            Alert.alert("Upload Failed", error.message || "Could not update your profile picture.");
        }
    };

    const handleRemoveProfilePicture = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            await updateDoc(doc(db, "users", user.uid), { profilePic: null });
            setProfilePic(null);
            setShowProfileModal(false);
            Alert.alert("Removed", "Profile picture removed.");
        } catch (error) {
            console.log("REMOVE PICTURE ERROR:", error);
            Alert.alert("Error", "Could not remove profile picture.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#090315' }}>
            <ScrollView 
   
            >   

                
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginTop: 20,
                    marginBottom: 10,
                }}>
                    <View style={{ flex: 1, paddingLeft: '3%' }}>
                        <Text style={{ color: "#8B859B", fontSize: 16, marginBottom: 4 }}>
                            Welcome
                        </Text>
                        <Text style={{ color: "#FFFFFF", fontSize: 18, marginTop: -5, fontWeight: "700" }}>
                            {fullname}
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingRight: 20 }}>
                        <TouchableOpacity style={{
                            width: 40, height: 40, borderRadius: 16, marginLeft: -30,
                            backgroundColor: "#160626", borderWidth: 1, borderColor: "#412A6F",
                            justifyContent: "center", alignItems: "center",
                        }}>
                            <Ionicons name="search" size={22} color="#FFFFFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowProfileModal(true)}
                            style={{ width: 40, height: 40, borderRadius: 35, overflow: "hidden" }}
                        >
                            <Image
                                source={profilePic ? { uri: profilePic } : require("../../../assets/images/avatar.png")}
                                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

               
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={trendingMovies}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.trendingCard}>
                                <Image
                                    source={{ uri: getImageUrl(item.backdrop_path || item.poster_path) }}
                                    style={styles.trendingImage}
                                />
                                <View style={styles.trendingOverlay}>
                                    <Text style={styles.trendingTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={12} color="#F5C518" />
                                        <Text style={styles.ratingText}>
                                            {item.vote_average?.toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Recommended for You */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.aiTitleRow}>
                            <Ionicons name="sparkles" size={16} color="#7F56D9" />
                            <Text style={styles.sectionTitle}> Recommended for You</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                    

                    <FlatList
                        data={recommendedMovies}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingLeft: 20 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.recCard}>
                                <Image source={{ uri: getImageUrl(item.poster_path) }} style={styles.recImage} />
                                <Text style={styles.recTitle} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={12} color="#F5C518" />
                                    <Text style={styles.ratingText}>
                                        {item.vote_average?.toFixed(1)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                {/* You Might Also Like */}
                <View style={styles.section}>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            You Might Also Like
                        </Text>

                        <TouchableOpacity
                            onPress={async () => {
                                const movies = await getYouMightAlsoLike();
                                setYouMightAlsoLike(movies);
                            }}
                        >
                            <Text style={styles.seeAll}>
                                Refresh
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                    data={youMightAlsoLike}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingLeft: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.recCard}>

                            <Image
                                source={{
                                    uri: getImageUrl(item.poster_path)
                                }}
                                style={styles.recImage}
                            />

                            <Text
                                style={styles.recTitle}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>

                            <View style={styles.ratingRow}>
                                <Ionicons
                                    name="star"
                                    size={12}
                                    color="#F5C518"
                                />

                                <Text style={styles.ratingText}>
                                    {item.vote_average?.toFixed(1)}
                                </Text>
                            </View>

                        </TouchableOpacity>
                    )}
                />

                </View>

            </ScrollView>

            {/* Profile Picture Modal */}
            <Modal
                visible={showProfileModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowProfileModal(false)}
            >
                <View style={{
                    flex: 1, backgroundColor: "rgba(0,0,0,0.7)",
                    justifyContent: "center", alignItems: "center",
                }}>
                    <View style={{ width: "85%", backgroundColor: "#160626", borderRadius: 20, padding: 24 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
                            Profile Picture
                        </Text>
                        <Text style={{ color: "#8B859B", fontSize: 15, marginBottom: 25 }}>
                            Choose a picture from your gallery.
                        </Text>

                        <TouchableOpacity
                            onPress={() => { setShowProfileModal(false); handleProfilePicture(); }}
                            style={{ height: 52, backgroundColor: "#7F56D9", borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 12 }}
                        >
                            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Choose Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { setShowProfileModal(false); handleChangeProfilePicture(); }}
                            style={{ height: 52, backgroundColor: "#2A1F3D", borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 12 }}
                        >
                            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Change Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleRemoveProfilePicture}
                            style={{ height: 52, backgroundColor: "#2A1F3D", borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 12 }}
                        >
                            <Text style={{ color: "#FF6B6B", fontSize: 16, fontWeight: "700" }}>Remove Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowProfileModal(false)}
                            style={{ height: 52, justifyContent: "center", alignItems: "center" }}
                        >
                            <Text style={{ color: "#8B859B", fontSize: 16, fontWeight: "600" }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    section: { marginTop: 24 },
    sectionHeader: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
    aiTitleRow: { flexDirection: "row", alignItems: "center" },
    seeAll: { color: "#7F56D9", fontSize: 14, fontWeight: "600" },
    trendingCard: { width: 260, height: 150, borderRadius: 16, overflow: "hidden", marginRight: 12 },
    trendingImage: { width: "100%", height: "100%" },
    trendingOverlay: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(0,0,0,0.5)", padding: 10,
    },
    trendingTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
    ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
    ratingText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
    recCard: { width: 120, marginRight: 12 },
    recImage: { width: 120, height: 170, borderRadius: 12, marginBottom: 6 },
    recTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
});