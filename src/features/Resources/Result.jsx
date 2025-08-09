import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../Components/ProductCard";
import { getNotesByFilter } from "../../services/notesService";

function Result() {
  const query = new URLSearchParams(useLocation().search);
  const year = query.get("year") || "";
  const branch = query.get("branch") || "";
  const semester = query.get("semester") || "";

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);

      const filters = {};

      // Keep the values exactly as stored in Firestore
      if (year) {
        // Example: Firestore stores "1st Year" not "1st"
        filters.year = year.trim();
      }
      if (branch) {
        filters.branch = branch.trim();
      }
      if (semester) {
        filters.semester = semester.trim();
      }

      // Always fetch only approved notes
      filters.status = "approved";

      const { notes: fetchedNotes } = await getNotesByFilter(filters);
      setNotes(fetchedNotes);
      setLoading(false);
    };

    fetchNotes();
  }, [year, branch, semester]);

  const handleAddToCart = (course) => {
    console.log("Add to cart clicked for:", course.title);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">
      <h2 className="mt-15 text-3xl font-bold text-center mb-8">
        {year
          ? branch
            ? semester
              ? `Results for ${year} - ${branch} - ${semester}`
              : `Results for ${year} - ${branch}`
            : `Results for ${year}`
          : "Please select branch and semester"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {notes.length > 0 ? (
          notes.map((course) => (
            <ProductCard
              key={course.id}
              title={course.title}
              subject={course.subject || "General"}
              numRatings={course.ratings?.length || 0}
              price={course.price}
              btn={"Add to Cart"}
              onAddToCart={() => handleAddToCart(course)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">
              No resources found for your selection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
