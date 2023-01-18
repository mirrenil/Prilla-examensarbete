import { FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Alert, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getOneDocById } from "../helper";
import { Review, Product, Tag } from "../Interfaces";
import { RateInactive } from "./RateInactive";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";

interface Props {
  review: Review;
}

export const ReviewCard = ({ review }: Props) => {
  const [product, setProduct] = useState<Product>();
  const myUser = useSelector(currentReduxUser);
  const navigation = useNavigation();
  const colorScheme: any = useColorScheme();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getProduct();
    }
  }, [isFocused]);

  const handleRemove = (id: string) => {};

  const getProduct = async () => {
    let data = await getOneDocById("produkter", review.productID);
    if (data) {
      setProduct(data as Product);
    }
  };

  const styles = StyleSheet.create({
    image: {
      height: 60,
      width: 60,
      flex: 1,
      borderRadius: 50,
    },
    productData: {
      flexDirection: "row",
    },
    textAndRating: {
      marginLeft: 10,
      flex: 4,
    },
    productText: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    textBold: {
      fontWeight: "bold",
    },
    description: {
      padding: 10,
      flexDirection: "row",
    },
    wrapper: {
      backgroundColor: Colors[colorScheme].section,
      marginTop: 10,
      borderRadius: 6,
      width: "90%",
      padding: 10,
      maxHeight: 200,
    },
    container: {
      borderWidth: 1,
      borderColor: "#575060",
      width: 73,
      margin: 5,
      height: 30,
      padding: 5,
      borderRadius: 6,
    },
    name: {
      textAlign: "center",
      fontWeight: "bold",
    },
    removeIcon: {
      position: "absolute",
      left: "90%",
      bottom: 30,
    },
  });

  if (product) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.productData}>
          <Image style={styles.image} source={{ uri: product.photo }} />
          <View
            // lightColor="#7e7885"
            // darkColor="#3D3745"
            // lightColor="transparent"
            style={styles.textAndRating}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Product", { id: review.productID })
              }
            >
              <View
                // lightColor="#7e7885"
                // darkColor="#3D3745"
                // lightColor="transparent"
                style={styles.productText}
              >
                <Text
                  style={styles.textBold}
                  lightColor="#fff"
                  darkColor="#fff"
                >
                  {product.brand + " " + product.name}
                </Text>
                <Text lightColor="#fff" darkColor="#fff">
                  {product.type}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              // lightColor="#7e7885"
              darkColor="#3D3745"
              // lightColor="transparent"
              style={{ flexDirection: "row" }}
            >
              <RateInactive rating={review.rating} />
              <Text lightColor="#fff" style={{ marginLeft: 25, marginTop: 10 }}>
                {review.rating} / 5
              </Text>
            </View>
          </View>
        </View>
        <View
          // lightColor="#7e7885"
          darkColor="#3D3745"
          // lightColor="transparent"
          style={styles.description}
        >
          <Text lightColor="#fff" darkColor="#fff">
            {review.description}
          </Text>
        </View>
        <View style={{ position: "relative" }}>
          {review.userID === myUser?.id && (
            <View style={styles.removeIcon}>
              <FontAwesome5
                name="trash"
                size={24}
                color="#783BC9"
                onPress={() => handleRemove(review.id as string)}
              />
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row" }}>
          {review.tags.map((tag: Tag) => {
            return (
              <View style={styles.container}>
                <Text lightColor="#fff" style={styles.name}>
                  {tag?.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <Text lightColor="#333" darkColor="#fff">
          Loading
        </Text>
      </View>
    );
  }
};
