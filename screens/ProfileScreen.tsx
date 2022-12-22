import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function ProfileScreen({
  navigation,
}: RootTabScreenProps<"Profile">) {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: "80%",
  },
});
