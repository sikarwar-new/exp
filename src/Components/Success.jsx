// Notes service functions for Firestore operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Get all approved notes for regular users
export const getAllNotes = async () => {
  try {
    const notesRef = collection(db, "notes");
    return { error: error.message };
  }
};

// Move note from pending to approved and update uploader earnings
export const approveUserNote = async (userId, noteData) => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Remove from pendingNotes and add to approvedNotes
    await updateDoc(userRef, {
      pendingNotes: arrayRemove(noteData),
      approvedNotes: arrayUnion(noteData),
      updatedAt: new Date(),
    });

    // Update uploader's earnings
    if (noteData.uploadedBy) {
      const uploaderRef = doc(db, "users", noteData.uploadedBy);
      await updateDoc(uploaderRef, {
        earnings: increment(5),
        updatedAt: new Date(),
      });
    }

    return { error: null };
  } catch (error) {
    console.error("Error approving user note:", error);
    return { error: error.message };
  }
};

// Get user's pending and approved notes
export const getUserNoteStatus = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { pendingNotes: [], approvedNotes: [], error: "User not found" };
    }
    
    const userData = userSnap.data();
    return {
      pendingNotes: userData.pendingNotes || [],
      approvedNotes: userData.approvedNotes || [],
      error: null
    };
  } catch (error) {
    console.error("Error getting user note status:", error);
    return { pendingNotes: [], approvedNotes: [], error: error.message };
  }
};

// Add note to user's pending notes
export const addToPendingNotes = async (userId, noteData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      pendingNotes: arrayUnion(noteData),
      updatedAt: new Date(),
    });
    return { error: null };
  } catch (error) {
    console.error("Error adding to pending notes:", error);
    return { error: error.message };
  }
};

    return { notes, error: null };
  } catch (error) {
    console.error("Error getting notes:", error);
    return { notes: [], error: error.message };
  }
};

// Get notes by filters
export const getNotesByFilter = async (filters = {}) => {
  try {
    const notesRef = collection(db, "notes");
    let q = query(notesRef);

    // Always filter by status if provided
    if (filters.status) {
      q = query(q, where("status", "==", filters.status.trim()));
    } else {
      q = query(q, where("status", "==", "approved"));
    }

    // Apply filters safely
    if (filters.year) {
      q = query(q, where("year", "==", filters.year.trim()));
    }
    if (filters.branch) {
      q = query(q, where("branch", "==", filters.branch.trim()));
    }
    if (filters.semester) {
      q = query(q, where("semester", "==", filters.semester.trim()));
    }

    // Order results
    q = query(q, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    return { notes, error: null };
  } catch (error) {
    console.error("Error getting filtered notes:", error);
    return { notes: [], error: error.message };
  }
};

// Get user's uploaded notes
export const getUserUploadedNotes = async (userId) => {
  try {
    // Get user document to access approvedNotes
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { notes: [], error: "User not found" };
    }
    
    const userData = userSnap.data();
    const approvedNotes = userData.approvedNotes || [];

    return { notes: approvedNotes, error: null };
  } catch (error) {
    console.error("Error getting user uploaded notes:", error);
    return { notes: [], error: error.message };
  }
};

// Create a new note (for users)
export const createNote = async (noteData, userId) => {
  try {
    const notesRef = collection(db, "notes");
    const docRef = await addDoc(notesRef, {
      ...noteData,
      uploadedBy: userId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { noteId: docRef.id, error: null };
  } catch (error) {
    console.error("Error creating note:", error);
    return { noteId: null, error: error.message };
  }
};

// Update user eligibility
export const updateUserEligibility = async (userId, isEligible) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isEligible: isEligible,
      updatedAt: new Date(),
    });
    return { error: null };
  } catch (error) {
    console.error("Error updating user eligibility:", error);
    return { error: error.message };
  }
};
export const getUserAccessedNotes = async (userId) => {
  try {

    return { notes, error: null };
  } catch (error) {
    console.error("Error getting accessed notes:", error);
    return { notes: [], error: error.message };
  }
};