import {
  getDocs,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Alert } from "react-native";

/**
 * Takes uploaded image and creates a blob (binary large object) and uploads it to firebase storage.
 * Every user gets its own file named with users id
 * @param {string} userId
 * @param {string} imageName
 * @returns image firebase URL
 */
export const uploadImageAndGetURL = async (userId, imageName) => {
  console.log("in upload image and get url", userId, imageName);
  try {
    const response = await fetch(imageName);
    console.log(JSON.stringify(response), "response");
    const blob = await response.blob();
    const filename = imageName.split("/").pop();
    const storage = getStorage();
    const imageRef = ref(storage, `${userId}/${filename}`);
    await uploadBytes(imageRef, blob);
    console.log(uploadBytes(imageRef, blob), "upload bytes");
    let imageURL = await getDownloadURL(ref(storage, `${userId}/${filename}`));
    console.log(JSON.stringify(imageURL), "image url");
    return imageURL;
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case "storage/object-not-found":
        Alert.alert("Något gick fel! Det verkar som att filen inte existerar.");
        break;
      case "storage/unauthorized":
        Alert.alert(
          "Något gick fel! Det verkar som att du inte har behörighet "
        );
        break;
      case "storage/canceled":
        Alert.alert("Ursäkta! Något gick fel");
        break;
      case "storage/unknown":
        Alert.alert("Ursäkta! Något gick fel");
        break;
    }
  }
};

//Gets one document in a collection by doc id
export const getOneDocById = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const item = docSnap.data();
      return item;
    }
  } catch (err) {
    console.log(err);
  }
};

//Gets all documents in one collection
export const getAllDocsInCollection = async (collectionName) => {
  let documents = [];
  const ref = query(
    collection(db, collectionName)
    // orderBy("createdAt", "desc")
  );
  try {
    const docs = await getDocs(ref);
    docs.forEach((doc) => {
      documents.push(doc.data());
    });
    return documents;
  } catch (err) {
    console.log(err);
  }
};

//Gets all documents with specific property value
export const getDocsWithSpecificValue = async (
  collectionName,
  property,
  id
) => {
  let documents = [];
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(property, "==", id));
  try {
    const data = await getDocs(q);
    data.forEach((doc) => {
      documents.push(doc.data());
    });
    return documents;
  } catch (err) {
    console.log(err);
  }
};

// Updates document OR adds new document with a preset id
// To add new doc that also creates an uid use addNewDoc
export const setOneDoc = async (collectionName, newData, id) => {
  try {
    let response = await setDoc(doc(db, collectionName, id), newData);
    return response;
  } catch (err) {
    console.log(err);
  }
};

// Update one property only
export const updateSingleProperty = async (
  collectionName,
  documentId,
  newData
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    updateDoc(docRef, newData).then((docRef) => {
      console.log("value has been updated");
    });
  } catch (err) {
    console.log(err);
  }
};

// Add a new document and set its referense to its id
export const addNewDoc = async (collectionName, newData) => {
  try {
    let response = await addDoc(collection(db, collectionName), newData).then(
      (docRef) => {
        let obj = { ...newData, id: docRef.id };
        setOneDoc(collectionName, obj, docRef.id);
        return docRef.id;
      }
    );
    console.log(JSON.stringify(response), "response");
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const deleteDocById = async (collectionName, id) => {
  try {
    const ref = doc(db, collectionName, id);
    await deleteDoc(ref);
    return;
  } catch (err) {
    console.log(err);
  }
};
