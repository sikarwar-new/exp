// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange, getUserDocument, checkAdminStatus } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Check if user is admin
        const adminStatus = await checkAdminStatus(firebaseUser.email);
        setIsAdmin(adminStatus);
        
        // Get user document from Firestore only if not admin
        if (!adminStatus) {
          const userDocument = await getUserDocument(firebaseUser.uid);
          setUserDoc(userDocument);
        } else {
          setUserDoc(null);
        }
      } else {
        setUser(null);
        setUserDoc(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loggedIn = !!user;

  const updateUserDoc = (newData) => {
    setUserDoc(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userDoc, 
      isAdmin,
      setUser, 
      updateUserDoc,
      loggedIn, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
