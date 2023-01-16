/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";
import { Provider, useSelector } from "react-redux";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import StartScreen from "../screens/StartScreen";
import SearchScreen from "../screens/SearchScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AgeCheckScreen from "../screens/AgeCheckScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import Constants from "expo-constants";

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import store from "../redux/store";
import ProductDetailScreen from "../screens/DetailScreen";
import { currentReduxUser } from "../redux/signin";
import ReviewModal from "../screens/ReviewModal";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <Provider store={store}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Signin" component={SigninScreen} />

      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      <Stack.Screen name="AgeCheck" component={AgeCheckScreen} />

      <Stack.Screen
        name="Product"
        initialParams={{ id: "13" }}
        component={ProductDetailScreen}
      />

      <Stack.Screen
        name="Profile"
        initialParams={{ id: "13" }}
        component={ProfileScreen}
      />

      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen
          options={{ title: "Lämna recension" }}
          name="Review"
          initialParams={{ id: "12 " }}
          component={ReviewModal}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 *
 */

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const user = useSelector(currentReduxUser);
  const username = user?.displayName;

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].background,
          height: 100,
        },
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          height: 100,
          padding: 15,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={StartScreen}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "Utforska",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home-outline" size={30} color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "",
          // headerShown: false,
          headerStyle: { height: Constants.statusBarHeight },
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={30} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={30} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ id: user.id }}
        options={{
          title: username,
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={30} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
