import { useEffect, useState } from "react";
import data from "./tests.json";
import "./Statistics.css";

const Statistics = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    setTests(data.tests);
  }, [])

  const calculateCorrectness = (participant, test) => {
    const correctGuesses = participant.guesses.filter((guess, index) => guess === test.truth[index]).length;
    return (correctGuesses / test.truth.length) * 100;
  };

  return (
    <div className="statistics"> {/* Apply a class for centering */}
      {tests.map(test => (
        <div className="test" key={test.name}>
          <h2>{test.name}</h2>
          <p>{test.description}</p>
          <div className="alternatives">
            <p>Alternatives:</p>
            <ul>
              {test.alternatives.map((alternative, index) => (
                <li key={index}>{alternative}</li>
              ))}
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>Participant</th>
                <th>Guesses</th>
              </tr>
            </thead>
            <tbody>
              {/* Rows for participants */}
              {test.participants.map(participant => (
                <tr key={participant.name}>
                  <td>{participant.name}</td>
                  <td>{participant.guesses.map((guess, index) => (
                    <span key={index}>{test.alternatives[guess]}{(index !== participant.guesses.length - 1) && ", "}</span>
                  ))}
                  </td>
                </tr>
              ))}
              <tr key="GroundTruth">
                <td>Ground Truth</td>
                <td>{test.truth.map((result, index) => (
                  <span key={index}>{test.alternatives[result]}{(index !== test.truth.length - 1) && ", "}</span>
                ))}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="correctness">
            <p>Correctness:</p>
            <ul>
              {test.participants.map(participant => (
                <li key={participant.name}>
                  {participant.name}: {calculateCorrectness(participant, test).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Statistics;
