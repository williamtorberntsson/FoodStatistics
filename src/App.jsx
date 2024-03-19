import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TestsSummary from "./TestsSummary";
import ParticipantDetails from "./ParticipantDetails";
import TestDetails from "./TestDetails";
import AllTestsSummary from "./AllTestsSummary";
import AllJudgesSummary from "./AllJudgesSummary";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <TestsSummary />
                <AllTestsSummary />
                <AllJudgesSummary />
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
