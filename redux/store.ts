import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./signin";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
