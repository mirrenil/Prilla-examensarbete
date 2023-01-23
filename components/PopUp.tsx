import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { View, Text, TextInput } from "../components/Themed";
import ImageUpload from "./ImageUpload";

interface Props {
  setProfilePic: (a: any) => void;
  closePopUp: () => void;
  userPhoto: string;
}

export const PopUp = ({ setProfilePic, closePopUp, userPhoto }: Props) => {
  const [image, setImage] = useState<any>(null);
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;

  const popupStyles = StyleSheet.create({
    fatText: {
      fontWeight: "bold",
      fontSize: 16,
    },
    layover: {
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    popUp: {
      width: "100%",
      height: 200,
      bottom: 0,
      position: "absolute",
      backgroundColor: isLight ? "#AE89E0" : "#2E233C",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 6,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    input: {
      width: "70%",
      backgroundColor: "white",
      height: 100,
      color: "black",
      borderRadius: 6,
      padding: 10,
    },
  });

  return (
    <View style={popupStyles.layover}>
      <View style={popupStyles.popUp}>
        <Text lightColor="#fff" style={[popupStyles.fatText]}>
          Hantera profilbild
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", top: 0, right: 0, padding: 10 }}
          onPress={closePopUp}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>

        {userPhoto ? (
          <>
            {!image && (
              <TouchableOpacity>
                <Text lightColor="#fff" darkColor="#fff">
                  Ta bort profilbild
                </Text>
              </TouchableOpacity>
            )}
            <ImageUpload
              changeProfilePicIsTrue={true}
              handleUpload={(image) => setImage(image)}
            />
          </>
        ) : (
          <ImageUpload
            changeProfilePicIsTrue={false}
            handleUpload={(image) => setImage(image)}
          />
        )}
        {image && (
          <View style={popupStyles.buttons}>
            <TouchableOpacity onPress={() => setProfilePic(image)}>
              <Text lightColor="#fff" darkColor="#fff">
                Spara profilbild
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
