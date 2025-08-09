import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../Components/Card";
import { BRANCHES } from "../../constants/index";

function Branch() {
  const { year } = useParams();
  const navigate = useNavigate();

  const handleBranchClick = (branch) => {
    navigate(`/sem/${encodeURIComponent(year)}/${encodeURIComponent(branch)}`);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Select Year - {year}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {BRANCHES.map((branch, index) => (
          <Card key={index} onClick={() => handleBranchClick(branch)}>
            <div className="flex flex-col items-center">
              <img
                src={`https://placehold.co/100x100?text=${branch.substring(
                  0,
                  3
                )}`}
                alt={branch}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
              <p className="text-center font-medium">{branch}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Branch;
