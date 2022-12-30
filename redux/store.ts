import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./signin";
import newReduxUserReducer from "./signup";

export default configureStore({
  reducer: {
    user: userReducer,
    newreduxuser: newReduxUserReducer,
  },
});
