import { AntDesign, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React from "react";

import { ColorSchemeName } from "react-native";
import { Provider, useSelector } from "react-redux";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import LoadingScreen from "../screens/LoadingScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import StartScreen from "../screens/StartScreen";
import SearchScreen from "../screens/SearchScreen";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
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

const HomeStack = createNativeStackNavigator<RootStackParamList>();

function HomeStackNavigator() {
  const colorScheme = useColorScheme();
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
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
        options={{ title: "Utforska" }}
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
        <HomeStack.Screen
          options={{ title: "Trendande sorter" }}
          name="Trending"
          component={TrendingScreen}
        />
        <HomeStack.Screen
          options={{ title: "Toppbetyg" }}
          name="TopRating"
          component={TopRatingsScreen}
        />
      </HomeStack.Group>
      <HomeStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Hoppsan! Denna sida finns inte!" }}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
        initialParams={{ id: "12" }}
      />
    </HomeStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator<RootStackParamList>();

function SearchStackScreen() {
  const colorScheme = useColorScheme();
  return (
    <SearchStack.Navigator
      initialRouteName="Search"
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

const ProfileStack = createNativeStackNavigator<RootStackParamList>();

function ProfileStackScreen() {
  const colorScheme = useColorScheme();
  const myUser = useSelector(currentReduxUser);

  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
        initialParams={{ id: myUser.id }}
      />
      <ProfileStack.Screen
        name="Product"
        component={ProductDetailScreen}
        initialParams={{ id: "13" }}
        options={{ title: "Produkt detaljer" }}
      />
      <ProfileStack.Group screenOptions={{ presentation: "modal" }}>
        <ProfileStack.Screen
          options={{ title: "Lämna recension" }}
          name="Review"
          initialParams={{ id: "12" }}
          component={ReviewModal}
        />
        <ProfileStack.Screen
          options={{ title: "Lämna kommentar" }}
          name="Comment"
          initialParams={{ id: "12" }}
          component={CommentModal}
        />
      </ProfileStack.Group>
      <ProfileStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Hoppsan! Denna sida finns inte!" }}
      />
      <ProfileStack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
}

const AuthStack = createNativeStackNavigator<RootStackParamList>();

function AuthStackNavigator() {
  const colorScheme = useColorScheme();
  return (
    <AuthStack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
        headerTitle: "",
      }}
    >
      <AuthStack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Signin"
        component={SigninScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();
  const currentUser = useSelector(currentReduxUser);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].menu,
        },
        headerTintColor: Colors[colorScheme].text,
      }}
    >
      {currentUser.displayName === "" ? (
        <RootStack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <RootStack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const myUser = useSelector(currentReduxUser);

  return (
    <BottomTab.Navigator
      initialRouteName="HomeStack"
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
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home-outline" size={24} color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="SearchStack"
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
        name="ProfileStack"
        component={ProfileStackScreen}
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
