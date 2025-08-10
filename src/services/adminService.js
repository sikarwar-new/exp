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

// Get all notes for admin (all statuses)
export const getAllNotesAdmin = async () => {
  try {
    const notesRef = collection(db, "notes");
    const querySnapshot = await getDocs(query(notesRef, orderBy("createdAt", "desc")));
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    return { notes, error: null };
  } catch (error) {
    console.error("Error getting admin notes:", error);
    return { notes: [], error: error.message };
  }
};

// Approve a note and move from pending to approved for all users who purchased it
export const approveNote = async (noteId) => {
  try {
    // First, get the note details
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);
    
    if (!noteSnap.exists()) {
      return { error: "Note not found" };
    }

    const noteData = noteSnap.data();

    // Update note status to approved
    await updateDoc(noteRef, {
      status: "approved",
      updatedAt: new Date(),
    });

    // Find all users who have this note in their pendingNotes
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const batch = [];
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const pendingNotes = userData.pendingNotes || [];
      
      // Find the pending note that matches this title
      const pendingNote = pendingNotes.find(note => note.title === noteData.title);
      
      if (pendingNote) {
        // Move from pending to approved
        const approvedNote = {
          ...pendingNote,
          driveLink: noteData.driveLink,
          approvedAt: new Date(),
          status: "approved"
        };

        batch.push({
          userRef: doc(db, "users", userDoc.id),
          updates: {
            pendingNotes: arrayRemove(pendingNote),
            approvedNotes: arrayUnion(approvedNote),
            updatedAt: new Date()
          }
        });
      }
    });

    // Execute all user updates
    await Promise.all(batch.map(({ userRef, updates }) => updateDoc(userRef, updates)));

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
    console.error("Error approving note:", error);
    return { error: error.message };
  }
};

// Deny a note
export const denyNote = async (noteId, reason = "") => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      status: "denied",
      denialReason: reason,
      updatedAt: new Date(),
    });

    return { error: null };
  } catch (error) {
    console.error("Error denying note:", error);
    return { error: error.message };
  }
};

// Update note details
export const updateNote = async (noteId, updates) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return { error: null };
  } catch (error) {
    console.error("Error updating note:", error);
    return { error: error.message };
  }
};

// Get all access requests
export const getAllAccessRequests = async () => {
  try {
    const requestsRef = collection(db, "accessRequests");
    const querySnapshot = await getDocs(query(requestsRef, orderBy("createdAt", "desc")));
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
    const requestRef = doc(db, "accessRequests", requestId);
    const requestSnap = await getDoc(requestRef);
    
    if (!requestSnap.exists()) {
      return { error: "Request not found" };
    }

    const requestData = requestSnap.data();

    // Update request status
    await updateDoc(requestRef, {
      status: "approved",
      approvedAt: new Date(),
      updatedAt: new Date(),
    });

    // Add notes to user's approved notes
    if (requestData.userId && requestData.requestedNotes) {
      const userRef = doc(db, "users", requestData.userId);
      const notesToAdd = requestData.requestedNotes.map(note => ({
        ...note,
        approvedAt: new Date(),
        status: "approved"
      }));

      await updateDoc(userRef, {
        approvedNotes: arrayUnion(...notesToAdd),
        updatedAt: new Date()
      });
    }

    return { error: null };
  } catch (error) {
    console.error("Error approving access request:", error);
    return { error: error.message };
  }
};

// Deny access request
export const denyAccessRequest = async (requestId, reason = "") => {
  try {
    const requestRef = doc(db, "accessRequests", requestId);
    await updateDoc(requestRef, {
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