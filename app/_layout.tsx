import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { UserContextProvider } from "../contexts/user.context"
import { useUserContext } from '../contexts/user.context';
import { ReportProvider, useReport } from '@/contexts/report.context';
import Loading from '@/components/Loading';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'mon' : require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-l' : require('../assets/fonts/Montserrat-Light.ttf'),
    'mon-b' : require('../assets/fonts/Montserrat-Bold.ttf'),
    'mon-sb' : require('../assets/fonts/Montserrat-SemiBold.ttf'),

  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  return (
    <UserContextProvider>
      <ReportProvider>
      <RootLayoutNav />
      </ReportProvider>
    </UserContextProvider>
  )
}

function RootLayoutNav() {

  const { isLoading, isLoggedIn } = useUserContext();

  // if(isLoading){
  //   return <Loading/>
  // }

  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
        <Stack.Screen name="(modals)/login" options={{
          presentation:'modal',
          title: `Se connecter`,
          headerTitleStyle: {
            fontFamily: 'mon-b'
          },
          headerLeft: () =>
            <TouchableOpacity onPress={() => { router.back()}}>
              <Ionicons name="close-outline" size={25}></Ionicons>
            </TouchableOpacity>
        }}/>
        <Stack.Screen name="(modals)/signIn" options={{
          presentation:'modal',
          title: `S'inscrire`,
          headerTitleStyle: {
            fontFamily: 'mon-b'
          },
          headerLeft: () =>
            <TouchableOpacity onPress={() => { router.back()}}>
              <Ionicons name="close-outline" size={25}></Ionicons>
            </TouchableOpacity>
        }}/>
        <Stack.Screen name='listing/[id]' options={{ headerTitle: "", headerTransparent:true, }} />
        <Stack.Screen name="(modals)/report" options={{
            presentation:'modal',
            title:'Signaler votre incident',
            headerTitleStyle: {
              fontFamily: 'mon-b'
            },
            headerLeft: () =>
              <TouchableOpacity onPress={() => { router.back()}}>
                <Ionicons name="close-outline" size={25}></Ionicons>
              </TouchableOpacity>

        }}
        
        />
        <Stack.Screen name="(modals)/importPic" options={{
            presentation:'fullScreenModal',
            title:'Importer ou prendre une photo',
            headerTitleStyle: {
              fontFamily: 'mon-b'
            },
            headerLeft: () =>
              <TouchableOpacity onPress={() => { router.back()}}>
                <Ionicons name="close-outline" size={25}></Ionicons>
              </TouchableOpacity>
        }}
        
        />
        <Stack.Screen name="(modals)/NumerosDurgences" options={{
            title:'Chosissez un numéro',
            headerTitleStyle: {
              fontFamily: 'mon-b'
            },
            headerLeft: () =>
              <TouchableOpacity onPress={() => { router.back()}}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
        }}
        
        />
        <Stack.Screen name="(modals)/monCompte" options={{
            title:'Mon Compte',
            headerTitleStyle: {
              fontFamily: 'mon-b'
            },
            headerLeft: () =>
              <TouchableOpacity onPress={() => { router.back()}}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
        }}
        
        /><Stack.Screen name="(modals)/instructions" options={{
          title:'Instructions à suivre',
          headerTitleStyle: {
            fontFamily: 'mon-b'
          },
          headerLeft: () =>
            <TouchableOpacity onPress={() => { router.back()}}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
      }}
      
      />
      </Stack>
  );
}
