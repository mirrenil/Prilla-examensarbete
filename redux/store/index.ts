import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducers from "../reducers";
import { getFirebase } from "react-redux-firebase";
import { createFirebaseInstance } from "react-redux-firebase";
import firebase from "firebase/app";
import "firebase/firestore";

export const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

export const rrfProps = {
  firebase,
  config: {
    userProfile: "users",
    useFirestoreForProfile: true,
  },
};

export default configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          getFirebase,
          createFirebaseInstance,
        },
      },
    }).concat(thunk),
});
