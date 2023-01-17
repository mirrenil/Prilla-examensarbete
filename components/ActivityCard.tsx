import { Text } from "./Themed";
import { Alert, Image, ImageBackground, StyleSheet, View } from "react-native";
import { Review, User } from "../Interfaces";
import { ReviewCard } from "./ReviewCard";
import React, { useEffect, useState } from "react";
import { deleteDocById, getOneDocById } from "../helper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
interface Props {
  review: Review;
  updateReviews: () => void;
}

export const ActivityCard = ({ review, updateReviews }: Props) => {
  const [author, setAuthor] = useState<User>();
  const [like, setLike] = useState<boolean>(false);
  const myUser = useSelector(currentReduxUser);

  useEffect(() => {
    getReviewAuthor();
  }, []);

  const toggleButton = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLike(!like);
  };

  const getReviewAuthor = async () => {
    let data = await getOneDocById("users", review.userID);
    if (data) {
      setAuthor(data as User);
    }
  };

  const handleRemove = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Är du säker på att du vill ta bort din recension?",
      "Du kan inte ångra dig!",
      [
        {
          text: "Avbryt",
          onPress: () => console.log("AVBRYT Pressed"),
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: () => {
            deleteDocById("recensioner", id).then(() => updateReviews());
          },
        },
      ]
    );
  };

  return (
    <View>
      <ImageBackground
        source={{ uri: review.photo }}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.userInfo}>
          <Text>User Pic</Text>
          <Text style={styles.username}>{author?.displayName}</Text>
        </View>
        <ReviewCard key={review.id} review={review} />
      </ImageBackground>
      <View style={styles.social}>
        <TouchableOpacity onPress={toggleButton}>
          {like ? (
            <AntDesign name="heart" size={24} color="#783BC9" />
          ) : (
            <AntDesign name="hearto" size={26} color="#783BC9" />
          )}
        </TouchableOpacity>

        <MaterialCommunityIcons
          style={{ marginLeft: 10 }}
          name="comment-outline"
          size={26}
          color="#783BC9"
        />
        {review.userID === myUser?.id && (
          <View style={styles.removeIcon}>
            <FontAwesome5
              name="trash"
              size={24}
              color="#783BC9"
              onPress={() => handleRemove(review.id as string)}
            />
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 230,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    width: "100%",
  },
  username: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  social: {
    paddingLeft: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  removeIcon: {
    position: "absolute",
    left: "90%",
    bottom: 30,
  },
});
