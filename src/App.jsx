import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestsSummary from "./TestsSummary";
import ParticipantDetails from "./ParticipantDetails";
import TestDetails from "./TestDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestsSummary />} />
        <Route path="/participant/:name" element={<ParticipantDetails />} />
        <Route path="/test/:testName" element={<TestDetails />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
