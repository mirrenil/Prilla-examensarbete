import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import { useFonts } from "expo-font";
import { getAllDocsInCollection } from "../helper";
import { Review } from "../Interfaces";
import Tabbar from "../components/Tabbar";
import { RootTabScreenProps } from "../types";
import { ActivityCard } from "../components/ActivityCard";
import { getAdditionalUserInfo } from "firebase/auth";
import Colors, { gradientDark, gradientLight } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function StartScreen({
  navigation,
}: RootTabScreenProps<"Home">) {
  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter-VariableFont_slnt,wght.ttf"),
    Caramel: require("../assets/fonts/Caramel-Regular.ttf"),
    OleoScript: require("../assets/fonts/OleoScript-Regular.ttf"),
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

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
                source={require("../assets/images/loop.png")}
              />
            </View>
          </View>
        </View>
        <Tabbar />
        {reviews.map((review) => {
          return <ActivityCard key={review.id} review={review} />;
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
    fontFamily: "Inter",
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
    height: 10,
    fontSize: 70,
  },
  logo: {
    height: 30,
    width: 80,
  },
  prilla: {
    fontFamily: "OleoScript",
    fontStyle: "normal",
    fontSize: 35,
    fontWeight: "bold",
    color: "#FFFD54",
  },
  separator: {
    marginVertical: 0.1,
    height: 1,
    width: "50%",
  },
});
