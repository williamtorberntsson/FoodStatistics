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
