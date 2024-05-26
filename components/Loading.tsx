import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { defaultStyles } from '@/constants/Styles'
import Animated, { FadeOut } from 'react-native-reanimated'
import { ActivityIndicator } from 'react-native'
import Colors from '@/constants/Colors'
const Loading = () => {
    return (

        <Animated.View exiting={FadeOut.delay(200)} style={[defaultStyles.container,{
            flexDirection:'column',
            alignItems:'center',
            justifyContent : 'center',
            gap:20
        }]}>
            <Text style={{
                fontFamily: 'mon-b', color:Colors.blue
              
            }}>En cours de chargment ...</Text>
            <ActivityIndicator
                size="large" color={Colors.blue}
            />
            <Text style={{
                fontFamily: 'mon', color:Colors.grey
              
            }}>Merci de patienter</Text>
        </Animated.View>
    )
}

export default Loading

const styles = StyleSheet.create({
    
})