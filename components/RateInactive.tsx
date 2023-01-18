import { RatingBar } from "@aashu-dubey/react-native-rating-bar";
import React from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";

interface Props {
  rating: number;
  small?: {
    size: number;
    container: number;
    single: number;
  };
}
export const RateInactive = ({ rating, small }: Props) => {
  const colorScheme = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  const styles = StyleSheet.create({
    circle: {
      width: small ? small.size : 20,
      height: small ? small.size : 20,
    },
    container: {
      width: small ? small.container : 120,
    },
    single: {
      width: small ? small.single : 25,
    },
  });

  return (
    <RatingBar
      initialRating={rating}
      direction="horizontal"
      allowHalfRating
      itemCount={5}
      itemPadding={0}
      ignoreGestures
      rateStyles={{
        container: styles.container,
        starContainer: styles.single,
      }}
      ratingElement={{
        full: (
          <Image
            style={styles.circle}
            source={require("../assets/images/rating/1.png")}
          />
        ),
        half: (
          <Image
            style={styles.circle}
            source={require("../assets/images/rating/0_5.png")}
          />
        ),
        empty: (
          <Image
            style={styles.circle}
            source={require("../assets/images/rating/0.png")}
          />
        ),
      }}
    />
  );
};
