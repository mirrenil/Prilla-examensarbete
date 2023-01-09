import { RatingBar } from "@aashu-dubey/react-native-rating-bar";
import React from "react";
import { StyleSheet, Image } from "react-native";

interface Props {
  strength?: number;
}
export const StrengthBar = ({ strength }: Props) => {
  const handleRating = (value: number) => {
    console.log(value);
  };

  return (
    <RatingBar
      initialRating={strength}
      direction="horizontal"
      allowHalfRating
      itemCount={5}
      itemPadding={0}
      ignoreGestures
      rateStyles={{
        starContainer: styles.single,
      }}
      ratingElement={{
        full: (
          <Image
            style={styles.circle}
            source={require("../assets/images/strength_one.png")}
          />
        ),
        empty: (
          <Image
            style={styles.circle}
            source={require("../assets/images/strength_empty.png")}
          />
        ),
      }}
      onRatingUpdate={(value) => handleRating(value)}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 15,
    height: 15,
  },
  single: {
    width: 17,
  },
});
