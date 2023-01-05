import { Text } from "./Themed";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { Review, User } from "../Interfaces";
import { ReviewCard } from "./ReviewCard";
import React, { useEffect, useState } from "react";
import { getOneDocById } from "../helper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
interface Props {
  review: Review;
}

export const ActivityCard = ({ review }: Props) => {
  const [author, setAuthor] = useState<User>();
  const [like, setLike] = useState<boolean>(false);
  const navigation = useNavigation();

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

  return (
    <View>
      <ImageBackground
        source={{ uri: review.photo }}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.userInfo}>
          <Image source={{ uri: author?.photo }} />
          <Text lightColor="#333" style={styles.username}>
            {author?.displayName}
          </Text>
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
});
