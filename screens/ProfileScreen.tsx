import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Image, Button } from "react-native";

import { Text, View } from "../components/Themed";
import { ActivityCard } from "../components/ActivityCard";
import { UserInfoCard } from "../components/UserInfoCard";
import { User } from "../Interfaces";
import user from "../redux/reducers/users";
import { getCurrentUser } from "../redux/actions/index";

interface Props {
  user: User;
}
export default function ProfileScreen({ user }: Props) {
  const [follow, setFollow] = useState(false);

  const toggleButton = () => {
    setFollow(!follow);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <UserInfoCard user={user} />

        <Button
          color="#FFFD54"
          onPress={toggleButton}
          title={follow ? "Följer" : "Följ"}
        />
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.favorites}>
        <View style={styles.box}>
          <Text lightColor="#fff" darkColor="#fff">
            Favoriter <AntDesign name="right" size={16} color="white" />
          </Text>
        </View>
        {/* <FavoritesCard /> */}
        <Text lightColor="#fff" darkColor="#fff" style={styles.smallText}>
          Senast uppdaterad:
        </Text>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.activities}>
        <View style={styles.box}>
          <Text lightColor="#fff" darkColor="#fff">
            Aktiviteter
          </Text>
          <AntDesign name="right" size={16} color="white" />
        </View>
      </View>
      {/* should only display reviews by specific user */}
      {/* {reviews.map((review: any) => {
        return <ActivityCard key={review.id} review={review} />;
      })} */}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  container: {
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
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFD54",
    padding: 10,
    borderRadius: 6,
    width: 100,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    margin: 10,
  },
  smallText: {
    fontSize: 9,
    margin: 10,
  },
  activities: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    margin: 10,
  },
  favorites: {},
});
