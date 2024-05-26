import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { defaultStyles } from '@/constants/Styles'
import ListItem from '@/components/ListItem'
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


const groupeiInstruction: InstructionGroup[] = [
  {
    id: 0,
    name: "En cas de crime, vol, agression ou situation de danger immédiat.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 17 pour signaler l'incident.\n"
      },
      {
        beforeColon: "Fournir des informations claires",
        afterColon: "Donnez des détails sur l'incident, l'emplacement exact, et une description des suspects si possible.\n"
      },
      {
        beforeColon: "Ne pas intervenir",
        afterColon: "Évitez de vous mettre en danger en essayant de confronter les criminels.\n"
      },
      {
        beforeColon: "Rester à l'abri",
        afterColon: "Attendez les forces de l'ordre dans un endroit sûr."
      }
    ]
  },
  {
    id: 1,
    name: "Incidents en zones rurales, routes ou nécessitant une intervention militaire.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 1055.\n"
      },
      {
        beforeColon: "Fournir des détails précis",
        afterColon: "Localisation exacte, nature de l'incident, et toute information pertinente.\n"
      },
      {
        beforeColon: "Suivre les instructions",
        afterColon: "Les opérateurs peuvent donner des consignes spécifiques en fonction de la situation."
      }
    ]
  },
  {
    id: 2,
    name: "Incendies, accidents de la route, inondations, secours en milieu dangereux.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 14 pour signaler un incendie ou le 1021 pour d'autres urgences de protection civile.\n"
      },
      {
        beforeColon: "Décrire l'incident",
        afterColon: "Nature de l'incident, localisation exacte, présence de victimes.\n"
      },
      {
        beforeColon: "Évacuer si nécessaire",
        afterColon: "Quittez les lieux si l'endroit est dangereux.\n"
      },
      {
        beforeColon: "Assister les victimes",
        afterColon: "Si vous avez une formation de premiers secours, aidez les victimes jusqu'à l'arrivée des secours."
      }
    ]
  },
  {
    id: 3,
    name: "Urgences médicales graves, comme les crises cardiaques, accidents graves, empoisonnements.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 16.\n"
      },
      {
        beforeColon: "Décrire l'urgence",
        afterColon: "Symptômes, état de la victime, et antécédents médicaux si connus.\n"
      },
      {
        beforeColon: "Suivre les instructions",
        afterColon: "Les opérateurs peuvent guider sur les premiers secours à administrer.\n"
      },
      {
        beforeColon: "Ne pas déplacer la victime",
        afterColon: "Sauf en cas de danger immédiat (comme un incendie)."
      }
    ]
  },
  {
    id: 4,
    name: "Intoxications, empoisonnements, ingestion de substances dangereuses.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 021 97 98 98.\n"
      },
      {
        beforeColon: "Fournir des informations détaillées",
        afterColon: "Substance ingérée, quantité, symptômes observés.\n"
      },
      {
        beforeColon: "Suivre les consignes",
        afterColon: "Les opérateurs peuvent donner des instructions spécifiques pour neutraliser le poison.\n"
      },
      {
        beforeColon: "Ne pas induire de vomissements",
        afterColon: "Sauf indication contraire par les professionnels."
      }
    ]
  },
  {
    id: 5,
    name: "Fuites d'eau, problèmes de drainage, inondations mineures.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 1594.\n"
      },
      {
        beforeColon: "Décrire le problème",
        afterColon: "Localisation exacte, nature de la fuite ou du problème.\n"
      },
      {
        beforeColon: "Éviter l'utilisation de l'eau",
        afterColon: "Jusqu'à la résolution du problème, minimisez l'utilisation de l'eau."
      }
    ]
  },
  {
    id: 6,
    name: "Fuites de gaz, pannes électriques, risques d'incendie liés à l'électricité.",
    instructions: [
      {
        beforeColon: "Appeler immédiatement",
        afterColon: "Composez le 3303.\n"
      },
      {
        beforeColon: "Évacuer en cas de fuite de gaz",
        afterColon: "Quittez les lieux immédiatement et n'utilisez pas d'appareils électriques.\n"
      },
      {
        beforeColon: "Couper l'électricité",
        afterColon: "Si possible, coupez l'électricité depuis le disjoncteur principal en cas de problème électrique grave.\n"
      },
      {
        beforeColon: "Informer les voisins",
        afterColon: "Alertez les voisins si le problème peut les affecter."
      }
    ]
  }
];


const renderItem = ({item }: { item: InstructionGroup })=>{
  return <ListItem item={item}/>
}



const instructions = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
      data={groupeiInstruction}
      renderItem={renderItem}
      />
    </SafeAreaView>
  )
}

export default instructions

const styles = StyleSheet.create({

    container:{
      backgroundColor:'white',
      padding:15,
      flex:1,
      gap:14,

    }
})