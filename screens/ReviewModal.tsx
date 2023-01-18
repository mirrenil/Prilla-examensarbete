import { View, Text, TextInput } from "../components/Themed";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import * as Haptics from "expo-haptics";
import { RootStackScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import { Product, Tag } from "../Interfaces";
import { addNewDoc, getOneDocById, updateSingleProperty } from "../helper";
import { EvilIcons } from "@expo/vector-icons";
import { RateActive } from "../components/RateActive";
import ImageUpload from "../components/ImageUpload";
import { DarkTheme } from "@react-navigation/native";
import Tags from "../components/Tags";
import Colors, { gradientDark, gradientLight } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { currentReduxUser } from "../redux/signin";

const ReviewModal = ({ navigation, route }: RootStackScreenProps<"Review">) => {
  const [product, setProduct] = useState<Product>();
  const [value, setValue] = useState<number>(0);
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [image, setImage] = useState<any>();
  const colorScheme: any = useColorScheme();
  let isLight = colorScheme == "light" ? true : false;
  const myUser = useSelector(currentReduxUser);

  useEffect(() => {
    getProductData();
  }, []);

  const getProductData = async () => {
    try {
      let data = await getOneDocById("produkter", route.params.id);
      if (data) {
        setProduct(data as Product);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTags = (tagList: Tag[]) => {
    setSelectedTags(tagList);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pushReviewToProductsReviewArray = async (id: string) => {
    product?.reviews.push(id);
    let newData = { reviews: product?.reviews };
    try {
      await updateSingleProperty("produkter", route.params.id, newData);
    } catch (err) {
      console.log(err);
    }
  };

  // Calculates average rating value and updates DB
  const updateProductsTotalRating = async (rating: number) => {
    if (product?.rating || product?.rating == 0) {
      let oldRating = product.rating;
      let numberOfReviews = product.reviews.length;
      let newRating =
        (oldRating * numberOfReviews + rating) / (numberOfReviews + 1);
      let string = newRating.toFixed(2);
      newRating = JSON.parse(string);

      const newData = {
        rating: newRating,
      };

      try {
        await updateSingleProperty("produkter", route.params.id, newData);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Converting rating since rating scale is 0 - 10 but UI shows scale 0 - 5.
  const convertRating = () => {
    let rating = value / 2;
    updateProductsTotalRating(rating);
    return rating;
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const rating = convertRating();
    const newReview = {
      createdAt: new Date(),
      tags: selectedTags,
      description: reviewText,
      photo: image ? image : product?.photo,
      productID: route.params.id,
      rating: rating,
      userID: myUser.id,
    };
    try {
      let docId = await addNewDoc("recensioner", newReview);
      if (docId) {
        pushReviewToProductsReviewArray(docId);
      }
      alert("Recension skickad!");
      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const styles = StyleSheet.create({
    fatText: {
      fontWeight: "bold",
      fontSize: 16,
    },
    sectionTitle: {
      paddingBottom: 10,
      fontSize: 16,
      fontWeight: "bold",
    },
    section: {
      borderBottomColor: Colors[colorScheme].grey.light,
      borderBottomWidth: 1,
      justifyContent: "space-evenly",
      padding: 10,
    },
    container: {},
    image: {
      height: 60,
      width: 60,
      borderRadius: 50,
    },
    productSection: {},
    productInfo: {
      flexDirection: "row",
      width: "70%",
      justifyContent: "space-between",
    },
    productText: {},
    reviewText: {
      flexDirection: "row",
      marginTop: 20,
      marginBottom: 10,
    },
    titles: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rateSection: {
      padding: 10,
    },
    rateSectionContent: {
      alignItems: "center",
    },
    value: {
      fontSize: 25,
    },
    imageSection: {
      justifyContent: "space-around",
      alignItems: "center",
      padding: 10,
      minHeight: 250,
    },
    submitButton: {
      width: "70%",
      backgroundColor: "#FFFD54",
      height: 50,
      borderRadius: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    ratingBackground: {
      backgroundColor: isLight ? Colors[colorScheme].primary.normal : null,
      borderRadius: 6,
      padding: 10,
    },
  });

  const popupStyles = StyleSheet.create({
    layover: {
      height: "100%",
      width: "100%",
      position: "absolute",
      top: -100,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      zIndex: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    popUp: {
      backgroundColor: Colors[colorScheme].primary.dark,
      width: "80%",
      height: 250,
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
      width: "80%",
      backgroundColor: "transparent",
    },
    button: {
      padding: 15,
      borderRadius: 6,
      width: 80,
      height: 45,
      justifyContent: "center",
      textAlign: "center",
      backgroundColor: "transparent",
      borderColor: "#783bc9",
      borderWidth: 0.2,
    },
    input: {
      width: "70%",
      backgroundColor: "white",
      height: 100,
      color: "black",
      borderRadius: 6,
      padding: 5,
      borderWidth: 0.2,
      borderColor: "#783bc9",
    },
    textButton: {
      fontWeight: "bold",
    },
  });

  const Popup = () => {
    const [text, setText] = useState<string>("");

    const handleSubmit = () => {
      setReviewText(text);
      setPopUpOpen(false);
    };

    return (
      <View style={popupStyles.layover}>
        <View style={popupStyles.popUp} lightColor="#fff" darkColor="#2E233C">
          <Text style={[styles.fatText]} darkColor="#fff" lightColor="#333">
            Lämna recension
          </Text>
          <TextInput
            lightColor="#AF90D9"
            darkColor="#413C48"
            placeholder="Skriv här..."
            style={popupStyles.input}
            value={text}
            onChangeText={setText}
            multiline={true}
            numberOfLines={5}
            maxLength={130}
          />
          <View style={popupStyles.buttons}>
            <TouchableOpacity
              style={popupStyles.button}
              onPress={() => setPopUpOpen(false)}
            >
              <Text
                style={popupStyles.textButton}
                darkColor="#FFFD54"
                lightColor="#2E233B"
              >
                Avbryt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={popupStyles.button} onPress={handleSubmit}>
              <Text
                style={popupStyles.textButton}
                darkColor="#FFFD54"
                lightColor="#2E233B"
              >
                Spara
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {popUpOpen ? <Popup /> : null}
      <LinearGradient
        colors={
          isLight
            ? [gradientLight.from, gradientLight.to]
            : [gradientDark.from, gradientDark.to]
        }
      >
        <ScrollView style={styles.container}>
          <View style={[styles.productSection, styles.section]}>
            <View style={styles.productInfo}>
              <Image style={styles.image} source={{ uri: product?.photo }} />
              <View style={styles.productText}>
                <View style={styles.titles}>
                  <Text style={styles.fatText}>{product?.brand} </Text>
                  <Text style={styles.fatText}>{product?.name} </Text>
                  <Text>{product?.format}</Text>
                </View>
                <Text>{product?.manufacturer}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.reviewText}
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
              <View style={styles.ratingBackground}>
                <RateActive
                  handleChange={(value: number) => {
                    setValue(value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Tags handleInput={handleTags} />
          </View>
          <View style={styles.imageSection}>
            <ImageUpload handleUpload={(img) => setImage(img)} />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={[{ color: "black" }, styles.fatText]}>
                Publicera
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default ReviewModal;
