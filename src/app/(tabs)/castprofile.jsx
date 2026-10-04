import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, FlatList, Image, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { getImageUrl, getPersonDetails } from "../services/tmbd";

export default function CastProfile() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const { id, character } = useLocalSearchParams();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            const data = await getPersonDetails(id);
            setPerson(data);
            setLoading(false);
        };
        fetchPerson();
    }, [id]);

    const styles = getStyles(colors, isDark);

    if (loading || !person) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#7F56D9" style={{ marginTop: 60 }} />
            </SafeAreaView>
        );
    }

    const knownFor = person.combined_credits?.cast
        ?.filter((c) => c.poster_path && c.media_type === "movie")
        ?.sort((a, b) => b.popularity - a.popularity)
        ?.slice(0, 5) || [];

    const filmography = person.combined_credits?.cast
        ?.filter((c) => c.media_type === "movie")
        ?.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""))
        ?.slice(0, 10) || [];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A")} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cast Profile</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <Image
                        source={
                            person.profile_path
                                ? { uri: getImageUrl(person.profile_path) }
                                : require("../../../assets/images/avatar.png")
                        }
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>{person.name}</Text>
                    {character && <Text style={styles.character}>{character}</Text>}
                </View>

                {person.biography ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Biography</Text>
                        <Text style={styles.bioText}>{person.biography}</Text>
                    </View>
                ) : null}

                {knownFor.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Known For</Text>
                        <FlatList
                            data={knownFor}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.knownForCard}
                                    onPress={() => router.push({ pathname: "/moviedetail", params: { id: item.id } })}
                                >
                                    <Image
                                        source={{ uri: getImageUrl(item.poster_path) }}
                                        style={styles.knownForImage}
                                    />
                                    <Text style={styles.knownForTitle} numberOfLines={1}>
                                        {item.title || item.name}
                                    </Text>
                                    <Text style={styles.knownForYear}>
                                        {(item.release_date || item.first_air_date || "").slice(0, 4)}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {filmography.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Filmography</Text>
                        {filmography.map((item, index) => (
                            <TouchableOpacity
                                key={`${item.id}-${index}`}
                                style={styles.filmographyRow}
                                onPress={() => router.push({ pathname: "/moviedetail", params: { id: item.id } })}
                            >
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.filmographyTitle} numberOfLines={1}>{item.title || item.name}</Text>
                                    <Text style={styles.filmographyRole} numberOfLines={1}>{item.character}</Text>
                                </View>
                                <Text style={styles.filmographyYear}>
                                    {(item.release_date || item.first_air_date || "").slice(0, 4)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={{ height: 40 }} />
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
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        headerTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 15,
            fontFamily: "Outfit_700Bold",
            flex: 1,
            textAlign: "center",
        },
        profileSection: {
            alignItems: "center",
            marginTop: 10,
            marginBottom: 20,
        },
        profileImage: {
            width: 110,
            height: 110,
            borderRadius: 55,
            borderWidth: 2,
            borderColor: "#7F56D9",
            marginBottom: 14,
        },
        name: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 20,
            fontFamily: "Outfit_700Bold",
        },
        character: {
            color: "#7F56D9",
            fontSize: 14,
            fontFamily: "Geist_400Regular",
            marginTop: 4,
        },
        section: {
            paddingHorizontal: 20,
            marginTop: 20,
        },
        sectionTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 17,
            fontFamily: "Outfit_700Bold",
            marginBottom: 12,
        },
        bioText: {
            color: colors.textSecondary || "#B5AFC7",
            fontSize: 14,
            lineHeight: 22,
            fontFamily: "Geist_400Regular",
        },
        knownForCard: {
            width: 110,
            marginRight: 14,
        },
        knownForImage: {
            width: 110,
            height: 155,
            borderRadius: 12,
            marginBottom: 6,
        },
        knownForTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 13,
            fontFamily: "Outfit_700Bold",
        },
        knownForYear: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 11,
            fontFamily: "Geist_400Regular",
            marginTop: 2,
        },
        filmographyRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.surface || (isDark ? "#160626" : "#F4F2F8"),
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            marginBottom: 10,
        },
        filmographyTitle: {
            color: colors.textPrimary || (isDark ? "#FFFFFF" : "#1A102A"),
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
        filmographyRole: {
            color: colors.textSecondary || "#8B859B",
            fontSize: 12,
            fontFamily: "Geist_400Regular",
            marginTop: 2,
        },
        filmographyYear: {
            color: "#7F56D9",
            fontSize: 14,
            fontFamily: "Outfit_700Bold",
        },
    });