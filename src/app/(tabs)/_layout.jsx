import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const TabsLayout = () => {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const activeColor = "#7F56D9";
    const inactiveColor = isDark ? "#9E96B0" : "#8E889B";

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                backBehavior: "history",
                tabBarStyle: {
                    backgroundColor: colors.background || (isDark ? "#090315" : "#FFFFFF"),
                    borderTopWidth: 0,
                    borderWidth: 0,
                    height: 100,
                    paddingTop: 20,
                    marginHorizontal: 10,
                    bottom: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    shadowColor: "transparent",
                },
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
            }}
        >
    

            <Tabs.Screen 
                name="home" 
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <Image 
                            resizeMode='contain'
                            source={require('../../../assets/images/home.png')} 
                            style={{ 
                                width: 24, 
                                height: 24,
                                tintColor: focused ? activeColor : inactiveColor
                            }}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="search" 
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />
                }}
            />

            <Tabs.Screen 
                name="Ai" 
                options={{
                    title: "AI Pick",
                    tabBarLabelStyle: { fontSize: 10 },
                    tabBarIcon: ({ focused }) => (
                        <Image 
                            resizeMode='contain'
                            source={require('../../../assets/images/AI.png')} 
                            style={{ 
                                width: 24, 
                                height: 24,
                                tintColor: focused ? activeColor : inactiveColor
                            }}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="watchlist" 
                options={{  
                    title: "Watchlist",
                    tabBarIcon: ({ focused }) => (
                        <Image 
                            resizeMode='contain'
                            source={require('../../../assets/images/watchlist.png')} 
                            style={{ 
                                width: 24, 
                                height: 24,
                                tintColor: focused ? activeColor : inactiveColor
                            }}
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="profile" 
                options={{  
                    title: "Profile",
                    tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />
                }}
            />
                    <Tabs.Screen 
                name="moviedetail" 
                options={{
                    href: null,
                    unmountOnBlur: true,
                }}
            />

            <Tabs.Screen 
                name="castprofile" 
                options={{
                    href: null,
                   
                }}
            />

            <Tabs.Screen 
                name="editProfile" 
                options={{
                    href: null,
                    unmountOnBlur: true,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;