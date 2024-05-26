import { FlatList, ListRenderItem, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import * as Linking from 'expo-linking';
import { defaultStyles } from '@/constants/Styles';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { IncidentType } from '@/interfaces/incident.type';
import Colors from '@/constants/Colors';

const NumerosDurgences = () => {

    const numbers = [
        { institution: 'Police Nationale 1', number: '17' },
        { institution: 'Police Nationale 2', number: '1548' },
        { institution: 'Gendarmerie Nationale', number: '1055' },
        { institution: 'Protection Civile (Pompiers) 1', number: '1021' },
        { institution: 'Protection Civile (Pompiers) 2', number: '14' },
        { institution: 'SAMU (Aide médicale urgente)', number: '16' },
        { institution: 'Centre Antipoison', number: '021979898' },
        { institution: 'Eaux et Assainissement', number: '1594' },
        { institution: 'Gaz et électricité', number: '3303' },
    ];
    interface EmergencyNumber {
        institution: string;
        number: string;
      }
      
    const callNumber = (number: string) => {
        Linking.openURL(`tel:${number}`)
    }

    const renderRow:ListRenderItem<EmergencyNumber> = ({item  }) => {

        return (
            <TouchableOpacity
                style={styles.numbers}
                onPress={() => callNumber(item.number)}>
                <View>
                    <Text style={styles.text}>{item.institution}</Text>
                    <Text style={[styles.text,{fontFamily:'mon', fontSize : 14}]}>{item.number}</Text>
                </View>
                <Entypo name="phone" size={24} color={Colors.blanco} 
                style={{alignSelf:'center'}}
                />
                
            </TouchableOpacity>)
    }

return (
    <View style={[defaultStyles.container, { gap: 14, padding:14 }]}>
        <FlatList
            
            data={numbers}
            renderItem={renderRow}
        />
    </View>
)

}
export default NumerosDurgences

const styles = StyleSheet.create({
    numbers: {
        backgroundColor: Colors.grey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 14,
        marginVertical: 10


    },
    text: {
        fontSize: 18,
        fontFamily: 'mon-sb',
        color: Colors.blanco
    }
})