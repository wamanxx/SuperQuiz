import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import * as ImagePicker from "expo-image-picker"
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { useReport } from '@/contexts/report.context';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import { useUserContext } from '@/contexts/user.context';
import { Button } from 'react-native-elements';
import { useRouter } from 'expo-router';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';

const importPic = () => {
    const { image, setImage } = useReport();
    const { user } = useUserContext()
    const saveImage = async (image: string) => {
        try {
            setImage(image)

        } catch (error) {
            throw error
        }
    }
    const uploadImage = async () => {
        try {
            await ImagePicker
            ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                aspect: [1, 1],
                quality: 0.8,
            })
            if (!result.canceled) {

                if (!result.canceled) {
                    await saveImage(result.assets[0].uri);
                }
            }
        } catch (error) {
            alert("Erreur lors de l'import")
            router.back()
        }
    }

    const uploadImageFromGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 3],
                quality: 0.8,
            })
            if (!result.canceled) {
                await saveImage(result.assets[0].uri);
            }
        } catch (error) {
            alert("Erreur lors de l'import")
            router.back()
        }
    }


    const removeImage = async () => {
        try {
            setImage(null)
        } catch (error) {
            throw error
        }
    }
    return (
        <View style={[defaultStyles.container, { padding: 24,  }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.btn} onPress={() => uploadImage()}>
                    <FontAwesome name="camera" size={24} color="black" />
                    <Text style={{ fontFamily: 'mon-sb', color: 'black', fontSize: 15 }}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => uploadImageFromGallery()}>
                    <AntDesign name="picture" size={24} color="black" />
                    <Text style={{ fontFamily: 'mon-sb', color: 'black', fontSize: 15 }}>Gallerie</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => { removeImage() }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderStyle: 'solid',
                    borderRadius: 10,
                    height: 44,
                    marginVertical: 14,
                }}>
                <Text style={{ fontFamily: 'mon-sb', color: 'black', fontSize: 15 }}>Supprimer</Text>
                <FontAwesome name="trash" size={24} color="black" />
            </TouchableOpacity>
            <View style={[styles.seperatorView]}>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} />

                <Text style={[styles.seperator]}>Image</Text>
                <View style={{
                    borderBottomColor: '#000',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    flex: 1
                }} /></View>
            {image
                ? <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut.delay(100)} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, }} >
                    <Image source={{ uri: image }} style={{ width: 300, aspectRatio: 1, borderRadius: 10 }} />
                    <Text style={{ fontFamily: 'mon-sb', color: Colors.grey, fontSize: 15, textAlign: 'center' }}>Image importée</Text>
                </Animated.View>
                : <Animated.Text entering={FadeIn.delay(100)} exiting={FadeOut.delay(100)}
                    style={{ fontFamily: 'mon-sb', color: Colors.grey, fontSize: 15, textAlign: 'center' }}>Aucune image importée</Animated.Text>
            }
        
            <TouchableOpacity
            style={[styles.importBtn, {
                position:'absolute',
                    bottom: 24,
                    marginBottom: 10,
                    alignSelf:'center',
                    width:'100%'
                 
                }]}
            onPress={() => { router.back() }}
                
            >
                <FontAwesome name="check" size={24} color="white"  />
                <Text
                    style={{ fontFamily: 'mon-b', color: 'white', fontSize: 14, }}
                >Terminer</Text>
            </TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 10,
        width: 150,
        height: 150,
        borderColor: Colors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderStyle: 'dashed'
    }
    ,

    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        borderColor: Colors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderRadius: 10,

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
})

export default importPic