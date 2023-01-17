import { View, Text, TextInput } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Keyboard } from "react-native";
import { Review } from "../Interfaces";
import { getOneDocById, updateSingleProperty } from "../helper";
import { RootStackScreenProps } from "../types";
import { ActivityIndicator } from "react-native-paper";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { ReviewComment } from "../Interfaces";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";

interface User {
  name: string;
  image: string;
}

interface CommentWithUsername {
  author: string;
  image: string;
  text: string;
}
let inputHeight = 20;

export const CommentModal = ({ route }: RootStackScreenProps<"Comment">) => {
  const [review, setReview] = useState<Review>();
  const [author, setAuthor] = useState<User>();
  const [input, setInput] = useState<string>();
  const [comments, setComments] = useState<CommentWithUsername[]>([]);
  const myUser = useSelector(currentReduxUser);

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
      let commentsArray: CommentWithUsername[] = [];
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
      <KeyboardAwareScrollView style={styles.scrollView} extraHeight={125}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={[styles.border, styles.comment]}>
              <Image source={{ uri: author?.image }} style={styles.image} />
              <View style={styles.textWrapper}>
                <Text>{author?.name}</Text>
                <Text>{review?.description}</Text>
              </View>
            </View>
            {comments.map((c) => {
              return (
                <View style={styles.commentWrapper}>
                  <View style={styles.comment}>
                    <Image source={{ uri: c.image }} style={styles.image} />
                    <View style={styles.textWrapper}>
                      <Text>{c.author}</Text>
                      <Text>{c?.text}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={"#fff"}
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
              <Feather
                name="send"
                size={24}
                color="white"
                style={{ marginTop: 5 }}
              />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }
};
const styles = StyleSheet.create({
  comment: {
    padding: 10,
    flexDirection: "row",
  },
  commentWrapper: {
    marginBottom: inputHeight,
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
    height: 40,
    width: "80%",
    padding: 10,
    marginTop: 10,
  },
  inputWrapper: {
    padding: 10,
    justifyContent: "space-around",
    borderRadius: 6,
    flexDirection: "row",
    backgroundColor: "#151416",
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: inputHeight,
  },
  scrollView: {
    paddingHorizontal: 20,
    maxHeight: "50vh",
  },
  keyboardAvoiding: {
    flex: 1,
  },
});
