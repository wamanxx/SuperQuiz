import useSWR from 'swr';
import axios from 'axios';
import ToggleSwitch from 'toggle-switch-react-native';

import { ScrollView } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ActivityIndicator } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated, {
    SlideInDown,
    SlideInRight,
    SlideOutDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';

import { Database } from '@/lib/database';
import { supabase } from '@/lib/supabase';

import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

import { IncidentType } from '@/interfaces/incident.type';

import { useReport } from '@/contexts/report.context';
import { useUserContext } from '@/contexts/user.context';

import Loading from '@/components/Loading';

const widthWindow = Dimensions.get('window');

const IMG_HEIGHT = 300;

const DetailPage = () => {
    const { id } = useLocalSearchParams()

    const incidentId = parseInt(id as string);

    const { role, isLoggedIn, user } = useUserContext()

    const [address, setAddress] = useState('');
    const [IsUpdated, setIsUpdated] = useState(false);
    const [IsVoteUpdated, setIsVoteUpdated] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    //GeoCoding Inversé
    const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
        const apiKey = '1a657ce413eb40a990ee9d9566876043';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.results.length > 0) {
                setAddress(response.data.results[0].formatted);
            } else {
                setAddress('Aucune adresse trouvée');
            }
        } catch (error) {
            console.error(error);
            setAddress('');
        }
    };//

    const { data: incident, isLoading, error, mutate } = useSWR(`/incidents/${incidentId}?extend=type_id&extend=auteur_id&extend=votes`, async () => {
        const response = await supabase.from('incidents').select(`
            *,
            type: type_id (*),
            auteur: auteur_id (*),
            votes: incidents_vote!incidents_vote_incident_id_fkey (*)
            `).eq("id", incidentId).single();

        if (response.error) throw response.error;

        await getAddressFromCoordinates(response.data.latitude, response.data.longitude)

        return response.data;
    })

    const Navigation = useNavigation()

    useLayoutEffect(() => {
        Navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.roundBtn} onPress={() => Navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={'#000'} />
                </TouchableOpacity>
            ),
        })
    }, [])

    if (isLoading) {
        return (
            <Loading />
        )
    }

    if (error || !incident) {
        console.log('[erreur]:', error);
        return (
            <Loading />
        )
    }

    const toggleVerif = async (newValue: boolean) => {

        setIsUpdated(true);

        const { error } = await supabase.from('incidents')
            .update({
                est_verifier: newValue
            }).eq("id", incidentId);

        setIsUpdated(false)

        if (error) {
            console.log("[error]:", error);
            return;
        } else {
            await mutate({
                ...incident,
                est_verifier: newValue
            });
        }
    }

    const voteAction = async (value: number) => {
        setIsVoteUpdated(false);
        try {
            const { data: vote, error } = await supabase
                .from('incidents_vote') 
                .insert({
                    auteur_id: user!.id,   
                    incident_id: incidentId,       
                    vote: value,           
                }).select("*").single();

            if (error) {
                console.error('Erreur lors de l\'insertion du vote :', error);
            } else {
                console.log('Vote inséré avec succès :', vote);
                await mutate({
                    ...incident,
                    votes: [...incident.votes, vote]
                }, false); 
            }
        } catch (error) {
            console.error('Erreur inattendue :', error);
        } finally {
            setIsVoteUpdated(true);
        }
    };





    const hasUserVoted = incident.votes.find((vote) => vote.auteur_id === user?.id);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Image onLoadEnd={() => setIsImageLoaded(true)} style={styles.image} source={{ uri: incident.attachement![0] }} />

                    {!isImageLoaded && <ActivityIndicator style={styles.activityIndicator} size={'large'} color={Colors.grey} />}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{incident.titre}</Text>
                    <Text style={[styles.dateCreation, { color: Colors.grey }]}>
                        {'Le ' + incident.created_at.slice(0, 10) + ' à ' + incident.created_at.slice(11, 16)}
                    </Text>
                    <Text style={[styles.adress, { color: Colors.grey }]}>
                        à {address ? address : '...'}
                    </Text>
                    <View style={styles.divider} />
                    <View style={styles.hostView}>
                        <MaterialIcons style={{}} name="verified" size={40} color={incident.est_verifier ? Colors.blue : Colors.grey} />

                        <View >
                            <Text style={{ fontWeight: '500', fontSize: 16, fontFamily: 'mon-sb' }}>Crée par {(incident.auteur as any).nom ? (incident.auteur as any).nom + " " + (incident.auteur as any).prenom : '...'}
                            </Text>


                            <Text style={{}}>
                                <Text style={{ fontFamily: 'mon' }}>Incident</Text>
                                {incident.est_verifier ? <Text style={{ fontFamily: 'mon' }}> vérifié</Text>
                                    : <Text style={{ fontFamily: 'mon'}}> pas vérifié</Text>
                                }

                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.description}>{incident.description}</Text>

                </View>
            </ScrollView>

            {isLoggedIn && (
                <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(1000)}>
                    {(role === "ADMIN" || role === "MODERATEUR") && (

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
                            <Text style={{ fontFamily: 'mon-b', fontSize: 15 }}>Changer l'état de vérification ?</Text>
                            <ToggleSwitch
                                isOn={incident.est_verifier}
                                disabled={IsUpdated}
                                onColor={Colors.blue}
                                offColor={Colors.grey}
                                size="medium"
                                onToggle={toggleVerif}
                            />
                        </View>
                    )}

                    {(!hasUserVoted && role === "USER")&& (

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  }}>
                            <Text style={{ fontFamily: 'mon-b', fontSize: 15 }}>Trouvez-vous cet article utile/fiable ?</Text>
                            <TouchableOpacity style={{ paddingHorizontal: 2 }}
                                onPress={() => voteAction(1)}
                            >
                                <Entypo name="arrow-with-circle-down" size={40} color={Colors.red} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => voteAction(1)}
                                style={{ paddingHorizontal: 2 }}>
                                <Entypo name="arrow-with-circle-up" size={40} color={Colors.blue} />
                            </TouchableOpacity>
                        </View>

                    )}
                    {(hasUserVoted && (role === 'USER')) && (

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontFamily: 'mon-b', fontSize: 15 }}>Vous avez déja voter !</Text>
                        </View>

                    )}

                </Animated.View>
            )}

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        height: IMG_HEIGHT,
        width: "100%"
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'mon-sb',
    },
    dateCreation: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'mon-sb',
    },
    adress: {
        fontSize: 14,
        marginTop: 10,
        fontFamily: 'mon',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
    },
    host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
    },
    hostView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'mon',
        paddingBottom: 100,
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    roundBtn: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.grey,
    },
    activityIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%',
    },
});

export default DetailPage