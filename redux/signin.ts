import { createSlice } from "@reduxjs/toolkit";

// same as [displayName, setdisplayName] = useState(null)
const initialState = {
  // reduxEmail: null,
    displayName: "",
    id: "",
    email: ""
  
};

const userSignInSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // same as setreduxEmail(action.payload)
    setActiveUser: (state, action) => {
      // console.log('setActiveUser state : ', state )
      console.log('setActiveUser action : ',  action.payload.currentUser)
      // state.reduxEmail = action.payload.reduxEmail;
      state.displayName = action.payload.currentUser.displayName
      state.id = action.payload.currentUser.uid
      state.email = action.payload.currentUser.email
      console.log('state: ', state)
    },
    setSignOutState: (state) => {
      // state.reduxEmail = null;
      state = {displayName: "", id: "", email: ""}
    },
  },
});

export const { setActiveUser, setSignOutState } = userSignInSlice.actions;

// export const selectReduxEmail = (state: any) => state.user.reduxEmail;
export const currentReduxUser = (state: any) => state.user;

export default userSignInSlice.reducer;
