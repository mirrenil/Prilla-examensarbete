import { ScrollView, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { ProductCard } from "../components/ProductCard";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "../components/Themed";

const TrendingScreen = ({ navigation }: RootStackScreenProps<"Trending">) => {
  const [products, setProducts] = useState<Product[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProductData();
    }
  }, [isFocused]);

  const getProductData = async () => {
    try {
      let data = await getAllDocsInCollection("produkter");
      filterByRating(data);
    } catch (err) {
      console.log(err);
    }
  };
  // filter the procucts by highest rating
  const filterByRating = (data: any) => {
    let filteredList = data.filter((p: Product) => p.reviews.length >= 3);
    sortProducts(filteredList);
  };

  const sortProducts = (filteredList: any) => {
    let mostRev: Product[] = [];
    let sorted = filteredList.sort((p: Product) => p.reviews.length >= 4);
    // let lengths = sorted.map(function (r: Product) {
    //   return r.reviews.length;
    // });
    const backwards = sorted.reverse();
    console.log(backwards);
    for (let i = 0; i < 5; i++) {
      mostRev.push(backwards[i]);
    }
    setProducts(mostRev);
  };

  console.log(products);

  return (
    <ScrollView>
      {products.map((product) => {
        return (
          <View style={styles.container}>
            <Text style={styles.number}>{products.indexOf(product) + 1}</Text>
            <View style={styles.product}>
              <ProductCard product={product} />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    fontSize: 20,
    paddingLeft: 30,
  },
  product: {
    width: "90%",
    paddingLeft: 10,
  },
});
export default TrendingScreen;
