import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Image, Button } from "react-native";

import { Text, View } from "../components/Themed";
import { ActivityCard } from "../components/ActivityCard";
import { UserInfoCard } from "../components/UserInfoCard";
import { FavoritesCard } from "../components/FavoritesCard";
import { User } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { RootTabScreenProps } from "../types";
import { selectReduxEmail } from "../redux/signin";
import { useDispatch, useSelector } from "react-redux";
import { reduxDisplayName } from "../redux/signup";

export default function ProfileScreen({
  navigation,
  route,
}: RootTabScreenProps<"Profile">) {
  const [follow, setFollow] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const dispatch = useDispatch();
  const userEmail = useSelector(selectReduxEmail);
  const userDisplayName = useSelector(reduxDisplayName);

  const toggleButton = () => {
    setFollow(!follow);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    let newData = [];
    let data = await getAllDocsInCollection("users");

    if (data?.length) {
      newData = data;
    }
    setUsers(newData);
  };
  console.log(userEmail, userDisplayName, "user info from redux");

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <UserInfoCard />

        <TouchableOpacity
          style={[follow ? styles.borderButton : styles.button]}
          onPress={toggleButton}
        >
          <Text
            darkColor="#201A28"
            lightColor="#201A28"
            style={[follow ? styles.borderButtonText : styles.buttonText]}
          >
            {follow ? "Följer" : "Följ"}{" "}
            {follow ? <AntDesign name="down" size={14} color="white" /> : null}
          </Text>
        </TouchableOpacity>
        {userEmail ? <Text>{userEmail}</Text> : <Text>Användarnamn</Text>}
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
  borderButton: {
    borderWidth: 0.2,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 6,
    width: 120,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  borderButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    color: "#fff",
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
