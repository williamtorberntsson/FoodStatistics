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

  const calculateImprovement = (participantName, tests) => {
    let firstHalfScore = 0;
    let secondHalfScore = 0;
    const splitIndex = Math.floor(tests.length / 2); // Find the middle of the test array

    tests.forEach((test, index) => {
      const participant = test.participants.find(
        (p) => p.name === participantName
      );
      if (participant) {
        const correctGuesses = participant.guesses.filter(
          (guess, index) => guess === test.truth[index]
        ).length;
        const correctness = (correctGuesses / test.truth.length) * 100;

        if (index < splitIndex) {
          firstHalfScore += correctness; // Sum up scores in the first half
        } else {
          secondHalfScore += correctness; // Sum up scores in the second half
        }
      }
    });

    const firstHalfAverage = firstHalfScore / splitIndex;
    const secondHalfAverage = secondHalfScore / (tests.length - splitIndex);

    return secondHalfAverage - firstHalfAverage; // Improvement is the difference in averages
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
    return <span style={{ color }}>{percentage.toFixed(2)} %</span>;
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
            <th>Improvement</th> {/* New column for improvement */}
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map(({ name, score }) => {
            const improvement = calculateImprovement(name, data.tests); // Calculate improvement for each participant
            return (
              <tr key={name} className="table-row">
                <td>
                  <Link to={`/participant/${name}`} className="link-style">
                    {name}
                  </Link>
                </td>
                <td>{renderColoredPercentage(score)}</td>
                <td>{improvement.toFixed(2)} %</td> {/* Display improvement */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TestsSummary;
