import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import ProductCard from "../../Components/ProductCard";
import { NavLink } from "react-router-dom";
import Particles from "../../Components/Particles";
import { getAllNotes } from "../../services/notesService";

function HomePostLogIn() {
  const { user, userDoc, isAdmin } = useAuth();
  const [randomNotes, setRandomNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user && !isAdmin) {
        // Fetch random notes for recommendations
        const { notes: allNotes } = await getAllNotes();
        const shuffled = [...allNotes].sort(() => 0.5 - Math.random());
        setRandomNotes(shuffled.slice(0, 4));
      }
      setLoading(false);
    };

    fetchData();
  }, [user, isAdmin]);

  // Redirect admin to admin panel
  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome Admin</h1>
          <p className="text-gray-600 mb-6">You are logged in as an administrator.</p>
          <NavLink
            to="/admin"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Go to Admin Panel
          </NavLink>
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
    <div className="mt-15 px-6 py-10 min-h-screen text-gray-800 w-[90%] mx-auto">
      <Particles />
      <h1 className="text-4xl font-semibold text-center mb-12">
        Welcome back, <span className="text-orange-500">{user?.displayName || userDoc?.displayName || "User"}</span>{" "}
        👋
      </h1>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between text-white shadow-md mt-12 mb-12">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-semibold mb-1">
            Looking for helpful notes or study kits?
          </h2>
          <p className="text-gray-300 text-sm">
            Browse the Resources section to boost your learning.
          </p>
        </div>
        <NavLink
          to="/resources"
          className="bg-white text-gray-900 font-medium px-5 py-2 rounded-md shadow hover:bg-gray-100 transition"
        >
          Explore Resources
        </NavLink>
      </div>

      <section className="mb-16 bg-indigo-100 rounded-xl px-6 py-8 shadow-inner">
        <h2 className="text-2xl font-semibold mb-6">Notes For You</h2>
        <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-300">
          {randomNotes.map((note, index) => (
            <div key={`random-${index}`} className="flex-shrink-0 w-64">
              <ProductCard
                title={note.title}
                subject={note.subject || note.branch}
                numRatings={note.ratings?.length || 0}
                price={note.price || 5}
                btn="Add to Cart"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 bg-indigo-100 rounded-xl px-6 py-8 shadow-inner">
        <h2 className="text-2xl font-semibold mb-4">Learning Kits</h2>
        <p className="text-gray-600 text-sm mb-6">
          Explore our curated study kits for better semester planning.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard
            title="One Year Kit"
            subject="All Subjects"
            numRatings={403}
            price={400}
            btn="Add to Cart"
          />
          <ProductCard
            title="One Semester Kit"
            subject="All Subjects"
            numRatings={403}
            price={220}
            btn="Add to Cart"
          />
        </div>
      </section>
    </div>
  );
}

export default HomePostLogIn;
