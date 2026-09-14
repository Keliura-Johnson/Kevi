import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import {
    Alert,
    Image, KeyboardAvoidingView, Platform, ScrollView,
    Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../firebaseConfig';
export default function signin (){
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [password, setPassword] = useState('');
        const [alertMessage, setAlertMessage] = useState('');
        const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);

        console.log("Login successful");
        router.push('/home');

    } catch (error) {
        let friendlyMessage = "Something went wrong. Please try again.";

        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            friendlyMessage = "Incorrect email or password.";
        } else if (error.code === 'auth/user-not-found') {
            friendlyMessage = "No account found with this email.";
        } else if (error.code === 'auth/invalid-email') {
            friendlyMessage = "Please enter a valid email address.";
        } else if (error.code === 'auth/too-many-requests') {
            friendlyMessage = "Too many attempts. Please try again later.";
        }

        Alert.alert(friendlyMessage);
        setShowAlert(true);
    } finally {
        setLoading(false);
    }
};
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#0A0415', }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  >
                <ScrollView
                             showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, }}
                            keyboardShouldPersistTaps="handled"
                >
            
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
                     borderRadius: 12,height:48,borderColor:'#412A6F',color:'#ffffff'
                  }}
                />
           
          <Text style={{color:'#8B859B',fontSize:15}}>Password</Text>
                <View    style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,borderColor:'#412A6F',flexDirection:'row',
                  }}>
               <TextInput
                style={{width:'90%',color:'#ffffff'}}
                placeholder="Password"
                placeholderTextColor='#3B324A'
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text)}
             
            >
              
            </TextInput>
              <TouchableOpacity style={{alignSelf:'center'}} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color='#412A6F' />
            </TouchableOpacity>
            
            </View>
            <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=>{
                router.push('/forgottenpass')
            }} >
            <Text style={{color:'#704cc0', fontSize:16}}>Forgot Password?</Text>
            </TouchableOpacity>
           


        <TouchableOpacity style={{alignSelf:'center',backgroundColor:'#7F56D9',fontSize:14,width:'98%',
                   height:48,borderRadius:15,marginTop:20}} onPress={handleLogin}  >
                    <Text style={{marginTop:13,textAlign:'center',
                      color:'#FFFFFF'}}>Log in</Text>
        
            </TouchableOpacity>
            
        
      <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:50,}}>
        <View style={{width:100,height:1,backgroundColor:'#473E56',borderRadius:4 }}>

        </View>
       <Text style={{color:'#8B859B',marginTop:-12}}>or continue with</Text>
        <View style={{width:100,height:1,backgroundColor:'#473E56',borderRadius:4 }}>
        </View>
    </View>
       <View style={{flex:1,flexDirection:'row',gap:10,marginTop:15}}>
                <TouchableOpacity style={{backgroundColor:'#160C26',borderColor:'#412A6F',
                    borderWidth:1,width:100,borderRadius:12,height:45
                }}>
                    <Image 
                     source={require('@/assets/images/globe.png')} style={{height:15,width:15
                     ,alignSelf:'center',marginTop:14.5}}>

                    </Image>
                </TouchableOpacity>
                 <TouchableOpacity style={{backgroundColor:'#160C26',borderColor:'#412A6F',
                    borderWidth:1,width:100,borderRadius:12,height:45
                }}>
                    <Image 
                     source={require('@/assets/images/twitter.png')} style={{height:15,width:15
                     ,alignSelf:'center',marginTop:14.5}}>

                    </Image>
                </TouchableOpacity>
                 <TouchableOpacity style={{backgroundColor:'#160C26',borderColor:'#412A6F',
                    borderWidth:1,width:100,borderRadius:12,height:45
                }}>
                 
                    <Feather name="facebook" size={20} style={{
                     alignSelf:'center',marginTop:12,color:'#ffffff'}}/>
                </TouchableOpacity>
                </View>
           
            <View style={{flexDirection:'row' ,justifyContent:'center',paddingVertical:30,
                gap:4,
            }}>
            <Text style={{ fontSize: 16, color: '#8B859B',}}>
           Don't have an account?
            </Text>
            <TouchableOpacity  onPress={()=> {
                router.push('/signup,')
            }}  >
             <Text style={{ fontSize: 16, color: '#704cc0',}}>
          Sign Up
            </Text>
            </TouchableOpacity>

            </View>


            </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>



    );
}