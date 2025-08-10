import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";

// Admin emails list
const ADMIN_EMAILS = [
  "admin@example.com",
  "admin@collabenote.com"
];

// Check if email is admin
export const checkAdminStatus = async (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};

// Sign in with email and password
export const signInWithEmail = async (email, password, isAdminLogin = false) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check admin status
    const isAdmin = await checkAdminStatus(user.email);
    
    if (isAdminLogin && !isAdmin) {
      await signOut(auth);
      return { user: null, error: "Access denied. Admin privileges required." };
    }

    if (!isAdminLogin && !isAdmin) {
      // Create user document if it doesn't exist (for regular users)
      await createUserDocument(user);
    }

    return { user, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

// Sign up with email and password (only for regular users)
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    // Check if trying to create admin account
    const isAdmin = await checkAdminStatus(email);
    if (isAdmin) {
      return { user: null, error: "Admin accounts cannot be created through signup." };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document
    await createUserDocument(user, { displayName });

    return { user, error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

// Sign in with Google
export const signInWithGoogle = async (isAdminLogin = false) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check admin status
    const isAdmin = await checkAdminStatus(user.email);
    
    if (isAdminLogin && !isAdmin) {
      await signOut(auth);
      return { user: null, error: "Access denied. Admin privileges required." };
    }

    if (!isAdminLogin && !isAdmin) {
      // Create user document if it doesn't exist (for regular users)
      await createUserDocument(user);
    }

    return { user, error: null };
  } catch (error) {
    console.error("Google sign in error:", error);
    return { user: null, error: getAuthErrorMessage(error.code) };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error: error.message };
  }
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    
    try {
      await setDoc(userRef, {
        displayName: displayName || additionalData.displayName || "",
        email,
        photoURL: photoURL || "",
        pendingNotes: [],
        approvedNotes: [],
        uploadedNotes: [],
        earnings: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  }
};

// Get user document
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user document:", error);
    return null;
  }
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion.";
    default:
      return "An error occurred during authentication.";
  }
};