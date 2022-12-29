import * as ImagePicker from 'expo-image-picker';
import { Constants } from 'expo-constants';
import { useEffect, useState } from 'react';
import { Button, Platform, Image } from 'react-native';
import { result } from 'lodash';
import { View, Text } from './Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ImageUpload = () => {
	const [image, setImage] = useState<any>(null);

	useEffect(() => {
		test();
	}, []);

	const test = async () => {
		if (Platform.OS !== 'web') {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission denied');
			}
		}
	};

	const PickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		console.log(result);
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		<View>
			<TouchableOpacity onPress={PickImage} style={{alignItems: 'center'}}>
				<MaterialIcons name="add-a-photo" size={50} color="white" style={{paddingBottom: 10}}/>
        <Text>Lägg till foto</Text>
			</TouchableOpacity>
			{image && (
				<Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
			)}
		</View>
	);
};

export default ImageUpload;
