import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";

// Action types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

// Action creators
export function login() {
  return { type: LOGIN };
}

export function logout() {
  return { type: LOGOUT };
}

// Thunks (async action creators)
export function saveLoginState(loggedIn: boolean) {
  return async (dispatch: Dispatch) => {
    try {
      await AsyncStorage.setItem("loggedIn", loggedIn.toString());
      if (loggedIn) {
        dispatch(login());
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function loadLoginState() {
  return async (dispatch: Dispatch) => {
    try {
      const loggedInString = await AsyncStorage.getItem("loggedIn");
      if (loggedInString === "true") {
        dispatch(login());
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };
}
