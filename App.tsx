import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    OleoScript: require("./assets/fonts/OleoScript-Regular.ttf"),
    Caramel: require("./assets/fonts/Caramel-Regular.ttf"),
  });

  if (!isLoadingComplete && !loaded) {
    return <LoadingSpinner />;
  } else {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }
}
