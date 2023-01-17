import { ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { ProductCard } from "../components/ProductCard";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "../components/Themed";

const TrendingModal = ({ navigation }: RootStackScreenProps<"Trending">) => {
  const [products, setProducts] = useState<Product[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProductData();
    }
  }, [isFocused]);

  const sortProducts = (data: any) => {
    let tenTopArray: Product[] = [];
    let sorted = data.sort(({ rating: a }, { rating: b }) => b - a);
    for (let i = 0; i < 10; i++) {
      tenTopArray.push(sorted[i]);
      console.log(sorted[i].name);
    }
    setProducts(tenTopArray);
  };

  const getProductData = async () => {
    try {
      let data = await getAllDocsInCollection("produkter");
      sortProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView>
      {products.map((product) => {
        return (
          <>
            <Text>{products.indexOf(product) + 1}</Text>
            <ProductCard product={product} />
          </>
        );
      })}
    </ScrollView>
  );
};

export default TrendingModal;
