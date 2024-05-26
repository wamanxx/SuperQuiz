import { View, Text, FlatList, ListRenderItem } from 'react-native'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { defaultStyles } from '@/constants/Styles'
import { Link } from 'expo-router';


interface Props{
    listings: any[];
}

const Listings = ({listings: items} : Props) => {
    const listRef = useRef<FlatList>(null)

    

    return (
        <View style={defaultStyles.container}>
           
        </View>
    )
}

export default Listings