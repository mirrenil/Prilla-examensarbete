import { createSlice } from "@reduxjs/toolkit";

// same as [displayName, setdisplayName] = useState(null)
const initialState = {
  reduxEmail: null,
};

const userSignInSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // same as setreduxEmail(action.payload)
    setActiveUser: (state, action) => {
      state.reduxEmail = action.payload.reduxEmail;
    },
    setSignOutState: (state) => {
      state.reduxEmail = null;
    },
  },
});

export const { setActiveUser, setSignOutState } = userSignInSlice.actions;

export const selectReduxEmail = (state: any) => state.user.reduxEmail;

export default userSignInSlice.reducer;
