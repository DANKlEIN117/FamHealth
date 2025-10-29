import React from "react";
import "./Spinner.css";

const Spinner = ({ show }) => {
  if (!show) return null;

  return (
    <div className="spinner-overlay">
      <div className="dot-spinner">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dot"></div>
        ))}
      </div>
    </div>
  );
};

export default Spinner;
