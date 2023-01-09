import { RatingBar } from "@aashu-dubey/react-native-rating-bar";
import React from "react";
import { StyleSheet, Image } from "react-native";

interface Props {
  handleChange: (v: number) => void;
}

export const RateActive = ({ handleChange }: Props) => {
  const styles = StyleSheet.create({
    circle: {
      width: 25,
      height: 25,
    },
    dotsContainer: {
      margin: 10,
    },
    single: {
      width: 30,
    },
  });

  return (
    <RatingBar
      initialRating={0}
      direction="horizontal"
      itemCount={10}
      itemPadding={0}
      rateStyles={{
        container: styles.dotsContainer,
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
      onRatingUpdate={handleChange}
    />
  );
};
