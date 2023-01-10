import { View, Text } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { Review } from "../Interfaces";
import { getOneDocById } from "../helper";
import { RootStackScreenProps } from "../types";

export const CommentModal = ({ route }: RootStackScreenProps<"Comment">) => {
  const [review, setReview] = useState<Review>();
  const [author, setAuthor] = useState<string>();

  useEffect(() => {
    getReview();
  }, []);

  const getReview = async () => {
    try {
      let data = await getOneDocById("recensioner", route.params.id);
      setReview(data as Review);
      getAuthor();
    } catch (err) {
      console.log(err);
    }
  };

  const getAuthor = async () => {
    try {
      let user = await getOneDocById("users", review?.userID);
      if (user) {
        setAuthor(user.displayName as string);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View>
        {/* <Image source={} /> */}
        <View>
          <Text>{author}</Text>
          <Text>{review?.description}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});
