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
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

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
    collection(db, collectionName),
    orderBy("createdAt", "desc")
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
