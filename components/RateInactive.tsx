import { RatingBar } from '@aashu-dubey/react-native-rating-bar';
import React, { ReactNode } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

interface Props {
	rating: number;
	dotSize?: number,
	single?: number,
	width?: number
}
export const RateInactive = ({ rating, dotSize, single, width }: Props) => {
	const handleRating = (value: number) => {
		console.log(value);
	};

	const styles = StyleSheet.create({
		circle: {
			width: dotSize ? dotSize : 20,
			height: dotSize ? dotSize : 20,
		},
		container: {
			width: width ? width : 120,
		},
		single: {
			width: single ? single : 25,
		}
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
						source={require('../assets/images/1.png')}
					/>
				),
				half: (
					<Image
						style={styles.circle}
						source={require('../assets/images/0_5.png')}
					/>
				),
				empty: (
					<Image
						style={styles.circle}
						source={require('../assets/images/0.png')}
					/>
				),
			}}
			onRatingUpdate={(value) => handleRating(value)}
		/>
	);
};

