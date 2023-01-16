import { FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import React, { useCallback, useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { getOneDocById } from "../helper";
import { Review, Product, Tag } from "../Interfaces";
import { currentReduxUser } from "../redux/signin";
import { RateInactive } from "./RateInactive";
import * as Haptics from "expo-haptics";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  review: Review;
}

export const ReviewCard = ({ review }: Props) => {
  const [product, setProduct] = useState<Product>();
  const myUser = useSelector(currentReduxUser);
  const navigation = useNavigation();

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    let data = await getOneDocById("produkter", review.productID);
    if (data) {
      setProduct(data as Product);
    }
  };

  const handleRemove = useCallback(
    async (id: string) => {
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
              const specificReview = doc(db, "recensioner", id);
              deleteDoc(specificReview);
              console.log(specificReview, "deleted");
            },
          },
        ]
      );
      getProduct();
    },
    [product]
  );

  if (product) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.productData}>
          <Image style={styles.image} source={{ uri: product.photo }} />
          <View style={styles.textAndRating}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Product", { id: review.productID })
              }
            >
              <View style={styles.productText}>
                <Text style={styles.textBold}>
                  {product.brand + " " + product.name}
                </Text>
                <Text>{product.type}</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row" }}>
              <RateInactive rating={review.rating} />
              <Text style={{ marginLeft: 25, marginTop: 10 }}>
                {review.rating}/5
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.description}>
          <Text>{review.description}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {review.tags.map((tag: Tag) => {
            return (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagName}>{tag?.name}</Text>
              </View>
            );
          })}

          {review.userID === myUser?.id && (
            <View style={{ position: "absolute", left: "85%" }}>
              <FontAwesome5
                name="trash"
                size={24}
                color="#783BC9"
                onPress={() => handleRemove(review.id as string)}
              />
            </View>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    borderRadius: 6,
    width: "90%",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  image: {
    height: 60,
    width: 60,
    flex: 1,
    borderRadius: 50,
  },
  productData: {
    flexDirection: "row",
  },
  textAndRating: {
    marginLeft: 10,
    flex: 4,
  },
  productText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textBold: {
    fontWeight: "bold",
  },
  description: {
    padding: 10,
    flexDirection: "row",
  },
  tagsContainer: {
    borderWidth: 1,
    borderColor: "#575060",
    width: 73,
    margin: 5,
    height: 30,
    padding: 5,
    borderRadius: 6,
  },
  tagName: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
