import { Text } from "./Themed";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { query, where, getDocs, collection, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { Product, User } from "../Interfaces";
import firebase from "firebase/compat/app";
import { getDocsWithSpecificValue, getOneDocById } from "../helper";

export const FavoritesCard = () => {
  const user = useSelector(currentReduxUser);
  const [liked, setLiked] = useState<string[]>([]);

  useEffect(() => {
    getLiked();
  }, []);

  const getLiked = async () => {
    const favoritesArray: string[] = [];
    try {
      const favorites = await getOneDocById("users", user?.id);
      for (let i = 0; i < favorites?.liked.length; i++) {
        favoritesArray.push(favorites?.liked[i]);
      }
      setLiked(favoritesArray);
      console.log(liked, "liked favorites Array");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View>
      {liked.map((item) => {
        return <Text>{item}</Text>;
      })}
    </View>
  );
};
const styles = StyleSheet.create({});
