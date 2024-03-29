import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import {
  getAllDocsInCollection,
  getDocsWithSpecificValue,
  getOneDocById,
} from "../helper";
import { Review } from "../Interfaces";
import Tabbar from "../components/Tabbar";
import { RootStackScreenProps } from "../types";
import { ActivityCard } from "../components/ActivityCard";
import { gradientDark, gradientLight } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import LoadingSpinner from "../components/LoadingSpinner";

export default function StartScreen({}: RootStackScreenProps<"Home">) {
  const myUser = useSelector(currentReduxUser);
  const [friendsReviews, setFriendsReviews] = useState<Review[]>([]);
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const myFollowingArray: string[] = [];
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFocused) {
      getMyFollowing();
      getLatestActivity();
    }
  }, [isFocused]);

  const getMyFollowing = async () => {
    try {
      const user = await getOneDocById("users", myUser.id);
      let myFollowing = user?.following;
      myFollowingArray.push(...myFollowing);
      getFriendsReviews();
    } catch (err) {
      console.log(err);
    }
    return myFollowingArray;
  };

  const getFriendsReviews = async () => {
    try {
      let newData: Review[] = [];

      myFollowingArray.map((id) => {
        getDocsWithSpecificValue("reviews", "userID", id)
          .then((data) => {
            if (data) {
              newData = data;
              let sorted = sortArray(newData);
              sorted = sorted.splice(0, 5);
              setFriendsReviews(sorted);
            }
          })
          .catch((err) => console.log(err));
      });
    } catch (err) {
      console.log(err);
    }
  };

  const sortArray = (array: any) => {
    let sorted = array?.sort((a: any, b: any) => {
      return b.createdAt.toDate() - a.createdAt.toDate();
    });
    return sorted;
  };

  const getLatestActivity = async () => {
    try {
      let data = await getAllDocsInCollection("reviews");
      data = data?.filter((d) => !ifAlreadyInFriendsList(d));
      data = sortArray(data);
      data = data?.splice(0, 5);
      setLatestReviews(data as Review[]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const ifAlreadyInFriendsList = (review: Review) => {
    return myFollowingArray.some((id) => id == review.userID);
  };

  if (!isLoading) {
    return (
      <LinearGradient
        colors={
          isLight
            ? [gradientLight.from, gradientLight.to]
            : [gradientDark.from, gradientDark.to]
        }
      >
        <ScrollView>
          <View style={styles.container}>
            <Image
              style={styles.heroImg}
              source={require("../assets/images/hero.png")}
            />
            <View style={styles.heroTextWrapper}>
              <Text style={styles.heroText}>äventyr väntar</Text>
              <Text style={styles.numbers}>
                20
                <Text style={styles.specialFont} lightColor="#fff">
                  23
                </Text>
              </Text>
              <View style={styles.separator} />
              <View style={styles.logosWrapper}>
                <Text style={styles.prilla}>Prilla</Text>
                <Image
                  style={styles.logo}
                  source={require("../assets/images/loop-logo.png")}
                />
              </View>
            </View>
          </View>
          <Tabbar />
          <Text style={styles.headlines}>Vänners senaste aktivitet</Text>
          {friendsReviews.length == 0 && (
            <Text style={styles.text}>Du följer ingen än...</Text>
          )}
          {friendsReviews.map((review) => {
            return (
              <ActivityCard
                key={review.id}
                review={review}
                updateReviews={getFriendsReviews}
              />
            );
          })}
          <Text style={styles.headlines}>Upptäck ny aktivitet</Text>
          {latestReviews.map((review) => {
            return (
              <ActivityCard
                key={review.id}
                review={review}
                updateReviews={getFriendsReviews}
              />
            );
          })}
        </ScrollView>
      </LinearGradient>
    );
  } else {
    return <LoadingSpinner />;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  heroImg: {
    width: "100%",
    height: 200,
  },
  heroTextWrapper: {
    top: 25,
    position: "absolute",
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  heroText: {
    color: "white",
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: 20,
  },
  logosWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  numbers: {
    marginTop: 10,
    fontSize: 40,
    color: "white",
    lineHeight: 60,
    fontWeight: "700",
  },
  specialFont: {
    fontFamily: "Caramel",
    fontStyle: "normal",
    height: 10,
    fontSize: 70,
  },
  logo: {
    height: 30,
    width: 80,
  },
  prilla: {
    fontFamily: "OleoScript",
    fontSize: 35,
    color: "#FFFD54",
  },
  headlines: {
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  separator: {
    marginVertical: 0.1,
    height: 1,
    width: "60%",
    backgroundColor: "white",
  },
  text: {
    marginLeft: 10,
  },
});
