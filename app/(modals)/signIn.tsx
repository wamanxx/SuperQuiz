import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useUserContext } from '@/contexts/user.context'
import { router } from 'expo-router'


const signIn = () => {
    const {signup}  = useUserContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const formIsFull = !!(email && password && nom && prenom)
    const signupClick = async () => {
        setLoading(true);
        try {
            await signup({ email, password, nom, prenom });
         router.back()
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={[defaultStyles.container, { padding: 26 }]}>
            <View style={{ gap: 13 }}>
                <Text style={{ fontFamily: 'mon-b', color: Colors.grey }}>Nom</Text>
                <TextInput
                    onChangeText={(text) => setNom(text)}
                    placeholder='Saisissez votre nom de famille' style={[defaultStyles.inputField, { height: 44, fontFamily: 'mon' }]} placeholderTextColor={Colors.grey} />

                <Text style={{ fontFamily: 'mon-b', color: Colors.grey }} >Prénom</Text>
                <TextInput
                    onChangeText={(text) => setPrenom(text)}
                    placeholder='Saisissez votre prénom' style={[defaultStyles.inputField, { height: 44, fontFamily: 'mon' }]} placeholderTextColor={Colors.grey} />

                <Text style={{ fontFamily: 'mon-b', color: Colors.grey }} >Adresse Mail</Text>
                <TextInput
                keyboardType='email-address' textContentType='emailAddress'  
                    onChangeText={(text) => setEmail(text)}
                    placeholder='E-mail' style={[defaultStyles.inputField, { height: 44, fontFamily: 'mon', }]} placeholderTextColor={Colors.grey} />

                <Text style={{ fontFamily: 'mon-b', color: Colors.grey }} >Mot de passe</Text>
                <TextInput
                    secureTextEntry={true}
                    onChangeText={(text) => { 
                        if(text.length>7 ){setPassword(text)}
                            else {setPassword('')}

                    }}
                    placeholder='Saisissez 7 caractères au min.' style={[defaultStyles.inputField, { height: 44, fontFamily: 'mon', }]} textContentType='password' placeholderTextColor={Colors.grey} />
                <TouchableOpacity
                    style={
                        loading
                        ? [defaultStyles.btn,{backgroundColor : Colors.grey}, { flexDirection: 'row', gap: 14, alignItems: 'center', marginVertical: 10, justifyContent: 'center' }]
                        : [defaultStyles.btn, { flexDirection: 'row', gap: 14, alignItems: 'center', marginVertical: 10, justifyContent: 'center' }]
                    
                    }
                        
                        
                        
                    onPress={() => {
                        formIsFull ? 
                        signupClick() 
                        :Alert.alert(
                            `Formulair incomplet`,
                            `Veuillez remplir tout les champs \n (Mot de passe min. 7 caractères)`,
                            [
                                { text: 'OK', onPress: () => console.log('OK appuyé') }
                            ],
                            { cancelable: false }
                        );
                    }}>
                    <Text style={[defaultStyles.btnText]}>{loading?'Chargement ...': 'Continuer'}</Text>
                    {
                        loading
                        ?<ActivityIndicator color={'white'}/>
                        : null
                    }</TouchableOpacity>

            </View>
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
                }}/></View>

            {/* <View style={{ gap: 20 }}>
                <TouchableOpacity style={[styles.btnOutline]} >
                    <Ionicons name='logo-google' style={[defaultStyles.btnIcon]} size={24}></Ionicons>

                    <Text style={[styles.btnOutlineText]}>S'inscrire avec Google</Text></TouchableOpacity>

                <TouchableOpacity style={[styles.btnOutline]} >
                    <Ionicons name='logo-apple' style={[defaultStyles.btnIcon]} size={24}></Ionicons>
                    <Text style={[styles.btnOutlineText]}>S'inscrire avec Apple</Text></TouchableOpacity>
            </View> */}
        </View>
    )
}

export default signIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    },

})