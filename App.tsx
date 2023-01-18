import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    OleoScript: require("./assets/fonts/OleoScript-Regular.ttf"),
    Caramel: require("./assets/fonts/Caramel-Regular.ttf"),
  });

  if (!isLoadingComplete && !loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
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
const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: 200,
    left: 200,
  },
});
