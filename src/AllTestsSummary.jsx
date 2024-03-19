// src/AllTestsSummary.js
import React from "react";
import { Link } from "react-router-dom";
import data from "./data.json";

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
              <td>{averageCorrectness.toFixed(2)} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTestsSummary;
