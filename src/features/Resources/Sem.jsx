import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../Components/Card";
import { SEMESTERS } from "../../constants/index";

function Sem() {
  const { year, branch } = useParams();
  const navigate = useNavigate();

  const handleSemClick = (semester) => {
    navigate(
      `/results?year=${encodeURIComponent(year)}&branch=${encodeURIComponent(
        branch
      )}&semester=${encodeURIComponent(semester)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">{`Select Semester - ${branch}, ${year} Year`}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {SEMESTERS.map((sem, index) => (
          <Card key={index} onClick={() => handleSemClick(sem)}>
            <div className="flex flex-col items-center">
              <img
                src={`https://placehold.co/100x100?text=${sem.split(" ")[0]}`}
                alt={sem}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
              <p className="text-center font-medium">{sem}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Sem;
