// import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function signup (){
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#0A0415', }}>
            
            <View style={{flexDirection:'row',justifyContent:'center',paddingVertical:'15%'}}>
                <Image style={{width:55,height:55,borderRadius:10,borderWidth:1}}  source={require('@/assets/images/kevilogo.png')} >

                </Image>
                <Text style={{color:'white',fontSize:30,fontWeight:'bold',marginTop:'6'}}>Kevi</Text>

            </View>
            <Text style={{marginTop:-50,color:'white',fontSize:26,fontWeight:'bold',alignSelf:'center',}}>Create Account</Text>
            <Text style={{color:'#8B859B',fontsize:20,alignSelf:'center',}}>Join kevi to discover AI-powered cinema</Text>


            <View style={{flex:1,flexDirection:'column',margin:'5%',gap:8}}>
                <Text style={{color:'#8B859B',fontSize:15}}>Full Name</Text>
                <TextInput
                placeholder="Alex Pavier"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setFullname(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,
                  }}
                />
                <Text style={{color:'#8B859B',fontSize:15}}>Email Address</Text>
                <TextInput
                placeholder="alexpavier123@gmail.com"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setEmail(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,
                  }}
                />
                <Text style={{color:'#8B859B',fontSize:15}}>Phone Number</Text>
                <TextInput
                placeholder="08.......63"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setPhone(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,
                  }}
                />
                <Text style={{color:'#8B859B',fontSize:15}}>Password</Text>
               {/* <View style={{ flexDirection: 'row',
                alignItems: 'center', borderWidth: 1,
                 }}> */}
               <TextInput
               
                placeholder="Password"
                placeholderTextColor='#3B324A'
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,
                  }}
            />
            <Text style={{color:'#8B859B',fontSize:15}}> Confirm Password</Text>
             <TextInput
               
                placeholder=" Confirm Password"
                placeholderTextColor='#3B324A'
                secureTextEntry={!showPassword}
                onChangeText={(text) => setConfirm(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,
                  }}
            />
            {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color='#9B9B9B' />
            </TouchableOpacity>
            </View> */}
        <TouchableOpacity style={{alignSelf:'center',backgroundColor:'#7F56D9',fontSize:14,width:'98%',
                   height:48,borderRadius:15,marginTop:20}} onPress={() => {
                    router.push('/preference')
                   }}  >
                    <Text style={{marginTop:13,textAlign:'center',
                      color:'#FFFFFF'}}>Create Account</Text>
        
            </TouchableOpacity>
            <View style={{flexDirection:'row',marginRight:10, marginTop: 4 ,justifyContent:'center',
                gap:4,
            }}>
            <Text style={{ fontSize: 16, color: '#8B859B',}}>
           Already have an account?
            </Text>
            <TouchableOpacity onPress={()=> {
                router.push('/signin')
            }}>
             <Text style={{ fontSize: 16, color: '#704cc0',}}>
          Log in
            </Text>
            </TouchableOpacity>

            </View>


            </View>
        
        </SafeAreaView>



    );
}