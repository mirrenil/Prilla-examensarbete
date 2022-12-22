import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "./Themed";
import { Formik } from "formik";
import * as yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, addDoc, collection, Timestamp } from "firebase/firestore";

export default function Signup() {
  const collectionRef = collection(db, "users");
  const [newUser, setNewUser] = useState({
    email: "",
    displayName: "",
    password: "",
  });

  const addUser = async (email: string, displayName: string, id: string) => {
    await setDoc(doc(db, "users", id), {
      email: email,
      displayName: displayName,
    });
  };

  const signup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      await addDoc(collectionRef, {
        email: newUser.email,
        displayName: newUser.displayName,
        userID: user.user.uid,
        createdAt: Timestamp.now().toDate(),
        photo: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Formik
        initialValues={newUser}
        onSubmit={(values) => {}}
        validationSchema={yup.object().shape({
          name: yup.string().required("Please, provide a displayName!"),
          email: yup.string().email().required("Please, provide an email!"),
          password: yup
            .string()
            .min(6, "Password should be of minimum 6 characters length")
            .required(),
          // passwordConfirmation: yup
          //   .string()
          //   .oneOf([yup.ref("password"), null], "Passwords must match"),
        })}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => {
          const { email, displayName, password } = values;

          useEffect(() => {
            setNewUser({
              email: email,
              displayName: displayName,
              password: password,
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

              {/* <TextInput
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
              )} */}

              <TouchableOpacity
                style={styles.button}
                onPress={() => signup()}
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
