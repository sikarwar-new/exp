import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Card";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function Year() {
  const navigate = useNavigate();

  const handleYearClick = (year) => {
    if (year === "1st Year") {
      navigate(`/results?branch=${encodeURIComponent(year)}`);
    } else {
      navigate(`/sem/${encodeURIComponent(year)}`);
    }
  };

  return (
    <div className="mt-15 min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Select Your Year</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {YEARS.map((year, index) => (
          <Card key={index} onClick={() => handleYearClick(year)}>
            <div className="flex flex-col items-center">
              <img
                src={`https://placehold.co/100x100?text=${year.split(" ")[0]}`}
                alt={year}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
              <p className="text-center font-medium">{year}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Year;
