import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducers from "../reducers";
import { getFirebase } from "react-redux-firebase";

export default configureStore({
  reducer: rootReducers,
  middleware: [...getDefaultMiddleware(), thunk],
});
