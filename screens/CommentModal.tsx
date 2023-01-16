import { View, Text, TextInput } from "../components/Themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  useColorScheme,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
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
import { useIsFocused } from "@react-navigation/native";
import { Comment } from "../Interfaces";

interface User {
  name: string;
  image: string;
}

interface FullComment {
  author: string;
  image: string;
  text: string;
  // id?: string;
}
export const CommentModal = ({ route }: RootStackScreenProps<"Comment">) => {
  const [review, setReview] = useState<Review>();
  const [author, setAuthor] = useState<User>();
  const [input, setInput] = useState<string>();
  const [comments, setComments] = useState<FullComment[]>([]);
  const myUser = useSelector(currentReduxUser);
  let isFocused = useIsFocused();

  useEffect(() => {
    getReview();
  }, []);

  useEffect(() => {
    getReviewAuthor();
    getCommentData();
  }, [review]);

  const getReview = async () => {
    try {
      let data = await getOneDocById("recensioner", route.params.id);
      setReview(data as Review);
    } catch (err) {
      console.log(err);
    }
  };

  const getReviewAuthor = async () => {
    try {
      let user = await getOneDocById("users", review?.userID);
      if (user) {
        setAuthor({ name: user.displayName, image: user.photo });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCommentAuthor = async (id: string) => {
    try {
      let user = await getOneDocById("users", id);
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  const getCommentData = async () => {
    if (review?.comments?.length) {
      let commentsArray: FullComment[] = [];
      for (let i = 0; i < review?.comments.length; i++) {
        try {
          let user = await getCommentAuthor(review?.comments[i].authorID);
          if (user) {
            commentsArray.push({
              author: user.displayName,
              image: user.photo,
              text: review?.comments[i].text,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
      setComments(commentsArray);
    }
  };

  const handleSubmit = async () => {
    let newObj = {};
    let newData: ReviewComment = {
      authorID: myUser.id,
      text: input!,
    };
    if (review?.comments) {
      newObj = { comments: [...review.comments, newData] };
    } else {
      newObj = { comments: [newData] };
    }
    try {
      await updateSingleProperty("recensioner", route.params.id, newObj);
    } catch (err) {
      console.log(err);
    }
    setInput("");
    getReview();
  };

  if (!review && !author) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  } else {
    return (
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View>
          <View style={[styles.border, styles.comment]}>
            <Image source={{ uri: author?.image }} style={styles.image} />
            <View style={styles.textWrapper}>
              <Text>{author?.name}</Text>
              <Text>{review?.description}</Text>
            </View>
          </View>
          <ScrollView>
            {comments.map((c) => {
              return (
                <View style={styles.comment}>
                  <Image source={{ uri: c.image }} style={styles.image} />
                  <View style={styles.textWrapper}>
                    <Text>{c.author}</Text>
                    <Text>{c?.text}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Lämna en kommentar..."
            style={styles.input}
            value={input}
            onChangeText={setInput}
            multiline={true}
            numberOfLines={1}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={input ? false : true}
          >
            <Text>Skicka</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
};
const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "space-between",
    height: "100%",
  },
  comment: {
    padding: 10,
    flexDirection: "row",
  },
  border: {
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#484152",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
