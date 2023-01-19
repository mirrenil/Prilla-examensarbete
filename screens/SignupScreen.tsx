import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { Text, View, TextInput } from "../components/Themed";
import { Formik } from "formik";
import * as yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { auth } from "../firebase";
import { setOneDoc } from "../helper";
import { RootStackScreenProps } from "../types";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { gradientDark, gradientLight } from "../constants/Colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";

let inputHeight = 20;

export default function Signup({ navigation }: RootStackScreenProps<"Signup">) {
  const [oldEnough, setOldEnough] = useState<boolean>(false);
  const [user, setUser] = useState({
    email: "",
    displayName: "",
    password: "",
    passwordConfirmation: "",
  });

  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  const addUserToDb = async () => {
    const userToDB = {
      email: user.email,
      displayName: user.displayName,
      id: auth.currentUser?.uid,
      createdAt: new Date(),
      photo: "",
      liked: [],
    };
    setOneDoc("users", userToDB, auth.currentUser?.uid);
  };

  const signup = async () => {
    if (oldEnough) {
      try {
        await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        ).then(() => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: user.displayName,
            });
          }
        });
        addUserToDb();
        Alert.alert("Registrering lyckades!");
        navigation.navigate("Signin");
      } catch (error) {
        Alert.alert("Denna användare finns redan registrerad");
      }
    } else {
      Alert.alert("Du måste vara över 18 år för att registrera dig");
    }
  };

  const isValid = () => {
    if (user.password !== user.passwordConfirmation) {
      Alert.alert("Lösenorden matchar inte");
    } else {
      signup();
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
          displayName: yup.string().required("Välj ett användarnamn"),
          email: yup.string().email().required("Ange din email adress"),
          password: yup
            .string()
            .min(6, "Lösenordet måste vara minst 6 tecken")
            .required("Välj ett lösenord"),
          passwordConfirmation: yup
            .string()
            .oneOf([yup.ref("password"), null], "Lösenorden matchar inte"),
        })}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => {
          const { email, displayName, password, passwordConfirmation } = values;

          useEffect(() => {
            setUser({
              email: email,
              displayName: displayName,
              password: password,
              passwordConfirmation: passwordConfirmation,
            });
          }, [email, displayName, password, passwordConfirmation]);

          return (
            <KeyboardAvoidingView>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <View style={styles.inputWrapperIos}>
                    {touched.displayName && errors.displayName && (
                      <Text style={styles.error}>{errors.displayName}</Text>
                    )}
                    <TextInput
                      lightColor="#fff"
                      darkColor="#413C48"
                      placeholder="Användarnamn"
                      style={styles.input}
                      value={displayName}
                      onChangeText={handleChange("displayName")}
                      onBlur={handleBlur("displayName")}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputWrapperIos}>
                    {touched.email && errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
                    <TextInput
                      lightColor="#fff"
                      darkColor="#413C48"
                      placeholder="Email adress"
                      style={styles.input}
                      value={email}
                      onChangeText={handleChange("email")}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputWrapperIos}>
                    {touched.password && errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}
                    <TextInput
                      lightColor="#fff"
                      darkColor="#413C48"
                      placeholder="Lösenord"
                      style={styles.input}
                      secureTextEntry
                      value={password}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      onBlur={handleBlur("password")}
                    />
                  </View>
                  <View style={styles.inputWrapperIos}>
                    {touched.passwordConfirmation &&
                      errors.passwordConfirmation && (
                        <Text style={styles.error}>
                          {errors.passwordConfirmation}
                        </Text>
                      )}
                    <TextInput
                      lightColor="#fff"
                      darkColor="#413C48"
                      placeholder="Lösenord igen"
                      style={styles.input}
                      secureTextEntry
                      value={passwordConfirmation}
                      onChangeText={handleChange("passwordConfirmation")}
                      autoCapitalize="none"
                      onBlur={handleBlur("passwordConfirmation")}
                    />
                  </View>
                  <View style={styles.bouncyCheckBox}>
                    <BouncyCheckbox
                      size={25}
                      fillColor="green"
                      unfillColor="transparent"
                      text="Jag är 18 år eller äldre."
                      iconStyle={{ borderColor: "green" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      textStyle={{
                        textDecorationLine: "none",
                      }}
                      onPress={() => {
                        setOldEnough(true);
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      isValid();
                      Haptics.ImpactFeedbackStyle.Light;
                    }}
                    disabled={
                      !values.email &&
                      !values.displayName &&
                      !values.password &&
                      !values.passwordConfirmation &&
                      !oldEnough
                    }
                  >
                    <Text style={styles.buttonText}>Registrera dig</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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

  input: {
    fontSize: 17,
    height: 50,
    width: 300,
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
    marginTop: 10,
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
    color: "#FFFD54",
  },
  slogan: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFD54",
  },
  separator: {
    marginVertical: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
    marginRight: 200,
  },
  error: {
    fontSize: 12,
    color: "#BF0404",
    fontWeight: "bold",
    margin: 3,
  },
  inputWrapperIos: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 6,
    width: "100%",
    marginBottom: inputHeight,
  },
  bouncyCheckBox: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 10,
  },
});
