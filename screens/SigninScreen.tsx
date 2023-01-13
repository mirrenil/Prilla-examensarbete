import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text, View, TextInput } from "../components/Themed";
import { Formik } from "formik";
import * as yup from "yup";
import * as Haptics from "expo-haptics";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
} from "@firebase/auth";
import { RootStackScreenProps } from "../types";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../redux/signin";
import { LinearGradient } from "expo-linear-gradient";
import { gradientDark, gradientLight } from "../constants/Colors";

export default function Signin({ navigation }: RootStackScreenProps<"Signin">) {
  const [currentUser, setcurrentUser] = useState<User>();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  useEffect(() => {
    const unsubrcribe = onAuthStateChanged(auth, (user) => {
      setcurrentUser(user as User);
    });
    return unsubrcribe;
  }, [auth, onAuthStateChanged]);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password).then(
        (result: UserCredential) => {
          dispatch(
            setActiveUser({
              reduxEmail: result.user?.email,
              currentUser: currentUser,
            })
          );
        }
      );

      navigation.navigate("Root");
    } catch (error) {
      Haptics.NotificationFeedbackType.Error;
      Alert.alert("Felaktig email eller lösenord");
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
        initialValues={user}
        onSubmit={(values) => {}}
        validationSchema={yup.object().shape({
          email: yup.string().email().required("Please, provide an email!"),
          password: yup
            .string()
            .min(6, "Password should be of minimum 6 characters length")
            .required("Please, provide a password!"),
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
              {touched.email &&
                errors.email &&
                (Haptics.NotificationFeedbackType.Error,
                (<Text style={styles.error}>{errors.email}</Text>))}
              <TextInput
                lightColor="#fff"
                darkColor="#413C48"
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={handleChange("email")}
                autoCapitalize="none"
                onBlur={handleBlur("email")}
              />
              {touched.password &&
                errors.password &&
                (Haptics.NotificationFeedbackType.Error,
                (<Text style={styles.error}>{errors.password}</Text>))}

              <TextInput
                lightColor="#fff"
                darkColor="#413C48"
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={handleChange("password")}
                autoCapitalize="none"
                onBlur={handleBlur("password")}
              />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgotPassword");
                  Haptics.ImpactFeedbackStyle.Light;
                }}
              >
                <Text style={styles.text} lightColor="#333" darkColor="#fff">
                  Glömt lösenord?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  login();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                disabled={!values.email || !values.password}
              >
                <Text style={styles.buttonText}>Logga in</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AgeCheck");
                  Haptics.ImpactFeedbackStyle.Light;
                }}
              >
                <Text style={styles.text} lightColor="#333" darkColor="#fff">
                  Har du inget konto än? Skapa ett här!
                </Text>
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
  },
  input: {
    fontSize: 17,
    height: 50,
    width: 300,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    border: ".1px solid #D3D3D3",
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
  text: {
    textAlign: "center",
    fontSize: 17,
    marginTop: 10,
  },
  title: {
    fontFamily: "OleoScript",
    fontSize: 50,
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
  error: {
    fontSize: 12,
    color: "#BF0404",
    fontWeight: "bold",
    margin: 7,
  },
});
