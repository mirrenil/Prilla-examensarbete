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
  ScrollView,
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
import { AntDesign } from "@expo/vector-icons";

let inputHeight = 20;

export default function Signup({ navigation }: RootStackScreenProps<"Signup">) {
  const [oldEnough, setOldEnough] = useState<boolean>(false);
  const [isAgreeOnPolicy, setIsAgreeOnPolicy] = useState<boolean>(false);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [buttonDisabled, setButtonIsDisabled] = useState<boolean>(true);

  const [user, setUser] = useState({
    email: "",
    displayName: "",
    password: "",
    passwordConfirmation: "",
  });

  useEffect(() => {
    if (
      user.displayName !== "" &&
      user.email !== "" &&
      user.password !== "" &&
      user.passwordConfirmation !== "" &&
      isAgreeOnPolicy &&
      oldEnough
    ) {
      setButtonIsDisabled(false);
    } else {
      setButtonIsDisabled(true);
    }
  }, [
    user.displayName,
    user.email,
    user.password,
    user.passwordConfirmation,
    isAgreeOnPolicy,
    oldEnough,
  ]);

  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  const addUserToDb = async () => {
    const userToDB = {
      email: user.email,
      displayName: user.displayName,
      id: auth.currentUser?.uid,
      createdAt: new Date(),
      photo: "https://cdn.drawception.com/images/avatars/647493-B9E.png",
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
      {policyOpen && (
        <View style={styles.policyWrapper}>
          <TouchableOpacity
            onPress={() => setPolicyOpen(false)}
            style={styles.policyCloseIcon}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.policyTitle}>Integritetspolicy</Text>

          <ScrollView style={styles.policyTextWrapper}>
            <Text style={styles.policyText}>
              Integritetspolicy Behandling av personuppgfter på Prilla. För
              Prilla är personlig integritet viktigt. Vi eftersträvar en hög
              nivå av dataskydd. I denna policy förklarar vi hur vi samlar in
              och använder personuppgifter. Vi beskriver också dina rättigheter
              och hur du kan göra dem gällande. Du är alltid välkommen att
              kontakta oss om du har frågor om hur vi behandlar dina
              personuppgifter. Kontaktuppgifter står sist i denna text. Vad är
              en personuppgift och vad är en behandling av personuppgifter?
              Personuppgifter är alla uppgifter om en levande fysisk person som
              direkt eller indirekt kan kopplas till den personen. Det handlar
              inte bara om namn och personnummer utan även om till exempel
              bilder och e-postadresser. Behandling av personuppgifter är allt
              som sker med personuppgifterna i IT-systemen, oavsett om det
              handlar om mobila enheter eller datorer. Det handlar om till
              exempel insamling, registrering, strukturering, lagring,
              bearbetning och överföring. I vissa fall kan även manuella
              register omfattas. Personuppgiftsansvarig För de behandlingar som
              sker inom Prillas verksamhet är Prilla personuppgiftsansvarig.
              Vilka personuppgifter samlar vi in om dig och varför? Vi behandlar
              i huvudsak din email och bilder. Hur länge sparar vi dina
              personuppgifter? Vi sparar aldrig dina personuppgifter längre än
              vad som är nödvändigt för respektive ändamål. Vad är dina
              rättigheter som registrerad? Som registrerad har du enligt
              gällande lagstiftning ett antal rättigheter. Du har rätt till att
              få ett utdrag som visar vilka personuppgifter vi har registrerade
              om dig. Du kan begära rättelse av felaktiga uppgifter. Kontakta
              oss vid frågor om hur vi behandlar personuppgifter. Om du har
              frågor om hur vi behandlar personuppgifter kontakta n.n. som är
              ansvarig för personuppgiftsfrågor. Vi kan komma att göra ändringar
              i vår integritetspolicy. Den senaste versionen av
              integritetspolicyn finns alltid här i applikationen
              info@prilla.com
            </Text>
          </ScrollView>
        </View>
      )}

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
                <View style={{ padding: 35 }}>
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
                      style={{ margin: 10 }}
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
                        setOldEnough(!oldEnough);
                      }}
                    />
                    <BouncyCheckbox
                      style={{ margin: 10 }}
                      size={25}
                      fillColor="green"
                      unfillColor="transparent"
                      text="Jag godkänner att mina uppgifter behandlas efter Prillas integritetspolicy."
                      iconStyle={{ borderColor: "green" }}
                      innerIconStyle={{ borderWidth: 2 }}
                      textStyle={{
                        textDecorationLine: "none",
                      }}
                      onPress={() => {
                        setIsAgreeOnPolicy(!isAgreeOnPolicy);
                      }}
                    />
                    <TouchableOpacity onPress={() => setPolicyOpen(true)}>
                      <Text
                        style={{
                          width: "100%",
                          textAlign: "center",
                          color: "white",
                          textDecorationLine: "underline",
                        }}
                      >
                        Integritetspolicy
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      isValid();
                      Haptics.ImpactFeedbackStyle.Light;
                    }}
                    disabled={buttonDisabled}
                    style={[
                      styles.button,
                      buttonDisabled ? styles.disabled : null,
                    ]}
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
  policyWrapper: {
    position: "absolute",
    zIndex: 100,
    width: "80%",
    height: 400,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    borderRadius: 6,
  },
  policyCloseIcon: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
  },
  policyTextWrapper: {
    // width: "80%",
    // height: "80%",
  },
  policyTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  policyText: {
    color: "black",
  },
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
  disabled: {
    backgroundColor: "grey",
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
    // alignItems: "center",
    marginBottom: 10,
    width: "100%",
    // backgroundColor: "red",
  },
});
