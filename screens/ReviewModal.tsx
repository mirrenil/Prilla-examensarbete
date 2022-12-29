import { View, Text } from '../components/Themed';
import {
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	ActivityIndicator,
	Pressable,
	Button,
	ScrollView,
} from 'react-native';
import { RootStackScreenProps } from '../types';
import React, { useEffect, useState } from 'react';
import { Product, Tag } from '../Interfaces';
import { getAllDocsInCollection, getOneDocById } from '../helper';
import { EvilIcons } from '@expo/vector-icons';
import { RateActive } from '../components/RateActive';
import ImageUpload from '../components/ImageUpload';
import { DarkTheme } from '@react-navigation/native';
import Tags from '../components/Tags';

const ReviewModal = ({ navigation, route }: RootStackScreenProps<'Review'>) => {
	const [product, setProduct] = useState<Product>();
	const [value, setValue] = useState<number>(0);

	useEffect(() => {
		getProductData();
	}, []);

	// useEffect(() => {
	// 	console.log(selectedTags);
	// }, [selectedTags]);

	const getProductData = async () => {
		try {
			let data = await getOneDocById('produkter', route.params.id);
			if (data) {
				setProduct(data as Product);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// const getTags = async () => {
	// 	try {
	// 		let tags = await getAllDocsInCollection('tags');
	// 		setTags(tags as Tag[]);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	// const isAlreadySelected = (tag: Tag) => {
	// 	let selected = selectedTags.some(
	// 		(selectedTag) => selectedTag.name == tag.name
	// 	);
	// 	console.log('is selected: ', tag.name, selected);
	// 	return selected;
	// };

	// const toggleSelectTag = (tag: Tag) => {
	// 	if (!isAlreadySelected(tag)) {
	// 		let list = selectedTags;
	// 		list.push(tag);
	// 		setSelectedTags(list);
	// 	}
	// };

	const styles = StyleSheet.create({
		fatText: {
			fontWeight: 'bold',
			fontSize: 16,
		},
		sectionTitle: {
			paddingBottom: 10,
			fontSize: 16,
			fontWeight: 'bold',
		},
		section: {
			borderBottomColor: 'rgba(255,255,255,0.3)',
			borderBottomWidth: 1,
			justifyContent: 'space-evenly',
			padding: 10,
		},
		container: {},
		image: {
			height: 60,
			width: 60,
		},
		productSection: {},
		productInfo: {
			flexDirection: 'row',
			width: '70%',
			justifyContent: 'space-between',
		},
		productText: {},
		titles: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		rateSection: {
			padding: 10,
		},
		rateSectionContent: {
			alignItems: 'center',
		},
		value: {
			fontSize: 25,
		},
		imageSection: {
			justifyContent: 'space-around',
			alignItems: 'center',
			padding: 10,
			height: 250,
		},
		submitButton: {
			width: '70%',
			backgroundColor: DarkTheme.colors.primary,
			height: 50,
			borderRadius: 6,
			justifyContent: 'center',
			alignItems: 'center',
		},
	});

	return (
		<ScrollView style={styles.container}>
			<View style={[styles.productSection, styles.section]}>
				<View style={styles.productInfo}>
					<Image style={styles.image} source={{ uri: product?.Photo }} />
					<View style={styles.productText}>
						<View style={styles.titles}>
							<Text style={styles.fatText}>{product?.Brand} </Text>
							<Text style={styles.fatText}>{product?.Name} </Text>
							<Text>{product?.Format}</Text>
						</View>
						<Text>{product?.Manufacturer}</Text>
					</View>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<EvilIcons name="pencil" size={24} color="white" />
					<Text>Lägg till kommentar</Text>
				</View>
			</View>
			<View style={[styles.rateSection, styles.section]}>
				<Text style={styles.sectionTitle}>Sätt betyg</Text>
				<View style={styles.rateSectionContent}>
					<Text style={styles.value}>{value}</Text>
					<RateActive
						handleChange={(value: number) => {
							setValue(value);
						}}
					/>
				</View>
			</View>
			<View style={styles.section}>
				<Tags />
			</View>
			<View style={styles.imageSection}>
				<ImageUpload />
				<TouchableOpacity style={styles.submitButton}>
					<Text style={[{ color: 'black' }, styles.fatText]}>Publicera</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

export default ReviewModal;
