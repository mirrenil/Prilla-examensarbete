import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text, TextInput } from "../components/Themed";
import ImageUpload from "./ImageUpload";

interface Props {
  setProfilePic: (a: any) => void;
  closePopUp: () => void;
}

export const PopUp = ({ setProfilePic, closePopUp }: Props) => {
  const [image, setImage] = useState<any>(null);

  return (
    <View style={popupStyles.layover}>
      <View style={popupStyles.popUp}>
        <Text style={[popupStyles.fatText]}>Hantera profilbild</Text>
        <ImageUpload
          handleUpload={(image) => setProfilePic(image)}
        />
        {image ? (
          <TouchableOpacity>
            <Text>Ta bort profilbild</Text>
          </TouchableOpacity>
        ) : null}
        <View style={popupStyles.buttons}>
          <TouchableOpacity style={popupStyles.button} onPress={closePopUp}>
            <View>
              <Text>Avbryt</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    backgroundColor: "#2E233C",
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
  button: {},
  input: {
    width: "70%",
    backgroundColor: "white",
    height: 100,
    color: "black",
    borderRadius: 6,
    padding: 10,
  },
});
