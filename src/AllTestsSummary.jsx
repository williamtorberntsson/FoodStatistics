// src/AllTestsSummary.js
import React from "react";
import { Link } from "react-router-dom";
import data from "./data.json";
import "./AllTestsSummary.css";

const AllTestsSummary = () => {
  // Calculate the average correctness for each test and include test name
  const testsSummary = data.tests
    .map((test) => {
      const totalCorrectness = test.participants.reduce(
        (total, participant) => {
          const correctGuesses = participant.guesses.filter(
            (guess, index) => guess === test.truth[index]
          ).length;
          return total + (correctGuesses / test.truth.length) * 100; // Add percentage correctness for each participant
        },
        0
      );
      const averageCorrectness =
        test.participants.length > 0
          ? totalCorrectness / test.participants.length
          : 0; // Avoid division by zero
      return {
        testName: test.name,
        averageCorrectness,
      };
    })
    .sort((a, b) => b.averageCorrectness - a.averageCorrectness); // Sort tests by average correctness in descending order
      
  // Function to calculate color based on percentage
  const getColorForPercentage = (percentage) => {
    // Interpolate between red (0%) and green (100%)
    const red = 255 * ((100 - percentage) / 100);
    const green = 255 * (percentage / 100);
    return `rgb(${red}, ${green}, 0)`;
  };

  // Function to render percentage with dynamically calculated color
  const renderColoredPercentage = (percentage) => {
    const color = getColorForPercentage(percentage);
    return (
      <span style={{ color }} className="colored-percentage">
        {percentage.toFixed(2)} %
      </span>
    );
  };
  
  return (
    <div>
      <h2>All Tests Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Correctness</th>
          </tr>
        </thead>
        <tbody>
          {testsSummary.map(({ testName, averageCorrectness }, index) => (
            <tr key={index}>
              <td>
                <Link
                  to={`/test/${encodeURIComponent(testName)}`}
                  className="link-style"
                >
                  {testName}
                </Link>
              </td>
              <td className="correctness-gradient">{renderColoredPercentage(averageCorrectness)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTestsSummary;
