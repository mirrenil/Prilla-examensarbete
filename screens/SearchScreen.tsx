import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { ProductCard } from "../components/ProductCard";
import { View } from "../components/Themed";
import { getAllDocsInCollection } from "../helper";
import { Product } from "../Interfaces";
import { RootTabScreenProps } from "../types";

export default function SearchScreen({
  navigation,
}: RootTabScreenProps<"Search">) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

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
    <ScrollView>
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
        {filteredProducts.map((product) => {
          return <ProductCard product={product} />;
        })}
      </View>
    </ScrollView>
  );
}

const search = StyleSheet.create({
  bar: {
    height: 40,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  container: {
    padding: 10,
  },
});
