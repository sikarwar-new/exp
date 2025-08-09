import React from "react";
import "../styles/Particles.scss";

const Particles = () => {
  const particleElements = Array.from({ length: 30 }, (_, i) => (
    <div className="particle" key={i}></div>
  ));

  return <div className="particle-container">{particleElements}</div>;
};

export default Particles;
