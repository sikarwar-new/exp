import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import ProductCard from "../../Components/ProductCard.jsx";
import UserProfileEdit from "./UserProfileEdit.jsx";
import { getUserAccessedNotes } from "../../services/notesService.js";

function Profile() {
  const { user, userDoc } = useAuth();
  const fileInputRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [accessedNotes, setAccessedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.photoURL || userDoc?.photoURL) {
      setProfilePhoto(user?.photoURL || userDoc?.photoURL);
    }
  }, [user, userDoc]);

  useEffect(() => {
    const fetchAccessedNotes = async () => {
      if (user) {
        const { notes } = await getUserAccessedNotes(user.uid);
        setAccessedNotes(notes);
      }
      setLoading(false);
    };

    fetchAccessedNotes();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePhoto(imageURL);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 shadow-md rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            className="rounded-full w-28 h-28 object-cover shadow-md"
            src={profilePhoto || "https://placehold.co/100x100?text=Profile"}
            alt="Profile"
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-2xl font-bold text-white">{user?.displayName || userDoc?.displayName}</p>
          <p className="text-gray-300 text-sm">{user?.email}</p>
          <button
            onClick={() => setIsEditOpen(true)}
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-indigo-100 rounded-xl px-6 py-8 shadow-inner">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800">
            Resources Accessed
          </h3>
          {accessedNotes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {accessedNotes.map((note, index) => (
                <ProductCard
                  key={`accessed-${index}`}
                  title={note.title}
                  subject={note.subject || note.branch}
                  numRatings={note.ratings?.length || 0}
                  price={note.price}
                  btn="Start Reading"
                  isBought={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No accessed notes yet.</p>
          )}
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg relative max-w-xl w-full">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>
            <UserProfileEdit />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
