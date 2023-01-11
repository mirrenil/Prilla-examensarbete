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
  const myFollowingArray: any = [];
  const usersFollowingArray: any = [];
  let photoURLS: string[] = [];
  const [myFollowersArray, setMyFollowersArray] = useState<string[]>([]);
  const [userFollowersArray, setUserFollowersArray] = useState<string[]>([]);

  const profilePic =
    "https://cdn.drawception.com/images/avatars/647493-B9E.png";
  let isMe = route.params.id === myUser.id;

  useEffect(() => {
    getReviews();
    getLiked();
    compareLikedIds();
    imagesLoaded();
    checkCurrentUser();
    getMyFollowing();
    getUsersFollowing();
  }, [isMe, follow]);

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
  const getMyFollowing = async () => {
    try {
      const following = await getOneDocById("users", route.params?.id);
      for (let i = 0; i < following?.following.length; i++) {
        myFollowingArray.push(following?.following[i]);
        setMyFollowersArray(myFollowingArray);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUsersFollowing = async () => {
    try {
      const following = await getOneDocById("users", user?.id);
      for (let i = 0; i < following?.following.length; i++) {
        usersFollowingArray.push(following?.following[i]);
        setUserFollowersArray(usersFollowingArray);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // check if user is already following
  const isAlreadyFollowing = () => {
    let selected = myFollowersArray.some((item) => {
      return item == route.params.id;
    });
    return selected;
  };

  const addFollowerToDb = async () => {
    let newArray = [...myFollowersArray];
    newArray.push(route.params.id);
    const newData = { following: newArray };
    try {
      await updateSingleProperty("users", myUser.id, newData);
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowFromDb = async () => {
    let newArray = [...myFollowersArray];
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
      setFollow(true);
      addFollowerToDb();
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
  console.log(myFollowingArray.length);

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
              <Text darkColor="#fff" lightColor="#333" style={styles.text}>
                Recensioner
              </Text>
              <Text
                darkColor="#fff"
                lightColor="#333"
                style={styles.textMedium}
              >
                {reviews.length}
              </Text>
            </View>
            <View style={styles.right}>
              <Text darkColor="#fff" lightColor="#333" style={styles.text}>
                Följer
              </Text>
              {myProfile ? (
                <Text
                  darkColor="#fff"
                  lightColor="#fff"
                  style={styles.textMedium}
                >
                  {myFollowersArray.length}
                </Text>
              ) : (
                <Text
                  darkColor="#fff"
                  lightColor="#fff"
                  style={styles.textMedium}
                >
                  {userFollowersArray.length}
                </Text>
              )}
            </View>
          </View>
          {myProfile ? (
            <View style={styles.center}>
              <Image source={{ uri: profilePic }} style={styles.image} />
              <Text darkColor="#fff" lightColor="#333" style={styles.text}>
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
              {!isAlreadyFollowing() ? (
                <Pressable
                  style={styles.borderButtonFollow}
                  onPress={toggleFollow}
                >
                  <Text
                    darkColor="#201A28"
                    lightColor="#201A28"
                    style={styles.buttonText}
                  >
                    Följ
                  </Text>
                </Pressable>
              ) : (
                <Pressable style={styles.button} onPress={toggleFollow}>
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
          lightColor="#D3D3D3"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View style={styles.favorites}>
          {myProfile ? (
            <View style={styles.box}>
              <Text lightColor="#333" darkColor="#fff" style={styles.text}>
                Mina favoriter
                <AntDesign name="right" size={16} color="white" />
              </Text>
            </View>
          ) : (
            <View style={styles.box}>
              <Text lightColor="#333" darkColor="#fff" style={styles.text}>
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
          lightColor="#D3D3D3"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View style={styles.activities}>
          {myProfile ? (
            <View style={styles.box}>
              <Text lightColor="#333" darkColor="#fff" style={styles.text}>
                Mina aktiviteter
              </Text>
              <AntDesign name="right" size={20} color="white" />
            </View>
          ) : (
            <View style={styles.box}>
              <Text lightColor="#333" darkColor="#fff" style={styles.text}>
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
            <View style={styles.layover}>
              <View
                lightColor="#FFF"
                darkColor="#261F30"
                style={styles.modalView}
              >
                <View>
                  <AntDesign
                    name="left"
                    size={20}
                    color="#D3D3D3"
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                  <Text
                    lightColor="#333"
                    darkColor="#fff"
                    style={styles.modalTextHeader}
                  >
                    Inställningar
                  </Text>
                </View>
                <View style={styles.column}>
                  <Text
                    lightColor="#333"
                    darkColor="#fff"
                    style={styles.modalText}
                  >
                    Lösenord
                  </Text>
                  <TouchableOpacity>
                    <Text
                      lightColor="#333"
                      darkColor="#fff"
                      style={styles.borderButton}
                      onPress={() => resetPassword(userEmail as string)}
                    >
                      Skicka återställnings länk till e-post
                    </Text>
                  </TouchableOpacity>

                  <Text
                    lightColor="#333"
                    darkColor="#fff"
                    style={styles.modalText}
                  >
                    Radera konto
                  </Text>
                  <TouchableOpacity>
                    <Text
                      lightColor="#333"
                      darkColor="#fff"
                      style={styles.borderButton}
                      onPress={() => deleteAccount()}
                    >
                      Vill du radera ditt konto?
                    </Text>
                  </TouchableOpacity>
                  <Text
                    lightColor="#333"
                    darkColor="#fff"
                    style={styles.modalText}
                  >
                    Logga ut
                  </Text>
                  <TouchableOpacity>
                    <Text
                      lightColor="#333"
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
    borderColor: "#575060",
    borderWidth: 0.2,
    backgroundColor: "transparent",
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
    borderColor: "#783bc9",
    padding: 15,
    borderRadius: 6,
    width: 300,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  borderButtonFollow: {
    backgroundColor: "#FFFD54",
    borderWidth: 0.5,
    borderColor: "#783BC9",
    padding: 10,
    borderRadius: 6,
    width: 100,
    height: 40,
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
  },
  top: {
    marginLeft: 300,
    marginBottom: 20,
  },
  modalView: {
    maxHeight: 400,
    borderRadius: 6,
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
    fontSize: 15,
    fontWeight: "bold",
  },
  modalTextHeader: {
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
  layover: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
