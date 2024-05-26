import { Alert, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useUserContext } from '@/contexts/user.context'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { router } from 'expo-router'
import { Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '@/components/Loading'
import useSWR from 'swr'

const monCompte = () => {
    const { profile, isLoggedIn, role, user, logout } = useUserContext()

    const { data, isLoading, error } = useSWR('incidents?auteur_id=${profil?.user_id}', async () => {
        const response = await supabase.from('incidents')
            .select('*')
            .eq('auteur_id', profile!.user_id).order('created_at', { ascending: false });
        if (response.error) throw response.error;
        return response.data;
    })

    const { data: votes, isLoading: isLoadingVote, error: errorVote } = useSWR(' /votes?auteur_id =${user.id}', async () => {
        const response = await supabase.from('incidents_vote')
            .select('*')
            .eq('auteur_id', profile!.user_id).order('voted_at', { ascending: false });
        if (response.error) throw response.error;
        return response.data;
    })

    if (isLoading || isLoadingVote) {
        return (
            <Loading />
        )
    }

    if ((error || !data || errorVote)&&isLoggedIn) {
        console.log('erreur : ', error)
        console.log('data : ', data)
        return (
            <Loading />)

    }    // !
    const incidents = data;
    return (
        <SafeAreaView style={[defaultStyles.container, { paddingHorizontal: 18, justifyContent: 'space-between' }]}>
            {isLoggedIn
                ? <>
                    <View style={styles.card}>
                        <MaterialIcons name="account-circle" size={40} color={Colors.grey} />
                        <Text style={styles.header}>{profile?.nom.toUpperCase() + " " + profile?.prenom[0].toUpperCase() + profile?.prenom.slice(1)}</Text>
                        <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>{`Vous êtes : ` + role}</Text>
                    </View>
                    <View style={[styles.seperatorView]}>
                        <View style={{
                            borderBottomColor: '#000',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            flex: 1
                        }} />

                        <Text style={[styles.seperator]}>Historique d'activité</Text>
                        <View style={{
                            borderBottomColor: '#000',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            flex: 1
                        }} /></View>
                    <ScrollView style={{
                        flexDirection: 'column', gap: 20,
                        borderRadius: 8,
                        borderColor: Colors.grey,
                        borderWidth: StyleSheet.hairlineWidth,
                        padding: 15,
                        marginBottom: 14,
                        backgroundColor: 'white',

                    }}>
                        {incidents?.map((item, index) => {
                            return (

                                <TouchableOpacity
                                    onPress={() => router.push(`/listing/${item.id}`)}
                                    key={index}
                                    style={[styles.historiqueElement, {
                                        marginBottom: 10,

                                    }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons style={{}} name="verified" size={30} color={item.est_verifier ? Colors.blue : Colors.grey} />
                                        <View style={{ paddingHorizontal: 15 }}>
                                            <Text style={{ color: Colors.grey, fontFamily: 'mon-sb' }}>{
                                                item.titre.length > 25
                                                    ? item.titre.slice(0, 25) + " ..."
                                                    : item.titre
                                            }</Text>
                                            <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>{item.created_at.slice(0, 10) + ' à ' + item.created_at.slice(11, 16)}</Text>
                                        </View>
                                    </View>

                                    <Feather style={{}} name="arrow-right" size={20} color={Colors.grey} />


                                </TouchableOpacity>
                            )
                        })}
                        {votes?.map((item, index) => {
                            return (

                                <TouchableOpacity
                                    onPress={() => router.push(`/listing/${item.incident_id}`)}
                                    key={index}
                                    style={[styles.historiqueElement, {
                                        marginBottom: 10,

                                    }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name="how-to-vote" size={30} color={Colors.grey} />
                                        <View style={{ paddingHorizontal: 15 }}>
                                            <Text style={{ color: Colors.grey, fontFamily: 'mon-sb' }}>{
                                                'Vous avez votez un article'
                                            }</Text>
                                            <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>{'Le ' + item.voted_at.slice(0, 10) + ' à ' + item.voted_at.slice(11, 16)}</Text>
                                        </View>
                                    </View>

                                    <Feather style={{}} name="arrow-right" size={20} color={Colors.grey} />


                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>

                </>
                :
                <View style={styles.card}>
                    <MaterialIcons name="no-accounts" size={40} color={Colors.grey} />
                    <Text style={[{ color: Colors.grey, fontFamily: 'mon', }]}>Vous n'êtes pas connecté</Text>
                </View>
            }

            {isLoggedIn
                ? <TouchableOpacity
                    onPress={() => { logout(); router.back() }}
                    style={[defaultStyles.btn, { backgroundColor: Colors.red }]} ><Text style={[defaultStyles.btnText]}>Se déconnecter</Text></TouchableOpacity>
                :
                <SafeAreaView style={{ gap: 15 }}>
                    <TouchableOpacity
                        onPress={() => { router.push('./login') }}
                        style={[defaultStyles.btn, { flexDirection: 'row', gap: 14 }]}>
                        <Text style={[defaultStyles.btnText]}>Se connecter</Text>
                        <Entypo name="login" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { router.push('./signIn') }}
                        style={[defaultStyles.btn, { flexDirection: 'row', gap: 14 }]}>
                        <Text style={[defaultStyles.btnText]}>S'inscrire</Text>
                        <MaterialCommunityIcons name="account-edit" size={30} color="white" />
                    </TouchableOpacity>

                </SafeAreaView>
            }

        </SafeAreaView>
    )
}

export default monCompte

const styles = StyleSheet.create({
    historiqueElement: {
        flexDirection: 'row',
        padding: 14,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 8,
        backgroundColor: '#eee',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    header: {
        fontFamily: 'mon-sb',
        fontSize: 18,
        color: Colors.grey

    },
    container: {
        flex: 1,
        padding: 14,



    },
    card: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15, gap: 14,
        backgroundColor: 'white',
        borderColor: Colors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        width: '100%'
    }, seperatorView: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginVertical: 20

    }, seperator: {
        fontFamily: 'mon-b',
        color: Colors.grey,

    },

})