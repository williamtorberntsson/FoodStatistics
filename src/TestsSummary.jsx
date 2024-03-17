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
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Correctness (%)</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map(({ name, score }) => (
            <tr key={name} className="table-row">
              <td>
                <Link to={`/participant/${name}`}>{name}</Link>
              </td>
              <td>{score.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestsSummary;
