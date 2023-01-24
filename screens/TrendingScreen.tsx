import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { ProductCard } from "../components/ProductCard";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "../components/Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { gradientLight, gradientDark } from "../constants/Colors";

const TrendingScreen = ({ navigation }: RootStackScreenProps<"Trending">) => {
  const [products, setProducts] = useState<Product[]>([]);
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProductData();
    }
  }, [isFocused]);

  const getProductData = async () => {
    try {
      let data = await getAllDocsInCollection("products");
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
    const backwards = sorted.reverse();
    for (let i = 0; i < 5; i++) {
      mostRev.push(backwards[i]);
    }
    setProducts(mostRev);
  };

  return (
    <LinearGradient
      colors={
        isLight
          ? [gradientLight.from, gradientLight.to]
          : [gradientDark.from, gradientDark.to]
      }
    >
      <ScrollView>
        {products.map((product, index) => {
          return (
            <View style={styles.container}>
              <Text style={styles.number}>{products.indexOf(product) + 1}</Text>
              <View style={styles.product}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.ImpactFeedbackStyle.Heavy;
                    navigation.navigate("Product", { id: product.id });
                  }}
                >
                  <ProductCard key={index} product={product} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
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
