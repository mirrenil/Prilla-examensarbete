import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { getAllDocsInCollection, getOneDocById } from "../helper";
import { Review } from "../Interfaces";
import Tabbar from "../components/Tabbar";
import { RootTabScreenProps } from "../types";
import { ActivityCard } from "../components/ActivityCard";
import Colors, { gradientDark, gradientLight } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";

export default function StartScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const myUser = useSelector(currentReduxUser);
  const [reviews, setReviews] = useState<Review[]>([]);
  const myFollowingArray: string[] = [];
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getReviews();
      getMyFollowing();
    }
  }, [isFocused]);

  const getMyFollowing = async () => {
    try {
      const user = await getOneDocById("users", myUser.id);
      if (user?.following) {
        myFollowingArray.push(...user.following);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getReviews = async () => {
    let newData: Review[] = [];
    try {
      let data = await getAllDocsInCollection("recensioner");
      if (data) {
        let sorted = sortArray(data);
        newData = sorted;
      }
      sortFollowingReviews(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const sortFollowingReviews = (newData: Review[]) => {
    // check if following array is empty and if userID in review is in following array
    let isInMyFollwingArray = newData.some((item) => myFollowingArray.includes);
    if (myFollowingArray.length > 0 && isInMyFollwingArray) {
      // filter out reviews that are not in my following array
      let sorted = newData.filter((review) =>
        myFollowingArray.includes(review.userID)
      );
      setReviews(sorted);
    } else {
      return setReviews(newData);
    }
  };

  const sortArray = (array: Review[]) => {
    let sorted = array?.sort((a: any, b: any) => {
      return b.createdAt.toDate() - a.createdAt.toDate();
    });
    return sorted;
  };

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
            <View style={styles.separator} lightColor="#fff" darkColor="#fff" />
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
        <Text style={{ fontWeight: "bold", fontSize: 16, padding: 10 }}>
          Ny aktivitet
        </Text>
        {reviews.map((review) => {
          return (
            <ActivityCard
              key={review.id}
              review={review}
              updateReviews={getReviews}
            />
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
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
  separator: {
    marginVertical: 0.1,
    height: 1,
    width: "50%",
  },
});
