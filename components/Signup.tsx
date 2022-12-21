import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "./Themed";
import { Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [newUser, setNewUser] = useState({
    email: "",
    displayName: "",
    password: "",
    passwordConfirmation: "",
  });
  const { signup } = useAuth();

  const handleSignup = async () => {
    console.log(newUser, "hello");
    if (newUser.password !== newUser.passwordConfirmation) {
      Alert.alert("Passwords do not match");
    }
    try {
      await signup(newUser.email, newUser.password, newUser.displayName);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Formik
        initialValues={newUser}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            setNewUser(values);
            console.log(newUser, "in formik");
            handleSignup();
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required("Please, provide a displayName!"),
          email: yup.string().email().required("Please, provide an email!"),
          password: yup
            .string()
            .min(6, "Password should be of minimum 6 characters length")
            .required(),
          passwordConfirmation: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        })}
      >
        {({
          values,
          handleChange,
          errors,
          touched,
          handleBlur,
          handleSubmit,
        }) => {
          const { email, displayName, password, passwordConfirmation } = values;
          return (
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={displayName}
                onChangeText={handleChange("displayName")}
                onBlur={handleBlur("displayName")}
                autoCapitalize="none"
              />
              {touched.displayName && errors.displayName && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.displayName}
                </Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={handleChange("email")}
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.email}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={handleChange("password")}
                autoCapitalize="none"
                onBlur={handleBlur("password")}
              />
              {touched.password && errors.password && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.password}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={passwordConfirmation}
                onChangeText={handleChange("passwordConfirmation")}
                autoCapitalize="none"
                onBlur={handleBlur("passwordConfirmation")}
              />
              {touched.passwordConfirmation && errors.passwordConfirmation && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.passwordConfirmation}
                </Text>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleSubmit();
                  console.log(values);
                }}
                disabled={!values.email || !values.password}
              >
                <Text style={styles.buttonText}>Registrera dig</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 50,
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
    marginTop: 10,
  },
  buttonText: {
    color: "#201A28",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
});
