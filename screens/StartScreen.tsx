import React, { useCallback, useEffect, useState } from "react";
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

export default function StartScreen({}: RootStackScreenProps<"Root">) {
  const myUser = useSelector(currentReduxUser);
  const [reviews, setReviews] = useState<Review[]>([]);
  const myFollowingArray: string[] = [];
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getMyFollowing();
    }
  }, [isFocused]);

  const getMyFollowing = async () => {
    try {
      const user = await getOneDocById("users", myUser.id);
      let myFollowing = user?.following;
      myFollowingArray.push(...myFollowing);
      getReviews();
    } catch (err) {
      console.log(err);
    }
    return myFollowingArray;
  };

  const getReviews = async () => {
    try {
      let newData: Review[] = [];
      myFollowingArray.map((id) => {
        getDocsWithSpecificValue("recensioner", "userID", id)
          .then((data) => {
            if (data) {
              newData.push(...data);
              let sorted = sortArray(newData);
              setReviews(sorted);
            }
          })
          .catch((err) => console.log(err));
      });
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

  if (reviews) {
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
              <View
                style={styles.separator}
                lightColor="#fff"
                darkColor="#fff"
              />
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
