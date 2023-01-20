import { Text } from "./Themed";
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { CommentWithUsername, Review, User } from "../Interfaces";
import { ReviewCard } from "./ReviewCard";
import React, { useEffect, useState } from "react";
import { deleteDocById, getOneDocById, updateSingleProperty } from "../helper";
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
import { useIsFocused } from "@react-navigation/native";
import Colors from "../constants/Colors";

interface Props {
  review: Review;
  updateReviews: () => void;
}

export const ActivityCard = ({ review, updateReviews }: Props) => {
  const [author, setAuthor] = useState<User>();
  const [like, setLike] = useState<boolean>(false);
  const navigation = useNavigation();
  const [comment, setComment] = useState<CommentWithUsername>();
  const myUser = useSelector(currentReduxUser);
  const [likesCount, setLikesCount] = useState<number>(0);
  let isFocused = useIsFocused();
  const colorScheme: any = useColorScheme();

  useEffect(() => {
    if (review.likes) {
      setLikesCount(review.likes.length);
    }
    getReviewAuthor();
    getCommentsData();
    checkIfLiked();
  }, [isFocused]);

  const getReviewAuthor = async () => {
    let data = await getOneDocById("users", review.userID);
    if (data) {
      setAuthor(data as User);
    }
  };

  const getCommentsData = async () => {
    if (review?.comments?.length) {
      try {
        let user = await getOneDocById("users", review.comments[0].authorID);
        if (user) {
          setComment({
            author: user.displayName,
            image: user.photo,
            text: review.comments[0].text,
            id: user.id,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addLike = async () => {
    let newData = {};
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikesCount(likesCount + 1);
    if (review.likes) {
      let allLikes = review.likes;
      let filteredList = allLikes.filter((id) => id !== myUser.id);
      filteredList.push(myUser.id);
      newData = { likes: filteredList };
    } else {
      newData = { likes: [myUser.id] };
    }
    try {
      await updateSingleProperty("recensioner", review.id, newData);
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikesCount(likesCount - 1);

    if (review.likes) {
      let likesArray = review.likes;
      let filteredList = likesArray.filter((id) => id !== myUser.id);
      try {
        await updateSingleProperty("recensioner", review.id, {
          likes: filteredList,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const checkIfLiked = () => {
    if (review.likes) {
      let isLiked = review.likes.some((id) => id === myUser.id);
      setLike(isLiked);
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

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: Colors[colorScheme].primary.dark,
      marginVertical: 1,
    },
    image: {
      paddingBottom: 10,
      minHeight: 260,
      justifyContent: "flex-end",
      alignItems: "center",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      padding: 10,
    },
    profilePic: {
      height: 30,
      width: 30,
      borderRadius: 100,
    },
    username: {
      fontWeight: "bold",
      marginLeft: 10,
    },
    buttons: {
      paddingLeft: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    comment: {
      padding: 10,
      flexDirection: "row",
    },
    textWrapper: {
      width: "70%",
      marginLeft: 10,
    },
    commentImg: {
      height: 30,
      width: 30,
      borderRadius: 100,
    },
  });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => navigation.navigate("Profile", { id: author!.id })}
      >
        <Image source={{ uri: author?.photo }} style={styles.profilePic} />
        <Text lightColor="#333" style={styles.username}>
          {author?.displayName}
        </Text>
      </TouchableOpacity>

      <ImageBackground
        source={{ uri: review.photo }}
        resizeMode="cover"
        style={styles.image}
      >
        <ReviewCard key={review.id} review={review} />
      </ImageBackground>
      <View style={styles.buttons}>
        <View style={{ flexDirection: "row" }}>
          {like ? (
            <TouchableOpacity
              onPress={() => {
                removeLike();
                setLike(false);
              }}
            >
              <AntDesign name="heart" size={24} color="#783BC9" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                addLike();
                setLike(true);
              }}
            >
              <AntDesign name="hearto" size={26} color="#783BC9" />
            </TouchableOpacity>
          )}
          <Text>{likesCount >= 1 ? likesCount : null}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Comment", { id: review.id })}
          >
            <MaterialCommunityIcons
              style={{ marginLeft: 10 }}
              name="comment-outline"
              size={26}
              color="#783BC9"
            />
          </TouchableOpacity>
        </View>

        {review.userID === myUser?.id && (
          <View>
            <FontAwesome5
              name="trash"
              size={20}
              color="#783BC9"
              onPress={() => handleRemove(review.id as string)}
            />
          </View>
        )}
      </View>

      {comment && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Comment", { id: review.id })}
        >
          <View style={styles.comment}>
            <Image source={{ uri: comment?.image }} style={styles.commentImg} />
            <View style={styles.textWrapper}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Profile", { id: review!.userID })
                }
              >
                <Text>{comment?.author}</Text>
                <Text>{comment?.text}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
