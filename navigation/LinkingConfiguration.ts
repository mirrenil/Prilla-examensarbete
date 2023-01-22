/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";
import { Product } from "../Interfaces";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "Home",
            },
          },
          Search: {
            screens: {
              SearchScreen: "Search",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "Profile",
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
