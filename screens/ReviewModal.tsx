import { View, Text, TextInput } from '../components/Themed';
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
import React, { FormEvent, useEffect, useState } from 'react';
import { Product, Review, Tag } from '../Interfaces';
import {
	addNewDoc,
	getOneDocById,
	setOneDoc,
	updateSingleProperty,
} from '../helper';
import { EvilIcons } from '@expo/vector-icons';
import { RateActive } from '../components/RateActive';
import ImageUpload from '../components/ImageUpload';
import { DarkTheme } from '@react-navigation/native';
import Tags from '../components/Tags';

const ReviewModal = ({ navigation, route }: RootStackScreenProps<'Review'>) => {
	const [product, setProduct] = useState<Product>();
	const [value, setValue] = useState<number>(0);
	const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
	const [reviewText, setReviewText] = useState<string>('');
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [image, setImage] = useState<any>();

	useEffect(() => {
		getProductData();
	}, []);

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

	const handleTags = (tagList: Tag[]) => {
		setSelectedTags(tagList);
	};

	const pushReviewToProductsReviewArray = async (id: string) => {
		product?.Reviews.push(id);
		let newData = { Reviews: product?.Reviews };
		try {
			await updateSingleProperty('produkter', route.params.id, newData);
		} catch (err) {
			console.log(err);
		}
	};

	const updateProductsTotalRating = async (rating: number) => {
		if (product?.Rating || product?.Rating == 0) {
			const total = rating + product.Rating;
			let updatedRating = total / product.Reviews.length;
			let string = updatedRating.toFixed(2);
			updatedRating = JSON.parse(string);
			let newData = { Rating: updatedRating };
			try {
				await updateSingleProperty('produkter', route.params.id, newData);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const convertRating = () => {
		let rating = value / 2;
		updateProductsTotalRating(rating);
		return rating;
	};

	const handleSubmit = async () => {
		const rating = convertRating();
		const newReview = {
			createdAt: new Date(),
			tags: selectedTags,
			description: reviewText,
			photo: image,
			productID: route.params.id,
			rating: rating,
			userID: 'Jg93kssG9mV4gaR72mfa9Lkm5aF2',
		};
		try {
			let docId = await addNewDoc('recensioner', newReview);
			if (docId) {
				pushReviewToProductsReviewArray(docId);
			}
		} catch (err) {
			console.log(err);
		}
	};

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

	const popupStyles = StyleSheet.create({
		layover: {
			height: '100%',
			width: '100%',
			position: 'absolute',
			top: 0,
			right: 0,
			backgroundColor: 'rgba(0,0,0,0.7)',
			zIndex: 100,
			justifyContent: 'center',
			alignItems: 'center',
		},
		popUp: {
			width: '80%',
			height: 200,
			backgroundColor: '#2E233C',
			justifyContent: 'space-around',
			alignItems: 'center',
			padding: 10,
			paddingLeft: 20,
			paddingRight: 20,
			borderRadius: 6,
		},
		buttons: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			width: '100%',
		},
		button: {},
		input: {
			width: '70%',
			backgroundColor: 'white',
			height: 100,
			color: 'black',
			borderRadius: 6,
			padding: 10,
		}
	});

	const Popup = () => {
		const [text, setText] = useState<string>('');

		const handleSubmit = () => {
			setReviewText(text);
			setPopUpOpen(false);
		};

		return (
			<View style={popupStyles.layover}>
				<View style={popupStyles.popUp}>
					<Text style={[styles.fatText]}>Lämna recension</Text>
					<TextInput
						lightColor="#AF90D9"
						darkColor="#413C48"
						placeholder="Skriv här..."
						style={popupStyles.input}
						value={text}
						onChangeText={setText}
						multiline={true}
						numberOfLines={4}
					/>
					<View style={popupStyles.buttons}>
						<TouchableOpacity
							style={popupStyles.button}
							onPress={() => setPopUpOpen(false)}
						>
							<View>
								<Text>Avbryt</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleSubmit}>
							<View>
								<Text>Spara</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	};

	return (
		<>
			{popUpOpen ? <Popup /> : null}
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
					<TouchableOpacity
						style={{ flexDirection: 'row' }}
						onPress={() => setPopUpOpen(true)}
					>
						<EvilIcons name="pencil" size={24} color="white" />
						{reviewText ? (
							<Text>{reviewText}</Text>
						) : (
							<>
								<Text>Lägg till kommentar</Text>
							</>
						)}
					</TouchableOpacity>
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
					<Tags handleInput={handleTags} />
				</View>
				<View style={styles.imageSection}>
					<ImageUpload handleUpload={(img) => setImage(img)} />
					<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
						<Text style={[{ color: 'black' }, styles.fatText]}>Publicera</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	);
};

export default ReviewModal;
