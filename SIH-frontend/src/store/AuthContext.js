import React, { createContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebaseConfig'; // Make sure this path is correct
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    // This listener is the core of the authentication state.
    // It automatically updates when the user logs in or out via Firebase.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, so we get their role from Firestore.
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserToken(user.uid);
          setUserRole(userData.role); // Set the role from Firestore
        } else {
          // This case handles if a user exists in Auth but not in Firestore.
          // Log them out to be safe.
          await auth.signOut();
        }
      } else {
        // User is signed out.
        setUserToken(null);
        setUserRole(null);
      }

      // We still check the onboarding status from AsyncStorage.
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      if (onboarded === 'true') {
        setHasOnboarded(true);
      }

      setIsLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts.
    return unsubscribe;
  }, []);

  const authContextValue = useMemo(() => ({
    // The signIn function is no longer needed here because the listener handles it.
    // We keep it in the context for legacy reasons if other components call it, but it does nothing.
    signIn: () => {},
    signOut: async () => {
      // The only job of signOut is to tell Firebase to sign out.
      // The listener above will handle clearing the state.
      await auth.signOut();
    },
    completeOnboarding: async () => {
      try {
        await AsyncStorage.setItem('hasOnboarded', 'true');
        setHasOnboarded(true);
      } catch (e) {
        console.error('Failed to save onboarding status', e);
      }
    },
    userToken,
    userRole,
    isLoading,
    hasOnboarded,
  }), [userToken, userRole, isLoading, hasOnboarded]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};