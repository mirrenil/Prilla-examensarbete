import { initializeApp } from "firebase/app";
import { getAuth, Persistence, ReactNativeAsyncStorage } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdpdQ0mUhv3D4fUi6QNPdf39pFLhTNnpA",
  authDomain: "prilla-c8eca.firebaseapp.com",
  projectId: "prilla-c8eca",
  storageBucket: "prilla-c8eca.appspot.com",
  messagingSenderId: "267350792334",
  appId: "1:267350792334:web:614ebc1c0a786003dc51df",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export declare function getReactNativePersistence(
  storage: ReactNativeAsyncStorage
): Persistence;
