import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { Formik } from "formik";
import * as yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { auth, db } from "../firebase";
import { collection, Timestamp } from "firebase/firestore";
import { setOneDoc } from "../helper";
import { RootStackScreenProps } from "../types";
import { useDispatch, useSelector } from "react-redux";

export default function Signup({ navigation }: RootStackScreenProps<"Signup">) {
  const [newUser, setNewUser] = useState({
    email: "",
    displayName: "",
    password: "",
    passwordConfirmation: "",
  });
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state);

  const addUserToDb = async () => {
    const user = {
      email: newUser.email,
      displayName: newUser.displayName,
      userID: auth.currentUser?.uid,
      createdAt: Timestamp.now().toDate(),
      photo: "",
    };
    setOneDoc("users", auth.currentUser?.uid, user);
  };
  const signup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      ).then(() => {
        if (auth.currentUser) {
          updateProfile(auth.currentUser, { displayName: newUser.displayName });
        }
      });
      addUserToDb();
      Alert.alert("Registrering lyckades!");
      navigation.navigate("Signin");
    } catch (error) {
      Alert.alert("Denna användare finns redan registrerad");
    }
  };

  const isValid = () => {
    if (newUser.password !== newUser.passwordConfirmation) {
      Alert.alert("Lösenorden matchar inte");
    } else {
      signup();
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

      <Formik
        initialValues={newUser}
        onSubmit={(values) => {}}
        validationSchema={yup.object().shape({
          displayName: yup.string().required("Please, provide a displayName!"),
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
        {({ values, errors, touched, handleBlur, handleChange }) => {
          const { email, displayName, password, passwordConfirmation } = values;

          useEffect(() => {
            setNewUser({
              email: email,
              displayName: displayName,
              password: password,
              passwordConfirmation: passwordConfirmation,
            });
          }, [email, displayName, password]);

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
                onPress={() => isValid()}
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
  screen: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
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
    width: "60%",
  },
});
