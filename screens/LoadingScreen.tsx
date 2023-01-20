import { StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { gradientDark, gradientLight } from "../constants/Colors";
import React, { useEffect } from "react";

export default function LoadingScreen({
  navigation,
}: RootStackScreenProps<"Loading">) {
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const [loaded] = useFonts({
    OleoScript: require("../assets/fonts/OleoScript-Regular.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Signin");
    }, 2000);
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <LinearGradient
      colors={
        isLight
          ? [gradientLight.from, gradientLight.to]
          : [gradientDark.from, gradientDark.to]
      }
      style={styles.container}
    >
      <Text style={styles.title}>Prilla</Text>
      <Text style={styles.slogan}>GOTTA SNUS THEM ALL</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="#eee" />
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

  button: {
    backgroundColor: "#FFFD54",
    padding: 10,
    borderRadius: 6,
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  buttonText: {
    color: "#201A28",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 5,
  },
});
