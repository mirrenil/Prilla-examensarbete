import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Tabbar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tabb}>
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
              color="white"
            />
          </View>
          <Text style={styles.text}>Trendande sorter</Text>
        </View>
      </View>

      <View style={styles.tabb}>
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
              color="white"
            />
          </View>

          <Text style={styles.text}>Toppbetyg</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    width: "100%",
    height: 70,
    marginTop: 10,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabb: {
    justifyContent: "space-around",
    width: "100%",
    height: 50,
    backgroundColor: "#3D3745",
    marginTop: 10,
    marginLeft: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  text: {
    color: "white",
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
});
export default Tabbar;
