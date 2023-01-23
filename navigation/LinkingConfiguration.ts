/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          HomeStack: {
            screens: {
              HomeScreen: "Home",
              ProductDetailScreen: "ProductDetail",
            },
          },
          SearchStack: {
            screens: {
              SearchScreen: "Search",
              ProductDetailScreen: "ProductDetail",
            },
          },
          ProfileStack: {
            screens: {
              ProfileScreen: "Profile",
              ProductDetailScreen: "ProductDetail",
            },
          },
        },
      },

      NotFound: "*",
      Review: "Review",
      Comment: "Comment",
      Trending: "Trending",
      TopRating: "TopRating",
      Product: "Product",
      Loading: "loading",
      Signup: "Registrering",
      Signin: "Logga in",
      ForgotPassword: "Glömt lösenord",
    },
  },
};

export default linking;
