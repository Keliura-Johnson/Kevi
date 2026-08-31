import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (

    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('@/assets/images/onboarding3.png')} 
      style={{width:"100%", height:360,marginTop:"20%"}}>
        <TouchableOpacity style={{marginLeft:"85%"}}>
      {/* <Text style={{color:'#8B859B',fontSize:16}}>Skip</Text> */}
      </TouchableOpacity>
      </ImageBackground>
     
      <Text style={{color:'#FFFFFF',textAlign:'center',
        paddingHorizontal:'10',fontSize:25,marginTop:20}}>
        Watch Anywhere, Anytime
      </Text>
        <Text style={{color:'#8B859B',marginTop:10,fontSize:14,
           paddingHorizontal:'10',textAlign:'center'}} >
        {  'Stream on any device wherever \nyou are, and never miss \na moment.'}
      </Text>

      <View style={{marginTop:105,flexDirection:'row',justifyContent:'center',gap:10}}>
        <View style={{width:8,height:8,backgroundColor:'#473E56',borderRadius:4 }}>

        </View>
        <View style={{width:8,height:8,backgroundColor:'#473E56',borderRadius:4 }}>
        </View>
        <View style={{width:24,height:8,backgroundColor:'#7F56D9',borderRadius:4 }}>
        </View>
    </View>
    <TouchableOpacity style={{alignSelf:'center',backgroundColor:'#7F56D9',fontSize:14,width:"85%",
           height:48,paddingHorizontal:'10',borderRadius:15,marginTop:20}} onPress={() => {
                       router.push('/signup')
                      }}>
            <Text style={{marginTop:13,textAlign:'center',
              color:'#FFFFFF'}}>Next</Text>

    </TouchableOpacity>
      

      
     </SafeAreaView>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
    backgroundColor:"#0B0417",
    
  },
});
