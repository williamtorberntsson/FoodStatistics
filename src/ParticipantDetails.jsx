import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import data from "./data.json";
import ParticipantGraph from "./ParticipantGraph";
import "./ParticipantDetails.css";

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

  // Calculate the average correctness
  const averageCorrectness =
    participantTests.reduce((acc, curr) => acc + curr.correctness, 0) /
    participantTests.length;

  // Assuming 'name' is the participant's name obtained from useParams()
  const numberOfParticipatedTests = data.tests.filter((test) =>
    test.participants.some((participant) => participant.name === name)
  ).length;

  const numberOfTestsAsBuyer = data.tests.filter(
    (test) => test.buyer === name
  ).length;

  // Total number of tests
  const totalTests = data.tests.length;

  // Calculate the participation percentage
  const participationPercentage =
    (numberOfParticipatedTests / totalTests) * 100;

  const buyerPercentage = (numberOfTestsAsBuyer / totalTests) * 100;

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Homepage</button>
      <h2>Participant: {name}</h2>
      <ParticipantGraph participantName={name} />
      <div className="participant-card">
        <p>
          Participated in {numberOfParticipatedTests} out of {totalTests} tests
          ({participationPercentage.toFixed(2)} %)
        </p>
        <p>
          Listed as buyer in {numberOfTestsAsBuyer} / {totalTests} tests (
          {buyerPercentage.toFixed(2)} %)
        </p>
        <p>Average Correctness: {averageCorrectness.toFixed(2)} %</p>
      </div>
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
              <td>
                {renderColoredPercentage(test.correctness)}
              </td>
              <td>{test.pValue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantDetails;
