import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./signin";

export default configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["user/setActiveUser"],
      },
    }),
  reducer: {
    user: userReducer,
  },
});
