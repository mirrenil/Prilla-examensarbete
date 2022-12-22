
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';


const styles = StyleSheet.create({
  wrapper: {
    width: '80%',
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.5)'
  }
});


export const ReviewCard = () => {
	return (
		<View style={styles.wrapper}>
			<Text>Loop Jalapeno Lime</Text>
		</View>
	);
};
