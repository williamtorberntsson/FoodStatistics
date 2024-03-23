import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TestsSummary from "./TestsSummary";
import ParticipantDetails from "./ParticipantDetails";
import TestDetails from "./TestDetails";
import AllTestsSummary from "./AllTestsSummary";
import AllJudgesSummary from "./AllJudgesSummary";
import Suggestions from "./Suggestions";
import TasteTestSummary from "./TasteTestSummary";
import SliderButton from "./SliderButton";
import "./App.css";


function App() {
  const [isToggled, setIsToggled] = useState(false);

  // Handler to change the state
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Router>
      <div className="app-container">
        <h1>SAAAB Statistics</h1> {/* Add your title element */}
        <div> <SliderButton isChecked={isToggled} handleCheckboxChange={handleToggle} /></div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {isToggled ? (
                  <div>
                    {/* Components to display when toggled */}
                    <TasteTestSummary />
                  </div>
                ) : (
                  <div>
                    {/* Components to display by default */}
                    <TestsSummary />
                    <AllTestsSummary />
                    <AllJudgesSummary />
                    <Suggestions />
                  </div>
                )}
              </div>
            }
          />

          <Route path="/participant/:name" element={<ParticipantDetails />} />
          <Route path="/test/:testName" element={<TestDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
