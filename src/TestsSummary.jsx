import React from "react";
import data from "./data.json";
import "./TestsSummary.css";
import { Link } from "react-router-dom";

const TestsSummary = () => {
  const calculateCorrectness = (participantName, tests) => {
    let totalCorrectGuesses = 0;
    let totalGuessesPossible = 0;

    tests.forEach((test) => {
      const participant = test.participants.find(
        (p) => p.name === participantName
      );
      if (participant) {
        const correctGuesses = participant.guesses.filter(
          (guess, index) => guess === test.truth[index]
        ).length;
        totalCorrectGuesses += correctGuesses;
        totalGuessesPossible += test.truth.length;
      }
    });

    return totalGuessesPossible > 0
      ? (totalCorrectGuesses / totalGuessesPossible) * 100
      : 0;
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

  // Generate an array of participants with their scores
  const participantsScores = data.tests
    .flatMap((test) => test.participants.map((participant) => participant.name))
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicate names
    .map((name) => ({
      name,
      score: calculateCorrectness(name, data.tests),
    }));

  // Sort the participants by score in descending order
  const sortedParticipants = participantsScores.sort(
    (a, b) => b.score - a.score
  );

  return (
    <div>
      <h2>All Participants Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Correctness</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map(({ name, score }) => (
            <tr key={name} className="table-row">
              <td>
                <Link to={`/participant/${name}`} className="link-style">
                  {name}
                </Link>
              </td>
              <td>{renderColoredPercentage(score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestsSummary;
