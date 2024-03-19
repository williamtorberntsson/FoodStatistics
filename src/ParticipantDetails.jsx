import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import data from "./data.json";
import ParticipantGraph from "./ParticipantGraph";

const ParticipantDetails = () => {
  let { name } = useParams();
  const navigate = useNavigate();

  const calculatePValue = (correctGuesses, totalAttempts) => {
    const expectedSuccessRate = 1 / 3;
    const observedSuccessRate = correctGuesses / totalAttempts;
    const deviation = Math.abs(observedSuccessRate - expectedSuccessRate);

    // Simplified logic: If the observed rate deviates significantly from 1/3, imply a lower p-value
    // This is not statistically accurate but serves as a placeholder
    if (deviation > 0.2) return 0.01; // Arbitrarily chosen value for demonstration
    if (deviation > 0.1) return 0.05;
    return 0.1; // Assume a higher p-value for smaller deviations
  };

  // Filter tests the participant was involved in and calculate correctness and p-value
  let participantTests = data.tests
    .filter((test) =>
      test.participants.some((participant) => participant.name === name)
    )
    .map((test) => {
      const participant = test.participants.find((p) => p.name === name);
      const correctGuesses = participant.guesses.filter(
        (guess, index) => guess === test.truth[index]
      ).length;
      const correctness = (correctGuesses / test.truth.length) * 100;
      const pValue = calculatePValue(correctGuesses, test.truth.length); // Calculate p-value for each test
      return {
        ...test,
        correctness,
        pValue, // Include calculated p-value in the test object
      };
    })
    .sort((a, b) => b.correctness - a.correctness); // Sort by correctness in descending order

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Homepage</button>
      <h2>Participant: {name}</h2>
      <ParticipantGraph participantName={name} />
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Correctness</th>
            <th>P-Value</th> {/* Corrected header */}
          </tr>
        </thead>
        <tbody>
          {participantTests.map((test, index) => (
            <tr key={index}>
              <td>
                <Link
                  to={`/test/${encodeURIComponent(test.name)}`}
                  className="link-style"
                >
                  {test.name}
                </Link>
              </td>
              <td>{test.correctness.toFixed(2)} %</td>
              <td>{test.pValue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantDetails;
