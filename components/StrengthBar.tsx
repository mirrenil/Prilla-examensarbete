import { RatingBar } from "@aashu-dubey/react-native-rating-bar";
import React from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";

interface Props {
  strength?: number;
}
export const StrengthBar = ({ strength }: Props) => {
  const colorScheme = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

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
      ratingElement={
        isLight
          ? {
              full: (
                <Image
                  style={styles.circle}
                  source={require("../assets/images/strength/strength_one_light.png")}
                />
              ),
              empty: (
                <Image
                  style={styles.circle}
                  source={require("../assets/images/strength/strength_empty_light.png")}
                />
              ),
            }
          : {
              full: (
                <Image
                  style={styles.circle}
                  source={require("../assets/images/strength/strength_one.png")}
                />
              ),
              empty: (
                <Image
                  style={styles.circle}
                  source={require("../assets/images/strength/strength_empty.png")}
                />
              ),
            }
      }
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
