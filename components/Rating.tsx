import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Rating } from "react-native-rating-element";


export const RatingDots = () => {

    const rating = 4.5;

    const dots = []


	return (
		<View style={styles.ratingsContainer}>

<Rating
  rated={3.5}
  totalCount={5}
  ratingColor="#f1c644"
  ratingBackgroundColor="#d4d4d4"
  size={24}
  readonly // by default is false
  icon="ios-star"
  direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
/>

			{/* <View style={styles.dotsContainer}>
				<View style={[styles.dot, styles.rated]}></View>
				<View style={[styles.dot, styles.rated]}></View>
				<View style={[styles.dot, styles.rated]}></View>
				<View style={[styles.dot, styles.rated]}></View>
				<View style={[styles.dot, styles.rated]}></View>
			</View>
			<View style={styles.dotsContainer}>
				<View style={styles.dot}></View>
				<View style={styles.dot}></View>
				<View style={styles.dot}></View>
				<View style={styles.dot}></View>
				<View style={styles.dot}></View>
			</View> */}
		</View>
	);
};

const styles = StyleSheet.create({
	ratingsContainer: {
		position: 'relative',
	},
	dotsContainer: {
		position: 'absolute',
		flexDirection: 'row',
	},
	dot: {
		backgroundColor: 'gray',
		borderRadius: 100,
		width: 50,
		height: 50,
	},
	rated: {
		backgroundColor: 'yellow',
	},
});
