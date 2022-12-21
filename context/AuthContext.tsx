import React, { createContext, useContext, useState } from "react";

import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface AuthContext {
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<any>;
  errorMessage: boolean;
}

export const AuthContext = createContext<AuthContext>({
  signup: async () => {},
  errorMessage: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  errorMessage
    ? setTimeout(() => {
        setErrorMessage(false);
      }, 10000)
    : null;

  const addUserToDb = async (
    email: string,
    id: string,
    displayName: string
  ) => {
    await setDoc(doc(db, "users", id), {
      displayName: displayName,
      email: email,
    });
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: displayName,
            });
          }
        })
        .catch((error) => {
          setErrorMessage(true);
        });
      if (auth.currentUser && auth.currentUser.email) {
        addUserToDb(auth.currentUser.email, auth.currentUser.uid, displayName);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        errorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
