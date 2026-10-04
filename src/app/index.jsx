// import { router } from "expo-router";
// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useTheme } from "../context/ThemeContext";
// import { auth } from "../firebaseConfig";

// export default function Index() {
//     const { colors, theme } = useTheme();
//     const isDark = theme === "dark";

//     const [checkingAuth, setCheckingAuth] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 router.replace('/home');
//             } else {
//                 setCheckingAuth(false);
//             }
//         });

//         return unsubscribe;
//     }, []);

//     const styles = getStyles(colors, isDark);

//     if (checkingAuth) {
//         return (
//             <SafeAreaView style={[styles.container, styles.loadingContainer]}>
//                 <ActivityIndicator size="large" color="#7F56D9" />
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <ImageBackground 
//                 source={require('@/assets/images/onboarding1.png')}
//                 style={styles.backgroundImage}
//             >
//                 <TouchableOpacity 
//                     style={styles.skipButton} 
//                     onPress={() => router.replace('/signup')}
//                 >
//                     <Text style={styles.skipText}>Skip</Text>
//                 </TouchableOpacity>
//             </ImageBackground>

//             <Text style={styles.title}>
//                 Discover Movies You'll Love
//             </Text>

//             <Text style={styles.subtitle}>
//                 {'Kevi parses thousands of cinematic masterpiece \nto match your exact mood, aesthetic preferences,\nand taste profile.'}
//             </Text>

//             <View style={styles.paginationContainer}>
//                 <View style={styles.activeDot} />
//                 <View style={styles.inactiveDot} />
//                 <View style={styles.inactiveDot} />
//             </View>

//             <TouchableOpacity 
//                 style={styles.nextButton} 
//                 onPress={() => router.push('/onboarding2')}
//             >
//                 <Text style={styles.nextButtonText}>Next</Text>
//             </TouchableOpacity>
//         </SafeAreaView>
//     );
// }

// const getStyles = (colors, isDark) =>
//     StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: colors.background || (isDark ? '#0B0417' : '#FFFFFF'),
//         },
//         loadingContainer: {
//             justify: 'center',
//             alignItems: 'center',
//         },
//         backgroundImage: {
//             width: "100%",
//             height: 360,
//             marginTop: "20%",
//         },
//         skipButton: {
//             marginLeft: "85%",
//         },
//         skipText: {
//             color: colors.textSecondary || '#8B859B',
//             fontSize: 16,
//             fontFamily: 'Geist_400Regular',
//         },
//         title: {
//             color: colors.textPrimary || (isDark ? '#FFFFFF' : '#1A102A'),
//             textAlign: 'center',
//             paddingHorizontal: 10,
//             fontSize: 25,
//             marginTop: 20,
//             fontFamily: 'Outfit_700Bold',
//         },
//         subtitle: {
//             color: colors.textSecondary || '#8B859B',
//             marginTop: 10,
//             fontSize: 14,
//             paddingHorizontal: 10,
//             textAlign: 'center',
//             fontFamily: 'Geist_400Regular',
//             lineHeight: 20,
//         },
//         paginationContainer: {
//             marginTop: 105,
//             flexDirection: 'row',
//             justifyContent: 'center',
//             gap: 10,
//         },
//         activeDot: {
//             width: 24,
//             height: 8,
//             backgroundColor: '#7F56D9',
//             borderRadius: 4,
//         },
//         inactiveDot: {
//             width: 8,
//             height: 8,
//             backgroundColor: isDark ? '#473E56' : '#E2DCEB',
//             borderRadius: 4,
//         },
//         nextButton: {
//             alignSelf: 'center',
//             backgroundColor: '#7F56D9',
//             width: "85%",
//             height: 48,
//             paddingHorizontal: 10,
//             borderRadius: 15,
//             marginTop: 20,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         nextButtonText: {
//             textAlign: 'center',
//             color: '#FFFFFF',
//             fontSize: 15,
//             fontFamily: 'Outfit_700Bold',
//         },
//     });
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebaseConfig";

export default function Index() {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // ONLY go to home if user exists AND email is verified
            if (user && user.emailVerified) {
                router.replace('/home');
            } else {
                setCheckingAuth(false);
            }
        });

        return unsubscribe;
    }, []);

    const styles = getStyles(colors, isDark);

    if (checkingAuth) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#7F56D9" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground 
                source={require('@/assets/images/onboarding1.png')}
                style={styles.backgroundImage}
            >
                <TouchableOpacity 
                    style={styles.skipButton} 
                    onPress={() => router.replace('/signup')}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </ImageBackground>

            <Text style={styles.title}>
                Discover Movies You'll Love
            </Text>

            <Text style={styles.subtitle}>
                {'Kevi parses thousands of cinematic masterpiece \nto match your exact mood, aesthetic preferences,\nand taste profile.'}
            </Text>

            <View style={styles.paginationContainer}>
                <View style={styles.activeDot} />
                <View style={styles.inactiveDot} />
                <View style={styles.inactiveDot} />
            </View>

            <TouchableOpacity 
                style={styles.nextButton} 
                onPress={() => router.push('/onboarding2')}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const getStyles = (colors, isDark) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background || (isDark ? '#0B0417' : '#FFFFFF'),
        },
        loadingContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        backgroundImage: {
            width: "100%",
            height: 360,
            marginTop: "20%",
        },
        skipButton: {
            marginLeft: "85%",
        },
        skipText: {
            color: colors.textSecondary || '#8B859B',
            fontSize: 16,
            fontFamily: 'Geist_400Regular',
        },
        title: {
            color: colors.textPrimary || (isDark ? '#FFFFFF' : '#1A102A'),
            textAlign: 'center',
            paddingHorizontal: 10,
            fontSize: 25,
            marginTop: 20,
            fontFamily: 'Outfit_700Bold',
        },
        subtitle: {
            color: colors.textSecondary || '#8B859B',
            marginTop: 10,
            fontSize: 14,
            paddingHorizontal: 10,
            textAlign: 'center',
            fontFamily: 'Geist_400Regular',
            lineHeight: 20,
        },
        paginationContainer: {
            marginTop: 105,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
        },
        activeDot: {
            width: 24,
            height: 8,
            backgroundColor: '#7F56D9',
            borderRadius: 4,
        },
        inactiveDot: {
            width: 8,
            height: 8,
            backgroundColor: isDark ? '#473E56' : '#E2DCEB',
            borderRadius: 4,
        },
        nextButton: {
            alignSelf: 'center',
            backgroundColor: '#7F56D9',
            width: "85%",
            height: 48,
            paddingHorizontal: 10,
            borderRadius: 15,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        nextButtonText: {
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 15,
            fontFamily: 'Outfit_700Bold',
        },
    });