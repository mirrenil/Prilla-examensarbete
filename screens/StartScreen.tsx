import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { getAllDocsInCollection } from "../helper";
import { Review } from "../Interfaces";
import Tabbar from "../components/Tabbar";
import { RootTabScreenProps } from "../types";
import { ActivityCard } from "../components/ActivityCard";

export default function StartScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    let newData = [];
    let data = await getAllDocsInCollection("recensioner");

    if (data?.length) {
      newData = data;
    }
    setReviews(newData);
  };

  return (
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
            <Text>x</Text>
            <Image
              style={styles.logo}
              source={require("../assets/images/loop-logo.png")}
            />
          </View>
        </View>
      </View>
      <Tabbar />
      {reviews.map((review) => {
        return <ActivityCard key={review.id} review={review} />;
      })}
    </ScrollView>
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
