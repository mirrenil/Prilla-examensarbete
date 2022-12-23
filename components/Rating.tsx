import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Rating } from 'react-native-rating-element';

export const RatingDots = () => {

	return (
		<Rating
			rated={1}
			totalCount={5}
			ratingColor="#FFFD54"
			ratingBackgroundColor="rgba(51,51,51,0.7)"
			size={24}
			readonly // by default is false
			icon="ios-star"
			direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
		/>
	);
};
