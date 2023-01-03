import { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { RatingDots } from "../components/Rating";
import { Text, View } from "../components/Themed";
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
    sortProducts();
  }, [searchInput]);

  const getAllProducts = async () => {
    let data = await getAllDocsInCollection("produkter");
    if (data) {
      setAllProducts(data);
      setFilteredProducts(data);
    }
  };

  const sortProducts = () => {
    let searchTerm = searchInput.toLowerCase();
    let filteredList = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm)
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
        <Text style={margin.top}>Sortera: </Text>
      </View>
      <View style={content.container}>
        {filteredProducts.map((product) => {
          return (
            <View style={content.cardWrapper} key={product.id}>
              <Image source={{ uri: product.photo }} style={card.image} />
              <View style={{ flex: 3 }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Product", { id: product.id })
                  }
                >
                  <Text style={[text.fat, margin.bottom]}>
                    {product.name} {product.format}
                  </Text>
                </TouchableOpacity>
                <Text style={margin.bottom}>
                  {product.description.slice(0, 130)}...
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <RatingDots rating={product.rating ?? 0} />
                  <Text style={margin.left}>{product.rating}</Text>
                </View>
                <Text>{product.reviews.length} ratings</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const text = StyleSheet.create({
  fat: {
    fontWeight: "bold",
  },
});

const margin = StyleSheet.create({
  all: {
    margin: 10,
  },
  bottom: {
    marginBottom: 10,
  },
  left: {
    marginLeft: 10,
  },
  top: {
    marginTop: 10,
  },
});

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

const content = StyleSheet.create({
  container: {},
  cardWrapper: {
    width: "95%",
    minHeight: 100,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    padding: 10,
  },
});

const card = StyleSheet.create({
  image: {
    flex: 1,
    height: 90,
    width: 90,
    marginRight: 10,
  },
});
