import { Text, TextInput } from "./Themed";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from "react-native";
import { User } from "../Interfaces";
import React, { useEffect, useState } from "react";
import { getAllDocsInCollection } from "../helper";
import { AntDesign, Feather } from "@expo/vector-icons";
import {
  deleteUser,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectReduxEmail, setSignOutState } from "../redux/signin";
import { useNavigation } from "@react-navigation/native";

export const UserInfoCard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [username, setUsername] = useState(currentUser?.displayName);
  const userEmail = useSelector(selectReduxEmail);
  const dispatch = useDispatch();
  const navigate = useNavigation();

  useEffect(() => {
    const unsubrcribe = onAuthStateChanged(auth, (user) => {
      // setCurrentUser(currentUser as User);
    });
    return unsubrcribe;
  }, [auth, onAuthStateChanged]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    let newData = [];
    let data = await getAllDocsInCollection("users");

    if (data?.length) {
      newData = data;
    }
    setUsers(newData);
  };

  const handleNameChange = async (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    e.preventDefault();
    let userObject = {
      displayName: userEmail,
    };
    userObject = { ...userObject };
    // await updateProfile(currentUser, userObject);
    // await setDoc(doc(db, "users", currentUser?.id), {
    //   displayName: username,
    // });
  };

  const resetPassword = async (userEmail: string) => {
    try {
      await sendPasswordResetEmail(auth, userEmail);
      Alert.alert("Återställningslänk skickad till din email");
    } catch (error) {
      Alert.alert("Ogiltig email");
    }
  };

  const deleteAccount = async () => {
    const auth = getAuth();
    const userToDelete = auth.currentUser;
    // deleteUser(userToDelete as User)
    //   .then(() => {
    //     Alert.alert("Ditt konto har raderats");
    //   })
    //   .catch((error) => {
    //     Alert.alert("Något gick fel");
    //   });
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setSignOutState());
        Alert.alert("Du har loggat ut");
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
                    Användarnamn
                  </Text>
                  <TextInput
                    lightColor="#261F30"
                    lightTextColor="#fff"
                    darkTextColor="#fff"
                    darkColor="#261F30"
                    placeholder={"Byt användarnamn"}
                    placeholderTextColor={"#fff"}
                    style={styles.input}
                    // onChangeText={(text) => setUsername(text)}
                    onEndEditing={(e) => handleNameChange(e)}
                  />

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
        {/* <Image source={{ uri: currentUser?.photo }} /> */}
        <Text darkColor="#fff" lightColor="#fff">
          Betyg
        </Text>
      </View>
      <View style={styles.row}>
        <Text darkColor="#fff" lightColor="#fff">
          {/* {currentUser?.reviews} */}
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {/* {currentUser?.displayName} */}
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {/* {currentUser?.grade} */}
        </Text>
      </View>
      <View style={styles.center}>
        <Text darkColor="#fff" lightColor="#fff">
          Medlem sedan:
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {/* {currentUser?.createdAt.toLocaleString("sv-SE").substring(0, 10)} */}
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
});
