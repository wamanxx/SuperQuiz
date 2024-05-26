import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeIn, SlideInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import Colors from '@/constants/Colors'
import instructions from '@/app/(modals)/instructions'

interface Instruction {
    beforeColon: string;
    afterColon: string;
}

interface InstructionGroup {
    id: number;
    name: string;
    instructions: Instruction[];
}
interface ListItemProps {
    item: InstructionGroup;
}

const ListItem: React.FC<ListItemProps> = ({ item }) => {
    const [expanded, setExpanded] = useState(false)
    const onItemPressed = () => {
        setExpanded(!expanded)
    }
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPress={() => onItemPressed()}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ flex: 10, color: Colors.grey, fontFamily: 'mon-b' }}>{item.name}</Text>
                    <Ionicons
                        style={{ flex: 1, transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
                        name="chevron-forward"
                        size={24}
                        color="black"
                    /></View>
            </TouchableWithoutFeedback>
            {expanded &&
            <Animated.View 
            entering={FadeIn.delay(100)}
            style={{

                borderRadius: 10, backgroundColor: "#e9e9e9",
                padding: 18,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',

            }}>
                     {item.instructions.map((instruction, index) => (
                        <Animated.View key={index}>
                        <Text
                         style={{ color: '#888', fontFamily: 'mon-b',  }}>
                            {"• "+instruction.beforeColon + " :"}
                        </Text>
                        <Text
                     style={{ color: '#888', fontFamily: 'mon' }}>
                            {instruction.afterColon }
                        </Text></Animated.View>))}
            </Animated.View>
                }

        </View>
    )
}

export default ListItem

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 17,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        gap: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    }
})