import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import data from "./data.json";
import "./TestDetails.css";

const TestDetails = () => {
  let { testName } = useParams();
  const navigate = useNavigate();
  const test = data.tests.find((t) => t.name === testName);

  // Sort participants by correctness in descending order
  const sortedParticipants = test.participants
    .map((participant) => {
      const correctGuesses = participant.guesses.filter(
        (guess, index) => guess === test.truth[index]
      ).length;
      const correctness = (correctGuesses / test.truth.length) * 100;
      return {
        ...participant,
        correctness,
      };
    })
    .sort((a, b) => b.correctness - a.correctness);

  if (!test) {
    return <p>Test not found. Please select a valid test.</p>;
  }

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
      <span style={{ color }}>{percentage.toFixed(2)} %</span>
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Homepage</button>
      <h2>Test: {testName}</h2>
      <h3>Judge: {test.judge}</h3>
      <p>{test.description}</p>
      <table>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Correctness</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((participant, index) => (
            <tr key={index}>
              <td>
                <Link
                  to={`/participant/${encodeURIComponent(participant.name)}`}
                  className="link-style"
                >
                  {participant.name}
                </Link>
              </td>
              <td>{renderColoredPercentage(participant.correctness)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestDetails;
