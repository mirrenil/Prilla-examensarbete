import { Text, TextInput } from "./Themed";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import {
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { currentReduxUser, setSignOutState } from "../redux/signin";
import { useNavigation } from "@react-navigation/native";

export const UserInfoCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector(currentReduxUser);
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const userEmail = user?.email;

  useEffect(() => {}, [user]);

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Återställningslänk skickad till din email");
    } catch (error) {
      Alert.alert("Ogiltig email");
    }
  };

  const deleteAccount = async () => {
    const userToDelete = user;
    deleteUser(userToDelete)
      .then(() => {
        Alert.alert("Ditt konto har raderats");
      })
      .catch((error) => {
        Alert.alert("Något gick fel");
      });
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setSignOutState());
        navigate.navigate("Signin");
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  return (
    <View>
      <View style={styles.top}>
        <Feather
          name="settings"
          size={24}
          color="#FFFD54"
          onPress={() => setModalVisible(true)}
        />
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View>
              <View style={styles.modalView}>
                <View>
                  <AntDesign
                    name="left"
                    size={20}
                    color="white"
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                  <Text
                    lightColor="#fff"
                    darkColor="#fff"
                    style={styles.modalTextHeader}
                  >
                    Inställningar
                  </Text>
                </View>
                <View style={styles.column}>
                  <Text
                    lightColor="#fff"
                    darkColor="#fff"
                    style={styles.modalText}
                  >
                    Lösenord
                  </Text>
                  <TouchableOpacity>
                    <Text
                      lightColor="#fff"
                      darkColor="#fff"
                      style={styles.borderButton}
                      onPress={() => resetPassword(userEmail as string)}
                    >
                      Skicka återställnings länk till e-post
                    </Text>
                  </TouchableOpacity>

                  <Text
                    lightColor="#fff"
                    darkColor="#fff"
                    style={styles.modalText}
                  >
                    Radera konto
                  </Text>
                  <TouchableOpacity>
                    <Text
                      lightColor="#fff"
                      darkColor="#fff"
                      style={styles.borderButton}
                      onPress={() => deleteAccount()}
                    >
                      Vill du radera ditt konto?
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text
                      lightColor="#fff"
                      darkColor="#fff"
                      style={styles.borderButton}
                      onPress={handleSignOut}
                    >
                      Logga ut
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.row}>
        <Text darkColor="#fff" lightColor="#fff">
          Recensioner
        </Text>
        <Image
          source={{ uri: user?.photo }}
          resizeMode="cover"
          style={{ height: 50, width: 50 }}
        />
        <Text darkColor="#fff" lightColor="#fff">
          Betyg
        </Text>
      </View>
      <View style={styles.row}>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.reviews}
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.displayName}
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.grade}
        </Text>
      </View>
      <View style={styles.center}>
        <Text darkColor="#fff" lightColor="#fff">
          Medlem sedan:
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {/* {user?.createdAt.toDate().toLocaleString("sv-SE").substring(0, 10)} */}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 80,
  },
  column: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  center: {
    alignItems: "center",
  },
  top: {
    marginLeft: 300,
  },
  modalView: {
    margin: 10,
    marginTop: 100,
    height: 550,
    backgroundColor: "#261F30",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    margin: 15,
    textAlign: "center",
    fontSize: 15,
  },
  modalTextHeader: {
    margin: 12,
    textAlign: "center",
    fontSize: 20,
  },
  borderButton: {
    borderWidth: 0.2,
    borderColor: "#575060",
    padding: 15,
    borderRadius: 6,
    width: 300,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 0.2,
    borderColor: "#575060",
    borderRadius: 6,
    textAlign: "center",
    height: 50,
    width: 300,
    marginBottom: 10,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});
