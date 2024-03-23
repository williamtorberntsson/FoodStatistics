import { useEffect, useState } from "react";
import data from "./data.json";
import "./Statistics.css";

const Statistics = () => {
  const [scores, setScores] = useState({});
  const [hoveredTestName, setHoveredTestName] = useState(null);

  useEffect(() => {
    // Calculate scores for each participant
    const calculatedScores = data.tests.reduce((acc, test) => {
      test.participants.forEach(({ name, guesses }) => {
        if (!acc[name]) acc[name] = { total: 0, tests: [] };
        
        const correctGuesses = guesses.reduce((total, guess, index) => (
          total + (guess === test.truth[index] ? 1 : 0)
        ), 0);

        const score = (correctGuesses / test.truth.length) * 100;
        acc[name].total += score;
        acc[name].tests.push({ name: test.name, score });
      });
      
      return acc;
    }, {});

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

    setScores(calculatedScores);
  }, []);

  const findTestByName = (name) => data.tests.find(test => test.name === name);

  return (
    <div className="statistics">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <table>
          <thead>
            <tr>
              <th>Participant</th>
              <th>Total Score (%)</th>
              {data.tests.map((test) => (
                <th key={test.name}
                    onMouseEnter={() => setHoveredTestName(test.name)}
                    onMouseLeave={() => setHoveredTestName(null)}>
                  {test.name} (%)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(scores).map(([participantName, details]) => (
              <tr key={participantName}>
                <td>{participantName}</td>
                <td>{(details.total / data.tests.length).toFixed(2)}</td>
                {data.tests.map(test => {
                  const testScore = details.tests.find(t => t.name === test.name)?.score.toFixed(2) || "0.00";
                  return <td key={test.name}>{testScore}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {hoveredTestName && (
          <table style={{ marginLeft: "20px" }}>
            <thead>
              <tr>
                <th>Participant</th>
                <th>Guess</th>
                <th>Correctness</th>
              </tr>
            </thead>
            <tbody>
              {findTestByName(hoveredTestName).participants.map(participant => (
                <tr key={participant.name}>
                  <td>{participant.name}</td>
                  <td>{participant.guesses.join(", ")}</td>
                  <td>{participant.guesses.filter((guess, index) => guess === findTestByName(hoveredTestName).truth[index]).length}/{findTestByName(hoveredTestName).truth.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Statistics;
