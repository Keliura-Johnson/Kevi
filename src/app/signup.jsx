import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
    ActivityIndicator,
    Image, KeyboardAvoidingView, Platform,
    ScrollView, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from '../firebaseConfig';
export default function signup (){
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [checkbox, setCheckbox] = useState(false);
const [loading, setLoading] = useState(false);



                const handleSignup = async () => {
                const hasNumber = /\d/.test(password);

                if (password.length < 8 || !hasNumber) {
                    alert("Password must be at least 8 characters and contain a number");
                    return;
                }

                if (password !== confirm) {
                    alert("Passwords do not match");
                    return;
                }

                setLoading(true);
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    await setDoc(doc(db, "users", user.uid), {
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    });

                    console.log("User created:", user.uid);
                    router.replace('/preference');
               } catch (error) {
                    let friendlyMessage = "Something went wrong. Please try again.";
                    
                    if (error.code === 'auth/email-already-in-use') {
                            friendlyMessage = "An account with this email already exists.";
                        } else if (error.code === 'auth/invalid-email') {
                            friendlyMessage = "Please enter a valid email address.";
                        } else if (error.code === 'auth/weak-password') {
                            friendlyMessage = "Password is too weak.";
                        }
                    alert(friendlyMessage);
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
            <View style={{flexDirection:'row',justifyContent:'center', opacity: loading ? 0.4 : 1,paddingVertical:'15%'}}>
                <Image style={{width:55,height:55,borderRadius:10,borderWidth:1}}  source={require('@/assets/images/kevilogo.png')} >

                </Image>
                <Text style={{color:'white',fontSize:30,fontWeight:'bold',marginTop:'6'}}>Kevi</Text>

            </View>
            <Text style={{marginTop:-50,color:'white',fontSize:26,fontWeight:'bold',alignSelf:'center',}}>Create Account</Text>
            <Text style={{color:'#8B859B',fontsize:20,alignSelf:'center',}}>Join kevi to discover AI-powered cinema</Text>


            <View style={{flex:1,flexDirection:'column',margin:'5%',gap:8}}>
                <Text style={{color:'#8B859B',fontSize:15}}>Full Name</Text>
                <TextInput
                placeholder=" Alex Pavier"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setFullname(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,borderColor:'#412A6F',color:'#ffffff'
                  }}
                />
                <Text style={{color:'#8B859B',fontSize:15}}>Email Address</Text>
                <TextInput
                placeholder=" alexpavier123@gmail.com"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setEmail(text)}
                style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,borderColor:'#412A6F',color:'#ffffff'
                  }}
                />
                <Text style={{color:'#8B859B',fontSize:15}}>Phone Number</Text>
                <TextInput
                placeholder=" 08.......63"
                placeholderTextColor='#3B324A'
                onChangeText={(text) => setPhone(text)}
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
                placeholder=" Password"
                placeholderTextColor='#3B324A'
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text)}
             
            />
              
        
              <TouchableOpacity style={{alignSelf:'center'}} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color='#412A6F' />
            </TouchableOpacity>
            
            </View>
       
            
            <Text style={{color:'#8B859B',fontSize:15}}> Confirm Password</Text>
             <View    style={{ borderWidth: 1, borderColor: '#191227',backgroundColor:'#160C26',
                     borderRadius: 12,height:48,borderColor:'#412A6F',flexDirection:'row',
                  }}>
             <TextInput
                style={{width:'90%',color:'#ffffff'}}
                placeholder=" Confirm Password"
                placeholderTextColor='#3B324A'
                secureTextEntry={!showPassword}
                onChangeText={(text) => setConfirm(text)}
              
            />
                <TouchableOpacity style={{alignSelf:'center'}} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color='#412A6F' />
            </TouchableOpacity>
            
            </View>
          
        <View style={{flexDirection:'row',gap:3,marginTop:8}}>
                <TouchableOpacity style={{alignSelf:'center'}} onPress={() => setCheckbox(!checkbox)}>
                <MaterialIcons name={checkbox ? 'check-box' : 'check-box-outline-blank'  } 
                size={20} color='#412A6F' />
            </TouchableOpacity>
         



        <Text>
        <Text style={{ color: '#8B859B' }}>I agree to the </Text>
        <Text
            style={{ color: '#412A6F' }}
            onPress={() => router.replace('/privacypolicy')}
        >
            Terms of Service{' '}
        </Text>
        <Text style={{ color: '#8B859B' }}>& </Text>
        <Text
            style={{ color: '#412A6F' }}
            onPress={() => router.replace('/privacypolicy')}
        >
            Privacy Policy
        </Text>
        </Text>
        </View>
        <TouchableOpacity 
          disabled={!checkbox}
        
        style={{alignSelf:'center',fontSize:14,width:'98%',
               backgroundColor: checkbox ? '#7F56D9' : '#9164f4',
               opacity: checkbox ? 1 : 0.5,
                   height:48,borderRadius:15,marginTop:15}} onPress={
                    handleSignup
                   }  >
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
            </ScrollView>
            </KeyboardAvoidingView>
            {loading && (
                    <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                    <ActivityIndicator size="large" color="#412A6F" />
                    </View>
                )}

        </SafeAreaView>



    );
}