import React, { useState } from "react";
import "./SliderButton.css"; // Import CSS file for styling

const SliderButton = ({ isChecked, handleCheckboxChange }) => {
  return (
    <div className="slider">
      <input
        type="checkbox"
        id="slider-checkbox"
        className="slider-checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="slider-checkbox" className="slider-button"></label>
    </div>
  );
};

export default SliderButton;
