import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { Text } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

const Tabbar = () => {
  const colorScheme = useColorScheme();
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
  const navigate = useNavigation();

  const sortTopRated = () => {
    navigate.navigate("TopRating");
  };

  const sortTrending = () => {
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
              size={35}
              color="black"
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
              size={40}
              color="black"
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
    opacity: 0.8,
  },
  logoWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
  },
  lightContainer: {
    backgroundColor: "white",
  },
  darkContainer: {
    backgroundColor: "#3D3745",
  },
});
export default Tabbar;
