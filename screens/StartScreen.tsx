import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { ReviewCard } from '../components/ReviewCard';
import { getAllDocsInCollection } from '../helper';
import { Review } from '../Interfaces';
import { RatingDots } from '../components/Rating';

export const StartScreen = () => {
	const [loaded] = useFonts({
		Inter: require('../assets/fonts/Inter-VariableFont_slnt,wght.ttf'),
		Caramel: require('../assets/fonts/Caramel-Regular.ttf'),
	});
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		getReviews();
	}, []);

	const getReviews = async () => {
    let newData = [];
		let data = await getAllDocsInCollection('recensioner');

		if (data?.length) {
			newData = data;
		}
    setReviews(newData)
	};


	return (
		<View>
			<View style={styles.container}>
				<Image
					style={styles.heroImg}
					source={require('../assets/images/hero.png')}
				/>
				<View style={styles.heroTextWrapper}>
					<Text style={styles.heroText}>äventyr väntar</Text>
					<Text style={styles.numbers}>
						20<Text style={styles.specialFont}>23</Text>
					</Text>
					<View style={styles.logosWrapper}>
						<Image
							style={styles.logo}
							source={require('../assets/images/Prilla.png')}
						/>
						<Text style={{ color: 'white' }}>X</Text>
						<Image
							style={styles.logo}
							source={require('../assets/images/loop.png')}
						/>
					</View>
				</View>
			</View>
			{reviews.map((review) => {
				return <ReviewCard key={review.id} review={review}/>;
			})}
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		padding: 0,
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
	},
	heroImg: {},
	heroTextWrapper: {
		position: 'absolute',
		width: '50%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	heroText: {
		color: 'white',
		textTransform: 'uppercase',
		fontFamily: '',
		fontWeight: '700',
		fontSize: 20,
	},
	logosWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
	},
	numbers: {
		fontSize: 40,
		color: 'white',
		lineHeight: 60,
	},
	specialFont: {
		fontFamily: 'Caramel',
		height: 10,
		fontSize: 70,
	},
	logo: {
		height: 30,
		width: 80,
	},
});
