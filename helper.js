import {
	getDocs,
	collection,
	doc,
	getDoc,
	setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export const getOneDocById = async (collectionName, id) => {
	try {
		const docRef = doc(db, collectionName, id);
		const snap = await getDoc(docRef);
		const doc = snap.data();
		return doc;
	} catch (err) {
		console.log(err);
	}
};

export const getAllDocsInCollection = async (collectionName) => {
	let documents = [];
	try {
		const docs = await getDocs(collection(db, collectionName));
		docs.forEach((doc) => {
			documents.push(doc.data());
		});
		return documents;
	} catch (err) {
		console.log(err);
	}
};

export const setOneDoc = async (collectionName, id, newData) => {
	try {
    let response = await setDoc(doc(db, collectionName, id), {newData});
    return response;
	} catch (err) {
		console.log(err);
	}
};
