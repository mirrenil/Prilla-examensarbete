import { Text } from "./Themed";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { query, where, getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";

export const FavoritesCard = () => {
  const [liked, setLiked] = useState([]);
  const docRef = collection(db, "users");

  const getFavorites = async () => {
    const q = query(
      docRef,
      where("liked", "array-contains", "6exAQJW12ChJMUnVWDLb")
    );
    const favorites: any = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const snus = {
        id: doc.id,
        ...doc.data(),
      };
      favorites.push(snus);
    });
    setLiked(favorites);
    console.log(favorites, "liked snus");
  };

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <View>
      <Text>Olika snus jag gillar :)</Text>
    </View>
  );
};
const styles = StyleSheet.create({});
