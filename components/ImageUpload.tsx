import * as ImagePicker from "expo-image-picker";
import { Constants } from "expo-constants";
import React, { useEffect, useState } from "react";
import { Platform, Image } from "react-native";
import { View, Text } from "./Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { uploadImageAndGetURL } from "../helper";

interface Props {
  handleUpload: (a: any) => void;
  setChosenImg?: () => void;
}

const ImageUpload = ({ handleUpload, setChosenImg }: Props) => {
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    PermissionImageUpload();
  }, []);

  const PermissionImageUpload = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Permission denied");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const PickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        handleUpload(result.assets[0].uri);
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        let firebaseImageURL = await uploadImageAndGetURL(
          result.assets[0].uri,
          blob
        );
        console.log("test: ", firebaseImageURL);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        height: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {image ? (
        <View style={{ justifyContent: "flex-start" }}>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
            }}
          >
            <MaterialIcons name="remove-circle" size={24} color="red" />
          </TouchableOpacity>

          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              top: 0,
              zIndex: 1,
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={PickImage}
          style={{ alignItems: "center", margin: 10 }}
        >
          <MaterialIcons
            name="add-a-photo"
            size={50}
            color="white"
            style={{ paddingBottom: 10 }}
          />
          <Text>Lägg till foto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUpload;
