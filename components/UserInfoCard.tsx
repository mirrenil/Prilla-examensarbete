import { Text } from "./Themed";
import { Image, StyleSheet, View } from "react-native";
import { User } from "../Interfaces";
import React from "react";

interface Props {
  user: User;
}

export const UserInfoCard = ({ user }: Props) => {
  return (
    <View>
      <View style={styles.row}>
        <Text darkColor="#fff" lightColor="#fff">
          Recensioner
        </Text>
        <Image source={{ uri: user?.photo }} />
        <Text darkColor="#fff" lightColor="#fff">
          Betyg
        </Text>
      </View>
      <View style={styles.row}>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.reviews.length}
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.displayName}
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.grade}
        </Text>
      </View>
      <View style={styles.center}>
        <Text darkColor="#fff" lightColor="#fff">
          Medlem sedan:
        </Text>
        <Text darkColor="#fff" lightColor="#fff">
          {user?.createdAt.toLocaleString("sv-SE").substring(0, 10)}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 80,
  },
  center: {
    alignItems: "center",
  },
});
