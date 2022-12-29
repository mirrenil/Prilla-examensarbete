import { configureStore } from "@reduxjs/toolkit";
import userSignUpSlice from "./signin";
import userSignInSlice from "./signin";

export default configureStore({
  reducer: {
    user: userSignInSlice,
    newuser: userSignUpSlice,
  },
});
