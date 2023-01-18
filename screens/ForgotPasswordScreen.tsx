import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Text, View, TextInput } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { auth } from "../firebase";
import { LinearGradient } from "expo-linear-gradient";
import { gradientLight, gradientDark } from "../constants/Colors";

function ForgotPasswordScreen({
  navigation,
}: RootStackScreenProps<"ForgotPassword">) {
  const [email, setEmail] = useState("");
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  const resetPassword = async (email: string) => {
    try {
      const reset = await sendPasswordResetEmail(auth, email);
      Haptics.NotificationFeedbackType.Success;
      Alert.alert("Återställningslänk skickad till din email");
      navigation.navigate("Signin");
    } catch (error) {
      Alert.alert("Ogiltig email");
    }
  };

  return (
    <LinearGradient
      colors={
        isLight
          ? [gradientLight.from, gradientLight.to]
          : [gradientDark.from, gradientDark.to]
      }
      style={styles.screen}
    >
      <Text style={styles.title}>Prilla</Text>
      <Text style={styles.slogan}>GOTTA SNUS THEM ALL</Text>
      <View
        style={styles.separator}
        lightColor="#D3D3D3"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => {}}
        validationSchema={yup.object().shape({
          email: yup.string().email().required("Please, provide an email!"),
        })}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => {
          const { email } = values;
          useEffect(() => {
            setEmail(values.email);
          }, [email]);

          return (
            <View style={styles.container}>
              <Text style={styles.text} lightColor="#333" darkColor="#fff">
                För att återställa ditt lösenord behöver vi din email
              </Text>
              <TextInput
                lightColor="#fff"
                darkColor="#413C48"
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={handleChange("email")}
                autoCapitalize="none"
                onBlur={handleBlur("email")}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => resetPassword(email)}
              >
                <Text style={styles.buttonText}>Skicka email</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>
    </LinearGradient>
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
    width: "70%",
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
    border: "1px solid #333",
  },
  button: {
    backgroundColor: "#FFFD54",
    padding: 15,
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
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  error: {
    fontSize: 12,
    color: "#BF0404",
    fontWeight: "bold",
    margin: 7,
  },
});

export default ForgotPasswordScreen;
