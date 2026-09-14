import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConfig";

export default function GenreScreen() {
    const auth = getAuth();
  const user = auth.currentUser;
  const [action, setAction] = useState(false);
  const [adventure, setAdventure] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [comedy, setComedy] = useState(false);
  const [crime, setCrime] = useState(false);
  const [documentary, setDocumentary] = useState(false);
  const [drama, setDrama] = useState(false);
  const [family, setFamily] = useState(false);
  const [fantasy, setFantasy] = useState(false);
  const [history, setHistory] = useState(false);
  const [horror, setHorror] = useState(false);
  const [music, setMusic] = useState(false);
  const [mystery, setMystery] = useState(false);
  const [romance, setRomance] = useState(false);
  const [scienceFiction, setScienceFiction] = useState(false);
  const [tvMovie, setTvMovie] = useState(false);
  const [thriller, setThriller] = useState(false);
  const [war, setWar] = useState(false);
  const [western, setWestern] = useState(false);

const handleContinue = async () => {
  const selectedGenreIds = [];

        if (action) selectedGenreIds.push(28);
        if (adventure) selectedGenreIds.push(12);
        if (animation) selectedGenreIds.push(16);
        if (comedy) selectedGenreIds.push(35);
        if (crime) selectedGenreIds.push(80);
        if (documentary) selectedGenreIds.push(99);
        if (drama) selectedGenreIds.push(18);
        if (family) selectedGenreIds.push(10751);
        if (fantasy) selectedGenreIds.push(14);
        if (history) selectedGenreIds.push(36);
        if (horror) selectedGenreIds.push(27);
        if (music) selectedGenreIds.push(10402);
        if (mystery) selectedGenreIds.push(9648);
        if (romance) selectedGenreIds.push(10749);
        if (scienceFiction) selectedGenreIds.push(878);
        if (tvMovie) selectedGenreIds.push(10770);
        if (thriller) selectedGenreIds.push(53);
        if (war) selectedGenreIds.push(10752);
        if (western) selectedGenreIds.push(37);

        if (selectedGenreIds.length < 3) {
            alert("Please select at least 3 genres.");
            return;
        }

        if (!user) {
            alert("You must be logged in.");
            return;
        }

        try {
            await updateDoc(doc(db, "users", user.uid), {
            favoriteGenres: selectedGenreIds,
            });

            alert("Genres saved", selectedGenreIds);
            router.push('/home');
        } catch (error) {
            console.log("Error saving genres:", error);
           Alert.alert("Could not save your genres.");
        }
        };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0A0415",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            color: "#8B859B",
            fontSize: 14,
            fontWeight: "700",
            letterSpacing: 1.5,
            marginBottom: 12,
          }}
        >
          STEP 2 OF 3
        </Text>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 30,
            fontWeight: "800",
            marginBottom: 18,
          }}
        >
          Taste Setup
        </Text>

        <View
          style={{
            height: 6,
            width: "100%",
            backgroundColor: "#160626",
            borderRadius: 10,
            marginBottom: 35,
          }}
        >
          <View
            style={{
              height: 6,
              width: "67%",
              backgroundColor: "#7F56D9",
              borderRadius: 10,
            }}
          />
        </View>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: "800",
            marginBottom: 10,
          }}
        >
          What do you love?
        </Text>

        <Text
          style={{
            color: "#8B859B",
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 25,
          }}
        >
          Select at least 3 genres to personalize Kevi's neural movie
          recommendations.
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            paddingTop: 5,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setAction(!action)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: action ? "#7F56D9" : "#412A6F",
                backgroundColor: action ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {action ? "✓ " : ""}Action
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAdventure(!adventure)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: adventure ? "#7F56D9" : "#412A6F",
                backgroundColor: adventure ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {adventure ? "✓ " : ""}Adventure
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAnimation(!animation)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: animation ? "#7F56D9" : "#412A6F",
                backgroundColor: animation ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {animation ? "✓ " : ""}Animation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setComedy(!comedy)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: comedy ? "#7F56D9" : "#412A6F",
                backgroundColor: comedy ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {comedy ? "✓ " : ""}Comedy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCrime(!crime)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: crime ? "#7F56D9" : "#412A6F",
                backgroundColor: crime ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {crime ? "✓ " : ""}Crime
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDocumentary(!documentary)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: documentary ? "#7F56D9" : "#412A6F",
                backgroundColor: documentary ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {documentary ? "✓ " : ""}Documentary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDrama(!drama)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: drama ? "#7F56D9" : "#412A6F",
                backgroundColor: drama ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {drama ? "✓ " : ""}Drama
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFamily(!family)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: family ? "#7F56D9" : "#412A6F",
                backgroundColor: family ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {family ? "✓ " : ""}Family
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFantasy(!fantasy)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: fantasy ? "#7F56D9" : "#412A6F",
                backgroundColor: fantasy ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {fantasy ? "✓ " : ""}Fantasy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setHistory(!history)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: history ? "#7F56D9" : "#412A6F",
                backgroundColor: history ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {history ? "✓ " : ""}History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setHorror(!horror)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: horror ? "#7F56D9" : "#412A6F",
                backgroundColor: horror ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {horror ? "✓ " : ""}Horror
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMusic(!music)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: music ? "#7F56D9" : "#412A6F",
                backgroundColor: music ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {music ? "✓ " : ""}Music
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMystery(!mystery)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: mystery ? "#7F56D9" : "#412A6F",
                backgroundColor: mystery ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {mystery ? "✓ " : ""}Mystery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRomance(!romance)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: romance ? "#7F56D9" : "#412A6F",
                backgroundColor: romance ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {romance ? "✓ " : ""}Romance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setScienceFiction(!scienceFiction)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: scienceFiction ? "#7F56D9" : "#412A6F",
                backgroundColor: scienceFiction ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {scienceFiction ? "✓ " : ""}Sci-Fi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTvMovie(!tvMovie)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: tvMovie ? "#7F56D9" : "#412A6F",
                backgroundColor: tvMovie ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {tvMovie ? "✓ " : ""}TV Movie
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThriller(!thriller)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: thriller ? "#7F56D9" : "#412A6F",
                backgroundColor: thriller ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {thriller ? "✓ " : ""}Thriller
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setWar(!war)}
              style={{
                paddingHorizontal: 17,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: war ? "#7F56D9" : "#412A6F",
                backgroundColor: war ? "#7F56D9" : "#160626",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {war ? "✓ " : ""}War
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setWestern(!western)}
              style={{
                paddingHorizontal: 17,height: 40,borderRadius: 20,borderWidth: 1,borderColor: western ? "#7F56D9" : "#412A6F",
                backgroundColor: western ? "#7F56D9" : "#160626",justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {western ? "✓ " : ""}Western
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity 
  
          onPress={handleContinue}
        style={{alignSelf:'center',fontSize:14,width:'98%',
               backgroundColor: '#7F56D9' ,
              
                   height:48,borderRadius:15,marginBottom:25}} 
                
                    >
                    <Text style={{marginTop:13,textAlign:'center',
                      color:'#FFFFFF'}}>Continue</Text>
        
            </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}