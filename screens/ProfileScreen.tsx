import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { currentReduxUser, setSignOutState } from "../redux/signin";
import {
  getAllDocsInCollection,
  getDocsWithSpecificValue,
  getOneDocById,
  updateSingleProperty,
} from "../helper";
import { Review, User } from "../Interfaces";
import { ScrollView } from "react-native-gesture-handler";
import { ReviewCard } from "../components/ReviewCard";
import { useNavigation } from "@react-navigation/native";
import {
  sendPasswordResetEmail,
  deleteUser,
  getAuth,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export default function ProfileScreen({
  navigation,
  route,
}: RootTabScreenProps<"Profile">) {
  const [follow, setFollow] = useState<boolean>(false);
  const myUser = useSelector(currentReduxUser);
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const userEmail = myUser?.email;
  const [urls, setUrls] = useState<string[]>([]);
  const favoritesArray: any = [];
  let photoURLS: string[] = [];
  const [usersFollowersArray, setUsersFollowersArray] = useState<string[]>([]);
  let newArray = [...usersFollowersArray];
  const profilePic =
    "https://cdn.drawception.com/images/avatars/647493-B9E.png";
  let isMe = route.params.id === myUser.id;

  useEffect(() => {
    getReviews();
    getLiked();
    compareLikedIds();
    imagesLoaded();
    checkCurrentUser();
    getFollowersFromDb();
  }, [isMe]);

  const checkCurrentUser = async () => {
    if (!isMe) {
      const user = await getOneDocById("users", route.params.id);
      setUser(user as User);
    } else {
      setMyProfile(true);
      setUser(myUser);
    }
  };

  const getReviews = async () => {
    try {
      let data = await getDocsWithSpecificValue(
        "recensioner",
        "userID",
        route.params.id
      );
      setReviews(data as Review[]);
    } catch (err) {
      console.log(err);
    }
  };
  // follow functionality
  const getFollowersFromDb = async () => {
    try {
      const user = await getOneDocById("users", myUser.id);
      setUsersFollowersArray(user?.following);
    } catch (err) {
      console.log(err);
    }
  };

  // not working
  const isAlreadyFollowing = () => {
    let selected = usersFollowersArray.some((item) => {
      console.log(item == route.params.id);
      return item == route.params.id;
    });
    return selected;
  };

  const addFollowerToDb = async () => {
    newArray.push(route.params.id);
    const newData = { following: newArray };
    try {
      await updateSingleProperty("users", myUser.id, newData);
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowFromDb = async () => {
    let index = newArray.indexOf(route.params.id);
    newArray.splice(index, 1);
    const newData = { following: newArray };
    try {
      await updateSingleProperty("users", myUser.id, newData);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFollow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isAlreadyFollowing()) {
      addFollowerToDb();
      setFollow(true);
      console.log("updated", usersFollowersArray);
    } else {
      unfollowFromDb();
      setFollow(false);
    }
  };

  // Modal functionality
  const resetPassword = async (email: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Återställningslänk skickad till din email");
    } catch (error) {
      Alert.alert("Ogiltig email");
    }
  };

  const deleteAccount = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const userToDelete = myUser;
    deleteUser(userToDelete)
      .then(() => {
        Alert.alert("Ditt konto har raderats");
      })
      .catch((error) => {
        Alert.alert("Något gick fel");
      });
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setSignOutState());
        setMyProfile(false);
        navigation.navigate("Signin");
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  // Favorite functionality
  const getLiked = async () => {
    try {
      const favorites = await getOneDocById("users", route.params?.id);
      for (let i = 0; i < favorites?.liked.length; i++) {
        favoritesArray.push(favorites?.liked[i]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get the products with same ID from the favorites array
  const compareLikedIds = async () => {
    const products = await getAllDocsInCollection("produkter");
    let likedProducts: any = [];
    if (!products) return;
    if (products) {
      likedProducts = products.filter((product) =>
        favoritesArray.includes(product.id)
      );
      return likedProducts;
    }
  };

  const getPhotos = async () => {
    const products = await compareLikedIds();
    for (let i = 0; i < products.length; i++) {
      photoURLS.push(products[i].photo);
    }
    return photoURLS;
  };

  const imagesLoaded = async () => {
    try {
      const asyncUrls = await getPhotos();
      setUrls(asyncUrls);
    } catch (err) {
      console.log(err);
    }
  };

  if (user) {
    return (
      <ScrollView style={styles.screen}>
        <View style={styles.container}>
          {myProfile && (
            <View style={styles.top}>
              <Feather
                name="settings"
                size={24}
                color="#FFFD54"
                onPress={() => setModalVisible(true)}
              />
            </View>
          )}
          <View style={styles.topContainer}>
            <View style={styles.left}>
              <Text darkColor="#fff" lightColor="#fff" style={styles.text}>
                Recensioner
              </Text>
              <Text
                darkColor="#fff"
                lightColor="#fff"
                style={styles.textMedium}
              >
                {reviews.length}
              </Text>
            </View>
            <View style={styles.right}>
              <Text darkColor="#fff" lightColor="#fff" style={styles.text}>
                Följer
              </Text>
              {myProfile ? (
                <Text
                  darkColor="#fff"
                  lightColor="#fff"
                  style={styles.textMedium}
                >
                  {usersFollowersArray.length}
                </Text>
              ) : (
                <Text
                  darkColor="#fff"
                  lightColor="#fff"
                  style={styles.textMedium}
                >
                  Finns inte
                </Text>
              )}
            </View>
          </View>
          {myProfile ? (
            <View style={styles.center}>
              <Image source={{ uri: profilePic }} style={styles.image} />
              <Text darkColor="#fff" lightColor="#fff" style={styles.text}>
                {myUser.displayName}
              </Text>
            </View>
          ) : (
            <View style={styles.center}>
              <Image source={{ uri: profilePic }} style={styles.image} />
              <Text darkColor="#fff" lightColor="#fff" style={styles.text}>
                {user.displayName}
              </Text>
            </View>
          )}

          {!myProfile && (
            <View>
              {!follow ? (
                <Pressable style={styles.button} onPress={toggleFollow}>
                  <Text
                    darkColor="#201A28"
                    lightColor="#201A28"
                    style={styles.buttonText}
                  >
                    Följ
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.borderButtonLike}
                  onPress={toggleFollow}
                >
                  <Text
                    darkColor="#fff"
                    lightColor="#fff"
                    style={styles.borderButtonText}
                  >
                    Följer <AntDesign name="down" size={14} color="white" />
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View style={styles.favorites}>
          {myProfile ? (
            <View style={styles.box}>
              <Text lightColor="#fff" darkColor="#fff" style={styles.text}>
                Mina favoriter
                <AntDesign name="right" size={16} color="white" />
              </Text>
            </View>
          ) : (
            <View style={styles.box}>
              <Text lightColor="#fff" darkColor="#fff" style={styles.text}>
                {user.displayName}'s favoriter
                <AntDesign name="right" size={16} color="white" />
              </Text>
            </View>
          )}

          <View style={styles.row}>
            {urls.map((url, index) => (
              <Image
                key={index}
                style={styles.favoritesImage}
                source={{
                  uri: url,
                }}
              />
            ))}
          </View>
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View style={styles.activities}>
          {myProfile ? (
            <View style={styles.box}>
              <Text lightColor="#fff" darkColor="#fff" style={styles.text}>
                Mina aktiviteter
              </Text>
              <AntDesign name="right" size={20} color="white" />
            </View>
          ) : (
            <View style={styles.box}>
              <Text lightColor="#fff" darkColor="#fff" style={styles.text}>
                {user.displayName}'s aktiviteter
              </Text>
              <AntDesign name="right" size={20} color="white" />
            </View>
          )}
          {reviews.map((review: Review) => {
            return <ReviewCard key={review.id} review={review} />;
          })}
        </View>
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
      </ScrollView>
    );
  } else {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }
}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
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
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFD54",
    padding: 10,
    borderRadius: 6,
    width: 100,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
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
  borderButtonLike: {
    borderWidth: 0.5,
    borderColor: "#783BC9",
    padding: 15,
    borderRadius: 6,
    width: 100,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  borderButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  smallText: {
    fontSize: 9,
    margin: 10,
  },
  text: {
    fontSize: 17,
    marginBottom: 10,
  },
  activities: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 20,
  },
  favorites: {
    marginLeft: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 80,
  },
  left: {
    flexDirection: "column",
    alignItems: "center",
  },
  center: {
    flexDirection: "column",
    alignItems: "center",
  },
  right: {
    flexDirection: "column",
    alignItems: "center",
  },
  topContainer: {
    width: 550,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  top: {
    marginLeft: 300,
    marginBottom: 20,
  },
  modalView: {
    margin: 10,
    marginTop: 100,
    height: 500,
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
    borderRadius: 50,
    marginBottom: 20,
  },
  textMedium: {
    fontSize: 20,
    padding: 10,
  },
  favoritesImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
  },
});
