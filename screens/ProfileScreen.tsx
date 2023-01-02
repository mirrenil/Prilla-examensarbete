import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { ActivityCard } from "../components/ActivityCard";
import { UserInfoCard } from "../components/UserInfoCard";
import { FavoritesCard } from "../components/FavoritesCard";
import { RootTabScreenProps } from "../types";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { getDocsWithSpecificValue, getOneDocById } from "../helper";
import { Review } from "../Interfaces";

export default function ProfileScreen({
  navigation,
  route,
}: RootTabScreenProps<"Profile">) {
  const [follow, setFollow] = useState(false);
  const user = useSelector(currentReduxUser);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loader();
  }, [user]);

  const getReviews = async () => {
    let userReviews = [];
    let data = await getDocsWithSpecificValue(
      "recensioner",
      "userID",
      route.params.id
    );
    console.log(data, "data from getReviews");
    if (data) {
      for (let review of data) {
        let x = await getReviewByCurrentUser(review.userID);
        userReviews.push({ ...review, author: x });
      }
      console.log(userReviews, "reviews");
    }
  };

  const getReviewByCurrentUser = async (id: string) => {
    console.log("in getReviewAuthor");
    try {
      const user = await getOneDocById("users", id);
      if (user) {
        let name = user?.displayName;
        return name;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loader = async () => {
    try {
      const loaded = await getReviews().then(() => {
        console.log("in then");
        return reviews;
      });
      setReviews(loaded);
      console.log(reviews, "reviews");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleButton = () => {
    setFollow(!follow);
  };
  console.log(user?.displayname, "user");
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <UserInfoCard />
        {user?.id !== route.params.id && (
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
              {follow ? (
                <AntDesign name="down" size={14} color="white" />
              ) : null}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.favorites}>
        <View style={styles.box}>
          <Text lightColor="#fff" darkColor="#fff" style={styles.text}>
            Favoriter <AntDesign name="right" size={16} color="white" />
          </Text>
        </View>
        <FavoritesCard />
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.activities}>
        <View style={styles.box}>
          <Text lightColor="#fff" darkColor="#fff" style={styles.text}>
            Aktiviteter
          </Text>
          <AntDesign name="right" size={16} color="white" />
        </View>
        {reviews.map((review: Review) => {
          return <ActivityCard key={review.id} review={review} />;
        })}
      </View>
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
  },
  smallText: {
    fontSize: 9,
    margin: 10,
  },
  text: {
    fontSize: 17,
    marginBottom: 10,
  },
  activities: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 20,
  },
  favorites: {
    marginLeft: 20,
  },
});
