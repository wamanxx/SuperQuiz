import { View, Text, TextInput, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import useSWR from 'swr'
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReport } from '@/contexts/report.context';
import * as FileSystem from 'expo-file-system';
import { useUserContext } from '@/contexts/user.context'
import * as Location from 'expo-location';
import { useEffect } from 'react'
import { LocationObject } from 'expo-location'
import { decode } from 'base64-arraybuffer';

import { mutate } from "swr";
import Loading from '@/components/Loading'
import { Alert } from 'react-native'


const report = () => {
    const [IsReportBeingInserted, setIsReportBeingInserted] = useState(false)
    const { image, setImage, heure, setHeure, date, setDate, type, setType, title, setTitle, description, setDescription } = useReport();
    const { user, role } = useUserContext()
    const { data, isLoading, error } = useSWR('incident_types', async () => {
        const response = await supabase.from('incident_types').select('*');
        if (response.error) throw response.error;
        return response.data;
    })


    //partie Location
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            // console.log("la loc est : ", location)
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    // fin




    if (isLoading) {
        return (
            <Loading />
        )
    }

    if (error || !data) {
        return (
            <View>
                <Text>Erreur de chargement</Text>
            </View>)

    }
    const incidents = data;
    const reportClick = async () => {
        setIsReportBeingInserted(true);
        console.log('Boolean value == ', !!(image && heure && date && type && title && description && location))


        const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        const filePath = `${user!.id}/${new Date().getTime()}`;
        const uploadedImage = await supabase.storage.from('incidents_attachments').upload(filePath, decode(base64));

        if (uploadedImage.error) {
            console.log("[image-upload-error]:", uploadedImage);
        }

        const uploadedImagePath = uploadedImage.data?.path;

        const uploadedImageUrlRequest = supabase
            .storage
            // le bucket
            .from('incidents_attachments')
            // le path
            .getPublicUrl(uploadedImagePath || "");
        const uploadedImageUrl = uploadedImageUrlRequest.data.publicUrl;

        const { error, data } = await supabase
            .from('incidents')
            .insert({
                auteur_id: user!.id,
                titre: title,
                description: description,
                type_id: type,
                created_at: date,
                est_verifier: false,
                // ici au lieu d'utiliser image tu utilises uploadedImageUrl
                attachement: [uploadedImageUrl],
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
            } as any)
            .select("*");

        console.log("[error]:", error);

        setIsReportBeingInserted(false);

        if (!error) {
            const newIncident = data[0];
            await mutate("incidents", (oldIncidents: any) => {
                return [newIncident, ...oldIncidents]
            })
        }

        router.back();

    }
    const formIsFull = !!(image && heure && date && type && title && description && location)
    //
    return (
        <View style={[styles.container, { gap: 15 }]}>

            <Text style={{ fontFamily: 'mon-sb', color: Colors.grey }}>Titre</Text>
            <TextInput
                onChangeText={(text) => setTitle(text)}
                placeholder='Saisissez un titre' style={[defaultStyles.inputField, { height: 44, fontFamily: 'mon-sb' }]} placeholderTextColor={Colors.grey} />

            <Text style={{ fontFamily: 'mon-sb', color: Colors.grey }} >Description</Text>

            <TextInput
                onChangeText={(text) => setDescription(text)}
                placeholder='Saisissez une description' style={[defaultStyles.inputField, { height: 60, fontFamily: 'mon-sb' }]} placeholderTextColor={Colors.grey} />
            <TouchableOpacity
                disabled={false}

                onPress={() => {
                    formIsFull ? reportClick() : Alert.alert(
                        `Incident incomplet`,
                        `Veuillez remplir tout les champs`,
                        [
                            { text: 'OK', onPress: () => console.log('OK appuyé') }
                        ],
                        { cancelable: false }
                    );
                }}

                style={[styles.reportBtn, { alignSelf: 'center', position: 'absolute', bottom: 40 }]}

            >
                {
                    IsReportBeingInserted
                        ? (
                            <>
                                <ActivityIndicator color={'white'} />
                                <Text style={{ fontFamily: 'mon-b', color: 'white', fontSize: 17 }}> Report en cours </Text>
                            </>
                        )
                        : <Text style={{ fontFamily: 'mon-b', color: 'white', fontSize: 17 }}> Signaler et finir </Text>
                }
            </TouchableOpacity>
            <View style={[styles.seperatorView]}>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} />

                <Text style={[styles.seperator]}>Type et date</Text>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} /></View>
            <View >
                <RNPickerSelect
                    style={pickerSelectStyless}
                    placeholder={{ label: "Spécifiez le type d'incident", value: null }}

                    onValueChange={(value) => setType(value)}
                    items={
                        incidents.map((item) => {
                            return { label: item.nom, value: item.id };
                        })
                    }
                />

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={styles.dh}>

                    <Text style={{ fontFamily: 'mon-sb', color: Colors.grey }}>Date et heure :</Text>
                    <DateTimePicker value={date}
                        maximumDate={new Date()}
                        onChange={(event) => setDate(new Date(event.nativeEvent.timestamp))}
                        style={styles.dateTimePicker} mode='datetime' />
                </View>

            </View>

            <View style={[styles.seperatorView]}>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} />

                <Text style={[styles.seperator]}>Multimédia</Text>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} /></View>

            <TouchableOpacity
                style={[styles.importBtn, {}]}
                onPress={() => router.push('/(modals)/importPic')}
            >
                <FontAwesome name="camera" size={21} color="white" />
                <Text style={{ fontFamily: 'mon-b', color: 'white', fontSize: 14 }}>{image ? '1 élément importé' : 'Importer/Prendre image'}</Text>
            </TouchableOpacity>
            <View style={[styles.seperatorView]}>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} />

                <Text style={[styles.seperator]}>Position</Text>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} /></View>
            <TouchableOpacity
                style={[styles.importBtn, { backgroundColor: location ? '#12b82b' : 'grey' }, { borderRadius: 0, }]}
                disabled={true}
            >
                {location
                    ?
                    <>
                        <FontAwesome6 name="location-crosshairs" size={21} color="white" />
                        <Text style={{ fontFamily: 'mon-b', color: 'white', fontSize: 14 }}>Position actuelle sélectionné</Text>
                    </>
                    :
                    <>
                        <ActivityIndicator color={"white"} size={'small'} />
                        <Text style={{ fontFamily: 'mon-b', color: 'white', fontSize: 14 }}>Sélection de la position ...</Text>
                    </>
                }
            </TouchableOpacity>
            <Text style={{ fontFamily: 'mon-l', color: 'grey' }}>*La position sélectionnée est votre position actuelle </Text>
        </View>
    )
}
const pickerSelectStyless = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ABABAB',
        borderRadius: 10,
        color: Colors.grey,
        paddingRight: 30, // to ensure the text is never behind the icon
        fontFamily: 'mon-sb'

    },
    inputAndroid: {
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ABABAB',
        borderRadius: 10,
        color: 'grey',
        paddingRight: 30, // to ensure the text is never behind the icon
        fontFamily: 'mon-sb'

    }
});

const styles = StyleSheet.create({
    dateTimePicker: {

        height: 40



    },
    dh: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 26,
    },

    reportBtn: {
        backgroundColor: Colors.red,
        borderRadius: 10,
        padding: 13,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 50,

    },
    importBtn: {
        backgroundColor: Colors.grey,
        borderRadius: 10,
        padding: 13,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,

        flexDirection: 'row',

    },
    image: {
        borderRadius: 10,
        width: 150,
        height: 150,
        borderColor: Colors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderStyle: 'dashed'

    }
    , seperatorView: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginVertical: 5

    },
    seperator: {
        fontFamily: 'mon-b',
        color: Colors.grey,

    },

})

export default report
