import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { getOneDocById } from '../helper';
import { Tag, Review, Product } from '../Interfaces';

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
			console.log(data.Photo);
		}
	};

	if (product) {
		return (
			<View style={styles.wrapper}>
				<View style={styles.productData}>
					<Image style={styles.image} source={{ uri: product.Photo }} />
					<Text style={styles.textBold}>{product.Brand + ' ' + product.Name}</Text>
          <Text>{product.Type}</Text>
				</View>
				<View>
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
		borderRadius: 6,
		width: '80%',
		padding: 25,
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	image: {
		height: 60,
		width: 60,
	},
	productData: {
		flexDirection: 'row',
	},
  textBold: {
    fontWeight: 'bold'
  }
});
