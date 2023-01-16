import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getOneDocById } from "../helper";
import { Review, Product, Tag } from "../Interfaces";
import { RateInactive } from "./RateInactive";

interface Props {
  review: Review;
}

export const ReviewCard = ({ review }: Props) => {
  const [product, setProduct] = useState<Product>();
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
