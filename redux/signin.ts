import { createSlice } from "@reduxjs/toolkit";

// same as [displayName, setdisplayName] = useState(null)
const initialState = {
  email: null,
  password: null,
};

const userSignInSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // same as setEmail(action.payload)
    setActiveUser: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setSignOutState: (state) => {
      state.email = null;
      state.password = null;
    },
  },
});

export const { setActiveUser, setSignOutState } = userSignInSlice.actions;

export const selectEmail = (state: any) => state.user.email;
export const selectPassword = (state: any) => state.user.password;

export default userSignInSlice.reducer;
