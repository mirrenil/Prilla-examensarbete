import { View, Text, TextInput } from "../components/Themed";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Keyboard,
  Platform,
  useColorScheme,
} from "react-native";
import { Review } from "../Interfaces";
import { getOneDocById, updateSingleProperty } from "../helper";
import { RootStackScreenProps } from "../types";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { ReviewComment, CommentWithUsername } from "../Interfaces";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LoadingSpinner from "../components/LoadingSpinner";
import Colors from "../constants/Colors";

interface User {
  name: string;
  image: string;
}

export const CommentModal = ({ route }: RootStackScreenProps<"Comment">) => {
  const [review, setReview] = useState<Review>();
  const [author, setAuthor] = useState<User>();
  const [input, setInput] = useState<string>();
  const [comments, setComments] = useState<CommentWithUsername[]>([]);
  const navigation = useNavigation();
  const myUser = useSelector(currentReduxUser);
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme === "dark" ? false : true;

  // STYLING VARIABLES
  let inputHeight = 20;
  const isAndroid = Platform.OS === "ios" ? false : true;
  const scrollViewHeight = Platform.OS === "ios" ? "50vh" : "100%";

  useEffect(() => {
    getReview();
  }, []);

  useEffect(() => {
    getReviewAuthor();
    getCommentData();
  }, [review]);

  const getReview = async () => {
    try {
      let data = await getOneDocById("reviews", route.params.id);
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
              id: user.id,
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
      await updateSingleProperty("reviews", route.params.id, newObj);
    } catch (err) {
      console.log(err);
    }
    setComments([
      ...comments,
      {
        author: myUser.displayName,
        image: myUser.photo,
        text: input!,
        id: myUser.id,
      },
    ]);
    setInput("");
    getReview();
  };

  const styles = StyleSheet.create({
    comment: {
      padding: 10,
      flexDirection: "row",
    },
    commentWrapper: {
      marginBottom: 10,
    },
    border: {
      borderBottomColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.3)",
      borderBottomWidth: 1,
    },
    fatText: {
      fontWeight: "bold",
      textTransform: "capitalize",
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
    },
    inputWrapper: {
      padding: 10,
      justifyContent: "space-around",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Colors[colorScheme].grey.light,
      width: "100%",
      alignItems: "center",
      position: "absolute",
      zIndex: 100,
      right: 0,
      marginBottom: isAndroid ? 0 : inputHeight,
      bottom: 0,
    },
    inputWrapperIos: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      alignContent: "center",
      borderRadius: 6,
      padding: 10,
      backgroundColor: Colors[colorScheme].grey.light,
      width: "100%",
      marginBottom: inputHeight,
    },
    inputIos: {
      height: 40,
      padding: 10,
      width: "80%",
    },
    scrollView: {
      paddingHorizontal: 20,
      maxHeight: scrollViewHeight,
      marginBottom: inputHeight + 20,
    },
    keyboardAvoiding: {
      flex: 1,
    },
  });

  if (!review && !author) {
    return <LoadingSpinner />;
  } else {
    return (
      <>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          extraHeight={125}
          scrollEnabled
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={[styles.border, styles.comment]}>
                <Image source={{ uri: author?.image }} style={styles.image} />
                <View style={styles.textWrapper}>
                  <Text style={styles.fatText}>{author?.name}</Text>
                  <Text>{review?.description}</Text>
                </View>
              </View>
              {comments.map((c) => {
                return (
                  <View style={styles.commentWrapper}>
                    <View style={styles.comment}>
                      <Image source={{ uri: c.image }} style={styles.image} />
                      <View style={styles.textWrapper}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Profile", {
                              id: c.id,
                            })
                          }
                        >
                          <Text style={styles.fatText} key={c.id}>
                            {c.author}
                          </Text>
                        </TouchableOpacity>
                        <Text>{c.text}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            {!isAndroid && (
              <View style={styles.inputWrapperIos}>
                <TextInput
                  placeholderTextColor={isLight ? "black" : "white"}
                  placeholder="Lämna en kommentar..."
                  style={styles.inputIos}
                  lightColor="transparent"
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
                    color={
                      isLight ? Colors[colorScheme].primary.normal : "white"
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
        {isAndroid && (
          <View style={styles.inputWrapper}>
            <TextInput
              placeholderTextColor={isLight ? "black" : "white"}
              placeholder="Lämna en kommentar..."
              style={styles.input}
              value={input}
              onChangeText={setInput}
              multiline={true}
              numberOfLines={1}
              autoFocus={true}
              lightColor="transparent"
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={input ? false : true}
            >
              <Feather
                name="send"
                size={24}
                color={isLight ? Colors[colorScheme].primary.normal : "white"}
                style={{ marginTop: 5 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }
};
