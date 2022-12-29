import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "@reduxjs/toolkit";
import { auth } from "../../firebase";

// Action types
export const LOGIN = "LOGIN";
export const SIGN_OUT_START = "SIGN_OUT_START";
export const SIGN_OUT_SUCCESS = "SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAILURE = "SIGN_OUT_FAILURE";
export const SET_USER = "SET_USER";
export const GET_CURRENT_USER = "GET_CURRENT_USER";

// Action creators
export function login() {
  return { type: LOGIN };
}

export function logout() {
  return { type: SIGN_OUT_START };
}

export function setUser(user: typeof auth | null) {
  return { type: SET_USER, user };
}

// Thunks (async action creators)
// this function should be called saveLoginState(false) to sign out!
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
      if (loggedInString) {
        dispatch(login());
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export const signOut = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: "SIGN_OUT_START" });
    auth
      .signOut()
      .then(() => {
        dispatch({ type: "SIGN_OUT_SUCCESS" });
      })
      .catch((error: any) => {
        dispatch({ type: "SIGN_OUT_FAILURE", error });
      });
  };
};

export function getCurrentUser() {
  return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    auth.onAuthStateChanged((user) => {
      dispatch(setUser(auth || null));
    });
  };
}
