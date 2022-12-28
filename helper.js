import { getDocs, collection, doc, getDoc, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

//Gets one document in a collection by doc id
export const getOneDocById = async (collectionName, id) => {
	try {
		const docRef = doc(db, collectionName, id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const item = docSnap.data();
			return {...item, id: docSnap.id};
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
			documents.push({ ...doc.data(), id: doc.id });
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
  const q = query(collectionRef, where(property, '==', id));
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

// Checks if document with id already exists. if so, existing doc updates with new data. if not, new doc is added.
export const setOneDoc = async (collectionName, id, newData) => {
	try {
		let response = await setDoc(doc(db, collectionName, id), newData);
		return response;
	} catch (err) {
		console.log(err);
	}
};
