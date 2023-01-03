import { RatingBar } from "@aashu-dubey/react-native-rating-bar";
import React, { ReactNode } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

interface Props {
  rating: number;
}
export const RatingDots = ({ rating }: Props) => {
  const handleRating = (value: number) => {
    console.log(value);
  };

  const styles = StyleSheet.create({
    circle: {
      width: 20,
      height: 20,
    },
    container: {
      width: 120,
    },
    single: {
      width: 25,
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
            source={require("../assets/images/1.png")}
          />
        ),
        half: (
          <Image
            style={styles.circle}
            source={require("../assets/images/0_5.png")}
          />
        ),
        empty: (
          <Image
            style={styles.circle}
            source={require("../assets/images/0.png")}
          />
        ),
      }}
      onRatingUpdate={(value) => handleRating(value)}
    />
  );
};
