import { initializeApp } from "firebase/app";
import { getAuth, Persistence, ReactNativeAsyncStorage } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  //original
  apiKey: "AIzaSyCdpdQ0mUhv3D4fUi6QNPdf39pFLhTNnpA",
  authDomain: "prilla-c8eca.firebaseapp.com",
  projectId: "prilla-c8eca",
  storageBucket: "prilla-c8eca.appspot.com",
  messagingSenderId: "267350792334",
  appId: "1:267350792334:web:614ebc1c0a786003dc51df",
  // backup below
  // apiKey: "AIzaSyABzLETtOOPLJVOAwyqGJCDeYSyGAQPjLc",
  // authDomain: "prilla-backup.firebaseapp.com",
  // projectId: "prilla-backup",
  // storageBucket: "prilla-backup.appspot.com",
  // messagingSenderId: "151031722406",
  // appId: "1:151031722406:web:0b0011ad1e3b8a10dedf67",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export declare function getReactNativePersistence(
  storage: ReactNativeAsyncStorage
): Persistence;
