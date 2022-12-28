import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';
import { View, Text } from '../components/Themed';
import { getDocsWithSpecificValue, getOneDocById } from '../helper';
import { Product, Review } from '../Interfaces';
import { RootStackParamList, RootStackScreenProps } from '../types';
import { RatingDots } from '../components/Rating';
import { AntDesign } from '@expo/vector-icons';
import { StrengthBar } from '../components/StrengthBar';
import { User } from '../Interfaces';

interface ReviewWithAuthor extends Review {
	author?: string;
}

function ProductDetailScreen({
	navigation,
	route,
}: RootStackScreenProps<'Product'>) {
	const [product, setProduct] = useState<Product>();
	const [activeTab, setActiveTab] = useState<number>(1);
	const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);

	useEffect(() => {
    setReviews([])
		getProductData();
		getProductReviews();
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

	const getProductReviews = async () => {
		try {
			const reviews = await getDocsWithSpecificValue(
				'recensioner',
				'productID',
				product?.id
			);
			setReviews(reviews as Review[]);
		} catch (err) {
			console.log(err);
		}
	};

	const getReviewAuthor = async (id: string) => {
		try {
			const user = await getOneDocById('users', id);
			return user
		} catch (err) {
			console.log(err);
		}
	};

	const renderFolderContent = () => {
		switch (activeTab) {
			case 1:
				return <Text>{product?.Description}</Text>;
			case 2:
				return (
					<>
						<View style={styles.folderFacts}>
							<Text style={styles.fatText}>Varumärke</Text>
							<Text>{product?.Brand}</Text>
						</View>
						<View style={styles.folderFacts}>
							<Text style={styles.fatText}>Namn</Text>
							<Text>{product?.Name}</Text>
						</View>
						<View style={styles.folderFacts}>
							<Text style={styles.fatText}>Smak</Text>
							<Text>{product?.Flavor}</Text>
						</View>
						<View style={styles.folderFacts}>
							<Text style={styles.fatText}>Nikotinhalt</Text>
							<Text>{product?.Nicotine} mg/g</Text>
						</View>
						<View style={styles.folderFacts}>
							<Text style={styles.fatText}>Vikt</Text>
							<Text>{product?.Weight}g</Text>
						</View>
					</>
				);
			case 3:
				reviews.forEach((rev) => {
					let user = getReviewAuthor(rev.userID);
          console.log(user)
					return (
						<View>
							<View>
								<Text>{}</Text>
								<Text></Text>
								<Text></Text>
							</View>
							<Text></Text>
						</View>
					);
				});
		}
	};

	return (
		<ScrollView>
			<ImageBackground
				style={styles.background}
				source={require('../assets/images/detail_Bg.png')}
			>
				<Image
					style={styles.waves}
					source={require('../assets/images/waves_dark.png')}
				/>
			</ImageBackground>
			<View style={styles.screenContainer}>
				<View style={styles.productDataContainer}>
					<Image style={styles.productImg} source={{ uri: product?.Photo }} />
					<View style={styles.productInfo}>
						<Text style={styles.title}>
							{product?.Brand + ' ' + product?.Name}
						</Text>
						<Text style={styles.manufacturer}>{product?.Manufacturer}</Text>
						<View style={styles.ratingContainer}>
							<RatingDots rating={product?.Rating ? product.Rating : 0} />
							<Text style={styles.ratingText}>
								{product?.Rating ? product.Rating : 0}
							</Text>
						</View>
						<Text>{product?.Reviews.length} Ratings</Text>
						<View style={styles.interactions}>
							<TouchableOpacity>
								<View style={styles.button}>
									<Text>Lägg till recension</Text>
								</View>
							</TouchableOpacity>
							<AntDesign name="hearto" size={24} color="white" />
						</View>
					</View>
				</View>

				<View style={styles.tableDataContainer}>
					<View style={styles.tableRow}>
						<Text>Styrka</Text>
						<StrengthBar strength={product?.Strength} />
					</View>
					<View style={styles.tableRow}>
						<Text>Antal</Text>
						<Text>{product?.Pouches} st per dosa</Text>
					</View>
					<View style={styles.tableRow}>
						<Text>Typ</Text>
						<Text>{product?.Type}</Text>
					</View>
					<View style={styles.tableRow}>
						<Text>Format</Text>
						<Text>{product?.Format}</Text>
					</View>
				</View>

				<View style={styles.folder}>
					<View style={styles.tabs}>
						<TouchableOpacity
							onPress={() => setActiveTab(1)}
							style={[styles.tab, activeTab === 1 ? styles.activeTab : null]}
						>
							<Text>Beskrivning</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setActiveTab(2)}
							style={[
								styles.tab,
								activeTab === 2 ? styles.activeTab : null,
								{ marginLeft: 10, marginRight: 10 },
							]}
						>
							<Text>Fakta</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setActiveTab(3)}
							style={[styles.tab, activeTab === 3 ? styles.activeTab : null]}
						>
							<Text>Recensioner</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.folderContent}>{renderFolderContent()}</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	fatText: {
		fontWeight: 'bold',
	},
	background: {
		position: 'relative',
		height: 200,
		width: '100%',
	},
	waves: {
		position: 'absolute',
		bottom: -23,
		height: 100,
	},
	screenContainer: {
		padding: 20,
	},
	productImg: {
		height: 120,
		width: 120,
		marginRight: 10,
	},
	productDataContainer: {
		height: 200,
		marginBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		fontWeight: 'bold',
		fontSize: 20,
	},
	productInfo: {
		justifyContent: 'space-between',
	},
	manufacturer: {},
	ratingContainer: {
		flexDirection: 'row',
	},
	ratingText: {
		marginLeft: 10,
	},
	interactions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	button: {
		padding: 10,
		marginRight: 10,
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 6,
	},
	tableDataContainer: {
		width: '70%',
	},
	tableRow: {
		height: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: 'rgba(255,255,255,0.3)',
		borderBottomWidth: 1,
	},
	folder: {
		marginTop: 50,
		width: '100%',
	},
	tabs: {
		flexDirection: 'row',
	},
	tab: {
		flex: 1,
		height: 50,
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	activeTab: {
		backgroundColor: '#2E233B',
	},
	folderContent: {
		backgroundColor: '#2E233B',
		padding: 10,
	},
	folderFacts: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 50,
	},
});

export default ProductDetailScreen;
