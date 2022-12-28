import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";
import firebase from "firebase/app";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "@reduxjs/toolkit";
import { auth } from "../../firebase";

// Action types
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";
export const GET_CURRENT_USER = "GET_CURRENT_USER";

// Action creators
export function login() {
  return { type: LOGIN };
}

export function logout() {
  return { type: LOGOUT };
}

export function setUser(user: typeof auth | null) {
  return { type: SET_USER, user };
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

export function getCurrentUser() {
  return (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    auth.onAuthStateChanged((user) => {
      dispatch(setUser(auth || null));
    });
  };
}
