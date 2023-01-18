import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { Text } from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";

const Tabbar = () => {
  const colorScheme = useColorScheme();
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
  const navigate = useNavigation();

  const sortTopRated = () => {
    console.log("Toppbetyg");
    navigate.navigate("TopRating");
  };

  const sortTrending = () => {
    console.log("Trendande sorter");
    navigate.navigate("Trending");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tabb, themeContainerStyle]}>
        <View style={styles.wrapper}>
          <View style={styles.logoWrapper}>
            <Image
              style={styles.logo}
              source={require("../assets/images/trending.png")}
            />
            <Feather
              style={styles.icon}
              name="trending-up"
              size={30}
              color="#FFFD54"
            />
          </View>
          <Text
            style={styles.text}
            lightColor="#333"
            darkColor="#fff"
            onPress={() => sortTrending()}
          >
            Trendande sorter
          </Text>
        </View>
      </View>

      <View style={[styles.tabb, themeContainerStyle]}>
        <View style={styles.wrapper}>
          <View style={styles.logoWrapper}>
            <Image
              style={styles.logo}
              source={require("../assets/images/toppbetyg.png")}
            />
            <Feather
              style={styles.icon}
              name="bar-chart-2"
              size={34}
              color="#FFFD54"
            />
          </View>
          <Text
            style={styles.text}
            lightColor="#333"
            darkColor="#fff"
            onPress={() => sortTopRated()}
          >
            Toppbetyg
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabb: {
    justifyContent: "space-around",
    width: "100%",
    height: 50,
    marginTop: 10,
    marginLeft: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  text: {
    fontSize: 20,
    marginLeft: 20,
  },
  logo: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    height: 50,
    width: 50,
    opacity: 0.5,
  },
  logoWrapper: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  lightContainer: {
    backgroundColor: "#DCC4FD",
  },
  darkContainer: {
    backgroundColor: "#3D3745",
  },
});
export default Tabbar;
