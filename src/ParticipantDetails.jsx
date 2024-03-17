import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import data from "./data.json";

const ParticipantDetails = () => {
  let { name } = useParams();
  const navigate = useNavigate();

  // Calculate correctness for each test and sort them
  const participantTests = data.tests
    .filter((test) =>
      test.participants.some((participant) => participant.name === name)
    )
    .map((test) => {
      const participant = test.participants.find((p) => p.name === name);
      const correctGuesses = participant.guesses.filter(
        (guess, index) => guess === test.truth[index]
      ).length;
      const correctness = (correctGuesses / test.truth.length) * 100;
      return {
        ...test,
        participantCorrectness: correctness, // Add correctness to the test object
      };
    })
    .sort((a, b) => b.participantCorrectness - a.participantCorrectness); // Sort tests by correctness in descending order

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Homepage</button>
      <h2>Tests for {name}</h2>
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Correctness (%)</th>
          </tr>
        </thead>
        <tbody>
          {participantTests.map((test, index) => (
            <tr key={index}>
              <td>
                <Link to={`/test/${encodeURIComponent(test.name)}`}>
                  {test.name}
                </Link>
              </td>
              <td>{test.participantCorrectness.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantDetails;
