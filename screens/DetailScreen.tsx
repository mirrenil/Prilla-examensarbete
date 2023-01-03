import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { View, Text } from "../components/Themed";
import { getDocsWithSpecificValue, getOneDocById } from "../helper";
import { Product, Review } from "../Interfaces";
import { RootStackParamList, RootStackScreenProps } from "../types";
import { RateInactive } from "../components/RateInactive";
import { AntDesign } from "@expo/vector-icons";
import { StrengthBar } from "../components/StrengthBar";
import { User } from "../Interfaces";
import { connectFirestoreEmulator } from "firebase/firestore";

interface ReviewWithAuthor extends Review {
  author: string;
}

function ProductDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"Product">) {
  const [product, setProduct] = useState<Product>();
  const [activeTab, setActiveTab] = useState<number>(3);
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);

  useEffect(() => {
    getProductReviews();
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

  const getProductReviews = async () => {
    let newList = [];
    try {
      const reviewsDocs = await getDocsWithSpecificValue(
        "recensioner",
        "productID",
        route.params.id
      );
      if (reviewsDocs) {
        for (let rev of reviewsDocs) {
          let name = await getReviewAuthor(rev.userID);
          newList.push({ ...rev, author: name });
        }
        setReviews(newList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getReviewAuthor = async (id: string) => {
    try {
      const user = await getOneDocById("users", id);
      if (user) {
        let name = user?.displayName;
        return name;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderFolderContent = () => {
    switch (activeTab) {
      case 1:
        return <Text>{product?.description}</Text>;
      case 2:
        return (
          <>
            <View style={styles.folderFacts}>
              <Text style={styles.fatText}>Varumärke</Text>
              <Text>{product?.brand}</Text>
            </View>
            <View style={styles.folderFacts}>
              <Text style={styles.fatText}>Namn</Text>
              <Text>{product?.name}</Text>
            </View>
            <View style={styles.folderFacts}>
              <Text style={styles.fatText}>Smak</Text>
              <View style={{ flexDirection: "row" }}>
                {product?.flavor.map((f) => {
                  return <Text>{f} </Text>;
                })}
              </View>
            </View>
            <View style={styles.folderFacts}>
              <Text style={styles.fatText}>Nikotinhalt</Text>
              <Text>{product?.nicotine} mg/g</Text>
            </View>
            <View style={styles.folderFacts}>
              <Text style={styles.fatText}>Vikt</Text>
              <Text>{product?.weight}g</Text>
            </View>
          </>
        );
      case 3:
        return reviews.map((rev) => {
          return (
            <View style={styles.reviewWrapper}>
              <View style={styles.reviewTop}>
                <Text style={[styles.fatText, styles.capitalize]}>
                  {rev.author}
                </Text>
                <RateInactive rating={rev.rating} />
                <Text>{rev.rating}</Text>
              </View>
              <Text>{rev.description}</Text>
            </View>
          );
        });
    }
  };

  if (product && reviews) {
    return (
      <ScrollView>
        <ImageBackground
          style={styles.background}
          source={require("../assets/images/detail_Bg.png")}
        >
          <Image
            style={styles.waves}
            source={require("../assets/images/waves_dark.png")}
          />
        </ImageBackground>
        <View style={styles.screenContainer}>
          <View style={styles.productDataContainer}>
            <Image style={styles.productImg} source={{ uri: product?.photo }} />
            <View style={styles.productInfo}>
              <Text style={styles.title}>
                {product?.brand + " " + product?.name}
              </Text>
              <Text style={styles.manufacturer}>{product?.manufacturer}</Text>
              <View style={styles.ratingContainer}>
                <RateInactive rating={product?.rating ? product.rating : 0} />
                <Text style={styles.ratingText}>
                  {product?.rating ? product.rating : 0}
                </Text>
              </View>
              <Text>{product?.reviews.length} Ratings</Text>
              <View style={styles.interactions}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Review", { id: product.id })
                  }
                >
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
              <StrengthBar strength={product?.strength} />
            </View>
            <View style={styles.tableRow}>
              <Text>Antal</Text>
              <Text>{product?.pouches} st per dosa</Text>
            </View>
            <View style={styles.tableRow}>
              <Text>Typ</Text>
              <Text>{product?.type}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text>Format</Text>
              <Text>{product?.format}</Text>
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
  } else {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }
}

const styles = StyleSheet.create({
  fatText: {
    fontWeight: "bold",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  background: {
    position: "relative",
    height: 200,
    width: "100%",
  },
  waves: {
    position: "absolute",
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  productInfo: {
    justifyContent: "space-between",
    maxWidth: "60%",
  },
  manufacturer: {},
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 10,
  },
  interactions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
  },
  tableDataContainer: {
    width: "70%",
  },
  tableRow: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
  },
  folder: {
    marginTop: 50,
    width: "100%",
  },
  tabs: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    height: 50,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeTab: {
    backgroundColor: "#2E233B",
  },
  folderContent: {
    backgroundColor: "#2E233B",
    padding: 10,
  },
  folderFacts: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
  },
  reviewTop: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
  },
  reviewWrapper: {
    width: "90%",
    marginBottom: 10,
  },
});

export default ProductDetailScreen;
