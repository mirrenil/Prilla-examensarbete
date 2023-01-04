import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayName: "",
  id: "",
  email: "",
  photo: "",
};

const userSignInSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.displayName = action.payload.currentUser.displayName;
      state.id = action.payload.currentUser.uid;
      state.email = action.payload.currentUser.email;
      state.photo = action.payload.currentUser.photoURL;
    },
    updateUser: (state, action) => {
      console.log("action: ", action);
      state.photo = action.payload.photo;
    },
    setSignOutState: (state) => {
      state = { displayName: "", id: "", email: "", photo: "" };
    },
  },
});

export const { setActiveUser, setSignOutState, updateUser } =
  userSignInSlice.actions;

export const currentReduxUser = (state: any) => state.user;

export default userSignInSlice.reducer;
