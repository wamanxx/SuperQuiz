import { View, Text } from 'react-native'
import React from 'react'
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet } from 'react-native';
const INITIAL_REGION = {
  latitude: 35.69906,
  longitude: -0.63588,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';
import { router } from 'expo-router';
import { IncidentType } from '@/interfaces/incident.type';
import Loading from './Loading';
import { ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

const Page = () => {


  //
  const onMarkerSelected = (item: IncidentType) => {
    router.push(`listing/${item.id}` as any)
  };
  //

  //Appel à la bdd
  const { data, isLoading, error } = useSWR('incidents', async () => {
    const response = await supabase.from('incidents').select('*');
    if (response.error) throw response.error;
    return response.data;
  })

  if (isLoading) {
    return (

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error, Failed loading num_urgences.</Text>
      </View>)

  }
  const incidents = data;
  //


  return (
    <View style={{ height: "100%", backgroundColor: 'red' }}>
      <MapView initialRegion={INITIAL_REGION} style={{ flex: 1 ,}} provider={PROVIDER_DEFAULT}
        showsMyLocationButton={false}
        clusterColor={Colors.red}
        clusterFontFamily	= 'mon-b'
      >

        {incidents.map((item) => {
          return <Marker
            style={{}}
            key={`incidents/${item.id}`} onPress={() => onMarkerSelected(item)} coordinate={{ latitude: item.latitude, longitude: item.longitude }}>
            <View style={styles.marker}>
              <Text style={styles.markerStyle}>1</Text>
            </View>
          </Marker>
        })}

      </MapView>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 12,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10
    }
  },
  markerStyle: {
    fontSize: 16,
    fontFamily: 'mon-b',
    color:"white"
  }
})