import React, { useState } from "react";
import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";

const ageOptions: RadioButtonProps[] = [
  {
    id: "1",
    label: "Jag är över 18 år",
    value: "Över 18 år",
  },
  {
    id: "2",
    label: "Jag är inte över 18 år",
    value: "Under 18 år",
  },
];

function AgeCheckScreen({ navigation }: RootStackScreenProps<"AgeCheck">) {
  const [radioButtons, setRadioButtons] =
    useState<RadioButtonProps[]>(ageOptions);

  const onPressRadioButton = (ageOption: RadioButtonProps[]) => {
    setRadioButtons(ageOption);
  };

  const checkAge = (ageOption: RadioButtonProps[]) => {
    if (ageOption[0].selected) {
      try {
        navigation.navigate("Signup");
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("Tyvärr är du inte gammal nog för att använda Prilla");
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Prilla</Text>
      <Text style={styles.slogan}>GOTTA SNUS THEM ALL</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.container}>
        <Text style={styles.text} lightColor="#fff" darkColor="#fff">
          För att använda Prilla behöver du vara 18 år eller äldre.
        </Text>

        <RadioGroup radioButtons={ageOptions} onPress={onPressRadioButton} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => checkAge(ageOptions)}
        >
          <Text style={styles.buttonText}>Validera ålder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  container: {
    alignItems: "center",
    marginBottom: 50,
    width: "65%",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "60%",
  },
  input: {
    fontSize: 17,
    height: 50,
    width: 300,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#FFFD54",
    padding: 10,
    borderRadius: 6,
    width: 300,
    height: 50,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#201A28",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 5,
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
  text: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    fontSize: 10,
    color: "red",
    margin: 5,
  },
});

export default AgeCheckScreen;
