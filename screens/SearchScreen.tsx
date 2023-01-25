import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { ProductCard } from "../components/ProductCard";
import { View, Text } from "../components/Themed";
import { getAllDocsInCollection } from "../helper";
import { Product, User } from "../Interfaces";
import { LinearGradient } from "expo-linear-gradient";
import Colors, { gradientDark, gradientLight } from "../constants/Colors";
import LoadingSpinner from "../components/LoadingSpinner";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../types";
import { useIsFocused } from "@react-navigation/native";
import Constants from "expo-constants";

export default function SearchScreen({
  navigation,
}: RootStackScreenProps<"Search">) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isOnProductSearch, setIsOnProductSearch] = useState<boolean>(true);
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllProducts();
    getAllUsers();
  }, [isFocused]);

  useEffect(() => {
    if (!searchInput) {
      setFilteredProducts(allProducts);
      setFilteredUsers(allUsers);
      return;
    }
    if (isOnProductSearch) {
      sortProductsByText();
    } else {
      sortUsersByText();
    }
  }, [searchInput, isOnProductSearch]);

  const getAllProducts = async () => {
    let data = await getAllDocsInCollection("products");
    if (data) {
      setAllProducts(data);
      setFilteredProducts(data);
    }
  };

  const getAllUsers = async () => {
    let data = await getAllDocsInCollection("users");
    if (data) {
      setAllUsers(data);
      setFilteredUsers(data);
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

  const sortUsersByText = () => {
    let searchTerm = searchInput.toLowerCase();
    let filteredList = allUsers.filter((p) =>
      p.displayName.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredList);
  };

  return (
    <LinearGradient
      colors={
        isLight
          ? [gradientLight.from, gradientLight.to]
          : [gradientDark.from, gradientDark.to]
      }
    >
      {!allProducts.length || !allUsers.length ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          style={{ height: "100%", marginTop: Constants.statusBarHeight }}
        >
          <View style={search.container}>
            <Searchbar
              placeholder="Sök"
              onChangeText={setSearchInput}
              value={searchInput}
              icon="magnify"
              style={search.bar}
            />
            <View style={search.icons}>
              <TouchableOpacity
                onPress={() => {
                  setIsOnProductSearch(true);
                }}
              >
                <MaterialIcons
                  name="format-list-bulleted"
                  size={24}
                  color="white"
                  style={[
                    search.icon,
                    isOnProductSearch ? search.active : search.inActive,
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsOnProductSearch(false);
                }}
              >
                <MaterialCommunityIcons
                  name="account-search-outline"
                  size={24}
                  color="white"
                  style={[
                    search.icon,
                    isOnProductSearch ? search.inActive : search.active,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          {!isOnProductSearch ? (
            <>
              {filteredUsers.length ? (
                filteredUsers.map((user) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Profile", { id: user.id });
                      }}
                      style={styles.userInfo}
                    >
                      <Image
                        source={{ uri: user.photo }}
                        style={styles.profilePic}
                      />
                      <Text lightColor="#333" style={styles.username}>
                        {user.displayName}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={{ alignSelf: "center" }}>
                  Sökningen gav inga träffar.
                </Text>
              )}
            </>
          ) : (
            <>
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
              </View>
            </>
          )}
        </ScrollView>
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
  icons: {
    flexDirection: "row",
    width: 70,
    marginTop: 10,
    justifyContent: "space-between",
  },
  icon: { fontSize: 24 },
  active: {
    color: "white",
  },
  inActive: {
    color: "rgba(255,255,255,0.5)",
  },
});

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  username: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});
