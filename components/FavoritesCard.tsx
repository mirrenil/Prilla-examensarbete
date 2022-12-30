import { Text } from "./Themed";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { query, where, getDocs, collection, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { User } from "../Interfaces";
import firebase from "firebase/compat/app";

export const FavoritesCard = () => {
  const user = useSelector(currentReduxUser);
  const [liked, setLiked] = useState<any>();
  const [likedArray, setLikedArray] = useState<string[]>([]);
  const usersRef = collection(db, "users");

  useEffect(() => {
    const fetch = async () => {
      await getDocs(usersRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id === user?.uid) {
            setLikedArray(doc.data().liked);
          }
        });
      });
    };
    fetch();
    console.log(likedArray, "likedArray");
  }, []);

  return (
    <View>
      {/* {liked?.liked.map(() => (
        <Text>{liked?.liked}</Text>
      ))} */}
    </View>
  );
};
const styles = StyleSheet.create({});
