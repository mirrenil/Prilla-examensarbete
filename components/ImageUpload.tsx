import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Platform, Image, Button, Alert } from "react-native";
import { View, Text } from "./Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
interface Props {
  handleUpload: (a: any) => void;
  setChosenImg?: () => void;
  changeProfilePicIsTrue?: boolean;
}

export const ImageUpload = ({
  handleUpload,
  changeProfilePicIsTrue,
}: Props) => {
  const [image, setImage] = useState<any>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused ? PermissionImageUpload() : null;
  }, [isFocused]);

  const PermissionImageUpload = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Åtkomst nekad");
        }
        pickImage();
      }
    } catch (err) {
      console.log(err);
    }
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("status camera", status);
      if (status !== "granted") {
        alert("För att ta en bild behöver du ge åtkomst till din kamera");
      }
      takePicture();
    } catch (err) {
      console.log(err);
    }
  };

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleUpload(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        handleUpload(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err, "error");
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: changeProfilePicIsTrue ? 50 : 100,
      }}
    >
      {image ? (
        <View style={{ justifyContent: "flex-start" }}>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
              handleUpload(null);
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
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={pickImage}
            style={{ alignItems: "center", margin: 10 }}
          >
            {changeProfilePicIsTrue ? (
              <>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={50}
                  color="white"
                  style={{ paddingBottom: 10 }}
                />
                <Text lightColor="#333">Ändra profilbild</Text>
              </>
            ) : (
              <>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={50}
                  color="white"
                  style={{ paddingBottom: 10 }}
                />
                <Text lightColor="#333">Lägg till foto</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePicture}
            style={{ alignItems: "center", margin: 10 }}
          >
            <MaterialIcons
              name="add-a-photo"
              size={50}
              color="white"
              style={{ paddingBottom: 10 }}
            />
            <Text lightColor="#333">Använd kamera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
