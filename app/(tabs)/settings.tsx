//import NotificationToggle from '../../components/ui/NotificationToggle';

import ThemeToggle from '../../components/ThemeToggle';
import { Text,
View,SafeAreaView,
Platform,TouchableOpacity
,ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { useTheme } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/theme/theme";
import NotificationToggle from "@/components/ui/NotificationToggle";
export default function StreaksScreen() {
  //const { isDark, toggleTheme } = useTheme();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const clearHabits = async () => {
    await AsyncStorage.removeItem('@habits');
    console.log('All habits cleared');
  };
  return (
  <ScrollView  showsVerticalScrollIndicator={false} style={{
    }}>
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 150,
      }}
    >
         <View
      style={{
        height:Platform.Os==='ios'?96:56,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '500',
          color:theme.textPrimary
        }}>
        Your Settings
        </Text>
        <Text style={{
          fontSize:18,
          fontWeight: '300',
          color:theme.textPrimary
        }}>
        HabitUp
        </Text>
      </View>
      <View style={{
        padding: 10,
        borderRadius:10,
        backgroundColor:theme.card,
        minHeight:180,
        marginTop:100,
        marginBottom: 10,
        position: 'relative',
      }}>
        <View style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor:theme.card,
          position: 'absolute',
          borderWidth:10,
          borderColor: theme.background,
          left: "50%",
          top: -100,
          transform: [{ translateX: '-50%' }],
          
        }}>
        </View>
        <View style={{
          marginTop: 80,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical:10,
          borderColor:theme.border,
          borderBottomWidth: 1,
          
        }}>
        <Text
        style={{
          color:theme.textPrimary
        }}>Your Name</Text>
        <Text style={{
          fontSize: 12,
          color: theme.text,
        }}>User Name</Text>
        </View>
        <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical:10,
          borderColor:theme.border,
          borderBottomWidth: 1,
        }}>
         <Text style={{
          color:theme.textPrimary
        }}>Email</Text>
        <Text
       style={{
          fontSize: 12,
          color: theme.text,
        }} >None</Text>
        </View>
        <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical:10,
          borderColor:theme.border,
          borderBottomWidth: 1,
        }}>
         <Text style={{
          color:theme.textPrimary
        }}>Vrosin</Text>
        <Text
       style={{
          fontSize: 12,
          color: theme.text,
        }} >01.0.0.0</Text>
        </View>
      </View>
      <View style={{
         flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:10,
          borderColor:theme.border,
          borderWidth: 1,
          backgroundColor:theme.card,
          borderRadius: 6,
          marginVertical: 10,
          width: '100%',
      }}>
          <Text style={{
          color:theme.textPrimary
        }}>Change Theme</Text>
          <ThemeToggle />
      </View>
      <View style={{
         flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:10,
          borderColor:theme.border,
          borderWidth: 1,
          backgroundColor:theme.card,
          borderRadius: 6,
          marginVertical:10,
          width: '100%',
      }}>
          <Text style={{
          color:theme.textPrimary
        }}>Set Remainder</Text>
          <NotificationToggle />

      </View>
            <View style={{
              width: '100%',
         flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:10,
          borderColor:theme.border,
          borderWidth: 1,
          backgroundColor:theme.card,
          borderRadius: 6,
          marginVertical:10,

      }}>
          <Text style={{
          color:theme.textPrimary
        }}>Dlelet All Habit</Text>
          <TouchableOpacity
            style={{
          width:90,
          height: 40,
          borderRadius:20,
          backgroundColor:theme.promoBottonColor,
          alignItems: 'cener',
          justifyContent: 'center',
         // marginVertical: 5,
              //padding: 5,
              //backgroundColor:theme.primary,
            }}
            onPress={clearHabits}
          >
            <Text style={{
              color:"#fff",
              textAlign: 'center',
            }}>Save Habit</Text>
          </TouchableOpacity>

      </View>

      <View style={{
         flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding:10,
          borderColor:theme.border,
          borderWidth: 1,
          backgroundColor:theme.card,
          borderRadius: 6,
          marginVertical:10,
          width: '100%',
      }}>
          <Text style={{
          color:theme.textPrimary
        }}>About Programemr</Text>
          <Text
             style={{
                fontSize: 12,
                color: theme.text,
              }} >Eng.Abdalla Osman</Text>
            </View>

    </SafeAreaView>
    </ScrollView>
  );
}
