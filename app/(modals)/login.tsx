import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, ActivityIndicator } from 'react-native'
import { supabase } from '@/lib/supabase'
import Colors from '@/constants/Colors'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native-elements'
import { TextInput } from 'react-native'
import { defaultStyles } from '@/constants/Styles'
import { useUserContext } from '@/contexts/user.context'
import { router } from 'expo-router'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const { login } = useUserContext();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    try {
      setLoading(true);
      const { user, profile, role } = await login({
        email: email,
        password: password,
      })
      router.back();
      Alert.alert("Bienvenue " + profile.nom.toUpperCase() + " " + profile.prenom)
    } catch (error: any) {
      Alert.alert("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'mon-b', color: Colors.grey }}>Adresse Mail</Text>

      <TextInput keyboardType='email-address' textContentType='emailAddress' placeholder='E-mail' value={email} onChangeText={(text) => setEmail(text)} placeholderTextColor={Colors.grey} autoCapitalize='none' style={[defaultStyles.inputField, { marginBottom: 30, fontFamily: 'mon' }]} />
      <Text style={{ fontFamily: 'mon-b', color: Colors.grey }}>Mot de passe</Text>

      <TextInput placeholder='Password' secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password} placeholderTextColor={Colors.grey} autoCapitalize='none' style={[defaultStyles.inputField, { marginBottom: 30, fontFamily: 'mon' }]} />
      <TouchableOpacity style={[defaultStyles.btn, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 }]}
        onPress={() => { signInWithEmail(); }}>
        {
          loading
            ?
            <>
              <ActivityIndicator color={"white"} />
              <Text style={[defaultStyles.btnText]} disabled={loading} >Chargement ...</Text>
            </>
            : <Text style={[defaultStyles.btnText]} disabled={loading} >Continuer</Text>
        }

      </TouchableOpacity>
      <View style={[styles.seperatorView]}>
        <View style={{
          borderBottomColor: '#000',
          borderBottomWidth: StyleSheet.hairlineWidth,
          flex: 1
        }} />

        <Text style={[styles.seperator]}>Prochainement avec Google et Apple</Text>
        <View style={{
          borderBottomColor: '#000',
          borderBottomWidth: StyleSheet.hairlineWidth,
          flex: 1
        }} /></View>
      {/* <View style={{ gap: 20 }}>
        <TouchableOpacity style={[styles.btnOutline]} >
          <Ionicons name='logo-google' style={[defaultStyles.btnIcon]} size={24}></Ionicons>

          <Text style={[styles.btnOutlineText]}>Continuer avec Google</Text></TouchableOpacity>

        <TouchableOpacity style={[styles.btnOutline]} >
          <Ionicons name='logo-apple' style={[defaultStyles.btnIcon]} size={24}></Ionicons>
          <Text style={[styles.btnOutlineText]}>Continuer avec Apple</Text></TouchableOpacity>
      </View> */}
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    gap: 14,
    padding: 26,
  },
  seperatorView: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginVertical: 30

  },
  seperator: {
    fontFamily: 'mon-b',
    color: Colors.grey,

  },
  btnOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "black",
    fontSize: 16,
    fontFamily: 'mon-b'
  }
})