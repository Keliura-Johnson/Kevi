import Ionicons from '@expo/vector-icons/Ionicons';

import { router } from 'expo-router';

import { sendPasswordResetEmail } from 'firebase/auth';

import { useState, } from 'react';

import { Alert, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from '../firebaseConfig';

export default function recovery(){

        const [email, setEmail] = useState('');

               const [loading, setLoading] = useState(false);

        const handleResetPassword = async () => {

            if (!email) {

                Alert.alert("Missing Email", "Please enter your email address.");

                return;

            }

            setLoading(true);

            try {

                await sendPasswordResetEmail(auth, email);

                Alert.alert(

                    "Check Your Email", 

                    "A password reset link has been sent to your email address."

                );

                router.back();

            } catch (error) {

                let friendlyMessage = "Something went wrong. Please try again.";

                if (error.code === 'auth/user-not-found') {

                    friendlyMessage = "No account found with this email address.";

                } else if (error.code === 'auth/invalid-email') {

                    friendlyMessage = "Please enter a valid email address.";

                } else if (error.code === 'auth/too-many-requests') {

                    friendlyMessage = "Too many attempts. Please try again later.";

                }

                Alert.alert("Reset Failed", friendlyMessage);

            } finally {

                setLoading(false);

            }

        };

        return(

            <KeyboardAvoidingView
                behavior="padding"
                style={{flex:1}}
            >
             <ScrollView
                 showsVerticalScrollIndicator={false}
                 contentContainerStyle={{ flexGrow: 1, }}
                keyboardShouldPersistTaps="handled">

            <SafeAreaView style={{flex:1,backgroundColor:'#090315',}}>

                <View style={{flexDirection:'row',paddingVertical:'25%',paddingLeft:'2%'}}>

                    <TouchableOpacity onPress={()=>{

                            router.back()

                        }} style={{width:32,height:32,borderWidth:1,borderRadius:12,

                        borderColor:'#211830'}}>

                        <Ionicons name="chevron-back" style={{alignSelf:'center',marginTop:5}} 

                        size={20} color='#bdbbc1' />

                    </TouchableOpacity>



                    <Text style={{paddingLeft:'25%',marginTop:3,color:'#79728A',fontSize:17}}>Reset Password</Text>

                </View>

                <Image style={{borderRadius: 48,width:96,height:96,alignSelf:'center'}}

                 source={require('@/assets/images/lockcircle.png')}></Image>

                 <Text style={{color:'white',alignSelf:'center',fontSize:23,fontWeight:'bold',marginTop:'18%'}}>

                    Forgot Password?</Text>

                <Text style={{color:'#79728A',alignSelf:'center',fontSize:14,marginTop:'4%'}}>

                {'Enter your registered email below, and we\'ll send you \nan encrypted link to reset and secure your credentials.'}

                </Text>

                <Text style={{color:'#8B859B',fontSize:15,marginTop:50,paddingLeft:'5%'}}>Email Address</Text>

                <TextInput

                placeholder=" alexpavier123@gmail.com"

                placeholderTextColor='#3B324A'

                onChangeText={(text) => setEmail(text)}

                style={{ borderWidth: 1,alignSelf:'center', borderColor: '#191227',backgroundColor:'#160C26',

                     borderRadius: 12,height:48,width:'90%',marginTop:7,

                     borderColor:'#412A6F',color:'#ffffff'

                 }}

                />

          <TouchableOpacity  onPress={handleResetPassword}

           disabled={loading} style={{alignSelf:'center',backgroundColor:'#7F56D9',fontSize:14,width:'98%',

                   height:48,borderRadius:15,marginTop:20,width:'90%',}}   >

                    <Text style={{marginTop:13,textAlign:'center',

                     color:'#FFFFFF'}}>{loading ? "Sending..." : "Send Reset Link"}</Text>

            </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{

                            router.back()

                        }} style={{alignSelf:'center',paddingVertical:70, }}>



                        <Text style={{ fontSize: 15, color: '#704cc0'}}>

                       Back to Login

                        </Text>

                        </TouchableOpacity>

            </SafeAreaView>
            
                        </ScrollView>
            </KeyboardAvoidingView>

        );

}