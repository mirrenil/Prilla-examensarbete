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
          Home: {
            screens: {
              HomeScreen: "one",
            },
          },
          Search: {
            screens: {
              SearchScreen: "two",
            },
          },
          Notifications: {
            screens: {
              NotificationScreen: "three",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "four",
            },
          },
        },
      },
      Modal: "modal",
      NotFound: "*",
      Loading: "loading",
      Signup: "signup",
      Signin: "signin",
      ForgotPassword: "forgot-password",
      AgeCheck: "age-check",
    },
  },
};

export default linking;
