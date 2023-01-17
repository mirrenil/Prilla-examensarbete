import { View, Text, TextInput } from "../components/Themed";
import { StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { ProductCard } from "../components/ProductCard";

const TrendingModal = ({ navigation }: RootStackScreenProps<"Trending">) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductData();
    filteredByReviews();
  }, []);

  const getProductData = async () => {
    try {
      let data = await getAllDocsInCollection("produkter");
      setProducts(data as Product[]);
    } catch (err) {
      console.log(err);
    }
  };

  // filter the procucts by most reviews
  const filteredByReviews = () => {
    let filteredList = products.filter((p) => p.reviews.length >= 3);
    setFilteredProducts(filteredList);
  };

  return (
    <ScrollView>
      {filteredProducts.map((product) => {
        return <ProductCard product={product} />;
      })}
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   item: {
//     height: 50,
//     borderRadius: 6,
//     backgroundColor: "rgba(255,255,255,0.5)",
//     padding: 10,
//     margin: 10,
//   },
// });

export default TrendingModal;
