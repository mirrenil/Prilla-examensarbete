import { is } from "immer/dist/internal";
import { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { ProductCard } from "../components/ProductCard";
import { RateInactive } from "../components/RateInactive";
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
  const [isSortByRate, setIsSortByRate] = useState<boolean>(false);

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

  const sortByRate = () => {
    let sortable = allProducts;
    sortable = sortable.sort((a, b) =>
      a.rating > b.rating ? -1 : b.rating > a.rating ? 1 : 0
    );
    setFilteredProducts(sortable);
    setIsSortByRate(true);
    return sortable;
  };

  const sortByNew = () => {
    let sortable = allProducts;
    sortable = sortable.sort((a, b) => (a.name > b.name ? -1 : 1));

    sortable.map((p) => {
      console.log(p.name);
    });
    // setFilteredProducts(sortable);
    // setIsSortByRate(true);
    // return sortable;
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
        <View>
          <Text style={margin.top}>Sortera: </Text>
          <TouchableOpacity onPress={sortByRate}>
            <Text>Högst betyg</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sortByNew}>
            <Text>Nyheter</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={content.container}>
        {isSortByRate
          ? filteredProducts.map((p) => {
              return <Text>{p.rating}</Text>;
            })
          : filteredProducts.map((product) => {
              return <ProductCard product={product} />;
            })}
      </View>
    </ScrollView>
  );
}

// const text = StyleSheet.create({
//   fat: {
//     fontWeight: "bold",
//   },
// });

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
    backgroundColor: "rgba(255,255,255,0.5)",
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

// const card = StyleSheet.create({
//   image: {
//     flex: 1,
//     height: 90,
//     width: 90,
//     marginRight: 10,
//   },
// });
