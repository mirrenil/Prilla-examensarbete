import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { currentReduxUser, setSignOutState } from "../redux/signin";
import {
  getAllDocsInCollection,
  getDocsWithSpecificValue,
  getOneDocById,
  updateSingleProperty,
  uploadImageAndGetURL,
} from "../helper";
import { Review, User } from "../Interfaces";
import { ScrollView } from "react-native-gesture-handler";
import {
  sendPasswordResetEmail,
  deleteUser,
  getAuth,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { gradientLight, gradientDark } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { PopUp } from "../components/PopUp";
import { useIsFocused } from "@react-navigation/native";
import { ActivityCard } from "../components/ActivityCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfileScreen({
  navigation,
  route,
}: RootStackScreenProps<"Profile">) {
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
  const [myFollows, setMyFollows] = useState<string[]>([]);
  const [profilePic, setProfilePic] = useState<string>();
  let isMe = route.params.id === myUser.id;
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setCurrentUser();
      getMyFollowing();
      getReviews();
      getLiked();
      compareLikedIds();
      imagesLoaded();
    }
  }, [isFocused]);

  const setCurrentUser = async () => {
    try {
      const user = await getOneDocById("users", route.params.id);
      setUser(user as User);
      setProfilePic(user?.photo);
      if (isMe) {
        setMyProfile(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getReviews = async () => {
    try {
      let data = await getDocsWithSpecificValue(
        "recensioner",
        "userID",
        route.params.id
      );
      if (data) {
        let sorted = sortArray(data);
        setReviews(sorted as Review[]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sortArray = (array: Review[]) => {
    let sorted = array?.sort((a: any, b: any) => {
      return b.createdAt.toDate() - a.createdAt.toDate();
    });
    return sorted;
  };

  // Gets a list of all users I follow to be able to check if I follow user of current profile page (unless profile is mine)
  const getMyFollowing = async () => {
    try {
      const user = await getOneDocById("users", myUser.id);
      if (user?.following) {
        setMyFollows(user.following);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // checks if I follow the user
  const isAlreadyFollowing = () => {
    let selected = myFollows.some((id) => {
      return id == route.params.id;
    });
    return selected;
  };

  const updateDb = async (newData) => {
    let newObj = { following: newData };
    try {
      await updateSingleProperty("users", myUser.id, newObj);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFollow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!isAlreadyFollowing()) {
      setFollow(true);
      let newArray = [...myFollows, route.params.id];
      updateDb(newArray);
      setMyFollows([...myFollows, route.params.id]);
    } else {
      let newArray = myFollows.filter((id) => id !== route.params.id);
      setMyFollows(newArray);
      updateDb(newArray);
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
    Alert.alert(
      "Är du säker på att du vill ta bort ditt konto?",
      "Du kan inte ångra dig!",
      [
        {
          text: "Avbryt",
          onPress: () => setModalVisible(false),
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: () => {
            deleteUser(userToDelete);
            Alert.alert("Ditt konto har raderats");
            setModalVisible(false);
            navigation.navigate("Signin");
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setSignOutState());
        setMyProfile(false);
        setModalVisible(false);
        navigation.navigate("Signin");
      })
      .catch((error: any) => {
        console.log(error);
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
    const products = await getAllDocsInCollection("products");
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

  const handleImgUpload = async (image: any) => {
    try {
      let imageURL = await uploadImageAndGetURL(myUser.id, image);
      if (!imageURL) {
        return Alert.alert("ursäkta! Något gick fel. Prova igen.");
      }
      await updateSingleProperty("users", myUser?.id, { photo: imageURL }).then(
        () => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, { photoURL: imageURL });
          }
          setProfilePic(imageURL);
        }
      );
      setPopUpOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const styles = StyleSheet.create({
    screen: {
      height: "100%",
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
    },

    followingButton: {
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
    btnText: {
      textAlign: "center",
    },
    borderButton: {
      borderRadius: 6,
      width: 300,
      height: 30,
      marginTop: 10,
      marginBottom: 10,
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
      marginLeft: 10,
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
      margin: 10,
    },
    favorites: {
      marginLeft: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: 80,
      width: "89%",
    },
    left: {
      flexDirection: "column",
      alignItems: "center",
    },
    center: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 10,
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
      marginLeft: 340,
      marginBottom: 0,
    },
    modalView: {
      backgroundColor: isLight ? "#fff" : "#2E233C",
      maxHeight: 400,
      borderRadius: 6,
      padding: 35,
    },
    modalText: {
      fontSize: 15,

      backgroundColor: "transparent",
    },
    modalTextHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 20,
      marginBottom: 10,
      fontWeight: "bold",
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
      width: 70,
      height: 70,
      borderRadius: 50,
      marginRight: 10,
    },
    favoritesScroll: {
      marginLeft: 10,
      width: "90%",
      flexDirection: "row",
    },
    layover: {
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    loading: {
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (user) {
    return (
      <LinearGradient
        colors={
          isLight
            ? [gradientLight.from, gradientLight.to]
            : [gradientDark.from, gradientDark.to]
        }
      >
        {popUpOpen ? (
          <PopUp
            userPhoto={user.photo}
            setProfilePic={(img) => handleImgUpload(img)}
            closePopUp={() => {
              setPopUpOpen(false);
            }}
          />
        ) : null}
        <ScrollView style={styles.screen}>
          <View style={styles.container}>
            {myProfile ? (
              <View style={styles.top}>
                {isLight ? (
                  <Feather
                    name="settings"
                    size={24}
                    color="#783BC9"
                    onPress={() => setModalVisible(true)}
                  />
                ) : (
                  <Feather
                    name="settings"
                    size={24}
                    color="#FFFD54"
                    onPress={() => setModalVisible(true)}
                  />
                )}
              </View>
            ) : null}
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
                <Text
                  darkColor="#fff"
                  lightColor="#333"
                  style={styles.textMedium}
                >
                  {user.following ? user.following.length : 0}
                </Text>
              </View>
            </View>
            <View style={styles.center}>
              {myProfile ? (
                <>
                  <TouchableOpacity onPress={() => setPopUpOpen(true)}>
                    <Image source={{ uri: profilePic }} style={styles.image} />
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        borderRadius: 100,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        right: 0,
                      }}
                    >
                      <Entypo name="camera" size={15} color="#333333" />
                    </View>
                  </TouchableOpacity>

                  <Text darkColor="#fff" lightColor="#333" style={styles.text}>
                    {myUser.displayName}
                  </Text>
                </>
              ) : (
                <>
                  <Image source={{ uri: profilePic }} style={styles.image} />
                  <Text darkColor="#fff" lightColor="#333" style={styles.text}>
                    {user.displayName}
                  </Text>
                </>
              )}
            </View>
            {!myProfile && (
              <View>
                {!isAlreadyFollowing() ? (
                  <TouchableOpacity
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
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.followingButton}
                    onPress={toggleFollow}
                  >
                    <Text
                      darkColor="#fff"
                      lightColor="#333"
                      style={styles.borderButtonText}
                    >
                      Följer <AntDesign name="down" size={14} color="#333" />
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

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
                  {user.displayName}s favoriter
                  <AntDesign name="right" size={16} color="white" />
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row" }}>
              <ScrollView horizontal style={styles.favoritesScroll}>
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
              </ScrollView>
              <AntDesign
                name="right"
                size={34}
                color="white"
                style={{ marginTop: 20 }}
              />
            </View>
            <View style={styles.activities}>
              {myProfile ? (
                <View style={styles.box}>
                  <Text lightColor="#333" darkColor="#fff" style={styles.text}>
                    Mina aktiviteter
                    <AntDesign name="right" size={16} color="white" />
                  </Text>
                </View>
              ) : (
                <View style={styles.box}>
                  <Text lightColor="#333" darkColor="#fff" style={styles.text}>
                    {user.displayName}s aktiviteter
                    <AntDesign name="right" size={16} color="white" />
                  </Text>
                </View>
              )}
            </View>
          </View>
          {reviews.map((review: Review) => {
            return (
              <ActivityCard
                key={review.id}
                review={review}
                updateReviews={getReviews}
              />
            );
          })}
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
                <View style={styles.modalView}>
                  <View style={styles.modalTextHeader}>
                    <Text
                      lightColor="#333"
                      darkColor="#fff"
                      style={styles.modalTextHeader}
                    >
                      Inställningar
                    </Text>
                    <Entypo
                      name="cross"
                      size={24}
                      color="black"
                      onPress={() => setModalVisible(!modalVisible)}
                    />
                  </View>
                  <View style={styles.column}>
                    <TouchableOpacity style={styles.borderButton}>
                      <Text
                        lightColor="#333"
                        darkColor="#fff"
                        onPress={() => resetPassword(userEmail as string)}
                      >
                        Skicka återställnings länk till e-post
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.borderButton}>
                      <Text
                        lightColor="#333"
                        darkColor="#fff"
                        onPress={() => deleteAccount()}
                      >
                        Vill du radera ditt konto?
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.borderButton}>
                      <Text
                        lightColor="#333"
                        darkColor="#fff"
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
      </LinearGradient>
    );
  } else {
    return <LoadingSpinner />;
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
  followingButton: {
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
  btnText: {
    textAlign: "center",
  },
  borderButton: {
    borderWidth: 0.5,
    borderColor: "#FFFD54",
    padding: 15,
    borderRadius: 6,
    width: 300,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  modalBorderButton: {
    borderWidth: 0.5,
    borderColor: "#FFFD54",
    padding: 15,
    borderRadius: 6,
    width: 300,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
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
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 80,
    marginLeft: 10,
    width: "90%",
  },
  favorites: {
    marginLeft: 20,
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
    backgroundColor: "#857E8E",
    maxHeight: 400,
    borderRadius: 6,
    padding: 35,
  },
  modalText: {
    fontSize: 15,
    fontWeight: "500",
    backgroundColor: "transparent",
  },
  modalTextHeader: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
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
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 10,
  },
  favortiesScroll: {
    width: "70%",
    flexDirection: "row",
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
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
});
