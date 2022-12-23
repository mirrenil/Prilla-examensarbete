import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { Formik } from "formik";
import * as yup from "yup";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "@firebase/auth";
import { auth } from "../firebase";
import { RootStackScreenProps } from "../types";

export default function Sigin({ navigation }: RootStackScreenProps<"Signin">) {
  const [currentUser, setcurrentUser] = useState<User>();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubrcribe = onAuthStateChanged(auth, (user) => {
      setcurrentUser(user as User);
    });
    return unsubrcribe;
  }, [auth, onAuthStateChanged]);

  const login = async () => {
    try {
      const x = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      if (auth.currentUser) {
        setcurrentUser(auth.currentUser);
        navigation.navigate("Root");
      } else {
        setcurrentUser(undefined);
      }
    } catch (error) {
      Alert.alert("Wrong email or password");
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
        initialValues={user}
        onSubmit={(values) => {}}
        validationSchema={yup.object().shape({
          email: yup.string().email().required("Please, provide an email!"),
          password: yup
            .string()
            .min(6, "Password should be of minimum 6 characters length")
            .required(),
        })}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => {
          const { email, password } = values;

          useEffect(() => {
            setUser({
              email: email,
              password: password,
            });
          }, [email, password]);

          return (
            <View style={styles.container}>
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

              {/* TODO: Add reset password */}
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.text}>Glömt lösenord?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => login()}
                disabled={!values.email || !values.password}
              >
                <Text style={styles.buttonText}>Logga in</Text>
              </TouchableOpacity>

              {/* TODO: Add navigation */}
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.text}>
                  Har du inget konto än? Skapa ett här!
                </Text>
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
    textAlign: "center",
    fontSize: 17,
    marginTop: 10,
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
