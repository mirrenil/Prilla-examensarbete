import React from "react";
import { ActivityIndicator, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

const LoadingSpinner = () => {
  const colorScheme: any = useColorScheme();
  return (
    <ActivityIndicator
      size="small"
      color={Colors[colorScheme].grey.light}
      style={{ height: "100%", width: "100%" }}
    />
  );
};
export default LoadingSpinner;
