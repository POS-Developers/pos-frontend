import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css/FloatingButton.css"; // Ensure the CSS file exists

const FloatingButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/contact-support"); // Update this with your actual route
  };

  return (
    <button className="floating-button" onClick={handleClick}>
      Contact & Support
    </button>
  );
};

export default FloatingButton;
