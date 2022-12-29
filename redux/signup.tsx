// import { createSlice } from "@reduxjs/toolkit";

// // same as [displayName, setdisplayName] = useState(null)
// const initialState = {
//   displayName: null,
//   email: null,
//   password: null,
//   passwordConfirmation: null,
// };

// const userSignUp = createSlice({
//   name: "newuser",
//   initialState,
//   reducers: {
//     // same as setEmail(action.payload)
//     setNewUser: (state, action) => {
//       state.displayName = action.payload.displayName;
//       state.email = action.payload.email;
//       state.password = action.payload.password;
//       state.passwordConfirmation = action.payload.passwordConfirmation;
//     },
//   },
// });

// export const { setNewUser } = userSignUp.actions;

// export const selectDisplayName = (state: any) => state.user.displayName;
// export const selectEmail = (state: any) => state.user.email;
// export const selectPassword = (state: any) => state.user.password;
// export const selectPasswordConfirmation = (state: any) =>
//   state.user.passwordConfirmation;

// export default userSignUp.reducer;
