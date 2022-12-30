import { Text } from "./Themed";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { query, where, getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { User } from "../Interfaces";

export const FavoritesCard = () => {
  const user = useSelector(currentReduxUser);
  const [liked, setLiked] = useState<User>();
  const docRef = collection(db, "users");

  const getFavorites = async () => {
    const q = query(docRef, where("id", "==", `${user?.id}`));
    const favorites: any = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const snusInArray = {
        id: doc.id,
        ...doc.data(),
      };
      favorites.push(snusInArray);
    });
    setLiked(favorites);
    console.log("favorites: ", favorites.liked);
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <View>
      {liked?.liked.map(() => (
        <Text>{liked?.liked}</Text>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({});
