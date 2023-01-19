import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { ProductCard } from "../components/ProductCard";
import { View, Text } from "../components/Themed";
import { getAllDocsInCollection } from "../helper";
import { Product } from "../Interfaces";
import { RootTabScreenProps } from "../types";
import { LinearGradient } from "expo-linear-gradient";
import Colors, { gradientDark, gradientLight } from "../constants/Colors";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SearchScreen({
  navigation,
}: RootTabScreenProps<"Search">) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    sortProductsByText();
  }, [searchInput]);

  const getAllProducts = async () => {
    let data = await getAllDocsInCollection("produkter");
    if (data) {
      setAllProducts(data);
      setFilteredProducts(data);
    }
  };

  const sortProductsByText = () => {
    let searchTerm = searchInput.toLowerCase();
    let filteredList = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filteredList);
  };

  return (
    <LinearGradient
      colors={
        isLight
          ? [gradientLight.from, gradientLight.to]
          : [gradientDark.from, gradientDark.to]
      }
    >
      {allProducts.length ? (
        <ScrollView style={{ height: "100%" }}>
          <View style={search.container}>
            <Searchbar
              placeholder="Sök"
              onChangeText={setSearchInput}
              value={searchInput}
              icon="magnify"
              style={search.bar}
            />
          </View>
          <View>
            {filteredProducts.length ? (
              filteredProducts.map((product) => {
                return <ProductCard product={product} />;
              })
            ) : (
              <Text style={{ alignSelf: "center" }}>
                Sökningen gav inga träffar.
              </Text>
            )}
            {/* {} */}
          </View>
        </ScrollView>
      ) : (
        <LoadingSpinner />
      )}
    </LinearGradient>
  );
}

const search = StyleSheet.create({
  bar: {
    height: 40,
    borderRadius: 6,
    backgroundColor: "white",
  },
  container: {
    padding: 10,
  },
});
