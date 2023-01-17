import { ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { ProductCard } from "../components/ProductCard";
import { useIsFocused } from "@react-navigation/native";

const TrendingModal = ({ navigation }: RootStackScreenProps<"Trending">) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProductData();
      filteredByReviews();
    }
  }, [isFocused]);

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

export default TrendingModal;
