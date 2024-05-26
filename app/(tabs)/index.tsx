import { View, Text } from 'react-native'
import React from 'react'
import ListingsMap from '@/components/ListingsMap'
import ReportButton from '@/components/ReportButton'
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInUp,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

const Page = () => {

  return (
    <View>
      <ListingsMap />
      <Animated.View entering={SlideInLeft.delay(1000)}style={{
        
        position: 'absolute',
        bottom: 15,
        marginBottom:10,
  
        alignSelf:'center'
      }} >
        <ReportButton/>
      </Animated.View>

    </View>
  )
}

export default Page