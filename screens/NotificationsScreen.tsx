import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { gradientDark, gradientLight } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function NotificationsScreen({
  navigation,
}: RootTabScreenProps<"Notifications">) {
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  return (
    <LinearGradient
      colors={
        isLight
          ? [gradientLight.from, gradientLight.to]
          : [gradientDark.from, gradientDark.to]
      }
      style={styles.container}
    >
      <Text>Notifications</Text>
      <View
        style={styles.separator}
        lightColor="#D3D3D3"
        darkColor="rgba(255,255,255,0.1)"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "OleoScript",
    fontStyle: "normal",
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFFD54",
  },
  slogan: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFD54",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
