import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getOneDocById } from "../helper";
import { Tag, Review, Product } from "../Interfaces";
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
            <View style={styles.productText}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Product", { id: review.productID })
                }
              >
                <Text style={styles.textBold}>
                  {product.brand + " " + product.name}
                </Text>
                <Text>{product.type}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row" }}>
              <RateInactive rating={review.rating} />
              <Text style={{ marginLeft: 10 }}>{review.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.description}>
          <Text>{review.description}</Text>
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
  },
});
