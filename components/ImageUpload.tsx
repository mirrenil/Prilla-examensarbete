import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Platform, Image } from "react-native";
import { View, Text } from "./Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  handleUpload: (a: any) => void;
  setChosenImg?: () => void;
  changeProfilePicIsTrue?: boolean;
}

const ImageUpload = ({ handleUpload, changeProfilePicIsTrue }: Props) => {
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
        minHeight: changeProfilePicIsTrue ? 50 : 100,
        justifyContent: "center",
        alignItems: "center",
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
        <TouchableOpacity
          onPress={PickImage}
          style={{ alignItems: "center", margin: 10 }}
        >
          {changeProfilePicIsTrue ? (
            <Text lightColor="#333">Ändra profilbild</Text>
          ) : (
            <>
              <MaterialIcons
                name="add-a-photo"
                size={50}
                color="white"
                style={{ paddingBottom: 10 }}
              />
              <Text lightColor="#333">Lägg till foto</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUpload;
