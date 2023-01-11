import { View, Text, TextInput } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";
import { Review } from "../Interfaces";
import {
  addNewDoc,
  getOneDocById,
  setOneDoc,
  updateSingleProperty,
} from "../helper";
import { RootStackScreenProps } from "../types";
import Colors from "../constants/Colors";
import { ActivityIndicator } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ReviewComment } from "../Interfaces";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { update } from "lodash";

interface User {
  name: string;
  image: string;
}

export const CommentModal = ({ route }: RootStackScreenProps<"Comment">) => {
  const [review, setReview] = useState<Review>();
  const [author, setAuthor] = useState<User>();
  const [input, setInput] = useState<string>();
  const [comments, setComments] = useState<ReviewComment>();
  const myUser = useSelector(currentReduxUser);

  useEffect(() => {
    getReview();
  }, []);

  useEffect(() => {
    getAuthor();
    if (review?.comments) {
      review?.comments.map((c) => {
        getComments(c);
      });
    }
  }, [review]);

  const getReview = async () => {
    try {
      let data = await getOneDocById("recensioner", route.params.id);
      setReview(data as Review);
    } catch (err) {
      console.log(err);
    }
  };

  const getAuthor = async () => {
    try {
      let user = await getOneDocById("users", review?.userID);
      if (user) {
        setAuthor({ name: user.displayName, image: user.photo });
        console.log(user.photo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getComments = async (comment: string) => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    let newData: ReviewComment = {
      authorID: myUser.id,
      reviewID: route.params.id,
      text: input!,
    };
    console.log(newData);

    try {
      await addNewDoc("comments", newData).then((doc) => {
        let newObj = review?.comments || [];
        newObj.push(doc!);
        updateSingleProperty("recensioner", route.params.id, {
          comments: newObj,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (!author && !review) {
    <ActivityIndicator size="small" color="#0000ff" />;
  } else {
    return (
      <View style={styles.wrapper}>
        <View style={styles.authorWrapper}>
          <Image source={{ uri: author?.image }} style={styles.image} />
          <View style={styles.textWrapper}>
            <Text>{author?.name}</Text>
            <Text>{review?.description}</Text>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Lämna en kommentar..."
            style={styles.input}
            value={input}
            onChangeText={setInput}
            multiline={true}
            numberOfLines={1}
            returnKeyType="search"
            returnKeyLabel="search"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={input ? false : true}
          >
            <Text>Skicka</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "space-between",
    height: "100%",
  },
  authorWrapper: {
    padding: 10,
    flexDirection: "row",
    borderBottomColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  textWrapper: {
    width: "70%",
    marginLeft: 10,
  },
  input: {
    height: 50,
    width: "80%",
    padding: 10,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});
