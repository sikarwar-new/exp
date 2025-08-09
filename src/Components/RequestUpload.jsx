import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createNote, getUserUploadedNotes, updateUserEligibility } from "../services/notesService";
import MarksheetScanner from "../features/misc/MarksheetScanner";

function RequestUpload() {
  const { user, userDoc, updateUserDoc } = useAuth();
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Note upload form state
  const [noteForm, setNoteForm] = useState({
    title: "",
    subject: "",
    branch: "",
    year: "",
    semester: "",
    driveLink: "",
    description: "",
    price: 25,
  });
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserNotes();
    }
  }, [user]);

  const fetchUserNotes = async () => {
    if (user) {
      const { notes } = await getUserUploadedNotes(user.uid);
      setUserNotes(notes);
    }
    setLoading(false);
  };

  const showInfoModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleEligibilityResult = async ({ isEligible, status, data }) => {
    // Update user eligibility in Firestore
    await updateUserEligibility(user.uid, isEligible);
    updateUserDoc({ isEligible, academicDetails: data });
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    
    if (!noteForm.driveLink || !noteForm.title || !noteForm.subject) {
      showInfoModal("Please fill all required fields and provide a Google Drive link.");
      return;
    }

    const { noteId, error } = await createNote(noteForm, user.uid);
    
    if (error) {
      showInfoModal(`Error uploading note: ${error}`);
    } else {
      showInfoModal("Note uploaded successfully! It will be reviewed by admin.");
      setNoteForm({
        title: '',
        subject: '',
        branch: '',
        year: '',
        semester: '',
        driveLink: '',
        description: ''
      });
      fetchUserNotes(); // Refresh the notes list
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'access denied': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to upload notes.</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* User Dashboard Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.displayName || user.email}</p>
          <div className="mt-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              userDoc?.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userDoc?.isEligible ? 'Eligible to Upload' : 'Not Eligible'}
            </span>
          </div>
        </div>

        {/* Eligibility Check Section */}
        {!userDoc?.isEligible && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Check Eligibility</h2>
            <p className="text-gray-600 mb-4">
              Please scan your marksheet to check if you're eligible to upload notes.
            </p>
            <MarksheetScanner
              onEligibilityDetermined={handleEligibilityResult}
              showInfoModal={showInfoModal}
            />
          </div>
        )}

        {/* Note Upload Form */}
        {userDoc?.isEligible && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Notes</h2>
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Engineering Mathematics Notes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm({...noteForm, subject: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={noteForm.branch}
                    onChange={(e) => setNoteForm({...noteForm, branch: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={noteForm.year}
                    onChange={(e) => setNoteForm({...noteForm, year: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={noteForm.semester}
                    onChange={(e) => setNoteForm({...noteForm, semester: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Semester</option>
                    <option value="1st semester">1st Semester</option>
                    <option value="2nd semester">2nd Semester</option>
                    <option value="3rd semester">3rd Semester</option>
                    <option value="4th semester">4th Semester</option>
                    <option value="5th semester">5th Semester</option>
                    <option value="6th semester">6th Semester</option>
                    <option value="7th semester">7th Semester</option>
                    <option value="8th semester">8th Semester</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Drive Link *
                </label>
                <input
                  type="url"
                  required
                  value={noteForm.driveLink}
                  onChange={(e) => setNoteForm({...noteForm, driveLink: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://drive.google.com/file/d/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload your notes to Google Drive and make it publicly accessible, then paste the link here.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({...noteForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brief description of the notes..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
              >
                Upload Notes
              </button>
            </form>
          </div>
        )}

        {/* User's Uploaded Notes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Uploaded Notes</h2>
          {userNotes.length === 0 ? (
            <p className="text-gray-500">You haven't uploaded any notes yet.</p>
          ) : (
            <div className="space-y-4">
              {userNotes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{note.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                      {note.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                    <div><strong>Subject:</strong> {note.subject}</div>
                    <div><strong>Branch:</strong> {note.branch}</div>
                    <div><strong>Year:</strong> {note.year}</div>
                    <div><strong>Semester:</strong> {note.semester}</div>
                  </div>
                  <p className="text-gray-700 text-sm">{note.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded: {new Date(note.createdAt?.toDate()).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Information</h3>
              <p className="text-gray-700 mb-6">{modalMessage}</p>
              <div className="text-center">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestUpload;