import { Text } from "./Themed";
import { StyleSheet, View, Image } from "react-native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { useState, useEffect } from "react";
import { Product, User } from "../Interfaces";
import { getOneDocById, getAllDocsInCollection } from "../helper";

export const FavoritesCard = () => {
  const user = useSelector(currentReduxUser);
  const favoritesArray: any = [];
  let photos: any = [];

  useEffect(() => {
    getLiked();
    compareLikedIds();
    getPhotos();
  }, []);

  const getLiked = async () => {
    try {
      const favorites = await getOneDocById("users", user?.id);
      for (let i = 0; i < favorites?.liked.length; i++) {
        favoritesArray.push(favorites?.liked[i]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get the products with same ID from the favorites array
  const compareLikedIds = async () => {
    const products = await getAllDocsInCollection("produkter");
    let likedProducts: any = [];
    if (!products) return;
    if (products) {
      likedProducts = products.filter((product) =>
        favoritesArray.includes(product.ProductID)
      );
      return likedProducts;
    }
  };

  const getPhotos = async () => {
    const products = await compareLikedIds();
    for (let i = 0; i < products.length; i++) {
      photos.push(products[i].Photo);
    }
    console.log(photos, "photo urls");
  };

  return (
    <View>
      {photos?.map((photo: any) => {
        return <Image style={styles.image} source={{ uri: `${photo}` }} />;
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
