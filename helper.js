import { getDocs, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

//Gets one document in a collection by doc id
export const getOneDocById = async (collectionName, id) => {
	try {
		const productDocRef = doc(db, "produkter", id);
		const docSnap = await getDoc(productDocRef);
		if (docSnap.exists()) {
			const product = docSnap.data();
			return product
		}
	} catch (err) {
		console.log(err);
	}
};

//Gets all documents in one collection
export const getAllDocsInCollection = async (collectionName) => {
	let documents = [];
	try {
		const docs = await getDocs(collection(db, collectionName));
		docs.forEach((doc) => {
			documents.push({...doc.data(), id: doc.id});
		});
		return documents;
	} catch (err) {
		console.log(err);
	}
};

// Checks if document with id already exists. if so, existing doc updates with new data. if not, new doc is added.
export const setOneDoc = async (collectionName, id, newData) => {
  try {
    let response = await setDoc(doc(db, collectionName, id), newData);
    return response;
  } catch (err) {
    console.log(err);
  }
};
