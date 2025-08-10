import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

function Profile() {
  const { user, loggedIn } = useAuth();
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("accessed");

  // Real-time listener for user document
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setUserDoc(doc.data());
      } else {
        setUserDoc(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleOpenNote = (driveLink) => {
    if (driveLink) {
      window.open(driveLink, '_blank');
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
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

  const approvedNotes = userDoc?.approvedNotes || [];
  const pendingNotes = userDoc?.pendingNotes || [];
  const earnings = userDoc?.earnings || 0;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.photoURL || "https://placehold.co/80x80"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.displayName || "User"}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Total Earnings: ₹{earnings}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("accessed")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "accessed"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Accessed Notes ({approvedNotes.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pending"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Approval ({pendingNotes.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "accessed" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Accessed Notes</h2>
                {approvedNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No approved notes yet.</p>
                    <a
                      href="/resources"
                      className="inline-block bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
                    >
                      Browse Notes
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedNotes.map((note, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{note.subject}</p>
                        <p className="text-sm text-gray-500 mb-3">
                          Purchased: {new Date(note.purchasedAt?.toDate ? note.purchasedAt.toDate() : note.purchasedAt).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => handleOpenNote(note.driveLink)}
                          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition font-medium"
                        >
                          Start Reading
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "pending" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
                {pendingNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No pending notes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingNotes.map((note, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                        <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{note.subject}</p>
                        <p className="text-sm text-gray-500 mb-3">
                          Purchased: {new Date(note.purchasedAt?.toDate ? note.purchasedAt.toDate() : note.purchasedAt).toLocaleDateString()}
                        </p>
                        <div className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md text-center font-medium">
                          Pending Admin Approval
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Earnings Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">₹{earnings}</h3>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">{approvedNotes.length}</h3>
              <p className="text-sm text-gray-600">Notes Accessed</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <h3 className="text-2xl font-bold text-yellow-600">{pendingNotes.length}</h3>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;