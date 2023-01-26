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
  deleteDocById,
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
import { CommonActions } from "@react-navigation/native";

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
  const [myFollows, setMyFollows] = useState<string[]>([]);
  const [profilePic, setProfilePic] = useState<string>();
  let isMe = route.params.id === myUser.id;
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [myFavourites, setMyFavourites] = useState<Liked[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);

  interface Liked {
    id: string;
    image: string;
  }

  useEffect(() => {
    if (isFocused) {
      setMyFavourites([]);
      setCurrentUser();
      getMyFollowing();
      getReviews();
      getLiked();
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
        "reviews",
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

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
            deleteAccount();
            Alert.alert("Ditt konto har raderats");
            setModalVisible(false);
            resetNavigationAndGoToStart();
          },
        },
      ]
    );
  };

  const deleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    try {
      await deleteUser(user!);
      await deleteDocById("users", user!.uid);
      deleteUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUserData = async () => {
    try {
      reviews.map((review) => {
        deleteDocById("reviews", review.id);
      });

      let comments = await getDocsWithSpecificValue(
        "comments",
        "authorID",
        myUser.id
      );

      comments?.map((comment) => {
        deleteDocById("comments", comment.id);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setSignOutState());
        setMyProfile(false);
        setModalVisible(false);
        resetNavigationAndGoToStart();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // Favorite functionality
  const getLiked = async () => {
    let newList: Liked[] = [];
    try {
      const user = await getOneDocById("users", route.params?.id);

      await Promise.all(
        user?.liked.map(async (id: string) => {
          let product = await fetchLikedProducts(id);
          if (product) {
            newList.push({ id: product.id, image: product.photo });
          }
        })
      ).then(() => {
        setMyFavourites(newList);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLikedProducts = async (id: string) => {
    try {
      let product = await getOneDocById("products", id);
      return product;
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

  const resetNavigationAndGoToStart = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Auth" }],
      })
    );
  };

  const styles = StyleSheet.create({
    screen: {
      height: "100%",
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      position: "relative",
    },

    followingButton: {
      borderColor: "#575060",
      borderWidth: 1,
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
      marginTop: 30,
      top: 10,
    },
    activityCard: {
      marginTop: 50,
    },
    favorites: {
      top: 30,
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
      marginTop: 50,
    },
    right: {
      flexDirection: "column",
      alignItems: "center",
    },
    topContainer: {
      top: 70,
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
      marginTop: 60,
      marginRight: 20,
      marginBottom: 0,
      alignSelf: "flex-end",
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
      marginHorizontal: 0,
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

  if (!loading && user) {
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
              <Feather
                name="settings"
                size={24}
                color={isLight ? "#783BC9" : "#FFFD54"}
                onPress={() => setModalVisible(true)}
                style={styles.top}
              />
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
              <View style={{ marginTop: 40 }}>
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
                      Följer
                      <AntDesign
                        name="down"
                        size={14}
                        color={isLight ? "black" : "white"}
                      />
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <View style={styles.favorites}>
            <View style={styles.box}>
              <Text lightColor="#333" darkColor="#fff" style={styles.text}>
                {myProfile
                  ? "Mina favoriter"
                  : user.displayName + "s favoriter"}
                <AntDesign name="right" size={16} color="white" />
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <ScrollView horizontal style={styles.favoritesScroll}>
                <View style={styles.row}>
                  {myFavourites.map((product) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Product", { id: product.id })
                      }
                      key={product.id}
                    >
                      <Image
                        key={product.id}
                        style={styles.favoritesImage}
                        source={{
                          uri: product.image,
                        }}
                      />
                    </TouchableOpacity>
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
              <View style={styles.box}>
                <Text lightColor="#333" darkColor="#fff" style={styles.text}>
                  {myProfile
                    ? "Mina aktiviteter"
                    : user.displayName + "s favoriter"}
                  <AntDesign name="right" size={16} color="white" />
                </Text>
              </View>
            </View>
          </View>
          {reviews.map((review: Review) => {
            return (
              <View style={styles.activityCard} key={review.id}>
                <ActivityCard
                  key={review.id}
                  review={review}
                  updateReviews={getReviews}
                />
              </View>
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
                      color={isLight ? "black" : "white"}
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
                        onPress={() => handleDeleteAccount()}
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
