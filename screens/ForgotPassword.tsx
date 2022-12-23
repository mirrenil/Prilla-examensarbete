import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { RootStackScreenProps } from "../types";
import { auth } from "../firebase";

function ForgotPassword({
  navigation,
}: RootStackScreenProps<"ForgotPassword">) {
  const [email, setEmail] = useState("");

  const resetPassword = async (email: string) => {
    try {
      const reset = await sendPasswordResetEmail(auth, email);
      Alert.alert("Återställningslänk skickad till din email");
      navigation.navigate("Signin");
    } catch (error) {
      Alert.alert("Ogiltig email");
    }
  };

  return (
    <View style={styles.screen}>
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
              <Text style={styles.text}>Forgot Password?</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={handleChange("email")}
                autoCapitalize="none"
                onBlur={handleBlur("email")}
              />
              {touched.email && errors.email && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.email}
                </Text>
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
    color: "#fff",
    backgroundColor: "#413C48",
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
  },
  text: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ForgotPassword;
