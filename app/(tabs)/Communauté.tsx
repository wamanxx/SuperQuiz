import React, { useRef, useState } from 'react';

import { View, Text, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native'

import { useUserContext } from '../../contexts/user.context';
import { supabase } from '@/lib/supabase';
import useSWR, { mutate } from 'swr';
import { Link } from 'expo-router';
import { IncidentType } from '@/interfaces/incident.type';
import { defaultStyles } from '@/constants/Styles';
import { FlatList } from 'react-native';
import { ListRenderItem } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import VoteRender from '@/components/VoteRender';
import Loading from '@/components/Loading';

// Ici

const Page = () => {

  const { isLoggedIn, user, profile, role } = useUserContext();
  const listRef = useRef<FlatList>(null)
 const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { data, isValidating, isLoading, error, mutate } = useSWR('incidents?extend=type_id&extend=auteur_id', async () => {
    const response = await supabase.from('incidents').select(
      `
      *,
      type: type_id (*),
      auteur: auteur_id(*)
      `
    ).order('created_at', { ascending: false });
    if (response.error) throw response.error;
    return response.data;
  })



  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (error || !data) {
    return (
      <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <AntDesign name="warning" size={40} color={Colors.red} />
        <Text style={{color: Colors.red, fontFamily:'mon-b'}} >Erreur de chargement</Text>
      </View>)

  }
  // !
  const incidents = data;



  const renderRow: ListRenderItem<IncidentType> = ({ item }) => {
    return (
      <Link href={`/listing/${item.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.listing}>
          <View>
                <Image onLoadEnd={() => setIsImageLoaded(true)} style={styles.image} source={{ uri: item.attachement![0] }}/>
                
                { !isImageLoaded && <ActivityIndicator style={styles.activityIndicator} size={'large'}color={Colors.grey}/>}
                </View>
      {/* <View>
            {
              item.attachement![0]
              ? <Image source={{ uri: item.attachement![0] }} style={styles.image} />
              : <ActivityIndicator color={'grey'} /> 
          }</View> */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'mon-sb', fontSize: 17, }}>{item.titre.length > 36 ?
                item.titre.slice(0, 36) + '...' : item.titre
              }</Text>


              <View style={{ flexDirection: 'row', gap: 5 }}>
                <FontAwesome5 name="arrow-alt-circle-up" size={20} color={'#000'} />
                <VoteRender type={1} incidentId={item.id} />
              </View>
            </View>

            <Text style={{ fontFamily: 'mon', }}>{
              item.description!.length > 50
                ? (<>{item.description!.slice(0, 60)}<Text style={{ color: Colors.grey, fontFamily: 'mon-b' }}> ... Lire la suite .</Text></>)
                : item.description!.slice(0, 50)


            }</Text>
            <View style={{ flexDirection: 'row', gap: 4 ,}}>
              <Text style={{ fontFamily: 'mon-b', color: Colors.red }}>{(item as any).type.nom}</Text>
            </View>
          </View>
          
        </TouchableOpacity>
        
      </Link>
    )
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isLoading || isValidating} onRefresh={async () => await mutate()} />
        }
        ref={listRef}
        data={incidents}
        renderItem={renderRow}
        extraData={mutate}
      />
    </SafeAreaView>


  )
}
const styles = StyleSheet.create({

  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 15,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },

})
export default Page