import {
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Product } from "../Interfaces";
import { RateInactive } from "./RateInactive";
import { Text, View } from "../components/Themed";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import Colors from "../constants/Colors";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const navigation = useNavigation();
  const colorScheme: any = useColorScheme();

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

  const content = StyleSheet.create({
    container: {},
    cardWrapper: {
      width: "95%",
      minHeight: 100,
      backgroundColor: Colors[colorScheme].section,
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
      borderRadius: 50,
    },
  });

  return (
    <View style={content.cardWrapper} key={product.id}>
      <Image source={{ uri: product.photo }} style={card.image} />
      <View style={{ flex: 3, backgroundColor: "transparent" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Product", { id: product.id })}
        >
          <Text style={[text.fat, margin.bottom]} lightColor="white">
            {product.name} {product.format}
          </Text>
        </TouchableOpacity>
        <Text style={margin.bottom} lightColor="white">
          {product.description.slice(0, 130)}...
        </Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            padding: 10,
            borderRadius: 6,
            width: "80%",
          }}
        >
          <RateInactive rating={product.rating ?? 0} />
          <Text style={margin.left} lightColor="white">
            {product.rating}
          </Text>
        </View>
        <Text lightColor="white">{product.reviews.length} ratings</Text>
      </View>
    </View>
  );
};
