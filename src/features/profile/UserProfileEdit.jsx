import React, { useRef, useState } from "react";

export default function UserProfileEdit() {
  const [avatar, setAvatar] = useState(
    "https://placehold.co/100x100?text=Profile"
  );
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setAvatar(imageURL);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-amber-100 via-white to-amber-200 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        <div className="flex items-center justify-center relative">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-8 bg-white border p-1 rounded-full shadow hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M16 5l6 6m-2 7h-6a2 2 0 00-2 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h6" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter a new password"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
