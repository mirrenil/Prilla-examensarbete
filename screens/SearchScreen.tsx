import { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { Text, View } from "../components/Themed";
import { getAllDocsInCollection } from "../helper";
import { Product } from "../Interfaces";
// import DropDownPicker from 'react-native-dropdown-picker'

export default function SearchScreen() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    let data = await getAllDocsInCollection("produkter");
    if (data) {
      setProducts(data);
    }
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
        <Text>Sortera: </Text>
      </View>
      <View style={content.container}>
        {products.map((product) => {
          return (
            <View style={content.cardWrapper}>
              <Image source={{ uri: product.photo }} style={card.image} />
              <View>
                <Text>{product.name}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

const search = StyleSheet.create({
  bar: {
    // width: "80%",
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
    height: 100,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
});

const card = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
  },
});
