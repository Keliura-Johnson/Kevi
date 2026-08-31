// import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function signin (){
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
            <Text style={{marginTop:-50,color:'white',fontSize:26,fontWeight:'bold',alignSelf:'center',}}>Welcome Back</Text>
            <Text style={{color:'#8B859B',fontsize:20,alignSelf:'center',}}>Log in to access you cinematic recommendations</Text>


            <View style={{flex:1,flexDirection:'column',margin:'5%',gap:8,marginTop:40,}}>
                
                <Text style={{color:'#8B859B',fontSize:15}}>Email Address</Text>
                <TextInput
                placeholder="alexpavier123@gmail.com"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setEmail(text)}
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
            <TouchableOpacity style={{alignSelf:'flex-end'}} >
            <Text style={{color:'#704cc0', fontSize:16}}>Forgot Password?</Text>
            </TouchableOpacity>
           

        
      <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:20,}}>
        <View style={{width:100,height:1,backgroundColor:'#473E56',borderRadius:4 }}>

        </View>
       <Text style={{color:'#8B859B',marginTop:-12}}>or continue with</Text>
        <View style={{width:100,height:1,backgroundColor:'#473E56',borderRadius:4 }}>
        </View>
    </View>

        <TouchableOpacity style={{alignSelf:'center',backgroundColor:'#7F56D9',fontSize:14,width:'98%',
                   height:48,borderRadius:15,marginTop:20}} onPress={() => {
                    router.push('/home')
                   }}  >
                    <Text style={{marginTop:13,textAlign:'center',
                      color:'#FFFFFF'}}>Log in</Text>
        
            </TouchableOpacity>
            <View style={{flexDirection:'row',marginRight:10, marginTop: 4 ,justifyContent:'center',
                gap:4,
            }}>
            <Text style={{ fontSize: 16, color: '#8B859B',}}>
           Don't have an account?
            </Text>
            <TouchableOpacity onPress={()=> {
                router.push('/signup,')
            }}>
             <Text style={{ fontSize: 16, color: '#704cc0',}}>
          Sign Up
            </Text>
            </TouchableOpacity>

            </View>


            </View>
        
        </SafeAreaView>



    );
}