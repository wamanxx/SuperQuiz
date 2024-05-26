import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading'
import { defaultStyles } from '@/constants/Styles';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Feather, FontAwesome5, FontAwesome6, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
interface NumerosUrgence {
  [service: string]: string;
}

const numerosUrgenceAlgerie: NumerosUrgence = {
  Police: '17',
  Pompiers: '14',
  SAMU: '15',
  'Gendarmerie nationale': '1055',
  'Sécurité routière': '1548',
  'Numéro vert anti-drogue': '11-41',
  'Numéro vert anti-corruption': '16-16',
  'Numéro vert pour les enfants disparus': '116-000',
  'Protection civile': '14',
  'Pharmacie de garde': '1737',
  'Electricité et gaz': '32-24',
  'Algérie Télécom': '12',
  'Sonelgaz': '33-03',
  'Algérie Poste': '15-05',
  'Eau et Assainissement': '1594',
};

const Aide = () => {
  
  return (

    <SafeAreaView style={[defaultStyles.container, { flexDirection: 'column', padding: 24, gap: 24 }]}>

      <TouchableOpacity 
      onPress={()=>router.push('/(modals)/NumerosDurgences')}
      style={[styles.card, { backgroundColor: Colors.red, }]}>

        <Text style={styles.cardText}>Numéros d'urgence</Text>
        <MaterialCommunityIcons  style={styles.cardIcons} name="phone-alert" size={170} color={'white'} />
        <Feather style={styles.arrow} name="arrow-right" size={40} color={Colors.blanco} />

      </TouchableOpacity >
      <TouchableOpacity 
      onPress={()=>router.push('/(modals)/instructions')}
      style={[styles.card, { backgroundColor: Colors.blue }]}>
        <Text style={styles.cardText}>Instructions en cas d'incident</Text>

        <Fontisto  style={styles.cardIcons} name="direction-sign" size={170} color="white" />

        <Feather  style={styles.arrow}  name="arrow-right" size={40} color={Colors.blanco} />

      </TouchableOpacity>
      
      <TouchableOpacity 
      onPress={()=>router.push('/(modals)/monCompte')}
      style={[styles.card, { backgroundColor: Colors.grey }]}>
        <Text style={styles.cardText}>Mon compte</Text>

        <Feather   style={styles.arrow} name="arrow-right" size={40} color={Colors.blanco} />
        <MaterialIcons style={styles.cardIcons} name="account-circle" size={170} color={Colors.blanco} />
      </TouchableOpacity>
    </SafeAreaView>


  )
}

export default Aide

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    flex: 1,
    padding: 14,
    overflow:'hidden',

  },
  cardText: {
    fontFamily: 'mon-b',
    fontSize: 25,
    color: Colors.blanco
  },
  cardIcons:{
    position: 'absolute',
    right:-25,
    bottom:-42,
    opacity:.8
  },
  arrow:{
    
        
  }
})