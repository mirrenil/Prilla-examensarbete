import { Text } from "./Themed";
import { StyleSheet, View, Image } from "react-native";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { useEffect, useState } from "react";
import { getOneDocById, getAllDocsInCollection } from "../helper";

export const FavoritesCard = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const user = useSelector(currentReduxUser);
  const favoritesArray: any = [];
  let photoURLS: string[] = [];

  useEffect(() => {
    getLiked();
    compareLikedIds();
    imagesLoaded();
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
        favoritesArray.includes(product.id)
      );
      return likedProducts;
    }
  };

  const getPhotos = async () => {
    const products = await compareLikedIds();
    for (let i = 0; i < products.length; i++) {
      photoURLS.push(products[i].photo);
    }
    console.log(photoURLS.length);
    return photoURLS;
  };

  const imagesLoaded = async () => {
    try {
      const asyncUrls = await getPhotos();
      setUrls(asyncUrls);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.row}>
      {urls.map((url, index) => (
        <Image
          key={index}
          style={styles.image}
          source={{
            uri: url,
          }}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  row: {
    flexDirection: "row",
  },
});
