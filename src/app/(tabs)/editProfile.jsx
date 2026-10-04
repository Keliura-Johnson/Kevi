import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator, Alert, BackHandler, Image, Modal,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth, db } from "../../firebaseConfig";

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

export default function EditProfile() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [showGenrePicker, setShowGenrePicker] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Direct navigation to the Profile tab
    const handleGoBack = useCallback(() => {
        router.navigate("/(tabs)/profile");
    }, []);

    // Intercept Hardware Back Button on Android
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                handleGoBack();
                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => subscription.remove();
        }, [handleGoBack])
    );

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setFullname(data.fullname || "");
                setEmail(data.email || user.email || "");
                setProfilePic(data.profilePic || "");

                const firstGenreId = data.favoriteGenres?.[0];
                const matched = GENRES.find((g) => g.id === firstGenreId);
                setSelectedGenre(matched || null);
            }
        } catch (error) {
            console.log("EDIT PROFILE FETCH ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "You must be logged in.");
            return;
        }

        if (!fullname.trim()) {
            Alert.alert("Missing Name", "Display name cannot be empty.");
            return;
        }

        setSaving(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                fullname: fullname.trim(),
                email: email.trim(),
                favoriteGenres: selectedGenre ? [selectedGenre.id] : [],
            });

            Alert.alert("Saved", "Your profile has been updated.", [
                { text: "OK", onPress: () => handleGoBack() }
            ]);
        } catch (error) {
            console.log("SAVE PROFILE ERROR:", error);
            Alert.alert("Error", "Could not save your changes.");
        } finally {
            setSaving(false);
        }
    };

    const uploadImage = async (imageUri) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/scw2o59n/image/upload",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        file: `data:image/jpeg;base64,${base64}`,
                        upload_preset: "Keliura",
                    }),
                }
            );

            const data = JSON.parse(await response.text());
            if (!response.ok) throw new Error(data.error?.message || "Upload failed");

            await updateDoc(doc(db, "users", user.uid), { profilePic: data.secure_url });
            setProfilePic(data.secure_url);
            Alert.alert("Success", "Profile picture updated.");
        } catch (error) {
            console.log("PROFILE PICTURE ERROR:", error);
            Alert.alert("Upload Failed", error.message || "Could not update your profile picture.");
        }
    };

    const handleChoosePicture = async () => {
        setShowPhotoModal(false);

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

        uploadImage(result.assets[0].uri);
    };

    const handleRemovePicture = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await updateDoc(doc(db, "users", user.uid), { profilePic: null });
            setProfilePic(null);
            setShowPhotoModal(false);
            Alert.alert("Removed", "Profile picture removed.");
        } catch (error) {
            Alert.alert("Error", "Could not remove profile picture.");
        }
    };

    const styles = getStyles(colors, isDark);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#7F56D9" style={{ marginTop: 60 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={22} color={colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <View style={styles.photoSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={profilePic ? { uri: profilePic } : require("../../../assets/images/avatar.png")}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.cameraButton} onPress={() => setShowPhotoModal(true)}>
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullname}
                        onChangeText={setFullname}
                        placeholderTextColor={colors.textSecondary || "#6E667D"}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor={colors.textSecondary || "#6E667D"}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Favorite Genre</Text>
                    <TouchableOpacity style={styles.dropdownField} onPress={() => setShowGenrePicker(!showGenrePicker)}>
                        <Text style={styles.dropdownFieldText}>
                            {selectedGenre ? selectedGenre.name : "Select a genre"}
                        </Text>
                        <Ionicons name="chevron-down" size={18} color={colors.textSecondary || "#8B859B"} />
                    </TouchableOpacity>

                    {showGenrePicker && (
                        <View style={styles.dropdownList}>
                            <ScrollView style={{ maxHeight: 220 }}>
                                {GENRES.map((g) => (
                                    <TouchableOpacity
                                        key={g.id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedGenre(g);
                                            setShowGenrePicker(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{g.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>

            <Modal
                visible={showPhotoModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPhotoModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Profile Picture</Text>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                setShowPhotoModal(false);
                                setShowViewModal(true);
                            }}
                        >
                            <Ionicons name="eye-outline" size={18} color={colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
                            <Text style={styles.modalOptionText}>View Profile Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={handleChoosePicture}>
                            <Ionicons name="image-outline" size={18} color={colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
                            <Text style={styles.modalOptionText}>Change Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalOption} onPress={handleRemovePicture}>
                            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                            <Text style={[styles.modalOptionText, { color: "#FF6B6B" }]}>Remove Picture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoModal(false)}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showViewModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowViewModal(false)}
            >
                <View style={styles.viewOverlay}>
                    <TouchableOpacity style={styles.viewClose} onPress={() => setShowViewModal(false)}>
                        <Ionicons name="close" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Image
                        source={profilePic ? { uri: profilePic } : require("../../../assets/images/avatar.png")}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        headerTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 18,
            fontFamily: "Outfit_700Bold",
        },
        photoSection: {
            alignItems: "center",
            marginTop: 10,
            marginBottom: 20,
        },
        avatarWrapper: {
            width: 100,
            height: 100,
            position: "relative",
            marginBottom: 10,
        },
        profileImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        cameraButton: {
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#7F56D9",
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
        },
        field: {
            paddingHorizontal: 20,
            marginBottom: 18,
        },
        label: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 13,
            marginBottom: 8,
            fontFamily: "Geist_400Regular",
        },
        input: {
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 12,
            height: 48,
            paddingHorizontal: 14,
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Geist_400Regular",
        },
        dropdownField: {
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 12,
            height: 48,
            paddingHorizontal: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        dropdownFieldText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Geist_400Regular",
        },
        dropdownList: {
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
            borderRadius: 12,
            marginTop: 8,
            overflow: "hidden",
        },
        dropdownItem: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border || (isDark ? "#2A1F3D" : "#E2DCEB"),
        },
        dropdownItemText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Geist_400Regular",
        },
        saveButton: {
            marginHorizontal: 20,
            marginTop: 10,
            height: 50,
            borderRadius: 14,
            backgroundColor: "#7F56D9",
            justifyContent: "center",
            alignItems: "center",
        },
        saveButtonText: {
            color: "#FFFFFF",
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
        },
        modalBox: {
            width: "85%",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#FFFFFF"),
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border || (isDark ? "#412A6F" : "#E2DCEB"),
        },
        modalTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            marginBottom: 14,
        },
        modalOption: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 12,
        },
        modalOptionText: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
        modalCancel: {
            alignItems: "center",
            paddingVertical: 12,
            marginTop: 4,
        },
        modalCancelText: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
        viewOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
            justifyContent: "center",
            alignItems: "center",
        },
        viewClose: {
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 10,
        },
        fullImage: {
            width: "90%",
            height: "70%",
        },
    });