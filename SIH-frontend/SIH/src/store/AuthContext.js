// AuthContext.js

import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  
  // THE "LOGIN LOCK" STATE
  // This state will prevent the listener from acting while we are manually signing in.
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // THE "LOCK" CHECK
      // If our signIn function is running, we ignore this event because
      // the signIn function itself will be the source of truth.
      if (isLoggingIn) {
        return;
      }

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserToken(user.uid);
          setUserRole(docSnap.data().role);
        } else {
          // User exists in Auth but not DB, a bad state. Sign out.
          await auth.signOut();
        }
      } else {
        setUserToken(null);
        setUserRole(null);
      }

      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboarded(onboarded === 'true');
      setIsLoading(false);
    });
    return unsubscribe;
  }, [isLoggingIn]); // Add isLoggingIn as a dependency

  const signIn = useCallback(async (email, password, intendedRole) => {
    // 1. ENGAGE THE LOCK
    setIsLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === intendedRole) {
        // SUCCESS: Roles match. The state will be set by the listener
        // once we release the lock.
        setUserToken(user.uid);
        setUserRole(docSnap.data().role);
      } else {
        await auth.signOut();
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      // Re-throw any error to be caught by AuthScreen
      throw error;
    } finally {
      // 3. RELEASE THE LOCK
      // This allows the onAuthStateChanged listener to behave normally again.
      setIsLoggingIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    setHasOnboarded(true);
  }, []);

  const authContextValue = {
    signIn,
    signOut,
    completeOnboarding,
    userToken,
    userRole,
    isLoading,
    hasOnboarded,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};