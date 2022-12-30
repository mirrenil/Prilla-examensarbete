// import { createSlice } from "@reduxjs/toolkit";

// // same as [displayName, setdisplayName] = useState(null)
// const initialState = {
//   reduxDisplayName: null,
//   reduxEmail: null,
// };

// const userSignUp = createSlice({
//   name: "newreduxuser",
//   initialState,
//   reducers: {
//     // same as setEmail(action.payload)
//     setNewUser: (state, action) => {
//       console.log('in userSignUp')
//       state.reduxDisplayName = action.payload.reduxDisplayName;
//       state.reduxEmail = action.payload.reduxEmail;
//     },
//   },
// });
// export const { setNewUser } = userSignUp.actions;

// export const reduxDisplayName = (state: any) => state.user.displayName;
// export const reduxEmail = (state: any) => state.user.email;

// export default userSignUp.reducer;
