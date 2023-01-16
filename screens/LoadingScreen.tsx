import { StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { useFonts } from "expo-font";

export default function LoadingScreen({
  navigation,
}: RootStackScreenProps<"Loading">) {
  const [loaded] = useFonts({
    OleoScript: require("../assets/fonts/OleoScript-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prilla</Text>
      <Text style={styles.slogan}>GOTTA SNUS THEM ALL</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="#eee" />
    </View>
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
