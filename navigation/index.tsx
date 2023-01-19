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
import { ColorSchemeName } from "react-native";
import { Provider, useSelector } from "react-redux";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import LoadingScreen from "../screens/LoadingScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import StartScreen from "../screens/StartScreen";
import SearchScreen from "../screens/SearchScreen";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AgeCheckScreen from "../screens/AgeCheckScreen";
import ReviewModal from "../screens/ReviewModal";
import TopRatingsScreen from "../screens/TopRatingsScreen";
import TrendingScreen from "../screens/TrendingScreen";
import ProductDetailScreen from "../screens/DetailScreen";
import { CommentModal } from "../screens/CommentModal";
import LinkingConfiguration from "./LinkingConfiguration";
import Constants from "expo-constants";

import { RootStackParamList, RootTabParamList } from "../types";
import store from "../redux/store";
import { currentReduxUser } from "../redux/signin";

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
const HomeStack = createNativeStackNavigator<RootStackParamList>();

function HomeStackScreen() {
  const colorScheme = useColorScheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
      }}
    >
      <HomeStack.Screen
        name="Root"
        component={StartScreen}
        options={{ title: "Hem" }}
      />
      <HomeStack.Screen
        name="Product"
        component={ProductDetailScreen}
        initialParams={{ id: "13" }}
        options={{ title: "Produkt detaljer" }}
      />
      <HomeStack.Group screenOptions={{ presentation: "modal" }}>
        <HomeStack.Screen
          options={{ title: "Lämna recension" }}
          name="Review"
          initialParams={{ id: "12" }}
          component={ReviewModal}
        />
        <HomeStack.Screen
          options={{ title: "Lämna kommentar" }}
          name="Comment"
          initialParams={{ id: "12" }}
          component={CommentModal}
        />
      </HomeStack.Group>
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ id: "13" }}
      />
      <HomeStack.Screen
        name="TopRating"
        component={TopRatingsScreen}
        options={{ title: "Toppbetyg" }}
      />
      <HomeStack.Screen
        name="Trending"
        component={TrendingScreen}
        options={{ title: "Trendande sorter" }}
      />

      <HomeStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Hoppsan! Denna sida finns inte" }}
      />
    </HomeStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator<RootStackParamList>();

function SearchStackScreen() {
  const colorScheme = useColorScheme();
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
      }}
    >
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Utforska" }}
      />
      <SearchStack.Screen
        name="Product"
        component={ProductDetailScreen}
        initialParams={{ id: "13" }}
        options={{ title: "Produkt detaljer" }}
      />
      <SearchStack.Group screenOptions={{ presentation: "modal" }}>
        <SearchStack.Screen
          options={{ title: "Lämna recension" }}
          name="Review"
          initialParams={{ id: "12" }}
          component={ReviewModal}
        />
        <SearchStack.Screen
          options={{ title: "Lämna kommentar" }}
          name="Comment"
          initialParams={{ id: "12" }}
          component={CommentModal}
        />
      </SearchStack.Group>
      <SearchStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Hoppsan! Denna sida finns inte!" }}
      />
    </SearchStack.Navigator>
  );
}

const SignInStack = createNativeStackNavigator<RootStackParamList>();

function SignInStackScreen() {
  const colorScheme = useColorScheme();
  return (
    <SignInStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
        headerTitle: "",
      }}
    >
      <SignInStack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <SignInStack.Screen
        name="Signin"
        component={SigninScreen}
        options={{
          headerShown: false,
        }}
      />

      <SignInStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      <SignInStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />

      <SignInStack.Screen
        name="AgeCheck"
        component={AgeCheckScreen}
        options={{ headerShown: false }}
      />
      <SignInStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Hoppsan! Denna sida finns inte" }}
      />
      <SignInStack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </SignInStack.Navigator>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();
  const currentUser = useSelector(currentReduxUser);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
      }}
    >
      {currentUser ? (
        <Stack.Screen
          name="Signin"
          component={SignInStackScreen}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const myUser = useSelector(currentReduxUser);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].header,
          height: 100,
        },
        headerTitleStyle: {
          color: Colors[colorScheme].text,
        },
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].menu,
          height: "10%",
          padding: 15,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home-outline" size={24} color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          title: "",
          headerShown: false,
          headerStyle: { height: Constants.statusBarHeight },
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={24} color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ id: myUser.id }}
        options={{
          title: "",
          headerTitle: "Profil",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
