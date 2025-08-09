// Admin service functions for managing notes and users
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  addDoc
} from "firebase/firestore";
import { db } from "../config/firebase";
import { checkAdminStatus } from "./authService";

// Check if user is admin
export const isAdmin = async (userEmail) => {
  return await checkAdminStatus(userEmail);
};

// Get all pending notes for approval
export const getPendingNotes = async () => {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting pending notes:', error);
    return { notes: [], error: error.message };
  }
};

// Get all notes (approved, pending, rejected)
export const getAllNotesAdmin = async () => {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { notes, error: null };
  } catch (error) {
    console.error('Error getting all notes:', error);
    return { notes: [], error: error.message };
  }
};

// Approve a note
export const approveNote = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      status: 'approved',
      approvedAt: new Date(),
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error approving note:', error);
    return { error: error.message };
  }
};

// Deny access to a note
export const denyNote = async (noteId, reason = '') => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      status: 'access denied',
      denialReason: reason,
      deniedAt: new Date(),
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error denying note:', error);
    return { error: error.message };
  }
};
export const updateNote = async (noteId, updatedFields) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, updatedFields);
    return { error: null };
  } catch (error) {
    console.error("Error updating note:", error);
    return { error: error.message };
  }
};

export const getAllAccessRequests = async () => {
  try {
    const accessReqRef = collection(db, "accessRequests");
    const q = query(accessReqRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    return { requests, error: null };
  } catch (error) {
    console.error("Error getting access requests:", error);
    return { requests: [], error: error.message };
  }
};

// Approve access request
export const approveAccessRequest = async (requestId) => {
  try {
    const reqRef = doc(db, "accessRequests", requestId);
    await updateDoc(reqRef, {
      status: "approved",
      approvedAt: new Date(),
      updatedAt: new Date(),
    });
    return { error: null };
  } catch (error) {
    console.error("Error approving access request:", error);
    return { error: error.message };
  }
};

// Deny access request with optional reason
export const denyAccessRequest = async (requestId, reason = "") => {
  try {
    const reqRef = doc(db, "accessRequests", requestId);
    await updateDoc(reqRef, {
      status: "denied",
      denialReason: reason,
      deniedAt: new Date(),
      updatedAt: new Date(),
    });
    return { error: null };
  } catch (error) {
    console.error("Error denying access request:", error);
    return { error: error.message };
  }
};

// Add a new access request (when user submits payment)
export const createAccessRequest = async ({
  userId,
  userEmail,
  requestedNotes,
}) => {
  try {
    const accessReqRef = collection(db, "accessRequests");
    const docRef = await addDoc(accessReqRef, {
      userId,
      userEmail,
      requestedNotes,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error creating access request:", error);
    return { id: null, error: error.message };
  }
};
