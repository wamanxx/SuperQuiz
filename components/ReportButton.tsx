import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { useUserContext } from "@/contexts/user.context";



const ReportButton = () => {
  const { isLoggedIn } = useUserContext()

  return isLoggedIn ? (
    <Link href={"/report"} asChild>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.red,
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
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 50,
          justifyContent:"center",

        }}
      >
        <MaterialCommunityIcons name="alarm-light" size={24} color="white" />
        <Text
          style={{
            fontFamily: "mon-b",
            color: "white",
            fontSize: 15,
          }}
        >
          Signaler un incident
        </Text>
        <MaterialCommunityIcons name="alarm-light" size={24} color="white" />
      </TouchableOpacity>
    </Link>
  )
    : (
      <Link href={"/monCompte"} asChild>
        <TouchableOpacity
          style={{
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 15,
          }}
        >
          <Fontisto name="locked" size={24} color="white" />
          <Text
            style={{
              fontFamily: "mon-b",
              color: "white",
              fontSize: 15,
            }}
          >
            Connectez-vous pour signaler
          </Text>
            <Fontisto name="locked" size={24} color="white" />
        </TouchableOpacity>
      </Link>

    )
};

export default ReportButton;