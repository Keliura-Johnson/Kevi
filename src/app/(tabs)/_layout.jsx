import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

const TabsLayout = ()=>{


    const TabIcon = ({ name, focused})=>{
        return(
            <View style={{gap:10, alignItems:'center'}}>
              
                {focused ?  <Octicons name="home" size={24} color={'white'} /> :  <Octicons name="home" size={24} color={'#C1B9F9'} />}
            
            </View>
        )


    }

    return(
        
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#090315",
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
                tabBarActiveTintColor: "#7f56d9",
                tabBarInactiveTintColor: "#9E96B0",
            }}
        >
            <Tabs.Screen 
                name="moviedetail" 
                options={{
                    href: null,
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
                }}
            />
             <Tabs.Screen name="home" 
            
            options={{
                title:"Home",
                tabBarIcon : ({focused}) => (
                <Image 
                resizeMode='contain'
                    source={require('../../../assets/images/home.png')} 
                    style={{ width: 24, height: 24 ,
                        tintColor: focused ? '#7f56d9' : '#9E96B0'
                    }}
                />
            )
            }}/>

            <Tabs.Screen name="search" 
            
            options={{
                title:"Search",
                tabBarIcon : ({color})=> <Feather name="search" size={24} color={color} />
            }}/>

         <Tabs.Screen name="Ai" 
            options={{
                title:"AI Pick",
                tabBarLabelStyle: { fontSize: 10},
                tabBarIcon : ({focused}) => (
                <Image 
                resizeMode='contain'
                    source={require('../../../assets/images/AI.png')} 
                    style={{ width: 24, height: 24,
                        tintColor: focused ? '#7f56d9' : '#9E96B0'
                     }}
                    
                />
            )
            }}
            />

            <Tabs.Screen name="watchlist" 

                options={{  title:"Watchlist",
                tabBarIcon : ({focused}) => (
                <Image 
                resizeMode='contain'
                    source={require('../../../assets/images/watchlist.png')} 
                    style={{ width: 24, height: 24 ,
                        tintColor: focused ? '#7f56d9' : '#9E96B0'
                    }}
                />
            )
            }}
            
            />
             <Tabs.Screen name="profile" 

                options={{  title:"Profile",
                tabBarIcon : ({color})=> <FontAwesome5 name="user" size={24} color={color} />
            }}
            
            />

        </Tabs>

    )
}

export default TabsLayout;