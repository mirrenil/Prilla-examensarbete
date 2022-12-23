import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { getOneDocById } from '../helper';
import { Tag, Review, Product } from '../Interfaces';
import { RatingDots } from './Rating';

interface Props {
	review: Review;
}

export const ReviewCard = ({ review }: Props) => {
	const [product, setProduct] = useState<any>();

	useEffect(() => {
		getProduct();
	}, []);

	const getProduct = async () => {
		let data = await getOneDocById('produkter', review.productID);
		if (data) {
			setProduct(data);
		}
	};

	if (product) {
		return (
			<View style={styles.wrapper}>
				<View style={styles.productData}>
					<Image style={styles.image} source={{ uri: product.Photo }} />
					<View style={styles.textAndRating}>
						<View style={styles.productText}>
							<Text style={styles.textBold}>{product.Brand + ' ' + product.Name}</Text>
              <Text>{product.Type}</Text>
						</View>
						<RatingDots rating={review.rating} />
					</View>
				</View>
				<View style={styles.description}>
					<Text>{review.description}</Text>
				</View>
			</View>
		);
	} else {
		return (
			<View>
				<Text>Loading</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	wrapper: {
    marginTop: 10,
		borderRadius: 6,
		width: '90%',
		padding: 10,
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	image: {
		height: 60,
		width: 60,
    flex: 1,
  
	},
	productData: {
		flexDirection: 'row',
	},
  textAndRating: {
    flex: 4
  },
  productText: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
	textBold: {
		fontWeight: 'bold',
	},
  description: {
    padding: 10
  }
});
