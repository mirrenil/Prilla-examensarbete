import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product } from "../Interfaces";
import { getAllDocsInCollection } from "../helper";
import { ProductCard } from "../components/ProductCard";
import { useIsFocused } from "@react-navigation/native";
import { Text } from "../components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import { gradientLight, gradientDark } from "../constants/Colors";

const TopRatingsScreen = ({
  navigation,
}: RootStackScreenProps<"TopRating">) => {
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
      let data = await getAllDocsInCollection("produkter");
      sortProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const sortProducts = (data: any) => {
    let tenTopArray: Product[] = [];
    let sorted = data.sort(({ rating: a }, { rating: b }) => b - a);
    for (let i = 0; i < 10; i++) {
      tenTopArray.push(sorted[i]);
      console.log(sorted[i].name);
    }
    setProducts(tenTopArray);
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
        {products.map((product) => {
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
                  <ProductCard product={product} />
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

export default TopRatingsScreen;
